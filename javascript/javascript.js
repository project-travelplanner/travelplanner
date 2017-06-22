// $('#user-sign-up').on('click', function(){
//   var user_email = $('#user-email').val().trim();
//   var user_password = $('#password-input').val().trim();
//   var confirm_password = $('#confirm-password-input').val().trim();

//   console.log(user_email);
//   console.log(user_password);
//   console.log(confirm_password);

//   debugger;
//   if(user_password === confirm_password){
//     firebase.auth().createUserWithEmailAndPassword(user_email, user_password).catch(function(error) {
//      // Handle Errors here.
//      var errorCode = error.code;
//      var errorMessage = error.message;
//      // ...
//       });
//   }
// })

// Variables
  var database = firebase.database()
  var venueid = ''
  var userid
  var dataref = database.ref('users/' + userid + '/data')
  var totaltripcounter

// On-Click Functions
  // New Trip Submit
    function newtripsubmit(event){
      var time = Date.now()
      event.preventDefault()
      var newTripDesc = $('#newtripdescrip').val()
      tripName = $('#newtripname').val().trim()
      debugger;
      console.log('Trip name = ' + tripName + '. Trip Description = ' + newTripDesc)
      database.ref('users/' + userid + '/trips/' + tripName).set({
        tripname: tripName,
        tripdesc: newTripDesc,
        tripcounter: 0,
        created: time
        })
      $('#newtripmodal').hide()
    }

  // New Destination Submit
    function newdestsubmit(event){
      event.preventDefault()
      var time = Date.now()
      debugger;
      var tripName = $(this)["0"].offsetParent.offsetParent.attributes[2].value
      var newDestname = $('#newdestname').val().trim()
      var newDestLoc = $('#newdestloc').val().trim()
      var newDestArr = $('#newdestarr').val().trim()
      var newDestDept = $('#newdestdept').val().trim()
      var newDestComm = $('#newdestcomm').val().trim()
      var currentTripCounter
      database.ref('users/' + userid + '/trips/' + tripName).once('value').then(function(snapshot){
        currentTripCounter = snapshot.val().tripcounter
      })
      database.ref('users/' + userid + '/trips/' + tripName + '/dests/' + newDestname).set({
        destName: newDestname,
        destLoc: newDestLoc,
        destArr: newDestArr,
        destDept: newDestDept,
        destComm: newDestComm,
        destcreated: time
      })
      $('#newdestmodal').hide()
    }

  // New User Submit
    function newusersubmit(){
      var userEmail = $('#newuseremail').val().trim()
      var userPassword = $('#newuserpw').val().trim()
      var confirmPassword = $('#newuserconfirm').val().trim()
        if(userPassword === confirmPassword){
          firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
              });
        } else {
          $('.errormsg').show()
        }
    }

// Modal Functionality
  //New User
    function newusersignup(event){
      event.preventDefault()
      console.log('clicked')
      $('#newusermodal').show()
    }
    $('.close').on('click', function(event){
      event.preventDefault()
      $('#newtripmodal').hide()
      $('#newusermodal').hide()
      $('#newdestmodal').hide()
    })

  //New Trip
    function ntmodal(event){
      event.preventDefault()
      $('#newtripmodal')
        .show()
    }

  //New Destination
    function ndmodal(event){
      debugger;
      console.log('clicked')
      event.preventDefault()
      $('#newdestmodal')
        .show()
        .attr("data-name", $(this).attr("data-name"))
    }

// Firebase Listeners
  firebase.auth().onAuthStateChanged((user) => {
    debugger;
    if (user) {
      console.log("---------auth state change-----------");
      userid = user.uid
      localStorage.setItem("userid", user.uid)
    }
  });

