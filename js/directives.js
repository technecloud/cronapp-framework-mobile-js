(function($app) {
  
  var isoDate = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
  
  /**
   * Função que retorna o formato que será utilizado no componente
   * capturando o valor do atributo format do elemento, para mais formatos
   * consulte os formatos permitidos em http://momentjs.com/docs/#/parsing/string-format/
   *
   */
  var patternFormat = function(element) {
    if (element) {
      return $(element).attr('format') || 'DD/MM/YYYY';
    }
    return 'DD/MM/YYYY';
  }
  
    var parsePermission = function(perm) {



    var result = {
      visible: {
        public: true
      },
      enabled: {
        public: true
      }
    }

    if (perm) {
      var perms = perm.toLowerCase().trim().split(",");
      for (var i=0;i<perms.length;i++) {
        var p = perms[i].trim();
        if (p) {
          var pair = p.split(":");
          if (pair.length == 2) {
            var key = pair[0].trim();
            var value = pair[1].trim();
            if (value) {
              var values = value.split(";");
              var json = {};
              for (var j=0;j<values.length;j++) {
                var v = values[j].trim();
                if (v) {
                  json[v] = true;
                }
              }
              result[key] = json;
            }
          }
        }
      }
    }
    return result;
    }

    app.directive('asDate', maskDirectiveAsDate)
    
    .directive('ngDestroy', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
          element.on('$destroy', function() {
            if (attrs.ngDestroy && attrs.ngDestroy.length > 0)
              if (attrs.ngDestroy.indexOf('app.') > -1 || attrs.ngDestroy.indexOf('blockly.') > -1)
                scope.$eval(attrs.ngDestroy);
              else
                eval(attrs.ngDestroy);
          });
        }
      }
    })
    
    .filter('mask',function($translate) {
        return function(value, maskValue) {
          
          maskValue = parseMaskType(maskValue, $translate);
          if (!maskValue)
            return value;

          maskValue = maskValue.replace(';1', '').replace(';0', '').trim();

          if (typeof value == "string" && value.match(isoDate)) {
            return moment.utc(value).format(maskValue);
          } else if (value instanceof Date) {
            return moment.utc(value).format(maskValue);
          } else if (typeof value == 'number') {
            return format(maskValue, value);
          }  else if (value != undefined && value != null && value != "") {
            var input = $("<input type=\"text\">");
            input.mask(maskValue);
            return input.masked(value);
          } else {
            return value;
          }
        };
      })

      .directive('mask', maskDirectiveMask)
    
    .directive('dynamicImage', function($compile) {
        var template = '';
        return {
          restrict: 'A',
          scope: true,
          require: 'ngModel',
          link: function(scope, element, attr) {
            debugger;
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");
            var content = element.html();
            var templateDyn    =
                '<div ngf-drop="" ngf-drag-over-class="dragover">\
                   <img style="width: 100%;" ng-if="$ngModel$" data-ng-src="{{$ngModel$.startsWith(\'http\') || ($ngModel$.startsWith(\'/\') && $ngModel$.length < 1000)? $ngModel$ : \'data:image/png;base64,\' + $ngModel$}}">\
                   <div class="btn" ng-if="!$ngModel$" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.setFile(\'$ngModel$\', $file)" ngf-pattern="\'image/*\'" ngf-max-size="$maxFileSize$">\
                     $userHtml$\
                   </div>\
                   <div class="remove-image-button button button-assertive" ng-if="$ngModel$" ng-click="$ngModel$=null">\
                     <span class="icon ion-android-close"></span>\
                   </div>\
                   <div class="button button-positive" ng-if="!$ngModel$" ng-click="cronapi.internal.startCamera(\'$ngModel$\')">\
                     <span class="icon ion-ios-videocam"></span>\
                   </div>\
                 </div>';
            var maxFileSize = "";
            if (attr.maxFileSize)
              maxFileSize = attr.maxFileSize;

            templateDyn = $(templateDyn
                .split('$ngModel$').join(attr.ngModel)
                .split('$required$').join(required)
                .split('$userHtml$').join(content)
                .split('$maxFileSize$').join(maxFileSize)
            );

            $(element).html(templateDyn);
            $compile(templateDyn)(element.scope());
          }
        }
    })
    .directive('dynamicFile', function($compile) {
        var template = '';
        return {
          restrict: 'A',
          scope: true,
          require: 'ngModel',
          link: function(scope, element, attr) {
            var s = scope;
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");

            var splitedNgModel = attr.ngModel.split('.');
            var datasource = splitedNgModel[0];
            var field = splitedNgModel[splitedNgModel.length-1];
            var number = Math.floor((Math.random() * 1000) + 20);
            var content = element.html();

            var maxFileSize = "";
            if (attr.maxFileSize)
              maxFileSize = attr.maxFileSize;

            var templateDyn    = '\
                                <div ng-show="!$ngModel$" ngf-drop="" ngf-drag-over-class="dragover">\
                                  <div class="btn" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.uploadFile(\'$ngModel$\', $file, \'uploadprogress$number$\')" ngf-max-size="$maxFileSize$">\
                                    $userHtml$\
                                  </div>\
                                  <div class="progress" data-type="bootstrapProgress" id="uploadprogress$number$" style="display:none">\
                                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:0%">\
                                      <span class="sr-only"></span>\
                                    </div>\
                                  </div>\
                                </div> \
                                <div ng-show="$ngModel$" class="upload-image-component-attribute"> \
                                  <div class="button button-assertive" style="float:right;" ng-if="$ngModel$" ng-click="$ngModel$=null"> \
                                    <span class="icon ion-android-close"></span> \
                                  </div> \
                                  <div> \
                                    <div ng-bind-html="cronapi.internal.generatePreviewDescriptionByte($ngModel$)"></div> \
                                    <a href="javascript:void(0)" ng-click="cronapi.internal.downloadFileEntityMobile($datasource$,\'$field$\')">download</a> \
                                  </div> \
                                </div> \
                                ';
            templateDyn = $(templateDyn
                .split('$ngModel$').join(attr.ngModel)
                .split('$datasource$').join(datasource)
                .split('$field$').join(field)
                .split('$number$').join(number)
                .split('$required$').join(required)
                .split('$userHtml$').join(content)
                .split('$maxFileSize$').join(maxFileSize)

            );

            $(element).html(templateDyn);
            $compile(templateDyn)(element.scope());
          }
        }
    })
    .directive('pwCheck', [function() {
      'use strict';
      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
          var firstPassword = '#' + attrs.pwCheck;
          elem.add(firstPassword).on('keyup', function() {
            scope.$apply(function() {
              var v = elem.val() === $(firstPassword).val();
              ctrl.$setValidity('pwmatch', v);
            });
          });
        }
      }
    }])

	.directive('qr', ['$window', function($window){
		return {
		  restrict: 'A',
		  require: '^ngModel',
		  template: '<canvas ng-hide="image"></canvas><img ng-if="image" ng-src="{{canvasImage}}"/>',
		  link: function postlink(scope, element, attrs, ngModel){
			if (scope.size === undefined  && attrs.size) {
			  scope.text = attrs.size;
			}
		  var getTypeNumeber = function(){
		  return scope.typeNumber || 0;
		};
		var getCorrection = function(){
		  var levels = {
			'L': 1,
			'M': 0,
			'Q': 3,
			'H': 2
		  };
		var correctionLevel = scope.correctionLevel || 0;
		  return levels[correctionLevel] || 0;
		};
		var getText = function(){
		  return ngModel.$modelValue || "";
		};
		var getSize = function(){
		  return scope.size || $(element).outerWidth();
		};
		var isNUMBER = function(text){
		  var ALLOWEDCHARS = /^[0-9]*$/;
		  return ALLOWEDCHARS.test(text);
		};
		var isALPHA_NUM = function(text){
		  var ALLOWEDCHARS = /^[0-9A-Z $%*+\-./:]*$/;
		  return ALLOWEDCHARS.test(text);
		};
		var is8bit = function(text){
		  for (var i = 0; i < text.length; i++) {
			var code = text.charCodeAt(i);
			if (code > 255) {
			  return false;
			}
		  }
		  return true;
		};
		var checkInputMode = function(inputMode, text){
		  if (inputMode === 'NUMBER' && !isNUMBER(text)) {
			throw new Error('The `NUMBER` input mode is invalid for text.');
		  }
		  else if (inputMode === 'ALPHA_NUM' && !isALPHA_NUM(text)) {
			throw new Error('The `ALPHA_NUM` input mode is invalid for text.');
		  }
		  else if (inputMode === '8bit' && !is8bit(text)) {
			throw new Error('The `8bit` input mode is invalid for text.');
		  }
		  else if (!is8bit(text)) {
			throw new Error('Input mode is invalid for text.');
		  }
		  return true;
		};
		var getInputMode = function(text){
		  var inputMode = scope.inputMode;
		  inputMode = inputMode || (isNUMBER(text) ? 'NUMBER' : undefined);
		  inputMode = inputMode || (isALPHA_NUM(text) ? 'ALPHA_NUM' : undefined);
		  inputMode = inputMode || (is8bit(text) ? '8bit' : '');
		  return checkInputMode(inputMode, text) ? inputMode : '';
		};
		var canvas = element.find('canvas')[0];
		var canvas2D = !!$window.CanvasRenderingContext2D;
		scope.TYPE_NUMBER = getTypeNumeber();
		scope.TEXT = getText();
		scope.CORRECTION = getCorrection();
		scope.SIZE = getSize();
		scope.INPUT_MODE = getInputMode(scope.TEXT);
		scope.canvasImage = '';
		var draw = function(context, qr, modules, tile){
		  for (var row = 0; row < modules; row++) {
			for (var col = 0; col < modules; col++) {
			  var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
				  h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));
			  context.fillStyle = qr.isDark(row, col) ? '#000' : '#fff';
			  context.fillRect(Math.round(col * tile), Math.round(row * tile), w, h);
			}
		  }
		};
		var render = function(canvas, value, typeNumber, correction, size, inputMode){
		  var trim = /^\s+|\s+$/g;
		  var text = value.replace(trim, '');
		  debugger;
		  var qr = new QRCode(typeNumber, correction, inputMode);
		  qr.addData(text);
		  qr.make();
		  var context = canvas.getContext('2d');
		  var modules = qr.getModuleCount();
		  var tile = size / modules;
		  canvas.width = canvas.height = size;
		  if (canvas2D) {
			draw(context, qr, modules, tile);
			scope.canvasImage = canvas.toDataURL() || '';
		  }
		};
		
		scope.$watch(function(){return ngModel.$modelValue}, function(value, old){
		if (value !== old) {
		  scope.text = ngModel.$modelValue;
		  scope.TEXT = getText();
		  scope.INPUT_MODE = getInputMode(scope.TEXT);
		  render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
		}
	  });
		render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
		}};
	  }])

    /**
     * Validação de campos CPF e CNPJ,
     * para utilizar essa diretiva, adicione o atributo valid com o valor
     * do tipo da validação (cpf ou cnpj). Exemplo <input type="text" valid="cpf">
     */
    .directive('valid', function() {
      return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
          var validator = {
            'cpf': CPF,
            'cnpj': CNPJ
          };

          ngModel.$validators[attrs.valid] = function(modelValue, viewValue) {
            var value = modelValue || viewValue;
            var fieldValid = validator[attrs.valid].isValid(value);
            if (!fieldValid) {
              element.scope().$applyAsync(function(){ element[0].setCustomValidity(element[0].dataset['errorMessage']); }) ;
            } else {
              element[0].setCustomValidity("");
            }
            return (fieldValid || !value);
          };
        }
      }
    })
	
	.directive('cronappSecurity', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var roles = [];
          if (scope.session && scope.session.roles) {
            roles = scope.session.roles.toLowerCase().split(",");
          }

          var perms = parsePermission(attrs.cronappSecurity);
          var show = false;
          var enabled = false;
          for (var i=0;i<roles.length;i++) {
            var role = roles[i].trim();
            if (role) {
              if (perms.visible[role]) {
                show = true;
              }
              if (perms.enabled[role]) {
                enabled = true;
              }
            }
          }

          if (!show) {
            $(element).hide();
          }

          if (!enabled) {
            $(element).find('*').addBack().attr('disabled', true);
          }
        }
      }
    })
	
	.directive('cronappStars', [function() {
      'use strict';
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelCtrl) {

          var $elem = $(elem);
          var $star = $($elem.children().get(0));
  
          $elem.html("");
          var stars = [];
          
          for (var i=1;i<=5;i++) {
            var clonned = $star.clone();
            $elem.append(clonned);
            
            clonned.attr("idx", i);
            clonned.click(function() {
              scope.$apply(function() {
                ngModelCtrl.$viewValue = parseInt($(this).attr("idx")); //set new view value
                ngModelCtrl.$commitViewValue();
         
              }.bind(this));
            });
            
            stars.push(clonned);
          }
          
          function changeStars(value) {
            for (var i=1;i<=5;i++) {
              stars[i-1].removeClass('ion-android-star-outline');
              stars[i-1].removeClass('ion-android-star');
              if (i <= value) {
                 stars[i-1].addClass('ion-android-star');  
              } else {
                 stars[i-1].addClass('ion-android-star-outline'); 
              }
            }
            
            return value;
          }
          
          ngModelCtrl.$parsers.push(changeStars);
          ngModelCtrl.$formatters.push(changeStars);
          
        }
      }
    }])
    
    .directive('cronappFilter', function() {
        var setFilterInButton = function($element, bindedFilter, operator) {
        var fieldset = $element.closest('fieldset');
        if (!fieldset)
          return;
        var button = fieldset.find('button[cronapp-filter]');
        if (!button)
          return;

        var filters = button.data('filters');
        if (!filters)
          filters = [];

        var index = -1;
        var ngModel = $element.attr('ng-model');
        $(filters).each(function(idx) {
          if (this.ngModel == ngModel)
            index = idx;
        });

        if (index > -1)
          filters.splice(index, 1);
        
        if (bindedFilter.length > 0) {
          var bindedFilterJson = {
            "ngModel" : ngModel,
            "bindedFilter" : bindedFilter
          };
          filters.push(bindedFilterJson);
        }
        button.data('filters', filters);
      }
      
      var makeAutoPostSearch = function($element, bindedFilter, datasource) {
        var fieldset = $element.closest('fieldset');
        if (fieldset && fieldset.length > 0) {
          var button = fieldset.find('button[cronapp-filter]');
          if (button && button.length > 0) {
            var filters = button.data('filters');
            if (filters && filters.length > 0) {
              bindedFilter = '';
              $(filters).each(function() {
                  bindedFilter += this.bindedFilter+";";
              });
            }
          }
        }
        datasource.search(bindedFilter);
      }
      
      var inputBehavior =function(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost) {
        var filterTemplate = '';
        var filtersSplited = attrs.cronappFilter.split(';');
        $(filtersSplited).each(function() {
          if (this.length > 0) {
            //Se for do tipo text passa parametro como like
            if (typeElement == 'text')
              filterTemplate += this + '@' + operator + '%{value}%;';
            //Senão passa parametro como valor exato
            else
              filterTemplate += this + operator + '{value};';
          }
        });
        if (filterTemplate.length > 0)
          filterTemplate = filterTemplate.substr(0, filterTemplate.length-1);
        else
          filterTemplate = '%{value}%';

        if (ngModelCtrl) {
          scope.$watch(attrs.ngModel, function(newVal, oldVal) {
            if (angular.equals(newVal, oldVal)) { return; }
            var eType = $element.data('type') || $element.attr('type');
            var value = ngModelCtrl.$modelValue;
            var datasource = eval(attrs.crnDatasource);

            if (value instanceof Date) {
              value = value.toISOString();
              if (eType == "date") {
                value = value + "@@date";
              }
              else if (eType == "time" || eType == "time-local") {
                value = value + "@@time";
              }
              else {
                value = value + "@@datetime";
              }
            }

            else if (typeof value == "number") {
              value = value + "@@number";
            }

            else if (typeof value == "boolean") {
              value = value + "@@boolean";
            }

            var bindedFilter = filterTemplate.split('{value}').join(value);
            if (ngModelCtrl.$viewValue.length == 0)
              bindedFilter = '';
            
            setFilterInButton($element, bindedFilter, operator);
            if (autopost)
              makeAutoPostSearch($element, bindedFilter, datasource);

          });
        }
        else {
          if (typeElement == 'text') {
            $element.on("keyup", function() {
              var datasource = eval(attrs.crnDatasource);
              var value = undefined;
              if (ngModelCtrl && ngModelCtrl != undefined)
                value = ngModelCtrl.$viewValue;
              else
                value = this.value;
              var bindedFilter = filterTemplate.split('{value}').join(value);
              if (this.value.length == 0)
                bindedFilter = '';

              setFilterInButton($element, bindedFilter, operator);
              if (autopost)
                makeAutoPostSearch($element, bindedFilter, datasource);
            });
          }
          else {
            $element.on("change", function() {
              var datasource = eval(attrs.crnDatasource);
              var value = undefined;
              var typeElement = $(this).attr('type');
              if (attrs.asDate != undefined)
                typeElement = 'date';

              if (ngModelCtrl && ngModelCtrl != undefined) {
                value = ngModelCtrl.$viewValue;
              }
              else {
                if (typeElement == 'checkbox')
                  value = $(this).is(':checked');
                else if (typeElement == 'date') {
                  value = this.value;
                  if (this.value.length > 0) {
                    var momentDate = moment(this.value, patternFormat(this));
                    value = momentDate.toDate().toISOString();
                  }
                }
                else
                  value = this.value;
              }
              var bindedFilter = filterTemplate.split('{value}').join(value);
              if (value.toString().length == 0)
                bindedFilter = '';

              setFilterInButton($element, bindedFilter, operator);
              if (autopost)
                makeAutoPostSearch($element, bindedFilter, datasource);
            });
          }
        }
      }
      
      var buttonBehavior = function(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost) {
        $element.on('click', function() {
          var $this = $(this);
          var datasourceName = '';
          if (attrs.crnDatasource)
            datasourceName = attrs.crnDatasource;
          else
            datasourceName = $element.parent().attr('crn-datasource')

          var filters = $this.data('filters');
          if (datasourceName && datasourceName.length > 0 && filters) {
            var bindedFilter = '';
            $(filters).each(function() {
                bindedFilter += this.bindedFilter+";";
            });
            
            var datasourceToFilter = eval(datasourceName);
            datasourceToFilter.search(bindedFilter);
          }
        });
      }
    
    return {
      restrict: 'A',
      require: '?ngModel',
      
      link: function(scope, element, attrs, ngModelCtrl) {
        var $element = $(element);
        var typeElement = $element.data('type') || $element.attr('type');
        if (attrs.asDate != undefined)
          typeElement = 'date';

        var operator = '=';
        if (attrs.cronappFilterOperator && attrs.cronappFilterOperator.length > 0)
          operator = attrs.cronappFilterOperator;

        var autopost = true;
        if (attrs.cronappFilterAutopost && attrs.cronappFilterAutopost == "false")
          autopost = false;

        if ($element[0].tagName == "INPUT")
          inputBehavior(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost);
        else
          buttonBehavior(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost);
      }
    }
  })  
	
}(app));
function maskDirectiveAsDate($compile, $translate) {
  return maskDirective($compile, $translate, 'as-date');
}

