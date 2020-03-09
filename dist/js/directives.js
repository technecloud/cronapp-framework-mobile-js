maskDirectiveAsDate.$inject=["$compile","$translate","$parse"],maskDirectiveMask.$inject=["$compile","$translate","$parse"],window.addEventListener("message",function(e){"reload"==e.data?window.location.reload():"reload(true)"==e.data&&window.location.reload(!0)}),function($app){var _Mathfloor=Math.floor,isoDate=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,patternFormat=function(e){return e?$(e).attr("format")||"DD/MM/YYYY":"DD/MM/YYYY"},parsePermission=function(e){var t={visible:{public:!0},enabled:{public:!0}};if(e)for(var a,n=e.toLowerCase().trim().split(","),o=0;o<n.length;o++)if(a=n[o].trim(),a){var l=a.split(":");if(2==l.length){var s=l[0].trim(),r=l[1].trim();if(r){for(var d,c=r.split(";"),m={},u=0;u<c.length;u++)d=c[u].trim(),d&&(m[d]=!0);t[s]=m}}}return t};app.directive("updateLanguage",["$rootScope",function(e){return{link:function(t,i){e.$on("$translateChangeSuccess",function(e,t){let a=t.language?t.language.split("_")[0]:null;i.attr("lang",a||"en")})}}}]),app.directive("asDate",maskDirectiveAsDate),app.directive("input",transformText),app.directive("textarea",transformText).directive("ngDestroy",function(){return{restrict:"A",link:function(scope,element,attrs,ctrl){element.on("$destroy",function(){attrs.ngDestroy&&0<attrs.ngDestroy.length&&(-1<attrs.ngDestroy.indexOf("app.")||-1<attrs.ngDestroy.indexOf("blockly.")?scope.$eval(attrs.ngDestroy):eval(attrs.ngDestroy))})}}}).filter("mask",["$translate",function(e){return function(t,i,a){if(i=parseMaskType(i,e),!i)return t;var n;if(void 0===a?n=window.fixedTimeZone:(n="date"==a||"datetime"==a||"time"==a,!window.fixedTimeZone&&(n=!1)),0<i.indexOf(";local")&&(n=!1),i=i.replace(";1","").replace(";0","").replace(";local","").trim(),"string"==typeof t&&t.match(isoDate)||t instanceof Date)return n?moment(t).utcOffset(window.timeZoneOffset).format(i):moment(t).format(i);if("number"==typeof t)return format(i,t);if(null!=t&&null!=t&&""!=t&&""!=i){var o=$("<input type=\"text\">");return o.mask(i),o.masked(t)}return t}}]).directive("screenParams",[function(){'use strict';return{link:function(scope,elem,attrs,ctrl){var screenParams=eval(attrs.screenParams);screenParams&&screenParams.length&&screenParams.forEach(function(e){scope.params&&!scope.params[e.key]&&(scope.params[e.key]=e.value||"")})}}}]).directive("mask",maskDirectiveMask).directive("dynamicImage",["$compile","$translate",function(e,t){return{restrict:"A",scope:!0,require:"ngModel",link:function(i,a,n){var o=n.ngRequired&&"true"==n.ngRequired?"required":"",l=a.html(),s=n.alt?n.alt:t.instant("Users.view.Picture"),r=t.instant("Home.view.Close"),d=t.instant("OpenCamera"),c="<div ngf-drop=\"\" ngf-drag-over-class=\"dragover\">               <img role=\"img\" alt=\"$altText$\" style=\"width: 100%;\" ng-if=\"$ngModel$\" data-ng-src=\"{{$ngModel$.startsWith('http') || ($ngModel$.startsWith('/') && $ngModel$.length < 1000)? $ngModel$ : 'data:image/png;base64,' + $ngModel$}}\">               <div class=\"btn\" ng-if=\"!$ngModel$\" ngf-drop=\"\" ngf-select=\"\" ngf-change=\"cronapi.internal.setFile('$ngModel$', $file)\" ngf-pattern=\"'image/*'\" ngf-max-size=\"$maxFileSize$\">                 $userHtml$               </div>               <div aria-label=\"$closeAriaText$\" class=\"remove-image-button button button-assertive\" ng-if=\"$ngModel$\" ng-click=\"$ngModel$=null\">                 <span class=\"icon ion-android-close\"></span>               </div>               <div aria-label=\"$videocamAriaText$\" class=\"button button-positive\" ng-if=\"!$ngModel$\" ng-click=\"cronapi.internal.startCamera('$ngModel$')\">                 <span class=\"icon ion-ios-videocam\"></span>               </div>             </div>",p="";n.maxFileSize&&(p=n.maxFileSize),c=$(c.split("$ngModel$").join(n.ngModel).split("$required$").join(o).split("$userHtml$").join(l).split("$maxFileSize$").join(p).split("$altText$").join(s).split("$closeAriaText$").join(r).split("$videocamAriaText$").join(d)),$(a).html(c),e(c)(a.scope())}}}]).directive("dynamicFile",["$compile","$translate",function(e,t){return{restrict:"A",scope:!0,require:"ngModel",link:function(i,a,n){var o=n.ngRequired&&"true"==n.ngRequired?"required":"",l=t.instant("Home.view.Close"),s=n.ngModel.split("."),r=s[0],d=s[s.length-1],c=_Mathfloor(1e3*Math.random()+20),p=a.html(),m="";n.maxFileSize&&(m=n.maxFileSize);var u="                                <div ng-show=\"!$ngModel$\" ngf-drop=\"\" ngf-drag-over-class=\"dragover\">                                  <div class=\"btn\" ngf-drop=\"\" ngf-select=\"\" ngf-change=\"cronapi.internal.uploadFile('$ngModel$', $file, 'uploadprogress$number$')\" ngf-max-size=\"$maxFileSize$\">                                    $userHtml$                                  </div>                                  <div class=\"progress\" data-type=\"bootstrapProgress\" id=\"uploadprogress$number$\" style=\"display:none\">                                    <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"70\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:0%\">                                      <span class=\"sr-only\"></span>                                    </div>                                  </div>                                </div>                                 <div ng-show=\"$ngModel$\" class=\"upload-image-component-attribute\">                                   <div aria-label=\"$closeAriaText$\" class=\"button button-assertive\" style=\"float:right;\" ng-if=\"$ngModel$\" ng-click=\"$ngModel$=null\">                                     <span role=\"img\" alt=\"$closeAriaText$\" class=\"icon ion-android-close\"></span>                                   </div>                                   <div>                                     <div ng-bind-html=\"cronapi.internal.generatePreviewDescriptionByte($ngModel$)\"></div>                                     <div aria-label=\"Download\" class=\"button button-positive\" ng-click=\"cronapi.internal.downloadFileEntityMobile($datasource$,'$field$')\">$lblDownload$</div>                                   </div>                                 </div>                                 ";u=$(u.split("$ngModel$").join(n.ngModel).split("$datasource$").join(r).split("$field$").join(d).split("$number$").join(c).split("$required$").join(o).split("$userHtml$").join(p).split("$maxFileSize$").join(m).split("$closeAriaText$").join(l).split("$lblDownload$").join(t.instant("download"))),$(a).html(u),e(u)(a.scope())}}}]).directive("pwCheck",[function(){'use strict';return{require:"ngModel",link:function(e,t,i,a){var n="#"+i.pwCheck;t.add(n).on("keyup",function(){e.$apply(function(){var e=t.val()===$(n).val();a.$setValidity("pwmatch",e)})})}}}]).directive("qr",["$window",function(e){return{restrict:"EA",require:"^ngModel",template:"<canvas ng-hide=\"image\"></canvas><img alt=\"qr-code\" ng-if=\"image\" ng-src=\"{{canvasImage}}\"/>",link:function(t,i,a,n){t.size===void 0&&a.size&&(t.text=a.size);var o=function(){return n.$modelValue||""},l=function(e){var t=/^[0-9]*$/;return t.test(e)},s=function(e){var t=/^[0-9A-Z $%*+\-./:]*$/;return t.test(e)},r=function(e){for(var t,a=0;a<e.length;a++)if(t=e.charCodeAt(a),255<t)return!1;return!0},d=function(e,t){if("NUMBER"===e&&!l(t))throw new Error("The `NUMBER` input mode is invalid for text.");else if("ALPHA_NUM"===e&&!s(t))throw new Error("The `ALPHA_NUM` input mode is invalid for text.");else if("8bit"===e&&!r(t))throw new Error("The `8bit` input mode is invalid for text.");else if(!r(t))throw new Error("Input mode is invalid for text.");return!0},c=function(e){var i=t.inputMode;return i=i||(l(e)?"NUMBER":void 0),i=i||(s(e)?"ALPHA_NUM":void 0),i=i||(r(e)?"8bit":""),d(i,e)?i:""},p=i.find("canvas")[0],m=!!e.CanvasRenderingContext2D;t.TYPE_NUMBER=function(){return t.typeNumber||0}(),t.TEXT=o(),t.CORRECTION=function(){var e=t.correctionLevel||0;return{L:1,M:0,Q:3,H:2}[e]||0}(),t.SIZE=function(){return t.size||$(i).outerWidth()}(),t.INPUT_MODE=c(t.TEXT),t.canvasImage="";var u=function(e,t,i,a){for(var n=Math.round,o=Math.ceil,l=0;l<i;l++)for(var s=0;s<i;s++){var r=o((s+1)*a)-_Mathfloor(s*a),d=o((l+1)*a)-_Mathfloor(l*a);e.fillStyle=t.isDark(l,s)?"#000":"#fff",e.fillRect(n(s*a),n(l*a),r,d)}},g=function(e,i,a,n,o,l){var s=/^\s+|\s+$/g,r=i.replace(s,""),d=new QRCode(a,n,l);d.addData(r),d.make();var c=e.getContext("2d"),p=d.getModuleCount();e.width=e.height=o,m&&(u(c,d,p,o/p),t.canvasImage=e.toDataURL()||"")};t.$watch(function(){return n.$modelValue},function(e,i){(e!==i||e!==t.TEXT)&&(t.text=n.$modelValue,t.TEXT=o(),t.INPUT_MODE=c(t.TEXT),g(p,t.TEXT,t.TYPE_NUMBER,t.CORRECTION,t.SIZE,t.INPUT_MODE))}),g(p,t.TEXT,t.TYPE_NUMBER,t.CORRECTION,t.SIZE,t.INPUT_MODE)}}}]).directive("valid",function(){return{require:"^ngModel",restrict:"A",link:function(e,t,i,a){var n={cpf:CPF,cnpj:CNPJ};a.$validators[i.valid]=function(e,a){var o=e||a,l=n[i.valid].isValid(o);return l?t[0].setCustomValidity(""):t.scope().$applyAsync(function(){t[0].setCustomValidity(t[0].dataset.errorMessage)}),l||!o}}}}).directive("cronappSecurity",function(){return{restrict:"A",link:function(e,t,a){var n=[],o=JSON.parse(localStorage.getItem("_u"));o&&o.roles&&(n=o.roles.toLowerCase().split(","));for(var l,s=parsePermission(a.cronappSecurity),r=!1,d=!1,c=0;c<n.length;c++)l=n[c].trim(),l&&(s.visible[l]&&(r=!0),s.enabled[l]&&(d=!0));r||$(t).hide(),d||$(t).find("*").addBack().attr("disabled",!0)}}}).directive("cronappStars",[function(){'use strict';return{restrict:"A",require:"ngModel",link:function(e,t,a,n){function o(e){for(var t=1;5>=t;t++)d[t-1].removeClass("ion-android-star-outline"),d[t-1].removeClass("ion-android-star"),t<=e?d[t-1].addClass("ion-android-star"):d[t-1].addClass("ion-android-star-outline");return e}var l=$(t),s=$("<i style=\"font-size: 200%\" class=\"component-holder ion ion-android-star-outline\" style=\"\" xattr-size=\"\" data-component=\"crn-icon\"></i>");l.html("");for(var r,d=[],c=1;5>=c;c++)r=s.clone(),l.append(r),r.attr("idx",c),r.click(function(){e.$apply(function(){n.$viewValue=parseInt($(this).attr("idx")),n.$commitViewValue()}.bind(this))}),d.push(r);n.$parsers.push(o),n.$formatters.push(o)}}}]).directive("cronappRating",[function(){'use strict';return{restrict:"E",require:"ngModel",link:function(e,t,a,n){function o(e){for(var t=1;5>=t;t++)c[t-1].removeClass(a.iconOff||"ion ion-android-star-outline"),c[t-1].removeClass(a.iconOn),c[t-1].removeClass(a.theme),t<=e?(c[t-1].addClass(a.iconOn),c[t-1].addClass(a.theme)):(c[t-1].addClass(a.iconOff||"ion ion-android-star-outline"),c[t-1].addClass(a.theme));return e}a.theme=$(t).find("i").attr("xattr-theme"),a.iconOn=$(t).find("i").attr("class");var l=$(t),s=[];a.xattrDefaultValue&&(n.$viewValue=0,n.$commitViewValue());for(var r=1;5>=r;r++)s.push($(t).find("i").get(r-1)),$(s[r-1]).addClass(a.iconOff||"fa fa-star-o");l.html("");for(var d,c=[],r=1;5>=r;r++)d=$(s[r-1]).clone(),l.append(d),d.attr("idx",r),d.click(function(){e.$apply(function(){n.$viewValue=parseInt($(this).attr("idx")),n.$commitViewValue()}.bind(this))}),c.push(d);n.$parsers.push(o),n.$formatters.push(o)}}}]).directive("ngInitialValue",["$parse",function(e){return{restrict:"A",require:"ngModel",link:function(t,i,a){if(a.ngInitialValue){var n,o=e(a.ngModel),l=o.assign;try{n=t.$eval(a.ngInitialValue)}catch(t){n=a.ngInitialValue}"checkbox"==i[0].type&&n&&(n="true"==(""+n).toLowerCase()),l(t,n)}}}}]).directive("crnAllowNullValues",[function(){return{restrict:"A",require:"?ngModel",link:function(e,t,i,a){a.$formatters=[],a.$parsers=[];let n=i.ngFalseValue?i.ngFalseValue.split("'").join(""):null,o=i.ngTrueValue?i.ngTrueValue.split("'").join(""):null;"true"==i.crnAllowNullValues?(a.$render=function(){let e=a.$viewValue;t.data("checked",e);!0===e||e===o?(t.prop("indeterminate",!1),t.prop("checked",!0)):!1===e||e===n?(t.prop("indeterminate",!1),t.prop("checked",!1)):t.prop("indeterminate",!0)},t.bind("click",function(){let l;switch(t.data("checked")){case!1:case n:l=!i.ngTrueValue||o;break;default:l=!!i.ngFalseValue&&n;}a.$setViewValue(l),e.$apply(a.$render)})):"false"==i.crnAllowNullValues&&(a.$render=function(){let e=a.$viewValue;switch((void 0===e||null===e)&&(a.$setViewValue(!1),e=!1),t.data("checked",e),e){case!0:case o:t.prop("indeterminate",!1),t.prop("checked",!0);break;default:t.prop("indeterminate",!1),t.prop("checked",!1);}},t.bind("click",function(){let l;switch(t.data("checked")){case!1:case n:l=!i.ngTrueValue||o;break;default:l=!!i.ngFalseValue&&n;}a.$setViewValue(l),e.$apply(a.$render)}))}}}]).directive("cronappFilter",["$compile",function($compile){var setFilterInButton=function(e,t){var i=e.closest("div");if(i){var a=i.find("button[cronapp-filter]");if(a){var n=a.data("filters");n||(n=[]);var o=-1,l=e.attr("ng-model");if($(n).each(function(e){this.ngModel==l&&(o=e)}),-1<o&&n.splice(o,1),0<t.length){n.push({ngModel:l,bindedFilter:t})}a.data("filters",n)}}},makeAutoPostSearch=function(e,t,i,a){var n=e.closest("div");if(n&&0<n.length){var o=n.find("button[cronapp-filter]");if(o&&0<o.length){var l=o.data("filters");l&&0<l.length&&(t="",$(l).each(function(){t+=this.bindedFilter+";"}))}}i.search(t,"true"==a.cronappFilterCaseinsensitive)},inputBehavior=function(scope,element,attrs,ngModelCtrl,$element,typeElement,operator,autopost){var datasource,filterTemplate="",filtersSplited=attrs.cronappFilter.split(";");if(attrs.crnDatasource)datasource=eval(attrs.crnDatasource);else{var fieldset=$element.closest("div");if(!fieldset)return;var button=fieldset.find("button[cronapp-filter]");if(!button)return;if(!button.attr("crn-datasource"))return;datasource=eval(button.attr("crn-datasource"))}var isOData=datasource.isOData();$(filtersSplited).each(function(){0<this.length&&(""!=filterTemplate&&(isOData?filterTemplate+=" or ":filterTemplate+=";"),isOData?"="==operator&&"text"==typeElement&&""==filterTemplate?filterTemplate="substringof({value.lower}, tolower("+this+"))":"="==operator?filterTemplate+=" substringof({value.lower},tolower("+this+"))":"!="==operator?filterTemplate+=this+" ne {value}":">"==operator?filterTemplate+=this+" gt {value}":">="==operator?filterTemplate+=this+" ge {value}":"<"==operator?filterTemplate+=this+" lt {value}":"<="==operator&&(filterTemplate+=this+" le {value}"):"text"==typeElement?filterTemplate+=this+"@"+operator+"%{value}%":filterTemplate+=this+operator+"{value}")}),0==filterTemplate.length&&(isOData?filterTemplate="{value}":filterTemplate="%{value}%"),ngModelCtrl?scope.$watch(attrs.ngModel,function(e,t){if(!angular.equals(e,t)){var i=$element.data("type")||$element.attr("type"),a=ngModelCtrl.$modelValue;isOData?a instanceof Date?"datetime-local"==i?a="datetimeoffset'"+a.toISOString()+"'":a="datetime'"+a.toISOString().substring(0,23)+"'":"number"==typeof a?a=a:"boolean"==typeof a?a=a:a="'"+a+"'":a instanceof Date?(a=a.toISOString(),a+="date"==i?"@@date":"time"==i||"time-local"==i?"@@time":"@@datetime"):"number"==typeof a?a+="@@number":"boolean"==typeof a&&(a+="@@boolean");var n=filterTemplate.split("{value}").join(a);n="string"==typeof a?n.split("{value.lower}").join(a.toLowerCase()):n.split("{value.lower}").join(a),0==ngModelCtrl.$viewValue.length&&(n=""),setFilterInButton($element,n,operator),autopost&&makeAutoPostSearch($element,n,datasource,attrs)}}):"text"==typeElement?$element.on("keyup",function(){var datasource=eval(attrs.crnDatasource),value=void 0;value=ngModelCtrl&&null!=ngModelCtrl?ngModelCtrl.$viewValue:this.value;var bindedFilter=filterTemplate.split("{value}").join(value);0==this.value.length&&(bindedFilter=""),setFilterInButton($element,bindedFilter,operator),autopost&&makeAutoPostSearch($element,bindedFilter,datasource,attrs)}):$element.on("change",function(){var datasource=eval(attrs.crnDatasource),value=void 0,typeElement=$(this).attr("type");if(null!=attrs.asDate&&(typeElement="date"),ngModelCtrl&&null!=ngModelCtrl)value=ngModelCtrl.$viewValue;else if("checkbox"==typeElement)value=$(this).is(":checked");else if("date"!=typeElement)value=this.value;else if(value=this.value,0<this.value.length){var momentDate=moment(this.value,patternFormat(this));value=momentDate.toDate().toISOString()}var bindedFilter=filterTemplate.split("{value}").join(value);0==value.toString().length&&(bindedFilter=""),setFilterInButton($element,bindedFilter,operator),autopost&&makeAutoPostSearch($element,bindedFilter,datasource,attrs)})},forceDisableDatasource=function(datasourceName,scope){var disableDatasource=setInterval(function(){try{var datasourceInstance=eval(datasourceName);datasourceInstance&&($(document).ready(function(){var e=0,t=setInterval(function(){10>e?(scope.$apply(function(){datasourceInstance.enabled=!1,datasourceInstance.data=[]}),e++):clearInterval(t)},20)}),clearInterval(disableDatasource))}catch(t){}},10)},buttonBehavior=function(scope,element,attrs,ngModelCtrl,$element,typeElement,operator,autopost){var datasourceName="";datasourceName=attrs.crnDatasource?attrs.crnDatasource:$element.parent().attr("crn-datasource");var datasource=eval(datasourceName),isOData=datasource.isOData(),requiredFilter=attrs.requiredFilter&&"true"==attrs.requiredFilter.toString();requiredFilter&&this.forceDisableDatasource(datasourceName,scope),$element.on("click",function(){var $this=$(this),filters=$this.data("filters");if(datasourceName&&0<datasourceName.length&&filters){var bindedFilter="";$(filters).each(function(){""!=bindedFilter&&(bindedFilter+=isOData?" and ":";"),bindedFilter+=this.bindedFilter});var datasourceToFilter=eval(datasourceName);requiredFilter?(datasourceToFilter.enabled=0<bindedFilter.length,datasourceToFilter.enabled?datasourceToFilter.search(bindedFilter,"true"==attrs.cronappFilterCaseinsensitive):scope.$apply(function(){datasourceToFilter.data=[]})):datasourceToFilter.search(bindedFilter,"true"==attrs.cronappFilterCaseinsensitive)}})};return{restrict:"A",require:"?ngModel",link:function(e,t,i,a){var n=$(t),o=n.data("type")||n.attr("type");i.asDate!=null&&(o="date");var l="=";i.cronappFilterOperator&&0<i.cronappFilterOperator.length&&(l=i.cronappFilterOperator);var s=!0;i.cronappFilterAutopost&&"false"==i.cronappFilterAutopost&&(s=!1),setTimeout(function(){"INPUT"==n[0].tagName?inputBehavior(e,t,i,a,n,o,l,s):buttonBehavior(e,t,i,a,n,o,l,s)},100)}}}]).directive("cronList",["$compile","$parse",function($compile,$parse){'use strict';const defaultAdvancedTemplate="<ion-list type=\"\" can-swipe=\"listCanSwipe\">\n   <ion-item ng-class=\"{'cron-list-selected' : isChecked(rowData)}\" class=\"item {{options.editableButtonClass}} {{options.iconClassPosition}} {{options.imageClassPosition}}\" ng-repeat=\"rowData in datasource\">\n     <ul ng-if=\"options.allowMultiselect\" class=\"checkbox-group component-holder {{'cron-list-multiselect-' + options.imageType}}\" data-component=\"crn-checkbox\"><label class=\"checkbox\"><input ng-checked=\"isChecked(rowData);\" type=\"checkbox\"></label></ul>\n\t    <img alt='Thumbnail' ng-if=\"options.imageType !== 'do-not-show' && rowData[options.fields.image]\" \n          ng-src=\"{{options.isImageFromDropbox ? '' : 'data:image/png;base64,'}}{{rowData[options.fields.image]}}\" class=\"{{options.imageToClassPosition}}\">\n\t\t<div class=\"{{options.xattrTextPosition}} {{options.textToClassPosition}}\">\n\t\t\t<h2 ng-if=\"rowData[options.fields.field0]\">{{rowData[options.fields.field0]|mask:options.fields.mask0:options.fields.type0}}</h2>\n\t\t\t<p class=\"dark\" ng-if=\"rowData[options.fields.field1]\">{{rowData[options.fields.field1]|mask:options.fields.mask1:options.fields.type1}}</p>\n\t\t\t<p class=\"dark\" ng-if=\"rowData[options.fields.field2]\">{{rowData[options.fields.field2]|mask:options.fields.mask2:options.fields.type2}}</p>\n\t\t\t<p class=\"dark\" ng-if=\"rowData[options.fields.field3]\">{{rowData[options.fields.field3]|mask:options.fields.mask3:options.fields.type3}}</p>\n\t\t\t<p class=\"dark\" ng-if=\"rowData[options.fields.field4]\">{{rowData[options.fields.field4]|mask:options.fields.mask4:options.fields.type4}}</p>\n\t\t\t<p class=\"dark\" ng-if=\"rowData[options.fields.field5]\">{{rowData[options.fields.field5]|mask:options.fields.mask5:options.fields.type5}}</p>\n\t\t\t<i ng-if=\"options.icon\" class=\"{{options.icon}}\" xattr-theme=\"dark\"></i>\n\t\t</div>\n   </ion-item>\n</ion-list>\n<ion-infinite-scroll></ion-infinite-scroll>\n",defaultSearchTemplate="<div class=\"item item-input-inset\">\n   <div class=\"item-input-wrapper\">\n   <i class=\"icon ion-search placeholder-icon\"></i>\n   <input aria-label=\"{{'template.crud.search' | translate}}\" type=\"text\" ng-model=\"vars.searchableList[options.randomModel]\" cronapp-filter=\"{{options.filterFields}}\" cronapp-filter-operator=\"\" cronapp-filter-caseinsensitive=\"false\"\n   cronapp-filter-autopost=\"true\" crn-datasource=\"{{options.dataSourceScreen.name}}\" placeholder=\"{{'template.crud.search' | translate}}\">\n   </div>\n   <button ng-if=\"showButton()\" ng-click=\"limparSelecao()\"\n   class=\"button-small cron-list-button-clean button button-inline button-positive component-holder\">\n   <span cron-list-button-text>Limpar Sele\xE7\xE3o</span></button>\n</div>";var getExpression=function(e){return"rowData in ".concat(e).concat(".data")},buildFormat=function(e){var t="";return t=" | mask: \""+e.type+"\"",e.format&&(t=" | mask: \""+e.format+"\":\""+e.type+"\""),t},getEditCommand=function(e){return e+".startEditing(rowData)"},addDefaultButton=function(e,t){const i="<ion-option-button class=\"button-positive ion-edit\" ng-click=\""+getEditCommand(e)+"\"><span>&nbsp;{{\"Permission.view.Edit\" | translate}}</span></ion-option-button>",a="<ion-option-button class=\"button-assertive ion-trash-a\" ng-click=\""+e+".remove(rowData)\"><span>&nbsp;{{\"Permission.view.Remove\" | translate}}</span></ion-option-button>";if("edit|destroy"==t.command)return i.concat(a);return"edit"==t.command?i:"destroy"==t.command?a:void 0},encodeHTML=function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")},generateBlocklyCall=function(e){var t;if("client"==e.type){var i=e.blocklyClass.split("/"),a=i[i.length-1];t="blockly.js.blockly."+a,t+="."+e.blocklyMethod;var n="()";0<e.blocklyParams.length&&(n="(",e.blocklyParams.forEach(function(e){n+=(e.value?encodeHTML(e.value):"''")+","}.bind(this)),n=n.substr(0,n.length-1),n+=")"),t+=n}else if("server"==e.type){var a=e.blocklyClass+":"+e.blocklyMethod;t="cronapi.util.makeCallServerBlocklyAsync('"+a+"',null,null,",0<e.blocklyParams.length&&e.blocklyParams.forEach(function(e){t+=(e.value?encodeHTML(e.value):"''")+","}.bind(this)),t=t.substr(0,t.length-1),t+=")"}return t},addBlockly=function(e){return"<ion-option-button class=\"button-dark ion-navigate\" ng-click=\""+generateBlocklyCall(e.blocklyInfo)+"\"></ion-option-button>"},isImage=function(e,t){for(var a,n=0;n<t.length;n++)if(a=t[n],e==a.name)return"Binary"==a.type;return!1},addCustomButton=function(e){return`<ion-option-button class="button-dark ${e.iconClass}" ng-click="listButtonClick($index, rowData, '${window.stringToJs(e.execute)}', $event)">${e.label}</ion-option-button> `};return{restrict:"E",require:"?ngModel",scope:!0,priority:9999998,terminal:!0,link:function(scope,element,attrs,ngModelCtrl){var optionsList={},dataSourceName="",buttons="";try{optionsList=JSON.parse(attrs.options),dataSourceName=optionsList.dataSourceScreen.name;var dataSource=eval(optionsList.dataSourceScreen.name),imageDirection=optionsList.imagePosition?optionsList.imagePosition:"left",iconDirection=optionsList.iconPosition?optionsList.iconPosition:"right",bothDirection="left"===imageDirection&&"left"===iconDirection?"left":"right"===imageDirection&&"right"===iconDirection?"right":"",checkboxTemplate="",modelArrayToInsert=[],isKey=!1;if(scope.options=optionsList,attrs.ngModel){var modelGetter=$parse(attrs.ngModel),modelSetter=modelGetter.assign;optionsList.allowMultiselect?(scope.verifyIsKey=function(e){return isKey=!1,optionsList.fieldType&&"key"===optionsList.fieldType&&(e=this.changeRowDataField(e),isKey=!0),e},scope.limparSelecao=function(){modelSetter(scope,[])},scope.isChecked=function(e){let t=!1;return modelArrayToInsert=modelGetter(scope),e=scope.verifyIsKey(e),t=scope.hasObjectChecked(isKey,e,null,event),scope.isSelected=t,t},scope.hasObjectChecked=function(e,t){let i=!1;return Array.isArray(modelArrayToInsert)&&(e&&"object"!=typeof t?modelArrayToInsert.forEach(e=>{t===e&&(i=!0)}):modelArrayToInsert.forEach(e=>{dataSource.objectIsEquals(t,e)&&(i=!0)})),i},scope.checkboxButtonClick=function(e,t,i,a){let n=!1,o=$(a.currentTarget),l=o.find("input[type=checkbox]:checked").length;modelArrayToInsert=modelGetter(scope),Array.isArray(modelArrayToInsert)||(modelArrayToInsert=[]),$(a.target).is("input[type=checkbox]")||i||(0<l?o.find("input[type=checkbox]").prop("checked",!1):o.find("input[type=checkbox]").prop("checked",!0));let s=$(a.currentTarget).find("input[type=checkbox]");t=scope.verifyIsKey(t),$(s).is(":checked")?(n=scope.hasObjectChecked(isKey,t,i,a),!n&&modelArrayToInsert.push(t)):isKey&&"object"!=typeof t?modelArrayToInsert.forEach((e,i)=>{t===e&&modelArrayToInsert.splice(i,1)}):modelArrayToInsert.forEach((e,i)=>{dataSource.objectIsEquals(t,e)&&modelArrayToInsert.splice(i,1)}),modelSetter(scope,modelArrayToInsert),a.stopPropagation()}):scope.setRowDataModel=function(e,t){optionsList.fieldType&&"key"===optionsList.fieldType&&(t=this.changeRowDataField(t)),modelSetter(scope,t)},scope.changeRowDataField=function(e){e=dataSource.getKeyValues(e);var t=Object.keys(e);return 1===t.length&&(e=e[t]),e}}scope.listButtonClick=function(e,t,i,a){dataSource.goTo(t);var n={currentData:dataSource.data,datasource:dataSource,selectedIndex:e,index:e,selectedRow:t,consolidated:{item:t,index:e},item:t,selectedKeys:dataSource.getKeyValues(dataSource.active,!0)};scope.$eval(i,n),a.preventDefault(),a.stopPropagation()};var searchableField=null,isNativeEdit=!1,addedImage=!1;scope.options=optionsList,scope.options.fields={},scope.options.isImageFromDropbox=!1,scope.options.editableButtonClass="",scope.options.itemContentClass="",scope.options.itemSimple="",scope.options.filterFields="",scope.options.randomModel=_Mathfloor(9e3*Math.random())+1e3,optionsList.imagePosition||(scope.options.imagePosition="left"),optionsList.iconPosition||(scope.options.iconPosition="right"),optionsList.imageType||(scope.options.imageType="avatar");for(var column,imageDirection=optionsList.imagePosition?optionsList.imagePosition:"left",iconDirection=optionsList.iconPosition?optionsList.iconPosition:"right",bothDirection="left"===imageDirection&&"left"===iconDirection?"left":"right"===imageDirection&&"right"===iconDirection?"right":"",visibleColumns=[],i=0;i<optionsList.columns.length;i++)column=optionsList.columns[i],column.visible&&visibleColumns.push(optionsList.columns[i]);for(var column,i=0;i<visibleColumns.length;i++)column=visibleColumns[i],column.field&&"Database"==column.dataType?(scope.options.fields["field"+i]=column.field,scope.options.fields["type"+i]=column.type,scope.options.fields["mask"+i]=column.format,!addedImage&&isImage(column.field,optionsList.dataSourceScreen.entityDataSource.schemaFields)&&"do-not-show"!==optionsList.imageType?(scope.options.fields.image=column.field,delete scope.options.fields["field"+i],addedImage=!0,scope.options.isImageFromDropbox=!1):addedImage||"image"!=column.type?column.filterable&&(searchableField=null==searchableField?column.field:searchableField+";"+column.field):(scope.options.fields.image=column.field,delete scope.options.fields["field"+i],addedImage=!0,scope.options.isImageFromDropbox=!0)):("Command"==column.dataType||"Blockly"==column.dataType||"Customized"==column.dataType)&&(scope.options.editableButtonClass="item-complex item-right-editable","Command"==column.dataType?(scope.options.fields["field"+i]=column.field,buttons=buttons.concat(addDefaultButton(dataSourceName,column)),("edit"==column.command||"edit|destroy"==column.command)&&(isNativeEdit=!0)):"Blockly"==column.dataType?buttons=buttons.concat(addBlockly(column)):"Customized"==column.dataType&&(buttons=buttons.concat(addCustomButton(column))))}catch(e){console.log("CronList invalid configuration! "+e)}scope.options.editableButtonClass||addedImage?!scope.options.editableButtonClass&&addedImage&&(scope.options.itemContentClass="item-content",scope.options.editableButtonClass="item-complex",scope.options.itemSimple=""):(scope.options.itemContentClass="item-content",scope.options.itemSimple="item-simple"),scope.options.fields.image&&"do-not-show"!=scope.options.imageType&&(scope.options.imageClassPosition="item-"+scope.options.imageType+"-"+scope.options.imagePosition),addedImage||(scope.options.imageType="do-not-show"),scope.options.icon&&scope.options.iconPosition&&scope.options.imageType&&(scope.options.iconClassPosition="item-icon-"+scope.options.iconPosition),bothDirection&&scope.options.icon&&scope.options.imagePosition&&scope.options.imageType&&(scope.options.imageToClassPosition="image-to-"+scope.options.imagePosition+"-"+scope.options.imageType,scope.options.textToClassPosition="text-to-"+scope.options.iconPosition+"-"+scope.options.imageType),scope.options.advancedTemplate||(scope.options.advancedTemplate=defaultAdvancedTemplate),scope.options.searchTemplate||(scope.options.searchTemplate=defaultSearchTemplate);var templateDyn=null;searchableField?(scope.options.filterFields=searchableField,templateDyn=$(scope.options.searchTemplate+scope.options.advancedTemplate)):templateDyn=$(scope.options.advancedTemplate),scope.options.xattrTextPosition=attrs.xattrTextPosition,templateDyn.attr("type",optionsList.listType),$(element).replaceWith(templateDyn);var $element=templateDyn,ionItem=$element.find("ion-item");"rowData in datasource"===$(ionItem).attr("ng-repeat")&&ionItem.attr("ng-repeat",getExpression(dataSourceName)),isNativeEdit&&ionItem.attr("ng-click",getEditCommand(dataSourceName));var ngClickAttrTemplate="",ngClickAttrTemplateCheckbox="";optionsList.allowMultiselect?(attrs.ngModel&&(ngClickAttrTemplateCheckbox="checkboxButtonClick($index, rowData, '"+window.stringToJs(attrs.ngClick)+"', $event);"),checkboxTemplate=$element.find("ul"),attrs.ngClick&&(checkboxTemplate=$(checkboxTemplate).attr("ng-click",ngClickAttrTemplateCheckbox).get(0).outerHTML,ngClickAttrTemplate=ngClickAttrTemplate+"listButtonClick($index, rowData, '"+window.stringToJs(attrs.ngClick)+"', $event);"),ionItem.attr("ng-click",ngClickAttrTemplateCheckbox+ngClickAttrTemplate)):(attrs.ngModel&&(ngClickAttrTemplate="setRowDataModel($index, rowData, '"+window.stringToJs(attrs.ngClick)+"', $event);"),attrs.ngClick&&(ngClickAttrTemplate=ngClickAttrTemplate+"listButtonClick($index, rowData, '"+window.stringToJs(attrs.ngClick)+"', $event);"),ionItem.attr("ng-click",ngClickAttrTemplate));const attrsExcludeds=["options","ng-repeat","ng-click"],filteredItems=Object.values(attrs.$attr).filter(function(e){return!attrsExcludeds.includes(e)});for(let e in filteredItems)ionItem.attr(filteredItems[e],attrs[e]);ionItem.append(buttons);var firstScroll=!0;scope.nextPageInfinite=function(){return $element.find("ion-item").length<dataSource.data.length||0==dataSource.data.length?void scope.$broadcast("scroll.infiniteScrollComplete"):void($element.find("ion-item").length==dataSource.data.length&&(firstScroll?(scope.$broadcast("scroll.infiniteScrollComplete"),firstScroll=!1):dataSource.nextPage(function(){scope.$broadcast("scroll.infiniteScrollComplete")})))};var infiniteScroll=$element.filter(function(){return $(this).is("ion-infinite-scroll")});infiniteScroll.attr("on-infinite","nextPageInfinite()"),infiniteScroll.attr("distance","1%"),scope.showButton=function(){if(optionsList.allowMultiselect){var e=modelGetter(scope);if(null!==e&&e!==void 0)return 0<e.length}return!1},$compile(templateDyn,null,9999998)(scope)}}}]).directive("cronInfiniteScroll",["$compile",function($compile){'use strict';return{restrict:"EA",link:function(scope,element,attrs){var dataSource=attrs.cronInfiniteScroll?eval(attrs.cronInfiniteScroll):attrs.crnDatasource?eval(attrs.crnDatasource):void 0;if(dataSource){scope.nextPageInfinite=function(){dataSource.nextPage(),scope.$broadcast("scroll.infiniteScrollComplete")};var templateDyn=$("<ion-infinite-scroll></ion-infinite-scroll>");$(element).html(templateDyn);var infiniteScroll=$(element).find("ion-infinite-scroll");infiniteScroll.attr("on-infinite","nextPageInfinite()"),infiniteScroll.attr("distance","1%"),$compile(templateDyn)(element.scope())}}}}]).filter("raw",["$translate",function(){return function(e){if(null!=e&&e!==void 0){if("number"==typeof e)return e+"";if("boolean"==typeof e)return e+"";if(e instanceof Date)"datetimeoffset'"+e.toISOString()+"'";else return 10<=e.length&&e.match(ISO_PATTERN)?"datetimeoffset'"+e+"'":"'"+e+"'"}else return""}}]).directive("xkeyField",["$compile",function(e){'use strict';return{restrict:"A",link:function(t,i,a){if(a.xkeyField&&a.xdisplayField){var n="";a.crnDatasource&&(n=a.crnDatasource);var o;i.removeAttr("xkey-field"),i.removeAttr("xdisplay-field"),a.multiple?(o="opt as opt."+a.xdisplayField+" for opt in "+n+".data track by opt."+a.xkeyField,i.attr("ng-options",o)):i.append("<option ng-repeat=\"opt in "+n+".data\" value=\"{{opt."+a.xkeyField+"}}\">{{opt."+a.xdisplayField+"}}</option>"),e($(i))(t)}}}}]).directive("cronMobileMenu",["$compile","$translate",function(e,t){'use strict';var i=function(e){var i="";return e&&null!=e&&e.subMenuOptions&&null!=e.subMenuOptions&&Array.isArray(e.subMenuOptions)&&e.subMenuOptions.forEach(function(e){var a=e.security&&null!=e.security?" cronapp-security=\""+e.security+"\" ":"",n=e.action&&null!=e.action?" ng-click=\""+e.action+"\" ":"",o=e.hide&&null!=e.hide?" ng-hide=\""+e.hide+"\" ":"",l=e.iconClass&&null!=e.iconClass?e.iconClass:"",s=e.imagePosition&&null!=e.imagePosition?"item-icon-"+e.imagePosition:"",r=e.textPosition&&null!=e.textPosition?"text-"+e.textPosition:"",d=e.contentTheme&&null!=e.contentTheme?e.contentTheme:"",c=e.iconTheme&&null!=e.iconTheme?e.iconTheme:"",p=t.instant(e.title);i=i+"                    <a menu-close=\"\" class=\"item "+s+"\" "+n+a+o+">                       <i class=\""+l+" "+c+"\" style=\"font-size: 150%\"></i>                       <div class=\"item-content "+r+"\">                           <h2 class=\""+d+"\">"+p+"</h2>                       </div>                     </a> "}),i};return{restrict:"EA",link:function(t,a,n){var o={};try{o=JSON.parse(n.options)}catch(t){console.log("CronMobileMenu: Invalid configuration!")}var l=$("<ul class=\"nav navbar-nav\" style=\"float:none\"></ul>"),s=i(o);l.append(s);var r=angular.element(l);a.html(""),a.append(l),a.attr("id",null),e(r)(t)}}}])}(app);function maskDirectiveAsDate(e,t,i){return maskDirective(e,t,"as-date",i)}function maskDirectiveMask(e,t,i){return maskDirective(e,t,"mask",i)}function maskDirective(e,t,i,a){return{restrict:"A",require:"?ngModel",link:function(e,n,o,l){var s=a(o.ngModel),r=s.assign;if("as-date"!=i||void 0===o.mask){var d=$(n),c=d.attr("type");if("checkbox"!=c&&"password"!=c){d.data("type",c),d.attr("type","text"),l&&(l.$formatters=[],l.$parsers=[]),void 0!==o.asDate&&"text"==c&&(c="date");var p=!0,m=!1,u=o.mask||o.format;u=u?parseMaskType(u,t):parseMaskType(c,t),u.endsWith(";0")&&(m=!0);var g=u.replace(";1","").replace(";0","").replace(";local","").trim(),f=o.keyboard,h=t.instant("keyboardDecimalChar")&&1==t.instant("keyboardDecimalChar").length?t.instant("keyboardDecimalChar"):",";if(f&&parseKeyboardType(f,h,d),null!=g&&0!=g.length){if("date"==c||"datetime"==c||"datetime-local"==c||"month"==c||"time"==c||"time-local"==c||"week"==c){var v="date"==c||"datetime"==c||"time"==c;window.fixedTimeZone||(v=!1),"date"==c?(g=moment.HTML5_FMT.DATE,d.attr("type","date")):"month"==c?(g=moment.HTML5_FMT.MONTH,d.attr("type","month")):"week"==c?(g=moment.HTML5_FMT.WEEK,d.attr("type","week")):"datetime"==c||"datetime-local"==c?(g=moment.HTML5_FMT.DATETIME_LOCAL,d.attr("type","datetime-local")):("time"==c||"time-local"==c)&&(g=moment.HTML5_FMT.TIME,d.attr("type","time")),l&&(l.$formatters.push(function(e){return e?v?moment(e).utcOffset(window.timeZoneOffset).format(g):moment(e).format(g):null}),l.$parsers.push(function(e){return e?v?moment(e,g).utcOffset(window.timeZoneOffset,!0).toDate():moment(e,g).toDate():new Date(e)}))}else if("number"==c||"money"==c||"integer"==c||"money-decimal"==c){m=!0,p=!1;var y=g.trim().replace(/\./g,"").replace(/\,/g,"").replace(/#/g,"").replace(/0/g,"").replace(/9/g,"");f||("integer"==c||"money-decimal"==c?f="integer":f="number");var k="",b="",x="",T=",",M=0;g.startsWith(y)?k=y:g.endsWith(y)&&(b=y);var w=g.trim().replace(k,"").replace(b,"").trim();w.startsWith("#.")?x=".":w.startsWith("#,")&&(x=",");var C=null;if(-1==w.indexOf(",0")?-1!=w.indexOf(".0")&&(T=".",C=".0"):(T=",",C=",0"),null!=C){var D=w.substring(w.indexOf(C)+1);M=D.length}var P="numeric";0==M&&(P="integer");var F={rightAlign:"money"==c||"money-decimal"==c,unmaskAsNumber:!0,allowMinus:"money"!=c&&"money-decimal"!=c,prefix:k,suffix:b,radixPoint:T,digits:M,numericInput:"money-decimal"==c};x&&(F.autoGroup=!0,F.groupSeparator=x),"money-decimal"==c&&(P="currency"),$(n).inputmask(P,F),useInputMaskPlugin(n,l,e,r,g)}else"text"==c||"tel"==c?(f||"tel"!=c||(f="tel"),o.maskPlaceholder?(options={},options.placeholder=o.maskPlaceholder,$(n).inputmask(g,options),$(n).off("keypress"),m&&useInputMaskPlugin(n,l,e,r,g)):(d.mask(g),useMaskPlugin(n,l,e,r,m))):("email"==c||"password"==c||"search"==c)&&(f||(f=c));f&&parseKeyboardType(f,h,d)}}}}}}function useInputMaskPlugin(e,t,i,a,n){var o=$(e);$(e).off("keypress"),$(e).on("keyup",function(){var t=$(this).inputmask("unmaskedvalue");$(this).data("rawvalue",t),e._ignoreFormatter=!0,i.safeApply(function(){a(i,t)})}),t&&(t.$formatters.push(function(t){return e._ignoreFormatter?(e._ignoreFormatter=!1,$(e).val()):(e._ignoreFormatter=!1,null!=t&&null!=t&&""!==t?format(n,t):null)}),t.$parsers.push(function(e){if(e!=null&&null!=e&&""!==e){var t=o.inputmask("unmaskedvalue");if(""!==t)return t}return null}))}function useMaskPlugin(e,t,i,a,n){var o=$(e),l=function(){n&&$(this).data("rawvalue",$(this).cleanVal())};$(e).on("keydown",l).on("keyup",l),n&&t&&(t.$formatters.push(function(e){return e?o.masked(e):null}),t.$parsers.push(function(e){return e?o.cleanVal():null}))}function parseKeyboardType(e,t,i){("integer"==e||"number"==e||"tel"==e)&&(i.attr("pattern","\\d*"),i.attr("inputmode","decimal")),("tel"==e||"email"==e||"search"==e||"password"==e)&&i.attr("type",e),"ios"===cordova.platformId&&"number"==e&&(i.attr("decimal","true"),i.attr("allow-multiple-decimals","true"),i.attr("decimal-char",t))}function parseMaskType(e,t){return"datetime"==e||"datetime-local"==e?(e=t.instant("Format.DateTime"),"Format.DateTime"==e&&(e="DD/MM/YYYY HH:mm:ss")):"date"==e?(e=t.instant("Format.Date"),"Format.Date"==e&&(e="DD/MM/YYYY")):"time"==e||"time-local"==e?(e=t.instant("Format.Hour"),"Format.Hour"==e&&(e="HH:mm:ss")):"month"==e?e="MMMM":"number"==e?(e=t.instant("Format.Decimal"),"Format.Decimal"==e&&(e="0,00")):"money"==e||"money-decimal"==e?(e=t.instant("Format.Money"),"Format.Money"==e&&(e="#.#00,00")):"integer"==e?e="0":"week"==e?e="dddd":"tel"==e?e="(99) 99999-9999;0":"text"==e?e="":"string"==e&&(e=""),e}function transformText(){return{restrict:"E",require:"?ngModel",link:function(e,t,i,a){var n=function(e,t){if(e&&t){if("uppercase"===e.css("text-transform"))return t.toUpperCase();return"lowercase"===e.css("text-transform")?t.toLowerCase():t}};a&&(a.$formatters.push(function(e){return n(t,e)}),a.$parsers.push(function(e){return n(t,e)}))}}}