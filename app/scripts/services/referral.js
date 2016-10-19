'use strict';

angular.module('ripple-ui')
  .factory('Referral', function ($http) {

    var all = function (patientId) {
      return $http.get('/api/patients/' + patientId + '/referrals');
    };

    var get = function (patientId, compositionId) {
      return $http.get('/api/patients/' + patientId + '/referrals/' + compositionId);
      /*console.log("get call");
      return {
        "sourceId":"8a634643-7232-45b7-a773-2375f92deb82::ripple_osi.ehrscape.c4h::1",
        "source":"Marand",
        "reference":"123-01923-09",
        "dateOfReferral":1459987200000,
        "dateOfResponse":1459987200000,
        "referralFrom":"Dr Jamie Jones",
        "type":"Cardiology",
        "referralTo":"Dr Carl Cox",
        "reason":"Prostate Cancer MDT",
        "outcome":"sick",
        "state":"Responded",
        "author":"c4h_ripple_osi",
        "dateCreated":1460716241945
      }*/
    };

    var create = function (patientId, composition) {
      console.log('post referral comp:');
      console.log(composition);
      return $http.post('/api/patients/' + patientId + '/referrals', composition);
    };

    var update = function (patientId, composition) {
      console.log('put referral comp:');
      console.log(composition);
      return $http.put('/api/patients/' + patientId + '/referrals', composition);
    };

    return {
      all: all,
      get: get,
      update: update,
      create: create
    };

  });
