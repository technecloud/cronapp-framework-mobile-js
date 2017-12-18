(function($app) {
  angular.module('custom.controllers', []);
  app.controller('LoginController', [ 
    '$scope', 
    '$http', 
    '$location', 
    '$rootScope', 
    '$window', 
    '$state', 
    '$translate', 
    'Notification', 
    '$ionicLoading', 
    '$timeout',
    '$stateParams',
    function($scope, $http, $location, $rootScope, $window, $state, $translate, Notification, $ionicLoading, $timeout, $stateParams) {
        
		  app.registerEventsCronapi($scope, $translate);
      $rootScope.http = $http;
      $scope.Notification = Notification;

		  for(var x in app.userEvents)
          $scope[x]= app.userEvents[x].bind($scope);
		  
        $scope.user = { username : "" , password : "" };
        $scope.message = {};

        $scope.login = function() {

          $ionicLoading.show({
            content : 'Loading',
            animation : 'fade-in',
            showBackdrop : true,
            maxWidth : 200,
            showDelay : 0
          });


          $scope.message.error = undefined;
          
          if(window.hostApp) {
            $http({
              method : 'POST',
              url : window.hostApp + 'auth',
			  data: $.param($scope.user),
			  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(handleSuccess).error(handleError);

          }
          else {
            $ionicLoading.hide();
            Notification.error("HostApp is required!");
          }

        }

        $rootScope.infiniteReached = function() {
          //
        }

        function handleSuccess(data, status, headers, config) {
          // Store data response on session storage
          // The session storage will be cleaned when the browser window is closed
          if(typeof (Storage) !== "undefined") {
            // save the user data on localStorage
            sessionStorage.setItem('_u', JSON.stringify(data));
          }
          else {
            // Sorry! No Web Storage support.
            // The home page may not work if it depends
            // on the logged user data
          }
          // Redirect to home page
          $state.go("app.home");
          
          $timeout(function() {
            $ionicLoading.hide();
          },500);
        }

        function handleError(data, status, headers, config) {
          var error = status == 401 ? $translate.instant('Login.view.invalidPassword') : data;
          if (!error) {
            error = $translate.instant('General.ErrorNotSpecified');
          }
          console.log(error);
          $ionicLoading.hide();
          Notification.error(error);
        }

      } ]);

  app.controller('HomeController', [ 
      '$scope', 
      '$http', 
      '$rootScope', 
      '$state',
      '$timeout',
      '$translate', 
      'Notification', 
      '$ionicHistory',
      '$ionicModal',
      function($scope, $http, $rootScope, $state, $timeout, $translate, Notification, $ionicHistory, $ionicModal) {
        
		    app.registerEventsCronapi($scope, $translate);
        $rootScope.http = $http;
        $scope.Notification = Notification;

        for(var x in app.userEvents)
          $scope[x]= app.userEvents[x].bind($scope);
        
        $ionicModal.fromTemplateUrl('views/logged/_changepassword.view.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        
        $scope.openChangePassword = function() {
          $scope.modal.show();
        };

        $scope.closeChangePassword = function() {
          $scope.modal.hide();
        };

        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true

        $scope.message = {};

        $scope.selecionado = {
          valor : 1
        }
        
        // When access home page we have to check
        // if the user is authenticated and the userData
        // was saved on the browser's sessionStorage
        $rootScope.session = (sessionStorage._u) ? JSON.parse(sessionStorage._u) : null;

        if(!$rootScope.session) {
          // If there isn't a user registered on the sessionStorage
          // we must send back to login page
          // TODO - REVISAR login oauth2
           $state.go("login");
        }

        $rootScope.logout = function logout() {
          $rootScope.session = {};
          if(typeof (Storage) !== "undefined") {
            // save the user data on localStorage
            sessionStorage.removeItem("_u");
          }
          $state.go("login");
        }

        $scope.changePassword = function() {

          var user = {
            oldPassword : oldPassword.value,
            newPassword : newPassword.value,
            newPasswordConfirmation : newPasswordConfirmation.value
          };

          $http({
            method : 'POST',
            url: window.hostApp + 'changePassword',
            data : $.param(user),
            headers : {
              'Content-Type' : 'application/x-www-form-urlencoded'
            }
          }).success(changeSuccess).error(changeError);

          function changeSuccess(data, status, headers, config) {
            Notification.info($translate.instant('Home.view.passwordChanged'));
            cleanPasswordFields();
          }

          function changeError(data, status, headers, config) {
            var error = status >= 401 ? $translate.instant('Home.view.InvalidPassword') : data;
            Notification.error(error);
          }

          function cleanPasswordFields() {
            oldPassword.value = "";
            newPassword.value = "";
            newPasswordConfirmation.value = "";
            $scope.closeChangePassword();
          }
        };
        // refresh token
        function refreshToken() {
            $http({
                method: 'GET',
                url: window.hostApp + 'auth/refresh'
            }).success(function(data, status, headers, config) {
                // Store data response on session storage
                  console.log('revive :' , new Date(data.expires));
                  sessionStorage.setItem("_u",JSON.stringify(data));
                  // Recussive 
                  setTimeout(function() {
                    refreshToken();
                    // refres time
                  },(1800*1000));
                  
            }).error(function() {
              // abafar TODO 
            });
        }
        
        // exist session
        if(!$rootScope.session) {
          $state.go("login");
        } else {
           if ($rootScope.session.token) refreshToken();
        }
      } ]);
}(app));

window.safeApply = function(fn) {
  var phase = this.$root.$$phase;
  if (phase == '$apply' || phase == '$digest') {
    if (fn && (typeof(fn) === 'function')) {
      fn();
    }
  } else {
    this.$apply(fn);
  }
};
