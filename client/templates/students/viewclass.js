
Meteor.subscribe("students");
Meteor.subscribe("classindex");
Meteor.subscribe("userData");

Template.viewclass.helpers({

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
        outputs.push({_id:studinfos[0]._id,username:studinfos[0].username,studId:studinfos[0].studId,colnum:num,rownum:i});
      }else{
        var rand = Math.random().toString(36).substr(2); // remove `0.`

        outputs.push({_id:rand,name:"Available",colnum:num,rownum:i});
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

Template.seat.helpers({
  isvacant:function(varId,colnum,rownum){
    var checkseat = students.find({_id:varId,colnum:colnum,rownum:rownum}).count();
    console.log(colnum,rownum);
    return checkseat === 0;
  },
  name:function(studId){
    return Meteor.users.find({_id:studId},{username:1}).fetch();
  },
  yourenothere:function(){
    var res = students.find({studId:Meteor.userId(),colnum:0,rownum:0,classId:Session.get("classId")}).count();
    console.log(Meteor.userId());
    return res === 1;
  },
  isyoursit:function(colnum,rownum){
    var usersit = students.find({studId:Meteor.userId(),colnum:colnum,rownum:rownum,classId:Session.get("classId")}).count();
    return usersit === 1;
  }

});

Template.seat.events({
  "click #btnHere":function(event){
    event.preventDefault()
    var studDetails = {
      colnum: this.colnum,
      rownum: this.rownum
    },classId = Session.get("classId");
    console.log(studDetails);
    Meteor.call("upstudent",classId,studDetails);

  }
});
