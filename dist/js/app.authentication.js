var cronappModules=["ionic","ui.router","ngResource","ngSanitize","custom.controllers","custom.services","datasourcejs","pascalprecht.translate","tmh.dynamicLocale","ui-notification","ngFileUpload","angularMoment"];window.customModules&&(cronappModules=cronappModules.concat(window.customModules));var app=function(){return angular.module("MyApp",cronappModules).constant("LOCALES",{locales:{pt_br:"Portugues (Brasil)",en_us:"English"},preferredLocale:"pt_br"}).run(["$ionicPlatform",function(e){e.ready(function(){setTimeout(function(){navigator.splashscreen&&navigator.splashscreen.hide()},100),window.cordova&&window.cordova.plugins&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}]).config(["$httpProvider",function(e){var n=["$q","$rootScope",function(e,n){return{request:function(e){var n=JSON.parse(localStorage.getItem("_u"));return n&&n.token&&(e.headers["X-AUTH-TOKEN"]=n.token,window.uToken=n.token),e}}}];e.interceptors.push(n)}]).config(["$stateProvider","$urlRouterProvider","$ionicConfigProvider",function(e,n,o){o.navBar.alignTitle("center")}]).config(["$stateProvider","$urlRouterProvider","NotificationProvider",function(e,n,o){o.setOptions({delay:5e3,startTop:20,startRight:10,verticalSpacing:20,horizontalSpacing:20,positionX:"right",positionY:"top"}),window.customStateProvider?window.customStateProvider(e):e.state("main",{url:"",cache:!1,controller:"InitialController",templateUrl:function(e){return navigator.app&&navigator.app.exitApp(),""}}).state("login",{url:"/app/login",cache:!1,controller:"LoginController",templateUrl:"views/login.view.html"}).state("publicRoot",{url:"/public/{name:.*}",cache:!1,controller:"PageController",templateUrl:function(e){return"views/public/"+e.name+".view.html"}}).state("public",{url:"/app/public",cache:!1,controller:"PublicMenuController",templateUrl:"plugins/cronapp-framework-mobile-js/components/templates/publicMenu.template.html"}).state("public.pages",{url:"/{name:.*}",cache:!1,views:{menuContent:{controller:"PageController",templateUrl:function(e){return"views/public/"+e.name+".view.html"}}}}).state("app",{url:"/app/logged",cache:!1,controller:"MenuController",templateUrl:"plugins/cronapp-framework-mobile-js/components/templates/menu.template.html"}).state("app.home",{url:"/home",cache:!1,views:{menuContent:{controller:"PageController",templateUrl:"views/logged/home.view.html"}}}).state("app.pages",{url:"/{name:.*}",cache:!1,views:{menuContent:{controller:"PageController",templateUrl:function(e){return"views/logged/"+e.name+".view.html"}}}}).state("404",{url:"/error/404",cache:!1,controller:"PageController",templateUrl:function(e){return"views/error/404.view.html"}}).state("403",{url:"/error/403",cache:!1,controller:"PageController",templateUrl:function(e){return"views/error/403.view.html"}}),n.otherwise("/error/404")}]).config(["$translateProvider","tmhDynamicLocaleProvider",function(e,n){e.useMissingTranslationHandlerLog(),e.useLoader("customTranslateLoader",{files:[{prefix:"i18n/locale_",suffix:".json"},{prefix:"plugins/cronapp-framework-mobile-js/i18n/locale_",suffix:".json"}]});var o=(window.navigator.userLanguage||window.navigator.language||"pt_br").replace("-","_");e.use(o.toLowerCase()),e.useSanitizeValueStrategy("escaped"),n.localeLocationPattern("plugins/angular-i18n/angular-locale_{{locale}}.js")}]).directive("crnValue",["$parse",function(e){return{restrict:"A",require:"^ngModel",link:function(n,o,r,t){var i;i=r.value?r.value:e(r.crnValue)(n),o.attr("data-evaluated",JSON.stringify(i)),o.bind("click",function(e){n.$apply(function(){t.$setViewValue(i),$(o).data("changed",!0)}.bind(o))}),n.$watch(function(){return t.$modelValue},function(e,n){if(e!==n){var r=o.attr("data-evaluated"),t=$(o).data("changed");$(o).data("changed",!1),t||(e&&JSON.stringify(""+e)==r?$(o)[0].children[0].checked=!0:$(o)[0].children[0].checked=!1)}})}}}]).decorator("$xhrFactory",["$delegate","$injector",function(e,n){return function(o,r){var t=e(o,r),i=n.get("$http"),a=i.pendingRequests[i.pendingRequests.length-1];return angular.isFunction(a.onProgress)&&t.upload.addEventListener("progress",a.onProgress),t}}]).run(["$rootScope","$state",function(e,n){e.$on("$stateChangeError",function(){if(arguments.length>=6){var e=arguments[5];404!==e.status&&403!==e.status||(localStorage.removeItem("_u"),n.go("login"))}else n.go("404")}),e.$on("$stateChangeSuccess",function(){setTimeout(function(){$($(".icon.ion-plus-round").parent()).off("click"),$($(".icon.ion-plus-round").parent()).on("click",function(){$("[required]").removeClass("input-validation-error"),$("input:invalid").removeClass("input-validation-error")}),$($(".icon.ion-checkmark").parent()).off("click"),$($(".icon.ion-checkmark").parent()).on("click",function(){$("[required].ng-invalid-required, [required].ng-invalid, [required].ng-empty").addClass("input-validation-error"),$("input:invalid").addClass("input-validation-error")}),$("input").off("keydown"),$("input").on("keydown",function(){$(this).removeClass("input-validation-error")})},300)})}])}(window);app.userEvents={},app.config={},app.config.datasourceApiVersion=2,app.config.defaultRoute="/app",app.bindScope=function(e,n){var o={};for(var r in n)"string"==typeof n[r]?o[r]=n[r]:"function"==typeof n[r]?o[r]=n[r].bind(e):o[r]=app.bindScope(e,n[r]);return o},app.registerEventsCronapi=function(e,n,o,r){for(var t in app.userEvents)e[t]=app.userEvents[t].bind(e);e.vars={};try{cronapi&&(e.cronapi=app.bindScope(e,cronapi),e.cronapi.$scope=e,e.cronapi.$scope.$ionicModal=o,e.cronapi.$scope.$ionicLoading=r,e.safeApply=safeApply,n&&(e.cronapi.$translate=n))}catch(e){console.info("Not loaded cronapi functions"),console.info(e)}try{blockly&&(e.blockly=app.bindScope(e,blockly))}catch(e){console.info("Not loaded blockly functions"),console.info(e)}},app.factory("customTranslateLoader",["$http","$q",function(e,n){return function(o){if(!(o&&(angular.isArray(o.files)||angular.isString(o.prefix)&&angular.isString(o.suffix))))throw new Error("Couldn't load static files, no files and prefix or suffix specified!");o.files||(o.files=[{prefix:o.prefix,suffix:o.suffix}]);for(var r=n.defer(),t=[],i=o.files.length,a=0;a<i;a++)t.push(function(r){if(!r||!angular.isString(r.prefix)||!angular.isString(r.suffix))throw new Error("Couldn't load static file, no prefix or suffix specified!");var t=n.defer();return e(angular.extend({url:[r.prefix,o.key,r.suffix].join(""),method:"GET",params:""},o.$http)).success(function(e){t.resolve(e)}).error(function(){t.resolve({})}),t.promise}({prefix:o.files[a].prefix,key:o.key,suffix:o.files[a].suffix}));return n.all(t).then(function(e){for(var n=e.length,o={},t=0;t<n;t++)for(var i in e[t])o[i]=e[t][i];r.resolve(o)},function(e){r.reject(e)}),r.promise}}]),window.safeApply=function(e){var n=this.$root.$$phase;"$apply"==n||"$digest"==n?e&&"function"==typeof e&&e():this.$apply(e)};