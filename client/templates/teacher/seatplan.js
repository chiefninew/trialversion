
Meteor.subscribe("students");
Meteor.subscribe("classindex");
Meteor.subscribe("userData");
Session.setDefault("swap1",false);
Session.setDefault("searchstud","");
Session.setDefault("studentswap",[]);

Template.seatplan.helpers({

  classInfo:function(){
    var classIndex = classindex.find({_id:this.class_id}).fetch();
    Session.set("row",classIndex[0].rows);
    Session.set("col",classIndex[0].cols);
    Session.set("classId",this.class_id);
    Session.set("classname",classIndex[0].description);
    return classIndex;
  },

  //output row in form of loop
  looprow: function(num){
    var outputs = [];
    var classRow = Session.get("row"),
        class_Id = Session.get("classId");
    for (var i=1; i<=classRow; i++){

      //check seat if vacant
      var vacant = students.find({classId:class_Id,colnum:num,rownum:i}).count();

      //fetch the students collection
      var studinfos = students.find({classId:class_Id,colnum:num,rownum:i}).fetch();

      if(vacant === 1){
        //console.log(studinfos);
        outputs.push({_id:studinfos[0]._id,profpic:"profpic.jpg",username:studinfos[0].username,studId:studinfos[0].studId,colnum:num,rownum:i});
      }else{
        var rand = Math.random().toString(36).substr(2); // remove `0.`

        outputs.push({_id:rand,profpic:"chair.png",name:"Available",colnum:num,rownum:i});
      }

    }

    //console.log(countArr);
    return outputs;
  },

  //output columns in form of loop
  loopcol: function(){
    var countArr = [];

    for (var i=1; i <= Session.get("col"); i++){
      countArr.push({column:i});
    }
    return countArr;

  }

});

Template.seatplan.events({

      "click #btnEditClass": function(events){
        events.preventDefault();
        var Row = $("#txtRow").val(),
            Col = $("#txtCol").val();
        //console.log(this.class_id);
        Meteor.call("EditClass",this.class_id,Row,Col);
      },

});


Template.info.helpers({
  isvacant:function(varId,colnum,rownum){
    var checkseat = students.find({_id:varId,colnum:colnum,rownum:rownum}).count();
    return checkseat === 0;
  },
  studentInfos:function(){
    var keyword  = Session.get("searchstud");
    var query = ".*"+keyword+".*";
    //console.log(Meteor.users.find({"username": {'$regex' : '.*' + keyword + '.*'}}).fetch());
    return Meteor.users.find({"username": {'$regex' : '.*' + keyword + '.*'},roles:["student"]}).fetch();
  },
  isswapready:function(){
    return Session.get("swap1") === false;
  },
  name:function(studId){
    return Meteor.users.find({_id:studId},{username:1}).fetch();
  }

});

Template.info.events({

    "keyup #txtSearchStud": function(event){
      event.preventDefault();
      Session.set("searchstud",$("#txtSearchStud").val());
    },
    "click #btnassign":function(event){
      Session.set("searchstud","");
      Session.set("curRow",this.rownum);
      Session.set("curCol",this.colnum);
    },
    //prototype for join class (student)
    "click #btnAddStud":function(event){
      event.preventDefault();
      //console.log(this.colnum +" "+this.rownum)
      var studDetails = {
        studId: this._id,
        classId: Session.get("classId"),
        colnum: Session.get("curCol"),
        rownum: Session.get("curRow")
      }
      var checkseat = students.find({_id:this._id,colnum:this.colnum,rownum:this.rownum}).count();
      if($("#studname").val() !== ""){

        if(checkseat === 0){
          Meteor.call('addstudent',studDetails);
        }else{
          console.log("someone sitting here.");
        }

      }else{
        console.log("No input");
      }
        Session.set("searchstud"," ");
      },

    //remove student
    "click #btnstudremove":function(event){
      event.preventDefault();
      Meteor.call("studremove",this._id);
    },

    //prototype for swap (teacher)
    "click #btnswap": function(event){
        var swap1 = Session.get("swap1"),
            swap2 = Session.get("swap2"),
            studentswap = Session.get("studentswap");

        if(swap1 === false)
        {
          console.log("swap1 clicked");
          studentswap.push({
              _id:this._id,
              name:this.name,
              colnum:this.colnum,
              rownum:this.rownum
            });
          Session.set("swap1",true);
          Session.set("studentswap",studentswap);
          console.log(Session.get("studentswap"));
        }else{
          console.log("swap2 clicked");
          studentswap.push({
              _id:this._id,
              name:this.name,
              colnum:this.colnum,
              rownum:this.rownum
            });

            console.log(studentswap);
          Meteor.call("swapstudent",studentswap);

          Session.set("swap1",false);
          //Session.set("swap2",false);
          Session.set("studentswap",[]);
        }

    }

});
