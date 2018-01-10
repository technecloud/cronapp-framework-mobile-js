(function($app) {

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

  /**
   * Em todo elemento que possuir o atibuto as-date será
   * aplicado o componente Datetimepicker (http://eonasdan.github.io/bootstrap-datetimepicker/)
   *
   * O componente se adequa de acordo com o formato, definido através do atributo format
   * espeficado no elemento.
   * Para data simples use format="DD/MMM/YYYY", para data e hora use format="DD/MM/YYYY HH:mm:ss"
   *
   * @see http://eonasdan.github.io/bootstrap-datetimepicker/
   */
  app.directive('asDate', function() {
      return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
          if (!ngModel) {
            return;
          }

          var format = patternFormat(element);

          var options = {
            format: format,
            locale: 'pt-BR',
            showTodayButton: true,
            useStrict: true,
            tooltips: {
              today: 'Hoje',
              clear: 'Limpar seleção',
              close: 'Fechar',
              selectMonth: 'Selecionar mês',
              prevMonth: 'Mês anterior',
              nextMonth: 'Próximo mês',
              selectYear: 'Selecionar ano',
              prevYear: 'Ano anterior',
              nextYear: 'Próximo ano',
              selectDecade: 'Selecionar década',
              prevDecade: 'Década anterior',
              nextDecade: 'Próxima década',
              prevCentury: 'Século anterior',
              nextCentury: 'Próximo século'
            }
          };

          if (format != 'DD/MM/YYYY') {
            options.sideBySide = true;
          }

          element.datetimepicker(options);

          element.on('dp.change', function() {
            if ($(this).is(":visible"))
              scope.$apply(read);
          });

          ngModel.$render = function() {
            if (ngModel.$viewValue) {
              var dateInMilliseconds = parseInt(ngModel.$viewValue, 10);
              var momentDate = moment(dateInMilliseconds);
              if (momentDate.isValid()) {
                element.val(momentDate.format(patternFormat(element)));
              } else {
                element.val('');
              }
            } else {
              element.data("DateTimePicker").clear();
              element.val('');
            }
          }

          read();

          function read() {
            var value = element.val();
            var momentDate = moment(value, patternFormat(element));
            if (momentDate.isValid())
              ngModel.$setViewValue(momentDate.toDate());
          }
        }
      };
    })

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
              element[0].setCustomValidity(element[0].dataset['errorMessage']);
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