function maskDirectiveMask($compile, $translate) {
  return maskDirective($compile, $translate, 'mask');
}

function maskDirective($compile, $translate, attrName) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      if(attrName == 'as-date' && attrs.mask !== undefined)
        return;


      var $element = $(element);

      var type = $element.attr("type");

      if (type == "checkbox" || type == "password")
        return;

      $element.data("type", type);

      $element.attr("type", "text");

      if (ngModelCtrl) {
        ngModelCtrl.$formatters = [];
        ngModelCtrl.$parsers = [];
      }

      if (attrs.asDate !== undefined && type == 'text')
        type = "date";

      var textMask = true;

      var removeMask = false;

      var attrMask = attrs.mask || attrs.format;

      if (!attrMask) {
        attrMask = parseMaskType(type, $translate);
      } else {
        attrMask = parseMaskType(attrMask, $translate);
      }

      if (attrMask.endsWith(";0")) {
        removeMask = true;
      }

      var mask = attrMask.replace(';1', '').replace(';0', '').trim();
      if (mask == undefined || mask.length == 0) {
        return;
      }

      if (type == 'date' || type == 'datetime' || type == 'datetime-local' || type == 'month' || type == 'time' || type == 'time-local' || type == 'week') {
        var useUTC = type == 'date' || type == 'datetime' || type == 'time';
        if(type == 'date'){
           mask = moment.HTML5_FMT.DATE;
          $element.attr("type", "date");
        }
        else if(type == 'month'){
          mask = moment.HTML5_FMT.MONTH;
          $element.attr("type", "month");
        }else if( type == 'week'){
          mask = moment.HTML5_FMT.WEEK;
          $element.attr("type", "week");
        }else if(  type == 'datetime' || type == 'datetime-local' ){
          mask = moment.HTML5_FMT.DATETIME_LOCAL;
          $element.attr("type", "datetime-local");
        }else if( type == 'time' || type == 'time-local'  ){
          mask = moment.HTML5_FMT.TIME;
          $element.attr("type", "time");
        }
        
        if (ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {

            if(value){
              if(useUTC){
                return moment.utc(value).format(mask);
              }
              return moment(value).format(mask);
            }else{
              return null;
            }
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value) {
              if(useUTC){
                return moment.utc(value, mask).toDate(); 
              }
              return moment(value,mask).toDate();
            }
              return new Date(value);
          });
        }

      } else if (type == 'number' || type == 'money' || type == 'integer') {
        removeMask = true;
        textMask = false;

        var currency = mask.trim().replace(/\./g, '').replace(/\,/g, '').replace(/#/g, '').replace(/0/g, '').replace(/9/g, '');

        var prefix = '';
        var suffix = '';
        var thousands = '';
        var decimal = ',';
        var precision = 0;

        if (mask.startsWith(currency)) {
          prefix = currency;
        }

        else if (mask.endsWith(currency)) {
          suffix = currency;
        }

        var pureMask = mask.trim().replace(prefix, '').replace(suffix, '').trim();

        if (pureMask.startsWith("#.")) {
          thousands = '.';
        }
        else if (pureMask.startsWith("#,")) {
          thousands = ',';
        }

        var dMask = null;

        if (pureMask.indexOf(",0") != -1) {
          decimal = ',';
          dMask = ",0";
        }
        else if (pureMask.indexOf(".0") != -1) {
          decimal = '.';
          dMask = ".0";
        }

        if (dMask != null) {
          var strD = pureMask.substring(pureMask.indexOf(dMask) + 1);
          precision = strD.length;
        }


        var inputmaskType = 'numeric';

        if (precision == 0)
          inputmaskType = 'integer';

        var ipOptions = {
          'rightAlign':  (type == 'money'),
          'unmaskAsNumber': true,
          'allowMinus': true,
          'prefix': prefix,
          'suffix': suffix,
          'radixPoint': decimal,
          'digits': precision
        };

        if (thousands) {
          ipOptions['autoGroup'] = true;
          ipOptions['groupSeparator'] = thousands;
        }

        $(element).inputmask(inputmaskType, ipOptions);

        var unmaskedvalue = function() {
          $(this).data('rawvalue',$(this).inputmask('unmaskedvalue'));
        };
        $(element).off("keypress");
        scope.safeApply(function(){
          $(element).on('keyup',unmaskedvalue);
        });
        if (ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            if (value != undefined && value != null && value != '') {
              return format(mask, value);
            }
            return null;
          });
          ngModelCtrl.$parsers.push(function (value) {
            if (value != undefined && value != null && value != '') {
              var unmaskedvalue = $element.inputmask('unmaskedvalue');
              if (unmaskedvalue != '')
                return unmaskedvalue;
            }
            return null;
          });
        }
      }

      else if (type == 'text' || type == 'tel') {

        var options = {};
        if (attrs.maskPlaceholder) {
          options.placeholder = attrs.maskPlaceholder
        }

        $element.mask(mask, options);

        var unmaskedvalue = function() {
          if (removeMask)
            $(this).data('rawvalue',$(this).cleanVal());
        }
        $(element).on('keydown', unmaskedvalue).on('keyup', unmaskedvalue);

        if (removeMask && ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            if (value) {
              return $element.masked(value);
            }

            return null;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value) {
              return $element.cleanVal();
            }

            return null;
          });
        }
      }
    }
  }
}

function parseMaskType(type, $translate) {
  if (type == "datetime" || type == "datetime-local") {
    type = $translate.instant('Format.DateTime');
    if (type == 'Format.DateTime')
      type = 'DD/MM/YYYY HH:mm:ss'
  }
  else if (type == "date") {
    type = $translate.instant('Format.Date');
    if (type == 'Format.Date')
      type = 'DD/MM/YYYY'
  }
  else if (type == "time" || type == "time-local") {
    type = $translate.instant('Format.Hour');
    if (type == 'Format.Hour')
      type = 'HH:mm:ss'
  }
  else if (type == "month") {
    type = 'MMMM';
  }
  else if (type == "number") {
    type = $translate.instant('Format.Decimal');
    if (type == 'Format.Decimal')
      type = '0,00'
  }
  else if (type == "money") {
    type = $translate.instant('Format.Money');
    if (type == 'Format.Money')
      type = '#.#00,00'
  }
  else if (type == "integer") {
    type = '0';
  }
  else if (type == "week") {
    type = 'dddd';
  }
  else if (type == "tel") {
    type = '(00) 00000-0000;0';
  }
  else if (type == "text") {
    type = '';
  }
  return type;
}