Meteor.subscribe("userData");
Session.setDefault("searchUser","");


Template.Userlist.helpers({
  userdata:function(){
    var keyword  = Session.get("searchUser");
    var query = ".*"+keyword+".*";
    //console.log(Meteor.users.find({"username": {'$regex' : '.*' + keyword + '.*'}}).fetch());
    return Meteor.users.find({"username": {'$regex' : '.*' + keyword + '.*'}}).fetch();
  }
});

Template.Userlist.events({
  "keyup #txtSearchStud": function(event){
    event.preventDefault();
    Session.set("searchUser",$("#txtSearchStud").val());
  }
});
