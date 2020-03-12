(function(){angular.module("custom.controllers",[]),app.controller("LoginController",["$scope","$http","$location","$rootScope","$window","$state","$translate","Notification","$ionicLoading","$timeout","$stateParams","$ionicModal","$cookies",function(a,b,c,d,e,f,g,h,i,j,k,l,m){function n(b){"undefined"!=typeof Storage&&localStorage.setItem("_u",JSON.stringify(b)),f.go("app.home"),a.blockly&&a.blockly.events&&a.blockly.events.onLogin&&a.blockly.events.onLogin instanceof Function&&a.blockly.events.onLogin()}function o(a,b){let c=401===b?g.instant("Login.view.invalidPassword"):a;c||(c=g.instant("General.ErrorNotSpecified")),h.error(c)}d.refreshToken=window.refreshToken,app.registerEventsCronapi(a,g,l,i),d.http=b,a.Notification=h,a.params=k;let p=c.search();for(let n in p)p.hasOwnProperty(n)&&(a.params[n]=p[n]);for(let n in app.userEvents)a[n]=app.userEvents[n].bind(a);if(a.redirectToLogin=function(){localStorage.setItem("redir_mob",!0),e.location.href="/login"},a.autoLogin=function(){localStorage.getItem("_u")&&JSON.parse(localStorage.getItem("_u")).token&&window.refreshToken(h,b,function(){f.go("app.home")},function(){localStorage.removeItem("_u")})},a.autoLogin(),m.get("_u")){if(!localStorage.getItem("_u")){var q=decodeURIComponent(m.get("_u"));localStorage.setItem("_u",q)}f.go("app.home")}a.user={username:"",password:""},a.message={},a.login=function(){a.message.error=void 0,window.hostApp?b({method:"POST",url:window.hostApp+"auth",data:$.param(a.user),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(n).error(o):h.error("HostApp is required!")},d.infiniteReached=function(){};try{let b=$controller("AfterLoginController",{$scope:a});app.copyContext(b,this,"AfterLoginController")}catch(a){}j(function(){a.blockly&&a.blockly.events&&a.blockly.events.afterLoginRender&&a.blockly.events.afterLoginRender instanceof Function&&a.blockly.events.afterLoginRender()})}]),app.controller("HomeController",["$scope","$http","$rootScope","$state","$timeout","$translate","Notification","$ionicHistory","$ionicModal","$ionicLoading","$stateParams","$location","$controller","UploadService",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){app.registerEventsCronapi(a,f,i,j),c.http=b,c.Notification=g,c.UploadService=n,a.params=k;let o=l.search();for(let p in o)o.hasOwnProperty(p)&&(a.params[p]=o[p]);for(let o in app.userEvents)a[o]=app.userEvents[o].bind(a);c.session=localStorage._u?JSON.parse(localStorage._u):null,c.session?c.session.token&&window.refreshToken(g,b,function(){},c.logout):!a.ignoreAuth&&("undefined"!=typeof Storage&&sessionStorage.removeItem("_u"),d.go("login"));try{var p=m("AfterHomeController",{$scope:a});app.copyContext(p,this,"AfterHomeController")}catch(a){}e(function(){a.blockly&&a.blockly.events&&a.blockly.events.afterHomeRender&&a.blockly.events.afterHomeRender instanceof Function&&a.blockly.events.afterHomeRender()})}]),app.controller("PublicController",["$controller","$scope",function(a,b){b.ignoreAuth=!0,angular.extend(this,a("HomeController",{$scope:b}))}]),app.controller("MenuController",["$scope","$http","$rootScope","$state","$timeout","$translate","Notification","$ionicHistory","$ionicModal","$ionicLoading","$cookies",function(a,b,c,d,e,f,g,h,i,j,k){for(let l in app.registerEventsCronapi(a,f,i,j),c.http=b,a.Notification=g,a.folder="logged",app.userEvents)a[l]=app.userEvents[l].bind(a);a.ignoreAuth||(i.fromTemplateUrl("views/logged/_changepassword.view.html",{scope:a,animation:"slide-in-up"}).then(function(b){a.modal=b}),a.openChangePassword=function(){a.modal.modelEl?a.modal.show():b({url:"views/logged/_changepassword.view.html"}).then(function(b){a.modal=i.fromTemplate($(b.data).last().text(),{scope:a,animation:"slide-in-up"}),a.modal.show()})},a.closeChangePassword=function(){a.modal.hide()},a.logout=function(){c.session=null,localStorage.removeItem("_u"),k.remove("_u",{path:"/"}),d.go("login")}),a.http({method:"GET",url:"views/"+a.folder+"/menu.view.html"}).then(function(b){0<$(b.data).find("ion-nav-bar").length?(a.isOldMenu=!0,0<$(document).find("ion-header-bar").length&&$(document).find("ion-nav-bar").show()):a.isOldMenu=!1})}]),app.controller("PublicMenuController",["$controller","$scope",function(a,b){b.folder="public",angular.extend(this,a("MenuController",{$scope:b}))}]),app.controller("chatController",["$scope","$state","$ionicPopup","$ionicScrollDelegate","$timeout","$interval","$ionicModal","$translate","$rootScope","$http","Notification",function(a,b,c,d,f,g,h,i,j,k,l){for(let e in app.registerEventsCronapi(a,i,h,$ionicLoading),j.http=k,a.Notification=l,app.userEvents)a[e]=app.userEvents[e].bind(a);let m,n,o,p=JSON.parse(localStorage._u).user.username,q=d.$getByHandle("userMessageScroll");a.enter=function(){f(function(){m=document.body.querySelector(".homeView .bar-footer"),n=document.body.querySelector(".homeView .scroll-content"),o=angular.element(m.querySelector("textarea"))},0)},a.isEnter=function(a){13===a.keyCode?f(function(){a.stopPropagation(),$("#sendButton").trigger("click")},0):null},a.refreshScroll=function(b,c){f(function(){b=b||a.scrollDown,q.resize(),b&&q.scrollBottom(!0),a.checkScroll()},c||1e3)},a.scrollDown=!0,a.checkScroll=function(){return f(function(){let b=q.getScrollPosition().top,c=q.getScrollView().__maxScrollTop;a.scrollDown=b>=c,a.$apply()},0),!0}}]),app.controller("PageController",["$scope","$stateParams","Notification","$location","$http","$rootScope","$translate","$ionicModal","$ionicLoading","$timeout","UploadService",function(a,b,c,d,e,f,g,h,i,j,k){app.registerEventsCronapi(a,g,h,i),f.http=e,f.Notification=c,a.params=b,f.$http=e,f.UploadService=k,a.listCanSwipe=!0;let l=d.search();for(let m in l)l.hasOwnProperty(m)&&(a.params[m]=l[m]);if(f.session=void 0===localStorage.getItem("_u")?null:JSON.parse(localStorage.getItem("_u")),a.registerComponentScripts=function(){$(".carousel-indicators li").on("click",function(){let a="#"+$(this).parent().parent().parent().attr("id"),b=$(a+" .carousel-indicators li").index(this);$(a+" #carousel-example-generic").carousel(b)})},a.registerComponentScripts(),a.isOldMenu){let b=a.params.name||"home";a.http({method:"GET",url:"views/logged/"+b+".view.html"}).then(function(a){0<$(a.data).find("ion-header-bar").length?$(document).find("ion-nav-bar").hide():0<$(document).find("ion-header-bar").length&&$(document).find("ion-nav-bar").show()})}try{let b=$controller("AfterPageController",{$scope:a});app.copyContext(b,this,"AfterPageController")}catch(a){}j(function(){a.blockly&&a.blockly.events&&a.blockly.events.afterPageRender&&a.blockly.events.afterPageRender instanceof Function&&a.blockly.events.afterPageRender()})}]),app.controller("InitialController",["$scope","$stateParams","$http","Notification","$location","$rootScope","$translate","$ionicModal","$ionicLoading","$ionicPlatform","$controller","$timeout","UploadService","$ionicHistory",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){j.registerBackButtonAction(function(a){let b=n.viewHistory();b.histories&&b.histories&&Object.keys(b.histories).length&&("app.home"===b.currentView.stateName?(a.preventDefault(),a.stopPropagation(),navigator.app.exitApp()):window.history.back())},101),app.registerEventsCronapi(a,g,h,i),f.http=c,f.Notification=d,f.UploadService=m,a.params=b,a.$http=c;let o=e.search();for(let p in o)o.hasOwnProperty(p)&&(a.params[p]=o[p]);a.blockly.js.blockly.auth.Home.change();try{let b=k("AfterHomeController",{$scope:a});app.copyContext(b,this,"AfterHomeController")}catch(a){}l(function(){a.blockly&&a.blockly.events&&a.blockly.events.afterHomeRender&&a.blockly.events.afterHomeRender instanceof Function&&a.blockly.events.afterHomeRender()})}])})(app),window.safeApply=function(a){let b=this.$root.$$phase;"$apply"===b||"$digest"===b?a&&"function"==typeof a&&a():this.$apply(a)};