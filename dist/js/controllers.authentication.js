!function(o){angular.module("custom.controllers",[]);var t=function(o,t,e,n){window.hostApp?t({method:"GET",url:window.hostApp+"auth/refresh"}).success(function(r,i,a,l){console.log("revive :",new Date(r.expires)),localStorage.setItem("_u",JSON.stringify(r)),setTimeout(function(){$scope.refreshToken(o,t,e,n)},18e5),e()}).error(function(){n()}):o.error("HostApp is required to refresh token!")};app.controller("LoginController",["$scope","$http","$location","$rootScope","$window","$state","$translate","Notification","$ionicLoading","$timeout","$stateParams","$ionicModal",function(o,e,n,r,i,a,l,c,s,p,u,f){function g(o,t,e,n){"undefined"!=typeof Storage&&localStorage.setItem("_u",JSON.stringify(o)),a.go("app.home"),p(function(){s.hide()},500)}function d(o,t,e,n){var r=401==t?l.instant("Login.view.invalidPassword"):o;r||(r=l.instant("General.ErrorNotSpecified")),console.log(r),s.hide(),c.error(r)}app.registerEventsCronapi(o,l,f,s),r.http=e,o.Notification=c;for(var h in app.userEvents)o[h]=app.userEvents[h].bind(o);o.autoLogin=function(){localStorage.getItem("_u")&&t(c,e,function(){a.go("app.home")},function(){localStorage.removeItem("_u")})},o.autoLogin(),o.user={username:"",password:""},o.message={},o.login=function(){o.message.error=void 0,window.hostApp?(this.cronapi.screen.showLoading(),e({method:"POST",url:window.hostApp+"auth",data:$.param(o.user),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(g).error(d)):c.error("HostApp is required!")},r.infiniteReached=function(){};try{var m=$controller("AfterLoginController",{$scope:o});app.copyContext(m,this,"AfterLoginController")}catch(o){}try{o.blockly.events.afterLoginRender&&o.blockly.events.afterLoginRender()}catch(o){}}]),app.controller("HomeController",["$scope","$http","$rootScope","$state","$timeout","$translate","Notification","$ionicHistory","$ionicModal","$ionicLoading",function(o,e,n,r,i,a,l,c,s,p){app.registerEventsCronapi(o,a,s,p),n.http=e,o.Notification=l;for(var u in app.userEvents)o[u]=app.userEvents[u].bind(o);n.session=localStorage._u?JSON.parse(localStorage._u):null,n.session?n.session.token&&t(l,e,function(){},n.logout):o.ignoreAuth||("undefined"!=typeof Storage&&sessionStorage.removeItem("_u"),r.go("login"))}]),app.controller("PublicController",["$controller","$scope",function(o,t){t.ignoreAuth=!0,angular.extend(this,o("HomeController",{$scope:t}))}]),app.controller("MenuController",["$scope","$http","$rootScope","$state","$timeout","$translate","Notification","$ionicHistory","$ionicModal","$ionicLoading",function(o,t,e,n,r,i,a,l,c,s){app.registerEventsCronapi(o,i,c,s),e.http=t,o.Notification=a,o.folder="logged";for(var p in app.userEvents)o[p]=app.userEvents[p].bind(o);o.ignoreAuth||(c.fromTemplateUrl("views/logged/_changepassword.view.html",{scope:o,animation:"slide-in-up"}).then(function(t){o.modal=t}),o.openChangePassword=function(){o.modal.show()},o.closeChangePassword=function(){o.modal.hide()},o.logout=function(){e.session=null,localStorage.removeItem("_u"),n.go("login")}),o.http({method:"GET",url:"views/"+o.folder+"/menu.view.html"}).then(function(t){$(t.data).find("ion-nav-bar").length>0?o.isOldMenu=!0:o.isOldMenu=!1})}]),app.controller("PublicMenuController",["$controller","$scope",function(o,t){t.folder="public",angular.extend(this,o("MenuController",{$scope:t}))}]),app.controller("InitialController",["$scope","$stateParams","$http","Notification","$location","$rootScope","$translate","$ionicModal","$ionicLoading",function(o,t,e,n,r,i,a,l,c){app.registerEventsCronapi(o,a,l,c),i.http=e,o.Notification=n,o.params=t,o.$http=e,o.blockly.js.blockly.auth.Home.change()}]),app.controller("chatController",["$scope","$state","$ionicPopup","$ionicScrollDelegate","$timeout","$interval","$ionicModal","$translate","$rootScope","$http","Notification",function(o,t,e,n,r,i,a,l,c,s,p){app.registerEventsCronapi(o,l,a,$ionicLoading),c.http=s,o.Notification=p;for(var u in app.userEvents)o[u]=app.userEvents[u].bind(o);var f,g,d,h=(JSON.parse(localStorage._u).user.username,n.$getByHandle("userMessageScroll"));o.enter=function(){r(function(){f=document.body.querySelector(".homeView .bar-footer"),g=document.body.querySelector(".homeView .scroll-content"),d=angular.element(f.querySelector("textarea"))},0)},o.isEnter=function(o){13==o.keyCode&&r(function(){o.stopPropagation(),$("#sendButton").trigger("click")},0)},o.refreshScroll=function(t,e){r(function(){t=t||o.scrollDown,h.resize(),t&&h.scrollBottom(!0),o.checkScroll()},e||1e3)},o.scrollDown=!0,o.checkScroll=function(){return r(function(){var t=h.getScrollPosition().top,e=h.getScrollView().__maxScrollTop;o.scrollDown=t>=e,o.$apply()},0),!0}}]),app.controller("PageController",["$scope","$stateParams","Notification","$location","$http","$rootScope","$translate","$ionicModal","$ionicLoading",function(o,t,e,n,r,i,a,l,c){app.registerEventsCronapi(o,a,l,c),i.http=r,o.Notification=e,o.params=t,o.$http=r,o.listCanSwipe=!0;var s=n.search();for(var p in s)s.hasOwnProperty(p)&&(o.params[p]=s[p]);o.registerComponentScripts=function(){$(".carousel-indicators li").on("click",function(){var o="#"+$(this).parent().parent().parent().attr("id"),t=$(o+" .carousel-indicators li").index(this);$(o+" #carousel-example-generic").carousel(t)})},o.registerComponentScripts();try{var u=$controller("AfterPageController",{$scope:o});app.copyContext(u,this,"AfterPageController")}catch(o){}}]),app.controller("InitialController",["$scope","$stateParams","$http","Notification","$location","$rootScope","$translate","$ionicModal","$ionicLoading",function(o,t,e,n,r,i,a,l,c){app.registerEventsCronapi(o,a,l,c),i.http=e,o.Notification=n,o.params=t,o.$http=e;var s=r.search();for(var p in s)s.hasOwnProperty(p)&&(o.params[p]=s[p]);o.blockly.js.blockly.auth.Home.change()}])}(app),window.safeApply=function(o){var t=this.$root.$$phase;"$apply"==t||"$digest"==t?o&&"function"==typeof o&&o():this.$apply(o)};