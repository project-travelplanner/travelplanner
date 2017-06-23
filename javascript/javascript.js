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

  // Returning User Login
    function returninguserlogin(event){
      event.preventDefault()
      console.log('clicked')
      $('#returningusermodal').show()
    }
    $('.close').on('click', function(event){
      event.preventDefault()
      $('#returningusermodal').hide()
    })

  // Close Trip Box
    function closetrip(){
      debugger;
      var whichtrip = $(this).attr("data-num")
      $('#' + whichtrip).hide()
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

  //Check Map
    function showcheck(){
      // modal.show()
      var mapslocation = $(this).context.previousSibling.innerText
      var mapsarrive = $(this).context.previousSibling.previousElementSibling.previousSibling.innerText
      var mapsdepart = $(this).context.previousSibling.previousElementSibling.innerText
      // Get and add Lat/Long
      evBriteLookUp(mapsarrive, mapsdepart, mapslocation, $(this))
    }

// Firebase Listeners
  firebase.auth().onAuthStateChanged((user) => {
    debugger;
    if (user) {
      console.log("---------auth state change-----------");
      userid = user.uid
      localStorage.setItem("userid", user.uid)
      $('.loginbutton').hide()
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
          var closebtn = $('<span class="glyphicon glyphicon-remove-circle tripclose" data-num="' + tripnum + '" data-toggle="collapse" data-target="#destinfo">')
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
            var showcheckbtn = $('<button>')
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
            showcheckbtn
              .addClass('showlookup')
              .text('Click to see shows near your Destination')
              .appendTo($('#destframe' + destnum + '-' + tripnum))
          })
        })
      })
    } else {
      console.log('run nothing, not on mytrips page')
    }
  })

// API Functions

  // Eventbrite API
    function evBriteLookUp(arrive, dept, loc, button){
      var thisbutton = button
      $.ajax({
        url: 'https://www.eventbriteapi.com/v3/events/search/',
        method: 'GET',
        data: {
          token: '75JDM6P6R2M2PFYEECJ3',
          categories: '103',
          sort_by: '-distance',
          'location.address': loc,
          'start_date.range_start': arrive,
          'start_date.range_end': dept,
          'include_all_series_instances': false,
          'include_unavailable_events': false
        }
      }).done(function(response){
        if (response.events.length === 0){
          console.log('no results')
          $(thisbutton).text("Sorry, no shows available for those dates!")
        } else {
          console.log('some results')
          debugger;
          tempid = response.events[0].venue_id
            $.ajax({
              url: 'https://www.eventbriteapi.com/v3/venues/' + tempid + '/',
              method: 'GET',
              data: {
                token: '75JDM6P6R2M2PFYEECJ3'
              }
            }).done(function(response){
              debugger;
              var tempaddress = response.address.localized_address_display
              var tempname = response.name
              // function geocodeAddress(geocoder, resultsMap) {
              //   var address = document.getElementById('address').value;
              //   geocoder.geocode({'address': tempaddress}, function(results, status) {
              //     if (status === 'OK') {
              //       resultsMap.setCenter(results[0].geometry.location);
              //       var marker = new google.maps.Marker({
              //         map: resultsMap,
              //         position: results[0].geometry.location
              //       });
              //     } else {
              //       alert('Geocode was not successful for the following reason: ' + status);
              //     }
              //   });
              // }
            })
        }
      })
    }

// On Click Listeners
  $(document).on('click', '.showlookup', showcheck);
  $(document).on('click', '.tripclose', closetrip)
  $(document).on('click', '#newusersubmit', newusersubmit);
  $(document).on('click', '#newdestsubmit', newdestsubmit);
  $(document).on('click', '#newtripsubmit', newtripsubmit);
  $(document).on('click', '.newusersignup', newusersignup);
  $(document).on('click', '.openmodnt', ntmodal);
  $(document).on('click', '.opennewdest', ndmodal);
  $(document).on('click', '#returningusersubmit', returningusersubmit);
  $(document).on('click', '.returninguserlogin', returninguserlogin);
  // $(document).on('click', '#logout', )

  // Returning User Login
  //   function returningusersubmit(){
  //     var returninguserEmail = $('#returninguseremail').val().trim()
  //     var returninguserPassword = $('#newuserpw').val().trim()
  //     var confirmPassword = $('#returninguserpw').val().trim()
  //       if(returninguserPassword === returninguserPassword){
  //   firebase.auth().signInWithEmailAndPassword(email, password)
  //       .catch(function(error) {
  //     // Handle Errors here.
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     if (errorCode === 'auth/wrong-password') {
  //       alert('Wrong password.');
  //     } else {
  //       alert(errorMessage);
  //     }
  //     console.log(error);
  //   });

  //   Sign Out
  //   firebase.auth().signOut().then(function() {
  //     console.log('Signed Out');
  //   }, .catch(function(error) {
  //     console.error('Sign Out Error', error);
  //   });
