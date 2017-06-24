// Variables
  var database = firebase.database()
  var venueid = ''
  var userid
  var dataref = database.ref('users/' + userid + '/data')
  var totaltripcounter
  var tempaddress
  var geocoder

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
      var newDestArry = $('#newdestarry').val().trim()
      var newDestArrm = $('#newdestarrm').val().trim()
      var newDestArrd = $('#newdestarrd').val().trim()
      var newDestDepty = $('#newdestdepty').val().trim()
      var newDestDeptm = $('#newdestdeptm').val().trim()
      var newDestDeptd = $('#newdestdeptd').val().trim()
      var newDestComm = $('#newdestcomm').val().trim()
      var currentTripCounter
      database.ref('users/' + userid + '/trips/' + tripName).once('value').then(function(snapshot){
        currentTripCounter = snapshot.val().tripcounter
      })
      database.ref('users/' + userid + '/trips/' + tripName + '/dests/' + newDestname).set({
        destName: newDestname,
        destLoc: newDestLoc,
        destArr: (newDestArry + '-' + newDestArrm + '-' + newDestArrd + 'T13:00:00'),
        destDept: (newDestDepty + '-' + newDestDeptm + '-' + newDestDeptd + 'T13:00:00'),
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
      $('#mapmodal').hide()
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
      var mapslocation = ($(this).context.previousSibling.innerText)
      var mapsarrive = ($(this).context.previousSibling.previousElementSibling.previousSibling.innerText + 'T13:00:00')
      var mapsdepart = ($(this).context.previousSibling.previousElementSibling.innerText + 'T13:00:00')
      // Get and add Lat/Long
      evBriteLookUp(mapsarrive, mapsdepart, mapslocation, $(this))
      // google.maps.event.trigger(map, 'resize')
      // initMap()
    }

// Firebase Listeners
  firebase.auth().onAuthStateChanged((user) => {
    debugger;
    if (user) {
      console.log("---------auth state change-----------");
      userid = user.uid
      sessionStorage.setItem("userid", user.uid)
      $('.newusersignup').hide()
      $('.returninguserlogin').hide()
    }
    // if (page === "index"){
    //   initMap()
    // }
  });

// My Trips
  $(document).on('ready', function(){
    userid = sessionStorage.getItem('userid')
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
          console.log(desttemp)
          desttemp = $.map( desttemp, function(key){
            console.log(key)
            var destnum = $('.destdrop' + tripnum)["0"].children.length
            var dname = key.destName
            var dcomm = key.destComm
            var darr = ((key.destArr).substring(0, 10))
            var ddept = ((key.destDept).substring(0, 10))
            debugger;
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
          'include_unavailable_events': false,
        }
      }).done(function(response){
        if (response.events.length === 0){
          console.log('no results')
          $(thisbutton).text("Sorry, no shows available for those dates!")
        } else {
          initMap()
          eventmap = $('#map')
          console.log('some results')
          for ( var i = 0; i < 5; i++){
            tempid = response.events[i].venue_id
            function makeMarkers (tempid) {

            }
            console.log(tempid)
            $.ajax({
              url: 'https://www.eventbriteapi.com/v3/venues/' + tempid + '/',
              method: 'GET',
              data: {
                token: '75JDM6P6R2M2PFYEECJ3'
              }
            }).done(function(response){
              debugger;
              tempaddress = response.address.localized_address_display
              var tempname = response.name
              var templat = Number(response.latitude)
              var templong = Number(response.longitude)
              $('#mapmodal').show()
              google.maps.event.trigger(map, 'resize')
              map.setCenter({lat: templat, lng: templong})
              // geocodeAddress(tempaddress, map)
              var marker = new google.maps.Marker({
                map: map,
                position:{lat: templat, lng: templong}
              })
            })
          }
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
    function returningusersubmit(){
      var returninguserEmail = $('#returninguseremail').val().trim()
      var returninguserPassword = $('#returninguserpw').val().trim()
        firebase.auth().signInWithEmailAndPassword(returninguserEmail, returninguserPassword).catch(function(error){
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
            console.log(error);
          }
        })
      $('#returningusermodal').hide()
    };

    // // Sign Out
    // firebase.auth().signOut().then(function() {
    //   console.log('Signed Out');
    // }).catch(function(error) {
    //   console.error('Sign Out Error', error);
    // });

