maskDirectiveAsDate.$inject=["$compile","$translate"],maskDirectiveMask.$inject=["$compile","$translate"],window.addEventListener("message",function(a){"reload"==a.data?window.location.reload():"reload(true)"==a.data&&window.location.reload(!0)}),function($app){var _Mathfloor=Math.floor,isoDate=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,patternFormat=function(a){return a?$(a).attr("format")||"DD/MM/YYYY":"DD/MM/YYYY"},parsePermission=function(a){var b={visible:{public:!0},enabled:{public:!0}};if(a)for(var c,d=a.toLowerCase().trim().split(","),e=0;e<d.length;e++)if(c=d[e].trim(),c){var f=c.split(":");if(2==f.length){var g=f[0].trim(),h=f[1].trim();if(h){for(var k,l=h.split(";"),m={},n=0;n<l.length;n++)k=l[n].trim(),k&&(m[k]=!0);b[g]=m}}}return b};app.directive("asDate",maskDirectiveAsDate),app.directive("input",transformText),app.directive("textarea",transformText).directive("ngDestroy",function(){return{restrict:"A",link:function(scope,element,attrs,ctrl){element.on("$destroy",function(){attrs.ngDestroy&&0<attrs.ngDestroy.length&&(-1<attrs.ngDestroy.indexOf("app.")||-1<attrs.ngDestroy.indexOf("blockly.")?scope.$eval(attrs.ngDestroy):eval(attrs.ngDestroy))})}}}).filter("mask",["$translate",function(a){return function(b,c,d){if(c=parseMaskType(c,a),!c)return b;var e;if(void 0===d?e=window.fixedTimeZone:(e="date"==d||"datetime"==d||"time"==d,!window.fixedTimeZone&&(e=!1)),0<c.indexOf(";local")&&(e=!1),c=c.replace(";1","").replace(";0","").replace(";local","").trim(),"string"==typeof b&&b.match(isoDate)||b instanceof Date)return e?moment(b).utcOffset(window.timeZoneOffset).format(c):moment(b).format(c);if("number"==typeof b)return format(c,b);if(null!=b&&null!=b&&""!=b&&""!=c){var f=$("<input type=\"text\">");return f.mask(c),f.masked(b)}return b}}]).directive("screenParams",[function(){'use strict';return{link:function(scope,elem,attrs,ctrl){var screenParams=eval(attrs.screenParams);screenParams&&screenParams.length&&screenParams.forEach(function(a){scope.params&&!scope.params[a.key]&&(scope.params[a.key]=a.value||"")})}}}]).directive("mask",maskDirectiveMask).directive("dynamicImage",["$compile",function(a){return{restrict:"A",scope:!0,require:"ngModel",link:function(b,c,d){var e=d.ngRequired&&"true"==d.ngRequired?"required":"",f=c.html(),g="<div ngf-drop=\"\" ngf-drag-over-class=\"dragover\">               <img style=\"width: 100%;\" ng-if=\"$ngModel$\" data-ng-src=\"{{$ngModel$.startsWith('http') || ($ngModel$.startsWith('/') && $ngModel$.length < 1000)? $ngModel$ : 'data:image/png;base64,' + $ngModel$}}\">               <div class=\"btn\" ng-if=\"!$ngModel$\" ngf-drop=\"\" ngf-select=\"\" ngf-change=\"cronapi.internal.setFile('$ngModel$', $file)\" ngf-pattern=\"'image/*'\" ngf-max-size=\"$maxFileSize$\">                 $userHtml$               </div>               <div class=\"remove-image-button button button-assertive\" ng-if=\"$ngModel$\" ng-click=\"$ngModel$=null\">                 <span class=\"icon ion-android-close\"></span>               </div>               <div class=\"button button-positive\" ng-if=\"!$ngModel$\" ng-click=\"cronapi.internal.startCamera('$ngModel$')\">                 <span class=\"icon ion-ios-videocam\"></span>               </div>             </div>",h="";d.maxFileSize&&(h=d.maxFileSize),g=$(g.split("$ngModel$").join(d.ngModel).split("$required$").join(e).split("$userHtml$").join(f).split("$maxFileSize$").join(h)),$(c).html(g),a(g)(c.scope())}}}]).directive("dynamicFile",["$compile",function(a){return{restrict:"A",scope:!0,require:"ngModel",link:function(b,c,d){var e=d.ngRequired&&"true"==d.ngRequired?"required":"",f=d.ngModel.split("."),g=f[0],h=f[f.length-1],i=_Mathfloor(1e3*Math.random()+20),j=c.html(),k="";d.maxFileSize&&(k=d.maxFileSize);var l="                                <div ng-show=\"!$ngModel$\" ngf-drop=\"\" ngf-drag-over-class=\"dragover\">                                  <div class=\"btn\" ngf-drop=\"\" ngf-select=\"\" ngf-change=\"cronapi.internal.uploadFile('$ngModel$', $file, 'uploadprogress$number$')\" ngf-max-size=\"$maxFileSize$\">                                    $userHtml$                                  </div>                                  <div class=\"progress\" data-type=\"bootstrapProgress\" id=\"uploadprogress$number$\" style=\"display:none\">                                    <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"70\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:0%\">                                      <span class=\"sr-only\"></span>                                    </div>                                  </div>                                </div>                                 <div ng-show=\"$ngModel$\" class=\"upload-image-component-attribute\">                                   <div class=\"button button-assertive\" style=\"float:right;\" ng-if=\"$ngModel$\" ng-click=\"$ngModel$=null\">                                     <span class=\"icon ion-android-close\"></span>                                   </div>                                   <div>                                     <div ng-bind-html=\"cronapi.internal.generatePreviewDescriptionByte($ngModel$)\"></div>                                     <a href=\"javascript:void(0)\" ng-click=\"cronapi.internal.downloadFileEntityMobile($datasource$,'$field$')\">download</a>                                   </div>                                 </div>                                 ";l=$(l.split("$ngModel$").join(d.ngModel).split("$datasource$").join(g).split("$field$").join(h).split("$number$").join(i).split("$required$").join(e).split("$userHtml$").join(j).split("$maxFileSize$").join(k)),$(c).html(l),a(l)(c.scope())}}}]).directive("pwCheck",[function(){'use strict';return{require:"ngModel",link:function(a,b,c,d){var e="#"+c.pwCheck;b.add(e).on("keyup",function(){a.$apply(function(){var a=b.val()===$(e).val();d.$setValidity("pwmatch",a)})})}}}]).directive("qr",["$window",function(a){return{restrict:"A",require:"^ngModel",template:"<canvas ng-hide=\"image\"></canvas><img ng-if=\"image\" ng-src=\"{{canvasImage}}\"/>",link:function(b,c,d,e){b.size===void 0&&d.size&&(b.text=d.size);var f=function(){return e.$modelValue||""},g=function(a){var b=/^[0-9]*$/;return b.test(a)},h=function(a){var b=/^[0-9A-Z $%*+\-./:]*$/;return b.test(a)},i=function(a){for(var b,c=0;c<a.length;c++)if(b=a.charCodeAt(c),255<b)return!1;return!0},j=function(a,b){if("NUMBER"===a&&!g(b))throw new Error("The `NUMBER` input mode is invalid for text.");else if("ALPHA_NUM"===a&&!h(b))throw new Error("The `ALPHA_NUM` input mode is invalid for text.");else if("8bit"===a&&!i(b))throw new Error("The `8bit` input mode is invalid for text.");else if(!i(b))throw new Error("Input mode is invalid for text.");return!0},k=function(a){var c=b.inputMode;return c=c||(g(a)?"NUMBER":void 0),c=c||(h(a)?"ALPHA_NUM":void 0),c=c||(i(a)?"8bit":""),j(c,a)?c:""},l=c.find("canvas")[0],m=!!a.CanvasRenderingContext2D;b.TYPE_NUMBER=function(){return b.typeNumber||0}(),b.TEXT=f(),b.CORRECTION=function(){var a=b.correctionLevel||0;return{L:1,M:0,Q:3,H:2}[a]||0}(),b.SIZE=function(){return b.size||$(c).outerWidth()}(),b.INPUT_MODE=k(b.TEXT),b.canvasImage="";var n=function(a,b,c,d){for(var e=Math.round,f=Math.ceil,g=0;g<c;g++)for(var i=0;i<c;i++){var j=f((i+1)*d)-_Mathfloor(i*d),k=f((g+1)*d)-_Mathfloor(g*d);a.fillStyle=b.isDark(g,i)?"#000":"#fff",a.fillRect(e(i*d),e(g*d),j,k)}},o=function(a,c,d,e,f,g){var h=/^\s+|\s+$/g,i=c.replace(h,""),j=new QRCode(d,e,g);j.addData(i),j.make();var k=a.getContext("2d"),l=j.getModuleCount();a.width=a.height=f,m&&(n(k,j,l,f/l),b.canvasImage=a.toDataURL()||"")};b.$watch(function(){return e.$modelValue},function(a,c){(a!==c||a!==b.TEXT)&&(b.text=e.$modelValue,b.TEXT=f(),b.INPUT_MODE=k(b.TEXT),o(l,b.TEXT,b.TYPE_NUMBER,b.CORRECTION,b.SIZE,b.INPUT_MODE))}),o(l,b.TEXT,b.TYPE_NUMBER,b.CORRECTION,b.SIZE,b.INPUT_MODE)}}}]).directive("valid",function(){return{require:"^ngModel",restrict:"A",link:function(a,b,c,d){var e={cpf:CPF,cnpj:CNPJ};d.$validators[c.valid]=function(a,d){var f=a||d,g=e[c.valid].isValid(f);return g?b[0].setCustomValidity(""):b.scope().$applyAsync(function(){b[0].setCustomValidity(b[0].dataset.errorMessage)}),g||!f}}}}).directive("cronappSecurity",function(){return{restrict:"A",link:function(a,b,c){var d=[],e=JSON.parse(localStorage.getItem("_u"));e&&e.roles&&(d=e.roles.toLowerCase().split(","));for(var f,g=parsePermission(c.cronappSecurity),h=!1,j=!1,k=0;k<d.length;k++)f=d[k].trim(),f&&(g.visible[f]&&(h=!0),g.enabled[f]&&(j=!0));h||$(b).hide(),j||$(b).find("*").addBack().attr("disabled",!0)}}}).directive("cronappStars",[function(){'use strict';return{restrict:"A",require:"ngModel",link:function(a,b,c,d){function e(a){for(var b=1;5>=b;b++)j[b-1].removeClass("ion-android-star-outline"),j[b-1].removeClass("ion-android-star"),b<=a?j[b-1].addClass("ion-android-star"):j[b-1].addClass("ion-android-star-outline");return a}var f=$(b),g=$("<i style=\"font-size: 200%\" class=\"component-holder ion ion-android-star-outline\" style=\"\" xattr-size=\"\" data-component=\"crn-icon\"></i>");f.html("");for(var h,j=[],k=1;5>=k;k++)h=g.clone(),f.append(h),h.attr("idx",k),h.click(function(){a.$apply(function(){d.$viewValue=parseInt($(this).attr("idx")),d.$commitViewValue()}.bind(this))}),j.push(h);d.$parsers.push(e),d.$formatters.push(e)}}}]).directive("cronappRating",[function(){'use strict';return{restrict:"E",require:"ngModel",link:function(a,b,c,d){function e(a){for(var b=1;5>=b;b++)k[b-1].removeClass(c.iconOff||"ion ion-android-star-outline"),k[b-1].removeClass(c.iconOn),k[b-1].removeClass(c.theme),b<=a?(k[b-1].addClass(c.iconOn),k[b-1].addClass(c.theme)):(k[b-1].addClass(c.iconOff||"ion ion-android-star-outline"),k[b-1].addClass(c.theme));return a}c.theme=$(b).find("i").attr("xattr-theme"),c.iconOn=$(b).find("i").attr("class");for(var f=$(b),g=[],h=1;5>=h;h++)g.push($(b).find("i").get(h-1)),$(g[h-1]).addClass(c.iconOff||"fa fa-star-o");f.html("");for(var j,k=[],h=1;5>=h;h++)j=$(g[h-1]).clone(),f.append(j),j.attr("idx",h),j.click(function(){a.$apply(function(){d.$viewValue=parseInt($(this).attr("idx")),d.$commitViewValue()}.bind(this))}),k.push(j);d.$parsers.push(e),d.$formatters.push(e)}}}]).directive("cronappFilter",["$compile",function($compile){var setFilterInButton=function(a,b){var c=a.closest("fieldset");if(c){var d=c.find("button[cronapp-filter]");if(d){var e=d.data("filters");e||(e=[]);var f=-1,g=a.attr("ng-model");if($(e).each(function(a){this.ngModel==g&&(f=a)}),-1<f&&e.splice(f,1),0<b.length){e.push({ngModel:g,bindedFilter:b})}d.data("filters",e)}}},makeAutoPostSearch=function(a,b,c,d){var e=a.closest("fieldset");if(e&&0<e.length){var f=e.find("button[cronapp-filter]");if(f&&0<f.length){var g=f.data("filters");g&&0<g.length&&(b="",$(g).each(function(){b+=this.bindedFilter+";"}))}}c.search(b,"true"==d.cronappFilterCaseinsensitive)},inputBehavior=function(scope,element,attrs,ngModelCtrl,$element,typeElement,operator,autopost){var datasource,filterTemplate="",filtersSplited=attrs.cronappFilter.split(";");if(attrs.crnDatasource)datasource=eval(attrs.crnDatasource);else{var fieldset=$element.closest("fieldset");if(!fieldset)return;var button=fieldset.find("button[cronapp-filter]");if(!button)return;if(!button.attr("crn-datasource"))return;datasource=eval(button.attr("crn-datasource"))}var isOData=datasource.isOData();$(filtersSplited).each(function(){0<this.length&&(""!=filterTemplate&&(isOData?filterTemplate+=" or ":filterTemplate+=";"),isOData?"="==operator&&"text"==typeElement&&""==filterTemplate?filterTemplate="substringof({value.lower}, tolower("+this+"))":"="==operator?filterTemplate+=" substringof({value.lower},tolower("+this+"))":"!="==operator?filterTemplate+=this+" ne {value}":">"==operator?filterTemplate+=this+" gt {value}":">="==operator?filterTemplate+=this+" ge {value}":"<"==operator?filterTemplate+=this+" lt {value}":"<="==operator&&(filterTemplate+=this+" le {value}"):"text"==typeElement?filterTemplate+=this+"@"+operator+"%{value}%":filterTemplate+=this+operator+"{value}")}),0==filterTemplate.length&&(isOData?filterTemplate="{value}":filterTemplate="%{value}%"),ngModelCtrl?scope.$watch(attrs.ngModel,function(a,b){if(!angular.equals(a,b)){var c=$element.data("type")||$element.attr("type"),d=ngModelCtrl.$modelValue;isOData?d instanceof Date?"datetime-local"==c?d="datetimeoffset'"+d.toISOString()+"'":d="datetime'"+d.toISOString().substring(0,23)+"'":"number"==typeof d?d=d:"boolean"==typeof d?d=d:d="'"+d+"'":d instanceof Date?(d=d.toISOString(),d+="date"==c?"@@date":"time"==c||"time-local"==c?"@@time":"@@datetime"):"number"==typeof d?d+="@@number":"boolean"==typeof d&&(d+="@@boolean");var e=filterTemplate.split("{value}").join(d);e="string"==typeof d?e.split("{value.lower}").join(d.toLowerCase()):e.split("{value.lower}").join(d),0==ngModelCtrl.$viewValue.length&&(e=""),setFilterInButton($element,e,operator),autopost&&makeAutoPostSearch($element,e,datasource,attrs)}}):"text"==typeElement?$element.on("keyup",function(){var datasource=eval(attrs.crnDatasource),value=void 0;value=ngModelCtrl&&null!=ngModelCtrl?ngModelCtrl.$viewValue:this.value;var bindedFilter=filterTemplate.split("{value}").join(value);0==this.value.length&&(bindedFilter=""),setFilterInButton($element,bindedFilter,operator),autopost&&makeAutoPostSearch($element,bindedFilter,datasource,attrs)}):$element.on("change",function(){var datasource=eval(attrs.crnDatasource),value=void 0,typeElement=$(this).attr("type");if(null!=attrs.asDate&&(typeElement="date"),ngModelCtrl&&null!=ngModelCtrl)value=ngModelCtrl.$viewValue;else if("checkbox"==typeElement)value=$(this).is(":checked");else if("date"!=typeElement)value=this.value;else if(value=this.value,0<this.value.length){var momentDate=moment(this.value,patternFormat(this));value=momentDate.toDate().toISOString()}var bindedFilter=filterTemplate.split("{value}").join(value);0==value.toString().length&&(bindedFilter=""),setFilterInButton($element,bindedFilter,operator),autopost&&makeAutoPostSearch($element,bindedFilter,datasource,attrs)})},forceDisableDatasource=function(datasourceName,scope){var disableDatasource=setInterval(function(){try{var datasourceInstance=eval(datasourceName);datasourceInstance&&($(document).ready(function(){var a=0,b=setInterval(function(){10>a?(scope.$apply(function(){datasourceInstance.enabled=!1,datasourceInstance.data=[]}),a++):clearInterval(b)},20)}),clearInterval(disableDatasource))}catch(a){}},10)},buttonBehavior=function(scope,element,attrs,ngModelCtrl,$element,typeElement,operator,autopost){var datasourceName="";datasourceName=attrs.crnDatasource?attrs.crnDatasource:$element.parent().attr("crn-datasource");var datasource=eval(datasourceName),isOData=datasource.isOData(),requiredFilter=attrs.requiredFilter&&"true"==attrs.requiredFilter.toString();requiredFilter&&this.forceDisableDatasource(datasourceName,scope),$element.on("click",function(){var $this=$(this),filters=$this.data("filters");if(datasourceName&&0<datasourceName.length&&filters){var bindedFilter="";$(filters).each(function(){""!=bindedFilter&&(bindedFilter+=isOData?" and ":";"),bindedFilter+=this.bindedFilter});var datasourceToFilter=eval(datasourceName);requiredFilter?(datasourceToFilter.enabled=0<bindedFilter.length,datasourceToFilter.enabled?datasourceToFilter.search(bindedFilter,"true"==attrs.cronappFilterCaseinsensitive):scope.$apply(function(){datasourceToFilter.data=[]})):datasourceToFilter.search(bindedFilter,"true"==attrs.cronappFilterCaseinsensitive)}})};return{restrict:"A",require:"?ngModel",link:function(a,b,c,d){var e=$(b),f=e.data("type")||e.attr("type");c.asDate!=null&&(f="date");var g="=";c.cronappFilterOperator&&0<c.cronappFilterOperator.length&&(g=c.cronappFilterOperator);var h=!0;c.cronappFilterAutopost&&"false"==c.cronappFilterAutopost&&(h=!1),setTimeout(function(){"INPUT"==e[0].tagName?inputBehavior(a,b,c,d,e,f,g,h):buttonBehavior(a,b,c,d,e,f,g,h)},100)}}}]).directive("cronList",["$compile",function($compile){'use strict';const TEMPLATE="               <ion-list can-swipe=\"listCanSwipe\">             \t   <ion-item class=\"item\" ng-repeat=\"rowData in datasource\">               \t   <div class=\"item-avatar\"></div>               \t </ion-item>                </ion-list>                <ion-infinite-scroll></ion-infinite-scroll>                ";var getExpression=function(a){return"rowData in ".concat(a).concat(".data")},buildFormat=function(a){var b="";return(a.format||"string"!=a.type&&"text"!=a.type)&&(b=" | mask: \""+(a.type||a.format)+"\":\""+a.type+"\""),b},addDefaultColumn=function(a,b){var c=null;return c=b?"<h2>{{rowData."+a.field+buildFormat(a)+"}}</h2>":"<p>{{rowData."+a.field+buildFormat(a)+"}}</p>",c},getEditCommand=function(a){return a+".startEditing(rowData)"},addDefaultButton=function(a,b){const c="<ion-option-button class=\"button-positive\" ng-click=\""+getEditCommand(a)+"\"><i class=\"icon ion-edit\"></i></ion-option-button>",d="<ion-option-button class=\"button-assertive\" ng-click=\""+a+".remove(rowData)\"><i class=\"icon ion-trash-a\"></i></ion-option-button>";if("edit|destroy"==b.command)return c.concat(d);return"edit"==b.command?c:"destroy"==b.command?d:void 0},addImage=function(a){return"<div class=\"custom-item-avatar-imagem\" style=\"background-image:url('data:image/png;base64,{{rowData."+a.field+"}}')\"></div>"},addImageLink=function(a){return"<div class=\"custom-item-avatar-imagem\" style=\"background-image:url('{{rowData."+a.field+"}}')\"></div>"},encodeHTML=function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")},generateBlocklyCall=function(a){var b;if("client"==a.type){var c=a.blocklyClass.split("/"),d=c[c.length-1];b="blockly.js.blockly."+d,b+="."+a.blocklyMethod;var e="()";0<a.blocklyParams.length&&(e="(",a.blocklyParams.forEach(function(a){e+=(a.value?encodeHTML(a.value):"''")+","}.bind(this)),e=e.substr(0,e.length-1),e+=")"),b+=e}else if("server"==a.type){var d=a.blocklyClass+":"+a.blocklyMethod;b="cronapi.util.makeCallServerBlocklyAsync('"+d+"',null,null,",0<a.blocklyParams.length&&a.blocklyParams.forEach(function(a){b+=(a.value?encodeHTML(a.value):"''")+","}.bind(this)),b=b.substr(0,b.length-1),b+=")"}return b},addBlockly=function(a){return"<ion-option-button class=\"button-dark\" ng-click=\""+generateBlocklyCall(a.blocklyInfo)+"\"><i class=\"icon ion-navigate\"></i></ion-option-button>"},isImage=function(a,b){for(var c,d=0;d<b.length;d++)if(c=b[d],a==c.name)return"Binary"==c.type;return!1},addCustomButton=function(a){return`<ion-option-button class="button-dark" ng-click="listButtonClick($index, rowData, '${window.stringToJs(a.execute)}', $event)"><i class=" ${a.iconClass}"></i> ${a.label}</ion-option-button> `},isImage=function(a,b){for(var c,d=0;d<b.length;d++)if(c=b[d],a==c.name)return"Binary"==c.type;return!1},getSearchableList=function(a,b){return"              <label class=\"item item-input\"> <i class=\"icon ion-search placeholder-icon\"></i>                 <input type=\"text\" ng-model=\"vars.__searchableList__\" cronapp-filter=\""+b+";\" cronapp-filter-operator=\"\" cronapp-filter-caseinsensitive=\"false\" cronapp-filter-autopost=\"true\"                 crn-datasource=\""+a+"\" placeholder=\"{{'template.crud.search' | translate}}\">               </label>             "};return{restrict:"E",link:function(scope,element,attrs,ngModelCtrl){var optionsList={},dataSourceName="",content="",buttons="",image="";try{optionsList=JSON.parse(attrs.options),dataSourceName=optionsList.dataSourceScreen.name;var dataSource=eval(optionsList.dataSourceScreen.name);scope.listButtonClick=function(a,b,c,d){dataSource.goTo(b);var e={currentData:dataSource.data,datasource:dataSource,selectedIndex:a,index:a,selectedRow:b,consolidated:{item:b,index:a},item:b,selectedKeys:dataSource.getKeyValues(dataSource.active,!0)};scope.$eval(c,e),d.preventDefault(),d.stopPropagation()};for(var column,searchableField=null,isNativeEdit=!1,addedImage=!1,i=0;i<optionsList.columns.length;i++)column=optionsList.columns[i],column.visible&&(column.field&&"Database"==column.dataType?!addedImage&&isImage(column.field,optionsList.dataSourceScreen.entityDataSource.schemaFields)?(image=addImage(column),addedImage=!0):addedImage||"image"!=column.type?(content=content.concat(addDefaultColumn(column,0==i)),column.filterable&&(searchableField=null==searchableField?column.field:searchableField+";"+column.field)):(image=addImageLink(column),addedImage=!0):"Command"==column.dataType?(buttons=buttons.concat(addDefaultButton(dataSourceName,column)),("edit"==column.command||"edit|destroy"==column.command)&&(isNativeEdit=!0)):"Blockly"==column.dataType?buttons=buttons.concat(addBlockly(column)):"Customized"==column.dataType&&(buttons=buttons.concat(addCustomButton(column))))}catch(a){console.log("CronList invalid configuration! "+a)}var templateDyn=null;templateDyn=searchableField?$(getSearchableList(dataSourceName,searchableField)+TEMPLATE):$(TEMPLATE),$(element).html(templateDyn);var ionItem=$(element).find("ion-item");ionItem.attr("ng-repeat",getExpression(dataSourceName)),isNativeEdit&&ionItem.attr("ng-click",getEditCommand(dataSourceName)),attrs.ngClick&&ionItem.attr("ng-click","listButtonClick($index, rowData, '"+window.stringToJs(attrs.ngClick)+"', $event)");const attrsExcludeds=["options","ng-repeat","ng-click"],filteredItems=Object.values(attrs.$attr).filter(function(a){return!attrsExcludeds.includes(a)});for(let a in filteredItems)ionItem.attr(filteredItems[a],attrs[a]);content="<div class=\"item-list-detail\">"+content+"<div>";var ionAvatar=$(element).find(".item-avatar");ionAvatar.append(image),ionAvatar.append(content),ionAvatar.append(buttons),scope.nextPageInfinite=function(){dataSource.nextPage(),scope.$broadcast("scroll.infiniteScrollComplete")};var infiniteScroll=$(element).find("ion-infinite-scroll");infiniteScroll.attr("on-infinite","nextPageInfinite()"),infiniteScroll.attr("distance","1%"),$compile(templateDyn)(scope)}}}]).directive("cronInfiniteScroll",["$compile",function($compile){'use strict';return{restrict:"EA",link:function(scope,element,attrs){var dataSource=attrs.cronInfiniteScroll?eval(attrs.cronInfiniteScroll):attrs.crnDatasource?eval(attrs.crnDatasource):void 0;if(dataSource){scope.nextPageInfinite=function(){dataSource.nextPage(),scope.$broadcast("scroll.infiniteScrollComplete")};var templateDyn=$("<ion-infinite-scroll></ion-infinite-scroll>");$(element).html(templateDyn);var infiniteScroll=$(element).find("ion-infinite-scroll");infiniteScroll.attr("on-infinite","nextPageInfinite()"),infiniteScroll.attr("distance","1%"),$compile(templateDyn)(element.scope())}}}}]).filter("raw",["$translate",function(){return function(a){if(null!=a&&a!==void 0){if("number"==typeof a)return a+"";if("boolean"==typeof a)return a+"";if(a instanceof Date)"datetimeoffset'"+a.toISOString()+"'";else return 10<=a.length&&a.match(ISO_PATTERN)?"datetimeoffset'"+a+"'":"'"+a+"'"}else return""}}]).directive("xkeyField",["$compile",function(a){'use strict';return{restrict:"A",link:function(b,c,d){if(d.xkeyField&&d.xdisplayField){var e="";d.crnDatasource&&(e=d.crnDatasource);var f;c.removeAttr("xkey-field"),c.removeAttr("xdisplay-field"),d.multiple?(f="opt as opt."+d.xdisplayField+" for opt in "+e+".data track by opt."+d.xkeyField,c.attr("ng-options",f)):c.append("<option ng-repeat=\"opt in "+e+".data\" value=\"{{opt."+d.xkeyField+"}}\">{{opt."+d.xdisplayField+"}}</option>"),a($(c))(b)}}}}])}(app);function maskDirectiveAsDate(a,b){return maskDirective(a,b,"as-date")}function maskDirectiveMask(a,b){return maskDirective(a,b,"mask")}function maskDirective(a,b,c){return{restrict:"A",require:"?ngModel",link:function(a,d,e,f){if("as-date"!=c||void 0===e.mask){var g=$(d),h=g.attr("type");if("checkbox"!=h&&"password"!=h){g.data("type",h),g.attr("type","text"),f&&(f.$formatters=[],f.$parsers=[]),void 0!==e.asDate&&"text"==h&&(h="date");var i=!0,j=!1,k=e.mask||e.format;k=k?parseMaskType(k,b):parseMaskType(h,b),k.endsWith(";0")&&(j=!0);var l=k.replace(";1","").replace(";0","").replace(";local","").trim();if(null!=l&&0!=l.length)if("date"==h||"datetime"==h||"datetime-local"==h||"month"==h||"time"==h||"time-local"==h||"week"==h){var m="date"==h||"datetime"==h||"time"==h;window.fixedTimeZone||(m=!1),"date"==h?(l=moment.HTML5_FMT.DATE,g.attr("type","date")):"month"==h?(l=moment.HTML5_FMT.MONTH,g.attr("type","month")):"week"==h?(l=moment.HTML5_FMT.WEEK,g.attr("type","week")):"datetime"==h||"datetime-local"==h?(l=moment.HTML5_FMT.DATETIME_LOCAL,g.attr("type","datetime-local")):("time"==h||"time-local"==h)&&(l=moment.HTML5_FMT.TIME,g.attr("type","time")),f&&(f.$formatters.push(function(a){return a?m?moment(a).utcOffset(window.timeZoneOffset).format(l):moment(a).format(l):null}),f.$parsers.push(function(a){return a?m?moment(a,l).utcOffset(window.timeZoneOffset,!0).toDate():moment(a,l).toDate():new Date(a)}))}else if("number"==h||"money"==h||"integer"==h||"money-decimal"==h){j=!0,i=!1;var n=l.trim().replace(/\./g,"").replace(/\,/g,"").replace(/#/g,"").replace(/0/g,"").replace(/9/g,""),o="",p="",q="",r=",",s=0;l.startsWith(n)?o=n:l.endsWith(n)&&(p=n);var t=l.trim().replace(o,"").replace(p,"").trim();t.startsWith("#.")?q=".":t.startsWith("#,")&&(q=",");var u=null;if(-1==t.indexOf(",0")?-1!=t.indexOf(".0")&&(r=".",u=".0"):(r=",",u=",0"),null!=u){var v=t.substring(t.indexOf(u)+1);s=v.length}var w="numeric";0==s&&(w="integer"),"money-decimal"==h&&(w="currency");var x={rightAlign:"money"==h||"money-decimal"==h,unmaskAsNumber:!0,allowMinus:!0,prefix:o,suffix:p,radixPoint:r,digits:s,numericInput:"money-decimal"==h};q&&(x.autoGroup=!0,x.groupSeparator=q),$(d).inputmask(w,x);var y=function(){$(this).data("rawvalue",$(this).inputmask("unmaskedvalue"))};$(d).off("keypress"),a.safeApply(function(){$(d).on("keyup",y)}),f&&(f.$formatters.push(function(a){return null!=a&&null!=a&&""!==a?format(l,a):null}),f.$parsers.push(function(a){if(null!=a&&null!=a&&""!==a){var b=g.inputmask("unmaskedvalue");if(""!==b)return b}return null}))}else if("text"==h||"tel"==h){var z={};e.maskPlaceholder&&(z.placeholder=e.maskPlaceholder),g.mask(l,z);var y=function(){j&&$(this).data("rawvalue",$(this).cleanVal())};$(d).on("keydown",y).on("keyup",y),j&&f&&(f.$formatters.push(function(a){return a?g.masked(a):null}),f.$parsers.push(function(a){return a?g.cleanVal():null}))}}}}}}function parseMaskType(a,b){return"datetime"==a||"datetime-local"==a?(a=b.instant("Format.DateTime"),"Format.DateTime"==a&&(a="DD/MM/YYYY HH:mm:ss")):"date"==a?(a=b.instant("Format.Date"),"Format.Date"==a&&(a="DD/MM/YYYY")):"time"==a||"time-local"==a?(a=b.instant("Format.Hour"),"Format.Hour"==a&&(a="HH:mm:ss")):"month"==a?a="MMMM":"number"==a?(a=b.instant("Format.Decimal"),"Format.Decimal"==a&&(a="0,00")):"money"==a||"money-decimal"==a?(a=b.instant("Format.Money"),"Format.Money"==a&&(a="#.#00,00")):"integer"==a?a="0":"week"==a?a="dddd":"tel"==a?a="(00) 00000-0000;0":"text"==a?a="":"string"==a&&(a=""),a}function transformText(){return{restrict:"E",require:"?ngModel",link:function(a,b,c,d){var e=function(a,b){if(a&&b){if("uppercase"===a.css("text-transform"))return b.toUpperCase();return"lowercase"===a.css("text-transform")?b.toLowerCase():b}};d&&(d.$formatters.push(function(a){return e(b,a)}),d.$parsers.push(function(a){return e(b,a)}))}}}