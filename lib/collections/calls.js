Calls = new Mongo.Collection('calls');

CallsSchema = new SimpleSchema({
   locationname: {
      type: String,
      label: 'Location name*',
      autoform:{
         type: 'select',
         options: function() {
            return Locations.find({},{sort: {name:1}}).map(function(t){
               return {label: t.name, value: t.name};
            });
         }

      }
   },
   appointment: {
      type: Date,
      label: 'Appointment*',
      autoform: {
         afFieldInput: {
            type: "bootstrap-datetimepicker",
            dateTimePickerOptions: {
               format: 'LLL',
               locale: 'nl',
               language: 'nl',
               today: true,
               timezoneId: 'Europe/Amsterdam'
            }
         }
      }
   },
   modality: {
      type: String,
      label: 'Modality*',
      allowedValues: ['barge', 'rail', 'truck'],
      autoform: {
         type: 'select',
         options: [{
            label: "barge",
            value: "barge"
         }, {
            label: "rail",
            value: "rail"
         }, {
            label: "truck",
            value: "truck"
         }]
      }
   },
   resourcename: {
      type: String,
      label: 'Resource name',
      optional: true,
      autoform:{
         type: 'select',
         options: function() {
            return Resources.find({},{sort: {name:1}}).map(function(t){
               return {label: t.name, value: t.name};
            });
         }
      }
   },
   arrivaltime:{
      type: Date,
      label: 'Arrival',
      optional: true,
      autoform: {
         afFieldInput: {
            type: "bootstrap-datetimepicker",
            dateTimePickerOptions: {
               format: 'LLL',
               locale: 'nl',
               language: 'nl',
               today: true,
               timezoneId: 'Europe/Amsterdam'
            }
         }
      }
   },
   departuretime:{
      type: Date,
      label: 'Departure',
      optional: true,
      autoform: {
         afFieldInput: {
            type: "bootstrap-datetimepicker",
            dateTimePickerOptions: {
               format: 'LLL',
               locale: 'nl',
               language: 'nl',
               today: true,
               timezoneId: 'Europe/Amsterdam'
            }
         }
      }
   },
   etafromresource:{
      type: Date,
      label: 'ETA',
      optional: true,
      autoform: {
         afFieldInput: {
            type: "bootstrap-datetimepicker",
            dateTimePickerOptions: {
               format: 'LLL',
               locale: 'nl',
               language: 'nl',
               today: true,
               timezoneId: 'Europe/Amsterdam'
            }
         }
      }
   },
   status: {
      type: String,
      label: 'Status',
      optional: true,
      allowedValues: ['expected', 'arrived', 'departed'],
      autoform: {
         type: 'select',
         options: [{
            label: "expected",
            value: "expected"
         }, {
            label: "arrived",
            value: "arrived"
         }, {
            label: "departed",
            value: "departed"
         }]
      }
   },
   colorpan: {
      type: String,
      label: 'colorpanel',
      optional: true,
      allowedValues: ['default', 'info', 'success'],
      autoform: {
         type: 'select',
         options: [{
            label: "default",
            value: "default"
         }, {
            label: "info",
            value: "info"
         }, {
            label: "success",
            value: "success"
         }]
      }
   },
   archivedbyresource: {
      type: Boolean,
      label: 'archived by resource',
      optional: true,
      allowedValues: [true, false],
      autoform: {
         type: 'select',
         options: [{
            label: "no",
            value: false
         }, {
            label: "yes",
            value: true
         }]
      }
   },
   archivedbyplanner: {
      type: Boolean,
      label: 'archived by planner',
      optional: true,
      allowedValues: [true, false],
      autoform: {
         type: 'select',
         options: [{
            label: "no",
            value: false
         }, {
            label: "yes",
            value: true
         }]
      }
   },
   callowner: {
      type: String,
      label: 'Callowner',
      optional: true,
      autoform:{
         type: 'select',
         options: function() {
            return [{label: Meteor.user().username, value: Meteor.user().username }];
         }
      }
   },
   callcompany: {
      type: String,
      label: 'Call company',
      optional: true,
      autoform:{
         type: 'select',
         options: function() {
            return [{label: Meteor.user().profile.company, value: Meteor.user().profile.company}];
         }
      }
   },
   calltype: {
      type: String,
      label: 'Call type',
      allowedValues: ['inland', 'seaport'],
      autoform: {
         type: 'select',
         options: [{
            label: 'inland',
            value: 'inland'
         }, {
            label: 'seaport',
            value: 'seaport'
         }]
      }
   }
});

Calls.attachSchema(CallsSchema);


Calls.allow({
   insert(userId, doc) {
      return !!Roles.userIsInRole(userId, ['planner', 'admin']);
   },
	update(userId, doc){
		return !!Roles.userIsInRole(userId, ['planner','resource-operator','admin']);
	},
	remove(userId, doc){
		return !!Roles.userIsInRole(userId, ['planner','admin']);
	}
});