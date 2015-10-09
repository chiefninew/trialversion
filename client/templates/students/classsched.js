Meteor.subscribe("classindex");
Meteor.subscribe("userData");
Meteor.subscribe("students");

Session.setDefault("searchmyClass","");

Template.classsched.helpers({
  myClass:function(){
    var keyword  = Session.get("searchmyClass");
    var query = ".*"+keyword+".*";
    return classindex.find({"description": {'$regex' : '.*' + keyword + '.*'}}).fetch();
  },
  inClass:function(CheckId){
    var checkclass = students.find({classId:CheckId,studId:Meteor.userId()}).count();
    console.log(checkclass);
    return checkclass === 1;
  }
});

Template.classsched.events({
  "keyup #txtSearchmyClass": function(event){
    event.preventDefault();
    Session.set("searchmyClass",$("#txtSearchmyClass").val());
  }
});

Template.ClassBody.helpers({
  TeacherInfo:function(teachId){
     return Meteor.users.find({_id:teachId},{username:1}).fetch();
  }
});

Template.ClassBody.events({
  "click #btnViewmyClass": function(event){
    event.preventDefault();
    Router.go('viewclass',{class_id:this._id});
  }


});
