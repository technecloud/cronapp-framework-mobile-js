(function(){angular.module("custom.controllers",[]);let a=function(b,c,d,e){window.hostApp?c({method:"GET",url:window.hostApp+"auth/refresh"}).success(function(f){console.log("revive :",new Date(f.expires)),localStorage.setItem("_u",JSON.stringify(f)),setTimeout(function(){a(b,c,d,e)},1800000),d()}).error(function(){e()}):b.error("HostApp is required to refresh token!")};app.controller("LoginController",["$scope","$http","$location","$rootScope","$window","$state","$translate","Notification","$ionicLoading","$timeout","$stateParams","$ionicModal",function(b,c,d,e,f,g,h,i,j,k,l,m){function n(a){"undefined"!=typeof Storage&&localStorage.setItem("_u",JSON.stringify(a)),g.go("app.home"),k(function(){j.hide()},500),b.blockly&&b.blockly.events&&b.blockly.events.onLogin&&b.blockly.events.onLogin instanceof Function&&b.blockly.events.onLogin()}function o(a,b){let c=401===b?h.instant("Login.view.invalidPassword"):a;c||(c=h.instant("General.ErrorNotSpecified")),console.log(c),j.hide(),i.error(c)}e.refreshToken=a,app.registerEventsCronapi(b,h,m,j),e.http=c,b.Notification=i,b.params=l;let p=d.search();for(let a in p)p.hasOwnProperty(a)&&(b.params[a]=p[a]);for(let a in app.userEvents)b[a]=app.userEvents[a].bind(b);b.autoLogin=function(){localStorage.getItem("_u")&&a(i,c,function(){g.go("app.home")},function(){localStorage.removeItem("_u")})},b.autoLogin(),b.user={username:"",password:""},b.message={},b.login=function(){b.message.error=void 0,window.hostApp?(this.cronapi.screen.showLoading(),c({method:"POST",url:window.hostApp+"auth",data:$.param(b.user),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(n).error(o)):i.error("HostApp is required!")},e.infiniteReached=function(){};try{let a=$controller("AfterLoginController",{$scope:b});app.copyContext(a,this,"AfterLoginController")}catch(a){}k(function(){b.blockly&&b.blockly.events&&b.blockly.events.afterLoginRender&&b.blockly.events.afterLoginRender instanceof Function&&b.blockly.events.afterLoginRender()})}]),app.controller("HomeController",["$scope","$http","$rootScope","$state","$timeout","$translate","Notification","$ionicHistory","$ionicModal","$ionicLoading","$stateParams","$location","$controller",function(b,c,d,e,f,g,h,i,j,k,l,m,n){app.registerEventsCronapi(b,g,j,k),d.http=c,b.Notification=h,b.params=l;let o=m.search();for(let a in o)o.hasOwnProperty(a)&&(b.params[a]=o[a]);for(let a in app.userEvents)b[a]=app.userEvents[a].bind(b);d.session=localStorage._u?JSON.parse(localStorage._u):null,d.session?d.session.token&&a(h,c,function(){},d.logout):!b.ignoreAuth&&("undefined"!=typeof Storage&&sessionStorage.removeItem("_u"),e.go("login"));try{var p=n("AfterHomeController",{$scope:b});app.copyContext(p,this,"AfterHomeController")}catch(a){}f(function(){b.blockly&&b.blockly.events&&b.blockly.events.afterHomeRender&&b.blockly.events.afterHomeRender instanceof Function&&b.blockly.events.afterHomeRender()})}]),app.controller("PublicController",["$controller","$scope",function(a,b){b.ignoreAuth=!0,angular.extend(this,a("HomeController",{$scope:b}))}]),app.controller("MenuController",["$scope","$http","$rootScope","$state","$timeout","$translate","Notification","$ionicHistory","$ionicModal","$ionicLoading",function(a,b,c,d,e,f,g,h,i,j){for(let k in app.registerEventsCronapi(a,f,i,j),c.http=b,a.Notification=g,a.folder="logged",app.userEvents)a[k]=app.userEvents[k].bind(a);a.ignoreAuth||(i.fromTemplateUrl("views/logged/_changepassword.view.html",{scope:a,animation:"slide-in-up"}).then(function(b){a.modal=b}),a.openChangePassword=function(){a.modal.modelEl?a.modal.show():b({url:"views/logged/_changepassword.view.html"}).then(function(b){a.modal=i.fromTemplate($(b.data).last().text(),{scope:a,animation:"slide-in-up"}),a.modal.show()})},a.closeChangePassword=function(){a.modal.hide()},a.logout=function(){c.session=null,localStorage.removeItem("_u"),d.go("login")}),a.http({method:"GET",url:"views/"+a.folder+"/menu.view.html"}).then(function(b){0<$(b.data).find("ion-nav-bar").length?(a.isOldMenu=!0,0<$(document).find("ion-header-bar").length&&$(document).find("ion-nav-bar").show()):a.isOldMenu=!1})}]),app.controller("PublicMenuController",["$controller","$scope",function(a,b){b.folder="public",angular.extend(this,a("MenuController",{$scope:b}))}]),app.controller("InitialController",["$scope","$stateParams","$http","Notification","$location","$rootScope","$translate","$ionicModal","$ionicLoading","$ionicPlatform",function(a,b,c,d,e,f,g,h,i,j){j.registerBackButtonAction(function(a){a.preventDefault(),a.stopPropagation(),navigator.app.exitApp()},101),app.registerEventsCronapi(a,g,h,i),f.http=c,a.Notification=d,a.params=b,a.$http=c,a.blockly.js.blockly.auth.Home.change()}]),app.controller("chatController",["$scope","$state","$ionicPopup","$ionicScrollDelegate","$timeout","$interval","$ionicModal","$translate","$rootScope","$http","Notification",function(a,b,c,d,f,g,h,i,j,k,l){for(let e in app.registerEventsCronapi(a,i,h,$ionicLoading),j.http=k,a.Notification=l,app.userEvents)a[e]=app.userEvents[e].bind(a);let m,n,o,p=JSON.parse(localStorage._u).user.username,q=d.$getByHandle("userMessageScroll");a.enter=function(){f(function(){m=document.body.querySelector(".homeView .bar-footer"),n=document.body.querySelector(".homeView .scroll-content"),o=angular.element(m.querySelector("textarea"))},0)},a.isEnter=function(a){13===a.keyCode?f(function(){a.stopPropagation(),$("#sendButton").trigger("click")},0):null},a.refreshScroll=function(b,c){f(function(){b=b||a.scrollDown,q.resize(),b&&q.scrollBottom(!0),a.checkScroll()},c||1e3)},a.scrollDown=!0,a.checkScroll=function(){return f(function(){let b=q.getScrollPosition().top,c=q.getScrollView().__maxScrollTop;a.scrollDown=b>=c,a.$apply()},0),!0}}]),app.controller("PageController",["$scope","$stateParams","Notification","$location","$http","$rootScope","$translate","$ionicModal","$ionicLoading","$timeout",function(a,b,c,d,e,f,g,h,i,j){app.registerEventsCronapi(a,g,h,i),f.http=e,a.Notification=c,a.params=b,a.$http=e,a.listCanSwipe=!0;let k=d.search();for(let l in k)k.hasOwnProperty(l)&&(a.params[l]=k[l]);if(f.session=void 0===localStorage.getItem("_u")?null:JSON.parse(localStorage.getItem("_u")),a.registerComponentScripts=function(){$(".carousel-indicators li").on("click",function(){let a="#"+$(this).parent().parent().parent().attr("id"),b=$(a+" .carousel-indicators li").index(this);$(a+" #carousel-example-generic").carousel(b)})},a.registerComponentScripts(),a.isOldMenu){let b=a.params.name||"home";a.http({method:"GET",url:"views/logged/"+b+".view.html"}).then(function(a){0<$(a.data).find("ion-header-bar").length?$(document).find("ion-nav-bar").hide():0<$(document).find("ion-header-bar").length&&$(document).find("ion-nav-bar").show()})}try{let b=$controller("AfterPageController",{$scope:a});app.copyContext(b,this,"AfterPageController")}catch(a){}j(function(){a.blockly&&a.blockly.events&&a.blockly.events.afterPageRender&&a.blockly.events.afterPageRender instanceof Function&&a.blockly.events.afterPageRender()})}]),app.controller("InitialController",["$scope","$stateParams","$http","Notification","$location","$rootScope","$translate","$ionicModal","$ionicLoading","$ionicPlatform",function(a,b,c,d,e,f,g,h,i,j){j.registerBackButtonAction(function(a){a.preventDefault(),a.stopPropagation(),navigator.app.exitApp()},101),app.registerEventsCronapi(a,g,h,i),f.http=c,a.Notification=d,a.params=b,a.$http=c;let k=e.search();for(let l in k)k.hasOwnProperty(l)&&(a.params[l]=k[l]);a.blockly.js.blockly.auth.Home.change()}])})(app),window.safeApply=function(a){let b=this.$root.$$phase;"$apply"===b||"$digest"===b?a&&"function"==typeof a&&a():this.$apply(a)};