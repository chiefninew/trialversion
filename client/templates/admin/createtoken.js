Meteor.subscribe("Tokens");

Template.createtoken.helpers({
  tokens:function(){
    return Tokens.find({});
  }
});

Template.createtoken.events({
  "click #btnGenerateToken": function(event){
    event.preventDefault();
    console.log('btnGenerateToken Clicked');
    Meteor.call('addTokens');
  },

  "click #btnDelToken": function(event){
    event.preventDefault();

    var confirm = window.confirm("are you sure you want to logout?");
    if(confirm){
      Meteor.call('DelToken',this._id);
    }


  }


});
