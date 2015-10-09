Meteor.startup(function(){
  var chkusers = Tokens.find().count();
  if(chkusers == 0){
    adminDetails = {
      username: "admin",
      email: "admin@admin.com",
      password: "admin"
    }
    id = Accounts.createUser(adminDetails);
    Roles.addUsersToRoles(id, 'admin');
    Tokens.insert({ // this is to prevent creating admin account on startup again
      token: "0000",
      used: true
    });
  }
}); // Create Admin if the users is Empty

//-------------------------------------starts of all methods-------------------------------------------//
Meteor.methods({

//-------------------------------------methods for registration starts here-------------------------------------------//

  //add user teacher
  TeacherRegistration: function(token, username, email, password){
    var ifexist = Tokens.find({token: token, used: false}).count();
    console.log(ifexist);
    if(ifexist === 1){
      regDetails = {
      username: username,
      email: email,
      password: password
      }
      id = Accounts.createUser(regDetails);
      Roles.addUsersToRoles(id, 'teacher');
      Tokens.update({token: token}, {$set: {used: "true"}});
    }else{
      console.log('token already taken');
    }
  },

  //add user student
  StudentRegistration: function(username,email,password){
      regDetails = {
      username: username,
      email: email,
      password: password
    }
    id = Accounts.createUser(regDetails);
    Roles.addUsersToRoles(id, 'student');
  },

//-------------------------------------end of registration methods-------------------------------------------//


//-------------------------------------methods for admin starts here-------------------------------------------//


  //generate tokens
  addTokens: function(token){
    var rand = function() {
        return Math.random().toString(36).substr(2); // remove `0.`
    };
    var token = function() {
        return rand() + rand(); // to make it longer
    };
    var token = token();
    Tokens.insert({
      token: token,
      used: false
    });
  },

  DelToken: function(vartoken){
    Tokens.remove(vartoken);
  },
//--------------------------------------end for admin methods-------------------------------------------------//


//---------------------------------------starts for teacher methods-----------------------------------------------//

//add the newly created class to the classindex collection

  EditClass:function(ClassId,Row,Col){
   classindex.update({_id:ClassId},{$set:{rows:Row,cols:Col}});
  },

 addclass:function(description,sec_code,subj_code,sched,sem,school_yr){
   var passkey = Math.random().toString(36).substr(2); // remove `0.`

    classindex.insert({
      teachId:this.userId,
      description: description,
      sec_code: sec_code,
      subj_code: subj_code,
      sched: sched,
      sem: sem,
      school_yr: school_yr,
      students: 0,
      rows: 0,
      cols: 0,
      passkey: passkey
    });
 },

 //delete class
 deleteclass:function(classId){
   classindex.remove({_id:classId});
 },


  //temporary method for adding student to class
  addstudent:function(studDetails){
     students.insert(studDetails);
  },

  upstudent:function(classId,studDetails){
      console.log(Meteor.userId);
      students.update({studId:Meteor.userId(),classId:classId},{$set:studDetails});
  },

  //remove student from seat
  studremove:function(varstudId){
    students.remove({_id:varstudId});
  },

  //swap
  swapstudent:function(studentswap){
  //change colnum and rownum of student1 to student2
    students.update(
      {_id:studentswap[0]._id},
      {$set:{
        colnum:studentswap[1].colnum,
        rownum:studentswap[1].rownum
      }});
  //change colnum and rownum of student2 to student1
    students.update(
      {_id:studentswap[1]._id},
      {$set:{
        colnum:studentswap[0].colnum,
        rownum:studentswap[0].rownum
      }});
  }

});
