'use strict';

angular.module('ripple-ui')
  .controller('ReferralsDetailCtrl', function ($scope, $stateParams, SearchInput, $modal, $location, $state, Helper, usSpinnerService, PatientService, Referral) {

    SearchInput.update();
    PatientService.get($stateParams.patientId).then(function (patient) {
      $scope.patient = patient;
    });

    Referral.get($stateParams.patientId, $stateParams.referralId, $stateParams.source).then(function (result) {
      $scope.referral = result.data;
      usSpinnerService.stop('contactDetail-spinner');
    });

    $scope.respond = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/referrals/referrals-modal.html',
        size: 'lg',
        controller: 'ReferralsModalCtrl',
        resolve: {
          modal: function () {
            return {
              title: 'Create Referral Response',
              response: true
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

        referral.dateResponded = new Date(referral.dateResponded);
        referral.dateResponded.setMinutes(referral.dateResponded.getMinutes() - referral.dateResponded.getTimezoneOffset());

        var toCreate = {
          sourceId: '',
          author: referral.author,
          referralOutcome: referral.referralOutcome,
          dateCreated: new Date(referral.dateCreated),
          dateOfReferral: referral.dateOfReferral,
          dateResponded: referral.dateResponded,
          reason: referral.reason,
          reference: referral.reference,
          referralFrom: referral.referralFrom,
          referralTo: referral.referralTo,
          referralType: referral.type,
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
        templateUrl: 'views/referrals/referrals-modal.html',
        size: 'lg',
        controller: 'ReferralsModalCtrl',
        resolve: {
          modal: function () {
            if($scope.referral.referralState == "completed"){
              return {
                title: 'Edit Referral Response',
                response: true
              };
            }
            else{
              return {
                title: 'Edit Referral Request',
                response: false
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

        referral.dateResponded = new Date(referral.dateResponded);
        referral.dateResponded.setMinutes(referral.dateResponded.getMinutes() - referral.dateResponded.getTimezoneOffset());

        var toUpdate = {
          sourceId: referral.sourceId,
          author: referral.author,
          clinicalSummary: referral.clinicalSummary,
          dateCreated: new Date(referral.dateCreated),
          dateOfReferral: referral.dateOfReferral,
          dateResponded: referral.dateResponded,
          reason: referral.reason,
          referralFrom: referral.referralFrom,
          referralTo: referral.referralTo,
          referralType: referral.type,
          referralOutcome: referral.referralOutcome,
          referralState: referral.referralState,
          reference: referral.reference,
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
