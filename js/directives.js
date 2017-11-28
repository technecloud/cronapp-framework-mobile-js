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
	
}(app));