// My Trips
  $(document).on('ready', function(){
    userid = localStorage.getItem('userid')
    if(page === "mytrips"){
      var tripsref = database.ref('users/' + userid + '/trips').orderByChild("created")
      console.log('On mytrips page')
      console.log('userid = ' + userid)
      tripsref.once('value', function(response){
        var triptemp = response.val()
        triptemp = $.map( triptemp, function( value, created ) {                    // map 1
          var tripnum = $('.tripcontainer')["0"].children.length
          var name = value.tripname
          var mapObject = value
          var tripframe = $('<div class="tripitem tripitem' + tripnum + '">')
          var tname = $('<h1 class="tripname tripname' + tripnum + '">')
          var tdescrip = $('<p class="tripdescrip tripdescrip' + tripnum + '">')
          var closebtn = $('<span class="glyphicon glyphicon-remove-circle tripclose tripclose' + tripnum + '" data-toggle="collapse" data-target="#destinfo">')
          var expandbtn = $('<a class="glyphicon glyphicon-chevron-down tripexpand" data-toggle="collapse" data-target="#destlist' + tripnum +'"></a>')
          var destlist = $('<div class="collapse destdrop destdrop' + tripnum + '">')
          var newdestbtn = $('<button  class="glyphicon glyphicon-plus opennewdest' + tripnum + '"></button>')
          tripframe
            .attr("id", tripnum)
            .appendTo($('.tripcontainer'))
            .append(expandbtn)
            .append(closebtn)
          tname
            .text(mapObject.tripname)
            .appendTo($('#' + tripnum))
          tdescrip
            .text(mapObject.tripdesc)
            .appendTo($('#' + tripnum))
          destlist
            .attr("id", "destlist" + tripnum)
            .appendTo($('.' + 'tripdescrip' + tripnum))
          newdestbtn
            .attr("data-number", tripnum)
            .attr("data-name", name)
            .addClass("opennewdest")
            .appendTo($('#destlist' + tripnum))
          var desttemp = value.dests
          desttemp = $.map( desttemp, function(key){
            var destnum = $('.destdrop' + tripnum)["0"].children.length
            var dname = key.destName
            var dcomm = key.destComm
            var darr = key.destArr
            var ddept = key.destDept
            var dloc = key.destLoc
            var destframe = $('<div class="destframe" id="destframe' + destnum + '-' + tripnum + '">')
            var destname = $('<div class="destname">')
            var destcomment = $('<div class="destcomment">')
            var destarrival = $('<div class="destarrival">')
            var destdepart = $('<div class="destdepart">')
            var destlocation = $('<div class="destlocation">')
            debugger;
            destframe
              .appendTo($('#destlist' + tripnum))
            destname
              .text(dname)
              .appendTo($('#destframe' + destnum + '-' + tripnum))
            destcomment
              .text(dcomm)
              .appendTo($('#destframe' + destnum + '-' + tripnum))
            destarrival
              .text(darr)
              .appendTo($('#destframe' + destnum + '-' + tripnum))
            destdepart
              .text(ddept)
              .appendTo($('#destframe' + destnum + '-' + tripnum))
            destlocation
              .text(dloc)
              .appendTo($('#destframe' + destnum + '-' + tripnum))
          })
        })
      })
    } else {
      console.log('run nothing, not on mytrips page')
    }
  })

// On Click Listeners
  $(document).on('click', '#newusersubmit', newusersubmit);
  $(document).on('click', '#newdestsubmit', newdestsubmit);
  $(document).on('click', '#newtripsubmit', newtripsubmit);
  $(document).on('click', '.newusersignup', newusersignup);
  $(document).on('click', '.openmodnt', ntmodal);
  $(document).on('click', '.opennewdest', ndmodal);
  $(document).on('click', '#returningusersubmit', returningusersubmit);
  $(document).on('click', '.returninguserlogin', returninguserlogin);

// base eventbrite API
  // $.ajax({
  //   url: 'https://www.eventbriteapi.com/v3/events/search/',
  //   method: 'GET',
  //   data: {
  //     token: '75JDM6P6R2M2PFYEECJ3',
  //     categories: '103',
  //     sort_by: '-distance',
  //     'location.address': 'San Francisco, CA'
  //   }
  // }).done(function(response){
  //     console.log(response)
  //     for (var i = 0; i < response.length; i++){
  //         var namePrint = response.events[i].name.text
  //         var idPrint = response.events[i].venue_id
  //           $.ajax({
  //             url: 'https://www.eventbriteapi.com/v3/venues/' + idPrint + '/',
  //             method: 'GET',
  //             data: {
  //               token: '75JDM6P6R2M2PFYEECJ3'
  //             }
  //           }).done(function(response){
  //             var venueName = response.name
  //             // console.log('--------Event ' + i + ' -----------')
  //             console.log('Event Name = ' + namePrint)
  //             console.log('venue_id = ' + idPrint)
  //             console.log('Venue Name = ' + venueName)
  //           })

  //       };
  // })

//eventbrite venue API
  // $.ajax({
  //   url: 'https://www.eventbriteapi.com/v3/venues/19770605/',
  //   method: 'GET',
  //   data: {
  //     token: '75JDM6P6R2M2PFYEECJ3'
  //   }
  // }).done(function(response){
  //   console.log(response)

  //Returning User Login
    function returninguserlogin(event){
      event.preventDefault()
      console.log('clicked')
      $('#returningusermodal').show()
    }
    $('.close').on('click', function(event){
      event.preventDefault()
      $('#returningusermodal').hide()
    })

  //Returning User Login
    // function returningusersubmit(){
    //   var returninguserEmail = $('#returninguseremail').val().trim()
    //   var returninguserPassword = $('#newuserpw').val().trim()
    //   var confirmPassword = $('#returninguserpw').val().trim()
    //     if(returninguserPassword === returninguserPassword){
    // firebase.auth().signInWithEmailAndPassword(email, password)
    //     .catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   if (errorCode === 'auth/wrong-password') {
    //     alert('Wrong password.');
    //   } else {
    //     alert(errorMessage);
    //   }
    //   console.log(error);
    // });

    //Sign Out
    // firebase.auth().signOut().then(function() {
    //   console.log('Signed Out');
    // }, .catch(function(error) {
    //   console.error('Sign Out Error', error);
    // });
