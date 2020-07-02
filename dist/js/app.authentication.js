var cronappModules=["ionic","ui.router","ngResource","ngSanitize","custom.controllers","custom.services","report.services","datasourcejs","pascalprecht.translate","tmh.dynamicLocale","ui-notification","ngFileUpload","angularMoment","upload.services","ngAria","ngCookies"];window.customModules&&(cronappModules=cronappModules.concat(window.customModules)),window.paceOptions={document:!0,eventLag:!0,restartOnPushState:!0,restartOnRequestAfter:!0,ajax:{trackMethods:["PUT","POST","GET"]}};var app=function(){return angular.module("MyApp",cronappModules).constant("LOCALES",{locales:{pt_br:"Portugues (Brasil)",en_us:"English"},preferredLocale:"pt_br"}).run(["$ionicPlatform",function(a){a.ready(function(){setTimeout(function(){navigator.splashscreen&&navigator.splashscreen.hide()},100),window.cordova&&window.cordova.plugins&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault(),ionic.Platform.is("ios")&&window.addEventListener("orientationchange",function(){var a=document.body.style.marginTop;document.body.style.marginTop="1px",setTimeout(function(){document.body.style.marginTop=a},100)},!1)})}]).config(["$httpProvider",function(a){a.interceptors.push(["$q","$rootScope","$injector",function(a,b,c){return{request:function(a){var b=JSON.parse(localStorage.getItem("_u"));return b&&b.token&&(a.headers["X-AUTH-TOKEN"]=b.token,window.uToken=b.token),a},responseError:function(b){if(500===b.status){let a=c.get("$state"),b=c.get("$http"),d=c.get("Notification");window.refreshToken(d,b,()=>{},()=>{localStorage.removeItem("_u"),a.go("login")})}return a.reject(b)}}}])}]).config(["$stateProvider","$urlRouterProvider","$ionicConfigProvider",function(a,b,c){c.navBar.alignTitle("center"),c.tabs.position("bottom"),ionic.Platform.isIOS()&&c.scrolling.jsScrolling(!1)}]).config(["$stateProvider","$urlRouterProvider","NotificationProvider",function(a,b,c){c.setOptions({delay:5e3,startTop:20,startRight:10,verticalSpacing:20,horizontalSpacing:20,positionX:"right",positionY:"top"}),window.customStateProvider?window.customStateProvider(a):a.state("main",{url:"",cache:!1,controller:"InitialController",templateUrl:function(){return navigator.app,""}}).state("login",{url:"/app/login",cache:!1,controller:"LoginController",templateUrl:"views/login.view.html"}).state("publicRoot",{url:"/public/{name:.*}",cache:!1,controller:"PageController",templateUrl:function(a){return"views/public/"+a.name+".view.html"}}).state("public",{url:"/app/public",cache:!1,controller:"PublicMenuController",templateUrl:"node_modules/cronapp-framework-mobile-js/components/templates/publicMenu.template.html"}).state("public.pages",{url:"/{name:.*}",cache:!1,views:{menuContent:{controller:"PageController",templateUrl:function(a){return"views/public/"+a.name+".view.html"}}}}).state("app",{url:"/app/logged",cache:!1,controller:"MenuController",templateUrl:"node_modules/cronapp-framework-mobile-js/components/templates/menu.template.html"}).state("app.home",{url:"/home",cache:!1,views:{menuContent:{controller:"PageController",templateUrl:"views/logged/home.view.html"}},resolve:{data:["$translate",function(a){a.refresh()}]}}).state("app.pages",{url:"/{name:.*}",cache:!1,views:{menuContent:{controller:"PageController",templateUrl:function(a){return"views/logged/"+a.name+".view.html"}}}}).state("404",{url:"/error/404",cache:!1,controller:"PageController",templateUrl:function(){return"views/error/404.view.html"}}).state("403",{url:"/error/403",cache:!1,controller:"PageController",templateUrl:function(){return"views/error/403.view.html"}}),b.otherwise("/error/404")}]).config(["$translateProvider","tmhDynamicLocaleProvider",function(a,b){a.useMissingTranslationHandlerLog(),a.useLoader("customTranslateLoader",{files:[{prefix:"i18n/locale_",suffix:".json"},{prefix:"node_modules/cronapp-framework-mobile-js/i18n/locale_",suffix:".json"}]});var c=(window.navigator.userLanguage||window.navigator.language||"pt_br").replace("-","_");a.use(c.toLowerCase()),a.useSanitizeValueStrategy("escaped"),b.localeLocationPattern("node_modules/angular-i18n/angular-locale_{{locale}}.js")}]).config(["$sceProvider",function(a){a.enabled(!1)}]).directive("crnValue",["$parse",function(a){return{restrict:"A",require:"^ngModel",link:function(b,c,d,e){var f;f=d.value?d.value:a(d.crnValue)(b),c.attr("data-evaluated",JSON.stringify(f)),c.bind("click",function(){b.$apply(function(){e.$setViewValue(f),$(c).data("changed",!0)}.bind(c))}),b.$watch(function(){return e.$modelValue},function(a,b){if(a!==b){var d=c.attr("data-evaluated"),e=$(c).data("changed");$(c).data("changed",!1),e||(a&&JSON.stringify(""+a)==d?$(c)[0].children[0].checked=!0:$(c)[0].children[0].checked=!1)}})}}}]).decorator("$xhrFactory",["$delegate","$injector",function(a,b){return function(c,d){var e=a(c,d),f=b.get("$http"),g=f.pendingRequests[f.pendingRequests.length-1];return angular.isFunction(g.onProgress)&&e.upload.addEventListener("progress",g.onProgress),e}}]).run(["$rootScope","$state","$stateParams","$timeout","$injector",function(a,b,c,d,e){a.$state=b,a.$stateParams=c,a.$on("$stateChangeError",function(){if(6<=arguments.length){var a=arguments[5];(404===a.status||403===a.status||401===a.status)&&(localStorage.removeItem("_u"),b.go("login").catch(function(){b.go("404")}))}else b.go("404")}),a.$on("$stateChangeSuccess",function(b,c){d(()=>{let b=$("ion-view ion-header-bar .title").last().text(),d=window.location.hash?window.location.hash.split("/"):null,f=d?d[d.length-1]:null,g=window.camelCaseToSentenceCase(window.toCamelCase(f));a.ionViewTitle=b||g||c.name;let h=e.get("$state"),i=e.get("$http"),j=e.get("Notification");window.refreshToken(j,i,()=>{},()=>{localStorage.removeItem("_u"),h.go("login")})}),setTimeout(function(){$($(".icon.ion-plus-round").parent()).off("click"),$($(".icon.ion-plus-round").parent()).on("click",function(){$("[required]").removeClass("input-validation-error"),$("input:invalid").removeClass("input-validation-error")}),$($(".icon.ion-checkmark").parent()).off("click"),$($(".icon.ion-checkmark").parent()).on("click",function(){$("[required].ng-invalid-required, [required].ng-invalid, [required].ng-empty").addClass("input-validation-error"),$("input:invalid").addClass("input-validation-error")}),$("input").off("keydown"),$("input").on("keydown",function(){$(this).removeClass("input-validation-error")})},300)}),setInterval(()=>$("ion-nav-view[name=\"menuContent\"] .button.button-clear.hide").removeClass("hide"),300)}])}(window);app.userEvents={},app.config={},app.config.datasourceApiVersion=2,app.config.defaultRoute="/app",app.bindScope=function(a,b){var c={};for(var d in b)c[d]="string"==typeof b[d]||"boolean"==typeof b[d]?b[d]:"function"==typeof b[d]?b[d].bind(a):app.bindScope(a,b[d]);return c},app.registerEventsCronapi=function(a,b,c,d){for(var e in app.userEvents)a[e]=app.userEvents[e].bind(a);a.vars={},a.$evt=$evt;try{cronapi&&(a.cronapi=app.bindScope(a,cronapi),a.cronapi.$scope=a,a.cronapi.$scope.$ionicModal=c,a.cronapi.$scope.$ionicLoading=d,a.safeApply=safeApply,b&&(a.cronapi.$translate=b))}catch(a){console.info("Not loaded cronapi functions"),console.info(a)}try{blockly&&(blockly.cronapi=cronapi,a.blockly=app.bindScope(a,blockly))}catch(a){console.info("Not loaded blockly functions"),console.info(a)}},app.copyContext=function(a,b,c){if(a)for(var d in a)b[d]?b[d+c]=a[d]:b[d]=a[d]},app.factory("customTranslateLoader",["$http","$q",function(a,b){return function(c){if(!c||!angular.isArray(c.files)&&(!angular.isString(c.prefix)||!angular.isString(c.suffix)))throw new Error("Couldn't load static files, no files and prefix or suffix specified!");c.files||(c.files=[{prefix:c.prefix,suffix:c.suffix}]);for(var d=function(d){if(!d||!angular.isString(d.prefix)||!angular.isString(d.suffix))throw new Error("Couldn't load static file, no prefix or suffix specified!");var e=b.defer();return a(angular.extend({url:[d.prefix,c.key,d.suffix].join(""),method:"GET",params:""},c.$http)).success(function(a){e.resolve(a)}).error(function(){e.resolve({})}),e.promise},e=b.defer(),f=[],g=c.files.length,h=0;h<g;h++)f.push(d({prefix:c.files[h].prefix,key:c.key,suffix:c.files[h].suffix}));return b.all(f).then(function(a){for(var b=a.length,c={},d=0;d<b;d++)for(var f in a[d])c[f]=a[d][f];e.resolve(c)},function(a){e.reject(a)}),e.promise}}]),window.safeApply=function(a){var b=this.$root.$$phase;"$apply"==b||"$digest"==b?a&&"function"==typeof a&&a():this.$apply(a)},window.toCamelCase=function(a){return a.toLowerCase().replace(/[-_\.]+/g," ").replace(/[^\w\s]/g,"").replace(/ (.)/g,function(a){return a.toUpperCase()}).replace(/ /g,"")},window.camelCaseToSentenceCase=function(a){let b=a.replace(/([A-Z])/g," $1");return b.charAt(0).toUpperCase()+b.slice(1)},window.refreshToken=function(a,b,c,d){window.hostApp?b({method:"GET",url:window.hostApp+"auth/refresh"}).success(function(e){console.log("revive :",new Date(e.expires)),localStorage.setItem("_u",JSON.stringify(e)),setTimeout(function(){window.refreshToken(a,b,c,d)},1800000),c()}).error(function(){d()}):a.error("HostApp is required to refresh token!")};