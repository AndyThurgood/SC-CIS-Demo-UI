'use strict';

angular.module('ripple-ui')
  .controller('ReferralsDetailCtrl', function ($scope, $stateParams, SearchInput, $modal, $location, $state, Helper, usSpinnerService, PatientService, Referral) {

    SearchInput.update();
    PatientService.get($stateParams.patientId).then(function (patient) {
      $scope.patient = patient;
    });

    Referral.get($stateParams.patientId, $stateParams.referralId).then(function (result) {
      $scope.referral = result.data;
      /*$scope.referral = {
        "sourceId":"8a634643-7232-45b7-a773-2375f92deb82::ripple_osi.ehrscape.c4h::1",
        "source":"Marand",
        "reference":"123-01923-09",
        "dateOfReferral":1459987200000,
        "dateOfResponse":1459987200000,
        "referralFrom":"Dr Jamie Jones",
        "referralType":"Cardiology",
        "referralTo":"Dr Carl Cox",
        "reason":"Prostate Cancer MDT",
        "outcome":"sick",
        "referralState":"completed",
        "author":"c4h_ripple_osi",
        "dateCreated":1460716241945
      };*/
      usSpinnerService.stop('referralsDetail-spinner');
    });

    $scope.respond = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/referrals/referrals-request-modal.html',
        size: 'lg',
        controller: 'ReferralsModalCtrl',
        resolve: {
          modal: function () {
            return {
              title: 'Create Referral Response'
            };
          },
          referral: function () {
            return angular.copy($scope.referral);
          },
          patient: function () {
            return $scope.patient;
          }
        }
      });

      modalInstance.result.then(function (referral) {
        referral.dateOfReferral = new Date(referral.dateOfReferral);
        referral.dateOfReferral.setMinutes(referral.dateOfReferral.getMinutes() - referral.dateOfReferral.getTimezoneOffset());

        var toCreate = {
          sourceId: '',
          author: referral.author,
          outcome: referral.outcome,
          dateCreated: new Date(referral.dateCreated),
          dateOfReferral: referral.dateOfReferral,
          reason: referral.reason,
          reference: referral.reference,
          referralFrom: referral.referralFrom,
          referralTo: referral.referralTo,
          referralState: 'completed',
          source: 'openehr'
        };

        Referral.create($scope.patient.id, toCreate).then(function () {
          setTimeout(function () {
            $state.go('referrals-request-detail', {
              patientId: $scope.patient.id,
              referralId: Helper.updateId(referral.sourceId),
              page: $scope.currentPage,
              reportType: $stateParams.reportType,
              searchString: $stateParams.searchString,
              queryType: $stateParams.queryType
            });
          }, 2000);
        });
      });
    };

    $scope.edit = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/referrals/referrals-request-modal.html',
        size: 'lg',
        controller: 'ReferralsModalCtrl',
        resolve: {
          modal: function () {
            if($scope.referral.referralState == "completed"){
              return {
                title: 'Edit Referral Response'
              };
            }
            else{
              return {
                title: 'Edit Referral Request'
              };
            }
          },
          referral: function () {
            return angular.copy($scope.referral);
          },
          patient: function () {
            return $scope.patient;
          }
        }
      });

      modalInstance.result.then(function (referral) {
        referral.dateOfReferral = new Date(referral.dateOfReferral);
        referral.dateOfReferral.setMinutes(referral.dateOfReferral.getMinutes() - referral.dateOfReferral.getTimezoneOffset());

        var toUpdate = {
          sourceId: referral.sourceId,
          author: referral.author,
          clinicalSummary: referral.clinicalSummary,
          dateCreated: new Date(referral.dateCreated),
          dateOfReferral: referral.dateOfReferral,
          reason: referral.reason,
          referralFrom: referral.referralFrom,
          referralTo: referral.referralTo,
          source: 'openehr'
        };

        Referral.update($scope.patient.id, toUpdate).then(function () {
          setTimeout(function () {
              $state.go('referrals-request-detail', {
                patientId: $scope.patient.id,
                referralId: Helper.updateId(referral.sourceId),
                page: $scope.currentPage,
                reportType: $stateParams.reportType,
                searchString: $stateParams.searchString,
                queryType: $stateParams.queryType
              });
          }, 2000);
        });
      });
    };

  });
