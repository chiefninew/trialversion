Meteor.subscribe("classindex");


Template.classes.helpers({

  //display the classes of the user
  classes:function(){
      var teachId = Meteor.userId();
      return classindex.find({teachId:teachId});
    },

  classlist:function(){
    return classindex.find({});
  }

  });

Template.classrooms.events({

  //view class
  "click .btnviewclass": function(event){
      event.preventDefault();
      console.log(this._id);
      Router.go('seatplan',{class_id:this._id});
  },

  //delete class
  "click .btndelclass":function(event){
    event.preventDefault();
    var confirm = window.confirm("are you sure you want to Delete this class?");
    if(confirm){
      Meteor.call('deleteclass',this._id);
    }
  }

});

Template.createclassmodal.events({

    "click .btnsaveclass": function(event){
      event.preventDefault();
      var description = $("#description").val(),
      sec_code = $("#sectioncode").val(),
      subj_code = $("#subjectcode").val(),
      sched = $("#schedule").val(),
      sem = $("#semester").val(),
      school_yr = $("#schoolyear").val();
      Meteor.call('addclass',description,sec_code,subj_code,sched,sem,school_yr);
    }

});
