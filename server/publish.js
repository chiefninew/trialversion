
Meteor.publish("Tokens", function(){
  return Tokens.find({});
});
Meteor.publish("classindex", function(){
  return classindex.find({});
});

Meteor.publish("students", function(){
  return students.find({});
});

Meteor.publish("rooms", function(){
  return rooms.find({});
});
Meteor.publish("userData", function () {
  return Meteor.users.find({});
});
