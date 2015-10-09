Session.setDefault("roles","student");
Template.index.events({
  "click #btnLoginSignin": function(event, template){
     event.preventDefault();
     console.log("Login Click");
     var email = $("#txtLoginEmail").val(),
         password = $("#txtLoginPass").val();

     Meteor.loginWithPassword(email, password, function(err){
      if(err){
        console.log(err.reason);
        window.alert(err.reason);
      }else{
        console.log('Welcome!');
        Router.go('home');
      }

      })
    }
});




Template.register.helpers({

  isteacher:function(role){
    var myrole = Session.get("roles");

    return role === myrole;

  }

});

Template.register.events({

  "click #btnStudent": function(event, template){
        event.preventDefault();
        Session.set("roles","student");
        console.log(Session.get("roles"));
  },

  "click #btnTeacher": function(event, template){
        event.preventDefault();
        Session.set("roles","teacher");
        console.log(Session.get("roles"));
  },

  "click #btnRegCreate": function(event, template){
        event.preventDefault();
        var myrole = Session.get("roles"),
            token = $("#txtRegToken").val(),
            username = $("#txtRegUser").val(),
            email = $("#txtRegEmail").val(),
            password = $("#txtRegPass").val(),
            cpassword = $("#txtRegCpass").val();

        if(password === cpassword){
          //check the user is teacher or student
          if(myrole === "teacher")
          {
            Meteor.call('TeacherRegistration',token,username,email,password);
          }else {
            Meteor.call('StudentRegistration',username,email,password);
          }
        }else {
          window.alert("Password did not match");
        }

        console.log(email);
        console.log(password);
  },


});
