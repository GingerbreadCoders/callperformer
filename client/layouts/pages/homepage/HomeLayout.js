// setting a reactive variable to hold he current datetime
var clock = new ReactiveVar(new Date());


// do when the template is created
// subscription to the currentcalls publication
// and update the reactivevariable every second.
Template.HomeLayout.onCreated(function() {
   this.autorun(() => {
      this.subscribe('currentcalls');
   });
   Meteor.setInterval(function() {
      clock.set(new Date());
   }, 1000);

   // setting an info alert upon the status change of the call.
   Calls.find({}).observeChanges({
      changed: function(id, fields) {
         if (fields.status) {
            var call = Calls.findOne(id);
            Bert.alert({
              title: call.resourcename,
              message: fields.status+', at '+call.locationname,
              icon: 'fa-thumbs-up',
            });
         }
      }
   });

});


// helpers for the HomeLayout template
Template.HomeLayout.helpers({
   // provides the proper displayvalue according to the status of the call
   etafield: function(status, eta, ata, atd) {
      switch (status) {
         case 'expected':
         case 'delayed':
            if (eta) {
               return moment(eta).locale("nl").format('DD-MM HH:mm');
               break;
            } else {
               return 'not received';
               break;
            }
         case 'arrived':
            return moment(ata).locale("nl").format('DD-MM HH:mm');
            break;
         case 'departed':
            return moment(atd).locale("nl").format('DD-MM HH:mm');
            break;
      }
   },
   // formats a datetime into dutch locale, take a datetime and returns it
   //  formatted.
   formattoDatetime: function(datetime) {
      if (datetime) {
         return moment(datetime).locale("nl").format('DD-MM HH:mm');
      } else {
         return false;
      }
   },
   // each to his own modality icon
   modalityicon: function(modality) {
      switch (modality) {
         case 'barge':
            return 'fa fa-ship';
            break;
         case 'rail':
            return 'fa fa-train';
            break;
         case 'truck':
            return 'fa fa-truck';
            break;
      }
   },
   // calculateStatus uses the ReactiveVar <clock> to have it change
   // reactively. It is ran with each clock.set
   calculateStatus: function(status, appointment) {
      switch (status) {
         case 'arrived':
            return status;
            break;
         case 'departed':
            return status;
            break;
         case 'expected':
            if (appointment < clock.get()) {
               return 'delayed';
               break;
            } else {
               return status;
            }
      }
   },
   //get the current datetime and format into Dutch locale
   datenow: function() {
      return moment(clock.get()).locale("nl").format('LLL');
   },
   // makes a list of calls at an inland terminal available to
   // render into the template
   callsinland: function() {
      return Calls.find({
         calltype: 'inland'
      }, {
         sort: {
            appointment: 1
         }
      });
   },
   // makes a list of calls at a seaport available to render into the template
   callsseaport: function() {
      return Calls.find({
         calltype: 'seaport'
      }, {
         sort: {
            appointment: 1
         }
      });
   }
});


// Caroussel uses the udondan:slick package
// will be rendered into the HomeLayout template
// by attaching it to the id:#carousel
Template.HomeLayout.rendered = function() {
   $('#carousel').slick({
      dots: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 15000,
   });
};