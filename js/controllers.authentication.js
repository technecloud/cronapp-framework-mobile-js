(function($app) {
  angular.module('custom.controllers', []);

  // refresh token
  var  refreshToken = function($http,success,err) {
    $http({
      method : 'GET',
      url : window.hostApp + 'auth/refresh'
    }).success(function(data, status, headers, config) {
      // Store data response on local storage
      console.log('revive :', new Date(data.expires));
      localStorage.setItem("_u", JSON.stringify(data));
      // Recussive
      setTimeout(function() {
        $scope.refreshToken($http, success,err);
        // refres time
      }, (1800 * 1000));
      success();
    }).error(function() {
      err();
    });
  };

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
    '$ionicModal',
    function($scope, $http, $location, $rootScope, $window, $state, $translate, Notification, $ionicLoading, $timeout, $stateParams,$ionicModal) {

      app.registerEventsCronapi($scope, $translate,$ionicModal);
      $rootScope.http = $http;
      $scope.Notification = Notification;

      for(var x in app.userEvents)
        $scope[x]= app.userEvents[x].bind($scope);

      $scope.autoLogin = function(){
        if(localStorage.getItem('_u')){
          refreshToken($http, function(){
            $state.go('app.home');
          }, function(){
            localStorage.removeItem('_u');
          })
        }
      }
      $scope.autoLogin();

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
          localStorage.setItem('_u', JSON.stringify(data));
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
	  
	  try {
        var contextAfterLoginController = $controller('AfterLoginController', { $scope: $scope });
        app.copyContext(contextAfterLoginController, this, 'AfterLoginController');
      } catch(e) {};
      try { if ($scope.blockly.events.afterLoginRender) $scope.blockly.events.afterLoginRender(); } catch(e) {};

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

      app.registerEventsCronapi($scope, $translate,$ionicModal);
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
      $rootScope.session = (localStorage._u) ? JSON.parse(localStorage._u) : null;

      $rootScope.logout = function logout() {
        $rootScope.session = {};
          localStorage.removeItem("_u");
        $state.go("login");
      }

      if(!$rootScope.session) {

        if(!$scope.ignoreAuth){
          if(typeof (Storage) !== "undefined") {
            // save the user data on localStorage
            sessionStorage.removeItem("_u");
          }
          $state.go("login");
        }
        // If there isn't a user registered on the sessionStorage
        // we must send back to login page
        // TODO - REVISAR login oauth2
      }else {
        if ($rootScope.session.token) refreshToken($http, function(){},  $rootScope.logout);
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
    } ]);

  app.controller('PublicController', function($controller, $scope) {
    $scope.ignoreAuth = true;
    angular.extend(this, $controller('HomeController', {
      $scope: $scope
    }));
  });

  app.controller('chatController', [
    '$scope',
    '$state',
    '$ionicPopup',
    '$ionicScrollDelegate',
    '$timeout',
    '$interval',
    '$ionicModal',
    '$translate',
    '$rootScope',
    '$http',
    'Notification',
    function chatController($scope, $state,$ionicPopup, $ionicScrollDelegate, $timeout, $interval, $ionicModal,$translate,$rootScope,$http,Notification) {

      app.registerEventsCronapi($scope, $translate);
      $rootScope.http = $http;
      $scope.Notification = Notification;
      for(var x in app.userEvents)
        $scope[x]= app.userEvents[x].bind($scope);

      var user = JSON.parse(localStorage._u).user.username;
      var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
      var footerBar; // gets set in $ionicView.enter
      var scroller;
      var txtInput; // ^^^
      $scope.enter =  function () {
        $timeout(function () {
          footerBar = document.body.querySelector('.homeView .bar-footer');
          scroller = document.body.querySelector('.homeView .scroll-content');
          txtInput = angular.element(footerBar.querySelector('textarea'));
        }, 0);
      };
      $scope.isEnter = function(e){
        (e.keyCode == 13) ?  $timeout(function(){
          e.stopPropagation();
          $('#sendButton').trigger('click')
        },0): null;
      }
      $scope.refreshScroll = function (scrollBottom, timeout) {
        $timeout(function () {
          scrollBottom = scrollBottom || $scope.scrollDown;
          viewScroll.resize();
          if (scrollBottom) {
            viewScroll.scrollBottom(true);
          }
          $scope.checkScroll();
        }, timeout || 1000);
      };
      $scope.scrollDown = true;
      $scope.checkScroll = function () {
        $timeout(function () {
          var currentTop = viewScroll.getScrollPosition().top;
          var maxScrollableDistanceFromTop = viewScroll.getScrollView().__maxScrollTop;
          $scope.scrollDown = (currentTop >= maxScrollableDistanceFromTop);
          $scope.$apply();
        }, 0);
        return true;
      };
    }
  ]);
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
