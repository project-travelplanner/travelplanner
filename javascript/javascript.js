// Variables
  var database = firebase.database()
  var venueid = ''
  var userid
  var dataref = database.ref('users/' + userid + '/data')
  var totaltripcounter


$('#user-sign-up').on('click', function(){
var user_email = $('#user-email').val().trim();
var user_password = $('#password-input').val().trim();
var confirm_password = $('#confirm-password-input').val().trim();

console.log(user_email);
console.log(user_password);
console.log(confirm_password);

debugger;
if(user_password === confirm_password){
  firebase.auth().createUserWithEmailAndPassword(user_email, user_password).catch(function(error) {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // ...
    });
}
})


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
      debugger;
      var tripName = $(this)["0"].offsetParent.offsetParent.attributes[2].value
      var newDestname = $('#newdestname').val().trim()
      var newDestLoc = $('#newdestloc').val().trim()
      var newDestArr = $('#newdestarr').val().trim()
      var newDestDept = $('#newdestdept').val().trim()
      var newDestComm = $('#newdestcomm').val().trim()
      var currentTripCounter
      database.ref('users/' + userid + '/trips/' + tripName).once('value').then(function(snapshot){
        console.log(snapshot.val().tripcounter)
        currentTripCounter = snapshot.val().tripcounter
      })
      database.ref('users/' + userid + '/trips/' + tripName + '/dests/' + newDestname).set({
        destName: newDestname,
        destLoc: newDestLoc,
        destArr: newDestArr,
        destDept: newDestDept,
        destComm: newDestComm
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
    if (user) {
      console.log("---------auth state change-----------");
      userid = user.uid
      localStorage.setItem("userid", user.uid)
      // dataref.once('value').then(function(response){
      //   localStorage.setItem("tripcounter", response.val())
      // })
    }
  });

// My Trips
  $(document).on('ready', function(){
    userid = localStorage.getItem('userid')
    if(window.location.pathname === '/travelplanner/mytrips.html' || window.location.pathname === "/C:/Users/Nate/Desktop/code/travelplannerfork/mytrips.html"){
      var tripsref = database.ref('users/' + userid + '/trips').orderByChild("created")
      console.log('On mytrips page')
      console.log('userid = ' + userid)
      tripsref.once('value', function(response){
        var responseAsArray = Object.keys(response.val())
        var triptemp = response.val()
        triptemp = $.map( triptemp, function( value, created ) {
          debugger;
          var containersize = $('.tripcontainer')["0"].children.length
          var name = value.tripname
          console.log(value)
          var mapObject = value
          var tripframe = $('<div class="tripitem tripitem' + containersize + '">')
          var tname = $('<h1 class="tripname tripname' + containersize + '">')
          var tdescrip = $('<p class="tripdescrip tripdescrip' + containersize + '">')
          var closebtn = $('<span class="glyphicon glyphicon-remove-circle tripclose tripclose' + containersize + '" data-toggle="collapse" data-target="#destinfo">')
          var expandbtn = $('<a class="glyphicon glyphicon-chevron-down tripexpand" data-toggle="collapse" data-target="#destlist' + containersize +'"></a>')
          var destlist = $('<div class="collapse destdrop destdrop' + containersize + '">')
          var newdestbtn = $('<button  class="glyphicon glyphicon-plus opennewdest' + containersize + '"></button>')
          tripframe
            .attr("id", containersize)
            .appendTo($('.tripcontainer'))
            .append(expandbtn)
            .append(closebtn)
          tname
            .text(mapObject.tripname)
            .appendTo($('#' + containersize))
          tdescrip
            .text(mapObject.tripdesc)
            .appendTo($('#' + containersize))
          destlist
            .attr("id", "destlist" + containersize)
            .appendTo($('.' + 'tripdescrip' + containersize))
          newdestbtn
            .attr("data-number", containersize)
            .attr("data-name", name)
            .addClass("opennewdest")
            .appendTo($('#destlist' + containersize))
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

            })
        }
      })
    }

// On Click Listeners
  $(document).on('click', '#newusersubmit', newusersubmit);
  $(document).on('click', '#newdestsubmit', newdestsubmit);
  $(document).on('click', '#newtripsubmit', newtripsubmit);
  $(document).on('click', '.newusersignup', newusersignup);
  $(document).on('click', '.openmodnt', ntmodal);
  $(document).on('click', '.opennewdest', ndmodal);