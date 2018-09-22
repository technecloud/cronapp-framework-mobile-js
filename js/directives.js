(function($app) {

  var isoDate = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

  /**
   * Fun��o que retorna o formato que ser� utilizado no componente
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
   * Valida��o de campos CPF e CNPJ,
   * para utilizar essa diretiva, adicione o atributo valid com o valor
   * do tipo da valida��o (cpf ou cnpj). Exemplo <input type="text" valid="cpf">
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
          //Sen�o passa parametro como valor exato
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

  .directive('cronList', ['$compile', function($compile){
    'use strict';

    const TEMPLATE = '\
               <ion-list can-swipe="listCanSwipe"> \
            	   <ion-item class="item" ng-repeat="rowData in datasource"> \
              	   <div class="item-avatar"></div> \
              	 </ion-item> \
               </ion-list> \
               <ion-infinite-scroll></ion-infinite-scroll> \
               ';

    var getExpression = function(dataSourceName) {
      return 'rowData in '.concat(dataSourceName).concat('.data');
    }

    var buildFormat = function(column) {
      var result = '';

      if (column.format) {
        result = ' | mask: "' + column.format + '"';
      } else {
        switch (column.type) {
          case 'date' : result = ' | mask: "date"'; break;
          case 'datetime' : result = ' | mask: "datetime"'; break;
          case 'number': result = ' | mask: "number"'; break;
          case 'money' : result = ' | mask: "money"'; break;
        }
      }

      return result;
    }

    var addDefaultColumn = function(column, first) {
      var result = null;

      if (first) {
        result = '<h2>{{rowData.' + column.field + buildFormat(column) + '}}</h2>';
      } else {
        result = '<p>{{rowData.' + column.field + buildFormat(column) + '}}</p>';
      }

      return result;
    }

    var getEditCommand = function(dataSourceName) {
      return dataSourceName + '.startEditing(rowData)';
    }

    var addDefaultButton = function(dataSourceName, column) {
      const EDIT_TEMPLATE = '<ion-option-button class="button-positive" ng-click="' + getEditCommand(dataSourceName) + '"><i class="icon ion-edit"></i></ion-option-button>';
      const DELETE_TEMPLATE = '<ion-option-button class="button-assertive" ng-click="' + dataSourceName + '.remove(rowData)"><i class="icon ion-trash-a"></i></ion-option-button>';

      if (column.command == 'edit|destroy') {
        return EDIT_TEMPLATE.concat(DELETE_TEMPLATE);
      } else if (column.command == 'edit') {
        return EDIT_TEMPLATE;
      } else if (column.command == 'destroy') {
        return DELETE_TEMPLATE;
      }
    }

    var addImage = function(column) {
      return '<img data-ng-src="data:image/png;base64,{{rowData.' + column.field + '}}">';
    }

    var encodeHTML = function(value) {
      return value.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
    }

    var generateBlocklyCall = function(blocklyInfo) {
      var call;
      if (blocklyInfo.type == "client")  {
        var splitedClass = blocklyInfo.blocklyClass.split('/');
        var blocklyName = splitedClass[splitedClass.length-1];
        call = "blockly.js.blockly." + blocklyName;
        call += "." +  blocklyInfo.blocklyMethod;
        var params = "()";
        if (blocklyInfo.blocklyParams.length > 0) {
          params = "(";
          blocklyInfo.blocklyParams.forEach(function(p) {
            params += (p.value ? encodeHTML(p.value) : "''") + ",";
          }.bind(this))
          params = params.substr(0, params.length - 1);
          params += ")";
        }
        call += params;
      } else if (blocklyInfo.type == "server") {
        var blocklyName = blocklyInfo.blocklyClass + ':' + blocklyInfo.blocklyMethod;
        call = "cronapi.util.makeCallServerBlocklyAsync('"+blocklyName+"',null,null,";
        if (blocklyInfo.blocklyParams.length > 0) {
          blocklyInfo.blocklyParams.forEach(function(p) {
            call += (p.value ? encodeHTML(p.value) : "''") + ",";
          }.bind(this))
        }
        call = call.substr(0, call.length - 1);
        call += ")";
      }

      return call;
    }

    var addBlockly = function(column) {
      return '<ion-option-button class="button-dark" ng-click="'
          + generateBlocklyCall(column.blocklyInfo)
          + '"><i class="icon ion-navigate"></i></ion-option-button>';
    }

    var isImage = function(fieldName, schemaFields) {
      for (var i = 0; i < schemaFields.length; i++) {
        var field = schemaFields[i];
        if (fieldName == field.name) {
          return (field.type == 'Binary');
        }
      }

      return false;
    }

    var getSearchableList = function(dataSourceName, fieldName) {
      return '\
              <label class="item item-input"> <i class="icon ion-search placeholder-icon"></i> \
                <input type="text" ng-model="vars.__searchableList__" cronapp-filter="'+ fieldName +';" cronapp-filter-operator="" cronapp-filter-caseinsensitive="false" cronapp-filter-autopost="true" \
                crn-datasource="' + dataSourceName + '" placeholder="{{\'template.crud.search\' | translate}}"> \
              </label>\
             ';
    }

    return {
      restrict: 'E',
      link: function(scope, element, attrs, ngModelCtrl) {
        var optionsList = {};
        var dataSourceName = '';
        var content = '';
        var buttons = '';
        var image = '';
        try {
          optionsList = JSON.parse(attrs.options);
          dataSourceName = optionsList.dataSourceScreen.name;
          var dataSource = eval(optionsList.dataSourceScreen.name);
          var searchableField = null;
          var isNativeEdit = false;
          var addedImage = false;
          for (var i = 0; i < optionsList.columns.length; i++) {
            var column = optionsList.columns[i];
            if (column.visible) {
              if (column.field && column.dataType == 'Database') {
                if (!addedImage && isImage(column.field, optionsList.dataSourceScreen.entityDataSource.schemaFields)) {
                  image = addImage(column);
                  addedImage = true;
                } else {
                  content = content.concat(addDefaultColumn(column, (i == 0)));
                  if (column.filterable) {
                    searchableField = (searchableField != null) ? searchableField + ';' + column.field : column.field;
                  }
                }
              } else if (column.dataType == 'Command') {
                buttons = buttons.concat(addDefaultButton(dataSourceName, column));
                if ((column.command == 'edit') || (column.command == 'edit|destroy')) {
                  isNativeEdit = true;
                }
              } else if (column.dataType == 'Blockly') {
                buttons = buttons.concat(addBlockly(column));
              }
            }
          }
        } catch(err) {
          console.log('CronList invalid configuration! ' + err);
        }

        var templateDyn = null;
        if (searchableField) {
          templateDyn = $(getSearchableList(dataSourceName, searchableField) + TEMPLATE);
        } else {
          templateDyn = $(TEMPLATE);
        }
        $(element).html(templateDyn);

        var ionItem = $(element).find('ion-item');
        ionItem.attr('ng-repeat', getExpression(dataSourceName));

        if (isNativeEdit) {
          ionItem.attr('ng-click', getEditCommand(dataSourceName));
        }

        var ionAvatar = $(element).find('.item-avatar');
        ionAvatar.append(image);
        ionAvatar.append(content);
        ionAvatar.append(buttons);

        scope.nextPageInfinite = function() {
          dataSource.nextPage();
          scope.$broadcast('scroll.infiniteScrollComplete');
        }

        var infiniteScroll = $(element).find('ion-infinite-scroll');
        infiniteScroll.attr('on-infinite', 'nextPageInfinite()');
        infiniteScroll.attr('distance', '1%');

        $compile(templateDyn)(element.scope());
      }
    }
  }])

  .directive('cronInfiniteScroll', ['$compile', function($compile){
    'use strict';
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var dataSource = attrs.cronInfiniteScroll ? eval(attrs.cronInfiniteScroll) : attrs.crnDatasource ? eval(attrs.crnDatasource): undefined;
        if (dataSource) {
          scope.nextPageInfinite = function() {
            dataSource.nextPage();
            scope.$broadcast('scroll.infiniteScrollComplete');
          }

          var templateDyn = $('<ion-infinite-scroll></ion-infinite-scroll>');
          $(element).html(templateDyn);

          var infiniteScroll = $(element).find('ion-infinite-scroll');
          infiniteScroll.attr('on-infinite', 'nextPageInfinite()');
          infiniteScroll.attr('distance', '1%');

          $compile(templateDyn)(element.scope());
        }
      }
    }
  }])

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

        if(type == 'date'|| type == 'month'){
          $element.attr("type", "date");
        }else if( type == 'week'){
          $element.attr("type", "week");
        }else if(  type == 'datetime' || type == 'datetime-local' ){
          $element.attr("type", "datetime-local");
        }else if( type == 'time' || type == 'time-local'  ){
          $element.attr("type", "time");
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



app.kendoHelper = {
  getSchema: function(dataSource) {
    var parseAttribute = [
      { kendoType: "string", entityType: ["string", "character", "uuid", "guid"] },
      { kendoType: "number", entityType: ["integer", "long", "double", "int", "float", "bigdecimal", "single", "int32", "int64", "decimal"] },
      { kendoType: "date", entityType: ["date", "time", "datetime"] },
      { kendoType: "boolean", entityType: ["boolean"] }
    ];

    var parseType = function(type) {
      for (var i = 0; i < parseAttribute.length; i++) {
        if (parseAttribute[i].entityType.includes(type.toLocaleLowerCase()))
          return parseAttribute[i].kendoType;
      }
      return "string";
    };

    var schema = {
      model : {
        id : "__$id",
        fields: {}
      }
    };
    if (dataSource && dataSource.schemaFields) {
      dataSource.schemaFields.forEach(function(field) {
        schema.model.fields[field.name] = {
          type: parseType(field.type),
          editable: true,
          nullable: field.nullable,
          validation: { required: !field.nullable },
        }
      });
      schema.model.fields["__$id"] = {
        type: "string",
        editable: true,
        nullable: true,
        validation: { required: false }
      }
    }
    return schema;
  },
  getDataSource: function(dataSource, scope, allowPaging, pageCount, columns) {
    var schema = this.getSchema(dataSource);
    if (columns) {
      columns.forEach(function(c) {
        for (var key in schema.model.fields) {
          if (c.dataType == "Database" && c.field == key ) {
            schema.model.fields[key].nullable = !c.required;
            schema.model.fields[key].validation.required = c.required;
            break;
          }
        }
      });
    }

    var parseParameter = function(data) {
      for (var attr in data) {
        if (schema.model.fields.hasOwnProperty(attr)) {

          var schemaField = schema.model.fields[attr];
          if (schemaField.type == 'string' && data[attr] != undefined)
            data[attr] = data[attr] + "";
          else if (schemaField.type == 'number' && data[attr] != undefined)
            data[attr] = parseFloat(data[attr]);
          else if (schemaField.type == 'date' && data[attr] != undefined)
            data[attr] = '/Date('+data[attr].getTime()+')/';
          else if (schemaField.type == 'boolean') {
            if (data[attr] == undefined)
              data[attr] = false;
            else
              data[attr] = data[attr].toString().toLowerCase() == "true"?true:false;
          }

          //Significa que é o ID
          if (schema.model.id == attr) {
            //Se o mesmo for vazio, remover do data
            if (data[attr] != undefined && data[attr].toString().length == 0)
              delete data[attr];
          }
        }
      }
      return data;
    };

    var pageSize = 10;
    if (scope[dataSource.name])
      pageSize = scope[dataSource.name].rowsPerPage;

    //Quando não for data UTC
    var offsetMiliseconds = new Date().getTimezoneOffset() * 60000;
    function onRequestEnd(e) {
      if (e.response  && e.response.d ) {
        var items = null;
        if (e.response.d.results)
          items = e.response.d.results;
        else
          items = [e.response.d];

        if (this.group().length) {

          columns.forEach( function(c) {
            if (c.dataType == 'Database') {
              var notUseUTC = c.type == 'datetime-local' || c.type == 'month' || c.type == 'time-local' || c.type == 'week';
              if (notUseUTC) {
                for (var i = 0; i < items.length; i++) {
                  var gr = items[i];
                  if (c.field == gr.Member) {
                    gr.Key = gr.Key.replace(/\d+/,
                        function (n) { return parseInt(n) + offsetMiliseconds }
                    );
                  }
                  addOffset.bind(this)(gr.Items);
                }
              }
            }
          });
        } else {
          addOffset.bind(this)(items);
        }
      }
    }

    function addOffset(items) {
      for (var i = 0; i < items.length; i++) {
        if (columns) {
          columns.forEach( function(c) {
            if (c.dataType == 'Database') {
              var notUseUTC = c.type == 'datetime-local' || c.type == 'month' || c.type == 'time-local' || c.type == 'week';
              if (notUseUTC) {
                if (items[i][c.field]) {
                  items[i][c.field] = items[i][c.field].replace(/\d+/,
                      function (n) { return parseInt(n) + offsetMiliseconds }
                  );
                }
              }
            }
          });
        }

      }
    }

    var datasourceId = app.common.generateId();
    var datasource = {
      transport: {
        setActiveAndPost: function(e) {
          var cronappDatasource = this.options.cronappDatasource;
          scope.safeApply(cronappDatasource.updateActive(parseParameter(e.data)));
          cronappDatasource.active.__sender = datasourceId;
          cronappDatasource.postSilent(
              function(data) {
                this.options.enableAndSelect(e);
                e.success(data);
              }.bind(this),
              function(data) {
                this.options.enableAndSelect(e);
                e.error(data, data, data);
              }.bind(this)
          );
        },
        push: function(callback) {
          if (!this.options.dataSourceEventsPush && this.options.cronappDatasource) {
            this.options.dataSourceEventsPush = {
              create: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  var current = this.options.getCurrentCallbackForPush(callback, this.options.grid);
                  current.pushUpdate(data);
                }
                else
                  this.options.cronappDatasource.removeDataSourceEvents(this.options.dataSourceEventsPush);
              }.bind(this),
              update: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  var current = this.options.getCurrentCallbackForPush(callback, this.options.grid);
                  current.pushUpdate(data);
                }
                else
                  this.options.cronappDatasource.removeDataSourceEvents(this.options.dataSourceEventsPush);
              }.bind(this),
              delete: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  var current = this.options.getCurrentCallbackForPush(callback, this.options.grid);
                  current.pushDestroy(data);
                }
                else
                  this.options.cronappDatasource.removeDataSourceEvents(this.options.dataSourceEventsPush);
              }.bind(this),
              overRideRefresh: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  this.options.grid.dataSource.read();
                } else if (this.options.combobox) {
                  if (!this.options.initRead) {
                    this.options.combobox.value('');
                    if (this.options.ngModelCtrl) {
                      this.options.ngModelCtrl.$setViewValue(this.options.combobox.value());
                    }
                  } else {
                    this.options.initRead = false;
                  }

                  this.options.combobox.dataSource.read();
                }
              }.bind(this),
              read: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  this.options.fromRead = true;
                  this.options.grid.dataSource.read();
                }
              }.bind(this),
              memorycreate: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  var current = this.options.getCurrentCallbackForPush(callback, this.options.grid);
                  current.pushUpdate(data);
                }
                else
                  this.options.cronappDatasource.removeDataSourceEvents(this.options.dataSourceEventsPush);
              }.bind(this),
              memoryupdate: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  var current = this.options.getCurrentCallbackForPush(callback, this.options.grid);
                  current.pushUpdate(data);
                }
                else
                  this.options.cronappDatasource.removeDataSourceEvents(this.options.dataSourceEventsPush);
              }.bind(this),
              memorydelete: function(data) {
                if (this.options.isGridInDocument(this.options.grid)) {
                  var current = this.options.getCurrentCallbackForPush(callback, this.options.grid);
                  current.pushDestroy(data);
                }

              }.bind(this)
            };
            this.options.cronappDatasource.addDataSourceEvents(this.options.dataSourceEventsPush);
          }
        },
        read:  function (e) {

          var doFetch = false;
          try {
            var cronappDatasource = this.options.cronappDatasource;
            var grid = this.options.grid;

            if (!this.options.kendoCallback) {
              this.options.kendoCallback = e;
              doFetch = true;
            }
            else {
              if (this.options.fromRead) {
                this.options.kendoCallback.success(cronappDatasource.data);
              }
              else {
                doFetch = true;
              }
            }
          } finally {
            this.options.fromRead = false;
          }

          if (doFetch) {
            for (key in e.data)
              if(e.data[key] == undefined)
                delete e.data[key];
            var paramsOData = kendo.data.transports.odata.parameterMap(e.data, 'read');
            var orderBy = '';

            if (this.options.grid) {
              this.options.grid.dataSource.group().forEach(function(group) {
                orderBy += group.field +" " + group.dir + ",";
              });
            }
            if (orderBy.length > 0) {
              orderBy = orderBy.substr(0, orderBy.length-1);
              if (paramsOData.$orderby)
                paramsOData.$orderby =  orderBy + "," + paramsOData.$orderby;
              else
                paramsOData.$orderby = orderBy;
            }

            var cronappDatasource = this.options.cronappDatasource;
            cronappDatasource.rowsPerPage = e.data.pageSize;
            cronappDatasource.offset = (e.data.page - 1);

            //Significa que quer exibir todos
            if (!e.data.pageSize) {
              cronappDatasource.offset = undefined
              delete paramsOData.$skip;
              if (this.options.grid) {
                //Se houver grade associado, e a pagina não for a primeira, cancela a chamada atual, e faz novamente selecionando a pagina 1
                if (this.options.grid.dataSource.page() != 1) {
                  this.options.grid.dataSource.page(1);
                  e.error("canceled", "canceled", "canceled");
                  return;
                }
              }
            }

            var fetchData = {};
            fetchData.params = paramsOData;
            var append = false;
            if (dataSource.append) {
              append = dataSource.append;
            }
            cronappDatasource.append = append;
            cronappDatasource.fetch(fetchData, {
              success:  function(data) {
                e.success(data);
              },
              canceled:  function(data) {
                e.error("canceled", "canceled", "canceled");
              }
            }, append);
          }

        },
        update: function(e) {
          this.setActiveAndPost(e);
        },
        create: function (e) {
          this.setActiveAndPost(e);
        },
        destroy: function(e) {
          cronappDatasource = this.options.cronappDatasource;
          cronappDatasource.removeSilent(e.data,
              function(data) {
                e.success(data);
              },
              function(data) {
                e.error("canceled", "canceled", "canceled");
              }
          );
        },
        batch: function (e) {
        },
        options: {
          fromRead: false,
          disableAndSelect: function(e) {
            if (this.isGridInDocument(this.grid)) {
              this.grid.select(e.container);
              this.grid.options.selectable = false;
              if (this.grid.selectable && this.grid.selectable.element) {
                this.grid.selectable.destroy();
                this.grid.selectable = null;
              }
            }
          },
          enableAndSelect: function(e) {
            if (this.isGridInDocument(this.grid)) {
              this.grid.options.selectable = "row";
              this.grid._selectable();
              this.grid.select(e.container);
            }
          },
          selectActiveInGrid: function(data) {
            //Verifica se já existe a grid
            if (this.isGridInDocument(this.grid)) {
              //Verifica se tem a opção selecionavel setada e se tem registros
              if (this.grid.selectable && this.grid.dataItems().length > 0) {
                //Se já existir o active setado, verifica se tem na grade
                if (this.cronappDatasource.active && this.cronappDatasource.active.__$id) {
                  var items = this.grid.dataItems();
                  var idxSelected = -1;
                  for (var idx = 0; idx < items.length; idx++) {
                    if (this.cronappDatasource.active.__$id == items[idx].__$id) {
                      idxSelected = idx;
                      break;
                    }
                  }
                  if (idxSelected >-1)
                    this.grid.select(this.grid.table.find('tr')[idxSelected]);
                }
              }
            }
          },
          isGridInDocument: function(grid) {
            if (!grid) return false;
            //Se não tiver element, significa que é
            //Verifica se a grade ainda existe
            return ($(document).has(grid.element[0]).length);
          },
          getCurrentCallbackForPush: function(callback, grid) {
            if (callback)
              return callback;
            return grid;
          },
          cronappDatasource: scope[dataSource.name]
        }
      },
      pageSize: pageSize,
      serverPaging: true,
      serverFiltering: true,
      serverSorting: true,
      batch: false,
      schema: schema,
      requestEnd: onRequestEnd
    };

    datasource.schema.total = function(){
      return datasource.transport.options.cronappDatasource.getRowsCount();
    };
    return datasource;
  },
  getEventReadCombo: function (e) {
    for (key in e.data) {
      if(e.data[key] == undefined) {
        delete e.data[key];
      }
    }
    var paramsOData = kendo.data.transports.odata.parameterMap(e.data, 'read');

    var cronappDatasource = this.options.cronappDatasource;
    cronappDatasource.rowsPerPage = e.data.pageSize;
    cronappDatasource.offset = (e.data.page - 1);

    if (!e.data.filter) {
      cronappDatasource.append = false;
    }

    var self = this;
    var silentActive = true;
    var fetchData = {};
    fetchData.params = paramsOData;
    cronappDatasource.fetch(fetchData, {
          success:  function(data) {
            if (e.success) {
              e.success(data);
              if (self.options.combobox.element[0].id) {
                var expToFind = " .k-animation-container";
                var x = angular.element($(expToFind));
                self.options.$compile(x)(self.options.scope);
              }
            }
          },
          canceled:  function(data) {
            if (e.success) {
              e.error("canceled", "canceled", "canceled");
            }
          }
        },
        cronappDatasource.append
    );
  },
  getConfigCombobox: function(options, scope) {
    var dataSource = {};

    var valuePrimitive = false;
    var dataSource = {};
    if (options && (!options.dynamic || options.dynamic=='false')) {
      valuePrimitive = true;
      options.dataValueField = 'key';
      options.dataTextField = 'value';
      dataSource.data = (options.staticDataSource == null ? undefined : options.staticDataSource);
      for (i = 0; i < dataSource.data.length; i++) {
        dataSource.data[i].key = eval(dataSource.data[i].key);
      }
    } else if (options.dataSourceScreen.entityDataSource) {
      options.dataSourceScreen.entityDataSource.append = true;
      dataSource = app.kendoHelper.getDataSource(options.dataSourceScreen.entityDataSource, scope, true, options.dataSourceScreen.rowsPerPage);
      dataSource.transport.read = app.kendoHelper.getEventReadCombo;
      valuePrimitive = (options.valuePrimitive == null ? false : (typeof options.valuePrimitive == 'string' ? options.valuePrimitive == 'true' : options.valuePrimitive));
    }

    if (!options.dataValueField || options.dataValueField.trim() == '') {
      options.dataValueField = (options.dataTextField == null ? undefined : options.dataTextField);
    }

    var getFieldType = function(field) {
      var fields = options.dataSourceScreen.entityDataSource.schemaFields;
      for (count = 0; count < fields.length; count++) {
        if (field == fields[count].name) {
          return fields[count].type.toLowerCase();
          break;
        }
      }

      return null;
    }

    if (!options.template && options.format) {
      options.template = "#= useMask(" + options.dataTextField + ",'" + options.format + "','" + getFieldType(options.dataTextField) + "') #";
    }

    if (!options.valueTemplate && options.format) {
      options.valueTemplate = "#= useMask(" + options.dataTextField + ",'" + options.format + "') #";
    }

    var config = {
      dataTextField: (options.dataTextField == null ? undefined : options.dataTextField),
      dataValueField: (options.dataValueField == null ? undefined : options.dataValueField),
      dataSource: dataSource,
      headerTemplate: (options.headerTemplate == null ? undefined : options.headerTemplate),
      template: (options.template == null ? undefined : options.template),
      placeholder: (options.placeholder == null ? undefined : options.placeholder),
      footerTemplate: (options.footerTemplate == null ? undefined : options.footerTemplate),
      filter: (options.filter == null ? undefined : options.filter),
      valuePrimitive : valuePrimitive,
      optionLabel : (options.optionLabel == null ? undefined : options.optionLabel),
      valueTemplate : (options.valueTemplate == null ? undefined : options.valueTemplate),
      suggest: true
    };

    return config;
  },
  getConfigDate: function(translate, options) {
    var config = {};

    if (config) {
      var formatCulture = function(culture) {
        culture = culture.replace(/_/gm,'-');
        var parts = culture.split('-');
        parts[parts.length - 1] = parts[parts.length - 1].toUpperCase();
        return parts.join('-');
      }

      var formatKendoMask = function(mask) {
        if (mask) {
          mask = mask.replace(/:MM/gm,':mm');
          mask = mask.replace(/:M/gm,':m');
          mask = mask.replace(/S/gm,'s');
          mask = mask.replace(/D/gm,'d');
          mask = mask.replace(/Y/gm,'y');
        }

        return mask;
      }

      var formatMomentMask = function(type, mask) {
        if (mask == null) {
          mask = parseMaskType(type, translate)
        }

        return mask;
      }

      var animation = {};
      if (options.animation) {
        try {
          animation = JSON.parse(options.animation);
        } catch(err) {
          console.log('DateAnimation invalid configuration! ' + err);
        }
      }

      var momentFormat = formatMomentMask(options.type, options.format);
      var format = formatKendoMask(momentFormat);

      var timeFormat = formatKendoMask(options.timeFormat);
      var culture = formatCulture(translate.use());

      config = {
        value: null,
        format: format,
        timeFormat: timeFormat,
        momentFormat: momentFormat,
        culture: culture,
        type: (options.type == null ? undefined : options.type),
        weekNumber: (options.weekNumber  == null ? undefined : options.weekNumber),
        dateInput: (options.dateInput == null ? undefined : options.dateInput),
        animation: animation,
        footer: (options.footer == null ? undefined : options.footer),
        start: (options.start == null ? undefined : options.start),
        depth: (options.start == null ? undefined : options.start)
      }
    }

    return config;
  },
  buildKendoMomentPicker : function($element, options, scope, ngModelCtrl) {
    var useUTC = options.type == 'date' || options.type == 'datetime' || options.type == 'time';

    if (!$element.attr('from-grid')) {
      var onChange = function() {
        var value = $element.val();
        if (!value || value.trim() == '') {
          if (ngModelCtrl)
            ngModelCtrl.$setViewValue('');
        } else {
          var momentDate = null;

          if (useUTC) {
            momentDate = moment.utc(value, options.momentFormat);
          } else {
            momentDate = moment(value, options.momentFormat);
          }

          if (ngModelCtrl && momentDate.isValid()) {
            ngModelCtrl.$setViewValue(momentDate.toDate());
            $element.data('changed', true);
          }
        }
      }

      if (scope) {
        options['change'] = function() {
          scope.$apply(function () {
            onChange();
          });
        };
      } else {
        options['change'] = onChange;
      }
    }


    if (options.type == 'date') {
      return $element.kendoDatePicker(options).data('kendoDatePicker');
    } else if (options.type == 'datetime' || options.type == 'datetime-local') {
      return $element.kendoDateTimePicker(options).data('kendoDateTimePicker');
    } else if (options.type == 'time' || options.type == 'time-local') {
      return $element.kendoTimePicker(options).data('kendoTimePicker');
    }
  },
  getConfigSlider: function(options) {
    var config = {
      increaseButtonTitle: options.increaseButtonTitle,
      decreaseButtonTitle: options.decreaseButtonTitle,
      dragHandleTitle: options.dragHandleTitle
    }

    try {
      config['min'] = options.min ? parseInt(options.min) : 1;
      config['max'] = options.max ? parseInt(options.max) : 1;
      config['smallStep'] = options.smallStep ? parseInt(options.smallStep) : 1;
      config['largeStep'] = options.largeStep ? parseInt(options.largeStep) : 1;
    } catch(err) {
      console.log('Slider invalid configuration! ' + err);
    }

    return config;
  },
  getConfigSwitch: function(options) {
    var config = {
      onLabel: (options.onLabel == null ? undefined : options.onLabel),
      offLabel: (options.offLabel == null ? undefined : options.offLabel)
    }

    return config;
  },
  getConfigBarcode: function(options) {
    var config = {
      type: (options.type == null ? undefined : options.type),
      width: (options.width == null ? undefined : parseInt(options.width)),
      height: (options.height == null ? undefined : parseInt(options.height))
    }

    if (!config.type) {
      config.type = 'EAN8';
    }

    return config;
  },
  getConfigQrcode: function(options) {
    var config = {
      errorCorrection: (options.errorCorrection == null ? undefined : options.errorCorrection),
      size: (options.size == null ? undefined : parseInt(options.size)),
      color: (options.color == null ? undefined : options.color)
    }

    if (options.borderColor || options.borderSize) {
      config['border'] = {
        size: (options.size == null ? undefined : parseInt(options.size)),
        color: (options.color == null ? undefined : options.color)
      }
    }

    return config;
  }
};

window.useMask = function(value, format, type) {
  var mask = '';
  format = format == 'null' || format == 'undefined' ? undefined : format;

  var resolvedValue = value;
  var resolvedType = format || type;

  if (value != null && value != undefined) {
    if (value instanceof Date) {
      resolvedValue = '"'+value.toISOString()+'"';
    }

    else if (typeof value == 'number') {
      resolvedValue = value;
    }

    else {
      resolvedValue = '"'+value+'"';
    }

    mask = '{{ ' + resolvedValue + '  | mask:"' + resolvedType + '"}}';
  }

  return mask;
};