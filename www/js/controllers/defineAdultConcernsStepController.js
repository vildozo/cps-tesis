angular.module('starter.controllers')
.controller('AdultConcernsCrtl', function($scope, $cordovaSQLite, $state, $ionicModal, $ionicPopup, $stateParams, $ionicTabsDelegate, $timeout, UnsolvedProblemFactory, ChildConcernFactory){

  $scope.adultsConcern = { description: ""};
  $scope.adultsConcerns = getAdultConcerns($cordovaSQLite, $stateParams.unsolvedProblemId);
  $scope.firstItemAnimationShown = false;

  $scope.updateAdultsConcerns = function(){
    $scope.adultsConcerns = getAdultConcerns($cordovaSQLite, $stateParams.unsolvedProblemId);
  };

  $scope.findUnsolvedProblem = function() {
    UnsolvedProblemFactory.find($stateParams.unsolvedProblemId, function(result){
      $scope.unsolvedProblem = result.rows.item(0);
    });
  };
  $scope.createAdultsConcern = function(){
    if (!inputFieldIsEmpty($scope.adultsConcern.description)) {
      saveAdultsConcern($cordovaSQLite,$scope.adultsConcern.description, $stateParams.unsolvedProblemId);
      $scope.modalCreate.hide();
      $state.go('app.defineTheProblem');
      $scope.adultsConcern.description = "";
      $scope.adultsConcerns= getAdultConcerns($cordovaSQLite,$stateParams.unsolvedProblemId);
    }
  };



  $scope.editAdultsConcern = function(adultsConcern){
    $scope.adultsConcerntoEdit = adultsConcern;
    $scope.editableAdultsConcern = {
      description: adultsConcern.description
    };
    $scope.openModalEdit();
  };


  $scope.updateAdultsConcern = function(){
    if (!inputFieldIsEmpty($scope.editableAdultsConcern.description)) {
      updateAdultsConcern($cordovaSQLite, [$scope.editableAdultsConcern.description,$scope.adultsConcerntoEdit.id]);
      $scope.modalEdit.hide();
      $scope.adultsConcerntoEdit = {};
      $scope.adultsConcerns= getAdultConcerns($cordovaSQLite,$stateParams.unsolvedProblemId);
    }
    else {
      $scope.emptyInput = true;
    }
  };

  $scope.showDeleteConfirmationPopup = function(adultsConcern) {
    var confirmPopup = $ionicPopup.confirm({
      title: "Delete Adult's Concern",
      template: "Are you sure you want to delete this adult's concern?"
    });

    confirmPopup.then(function(res) {
      if(res){
        $scope.deleteAdultsConcern(adultsConcern);
      }
    });
  };

  $scope.deleteAdultsConcern = function(adultsConcern) {
    var query = "DELETE FROM adults_concerns where id = ?";
    $cordovaSQLite.execute(db, query, [adultsConcern.id]).then(function(res) {
        $scope.adultsConcerns.splice($scope.adultsConcerns.indexOf(adultsConcern), 1);
    }, function (err) {
        console.error(err);
    });
 };

  $ionicModal.fromTemplateUrl('templates/adultsConcerns/create-adults-concern-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalCreate = modal;
  });
  $scope.openModal = function() {
    $scope.modalCreate.show();
  };
  $scope.closeModal = function() {
    $scope.modalCreate.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modalCreate.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });



  $ionicModal.fromTemplateUrl('templates/adultsConcerns/create-adults-concern-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalEdit = modal;
  });
  $scope.openModalEdit = function() {
    $scope.modalEdit.show();
  };
  $scope.closeModalEdit = function() {
    $scope.modalEdit.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modalEdit.remove();
  });
  // Execute action on hide modal
  $scope.$on('modalEdit.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modalEdit.removed', function() {
    // Execute action
  });

  $ionicModal.fromTemplateUrl('templates/adultsConcerns/edit-adults-concern-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalEdit = modal;
  });
  $scope.openModalEdit = function() {
    $scope.modalEdit.show();
  };
  $scope.closeModalEdit = function() {
    $scope.modalEdit.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modalEdit.remove();
  });
  // Execute action on hide modal
  $scope.$on('modalEdit.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modalEdit.removed', function() {
    // Execute action
  });

  $scope.selectTabWithIndex = function(index) {
    if(index === 0){
      $ionicTabsDelegate.select(index);
      $state.go('app.showUnsolvedProblem',{ unsolvedProblemId: $scope.unsolvedProblem.id});
    }
    if(index == 1){
      if($scope.childsConcerns.length === 0){
        var alertPopup = $ionicPopup.alert({
           title: 'Step 2 wasn\'t unlocked.',
           template: 'You have to finish previous steps to continue.'
         });
         alertPopup.then(function(res) {
         });
      }else {
        $ionicTabsDelegate.select(index);
        $state.go('app.defineTheProblem',{ unsolvedProblemId: $scope.unsolvedProblem.id});
      }
    }
    if(index==2){
      if($scope.adultsConcerns.length === 0 || $scope.childsConcerns.length === 0){
        var alertPopupForUnsolved = $ionicPopup.alert({
           title: 'Step 3 wasn\'t unlocked.',
           template: 'You have to finish previous steps to continue.'
         });
         alertPopupForUnsolved.then(function(res) {
         });
      }else {
        $state.go('app.invitation',{ unsolvedProblemId: $scope.unsolvedProblem.id});
        $ionicTabsDelegate.select(index);
      }
    }
  };
  $scope.unableAnimation = function(){
    $scope.firstItemAnimationShown = true;
  };
  $scope.hideFakeButtons = function() {
    return ( $scope.adultsConcerns.length === 0 || $scope.firstItemAnimationShown );
  };

  $timeout( function() {$ionicTabsDelegate.$getByHandle('myTabs').select( parseInt(1,10));});

});
