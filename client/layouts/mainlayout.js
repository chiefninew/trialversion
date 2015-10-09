
Template.mainlayout.events({
  "click #btnLogout": function(event, template){
     event.preventDefault();
     Meteor.logout();
  }
}); 
