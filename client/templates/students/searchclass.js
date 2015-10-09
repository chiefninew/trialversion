Meteor.subscribe("classindex");
Meteor.subscribe("userData");
Meteor.subscribe("students");

Session.setDefault("searchClass","");

Template.searchclass.helpers({
  SearchClass:function(){
    var keyword  = Session.get("searchClass");
    var query = ".*"+keyword+".*";
    return classindex.find({"description": {'$regex' : '.*' + keyword + '.*'}}).fetch();
  }
});

Template.searchclass.events({
  "keyup #txtSearchClass": function(event){
    event.preventDefault();
    Session.set("searchClass",$("#txtSearchClass").val());
  }
});

Template.ClassData.helpers({
  TeacherInfo:function(teachId){
     return Meteor.users.find({_id:teachId},{username:1}).fetch();
  }
});

Template.ClassData.events({
  "click #btnViewClass": function(event){
    event.preventDefault();
    var studDetails = {
      studId: Meteor.userId(),
      classId: this._id,
      colnum: 0,
      rownum: 0
    }
    var checkstud = students.find({studId:Meteor.userId(),classId:this._id}).count();
    console.log(this._id);
    console.log(this.passkey);
    console.log($("#txtPassKey"+this._id).val());
    if($("#txtPassKey"+this._id).val() === this.passkey){
      if(checkstud === 0){
        Meteor.call('addstudent',studDetails);
        Router.go('viewclass',{class_id:this._id});
      }else{
        Router.go('viewclass',{class_id:this._id});
      }
      }else{
        console.log("Pass Key Not Match");
    }
  }


});
