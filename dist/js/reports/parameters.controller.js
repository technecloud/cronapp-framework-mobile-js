(function(){'use strict';function a(a,b,c,d,e){function f(a){c.openURLContent(a.data)}b.getDescription=function(a){var b=a.name;return a.description&&(b=a.description,-1<b.indexOf("{{")&&-1<b.indexOf("}}")&&(b=b.replace("{{","").replace("}}",""),b=window.cronapi.i18n.translate(b,[]))),b},b.cloneElement=function(a){return angular.copy(a)},b.isVisibleParam=function(a){if("DATA_LIMIT"===a.name)return!1;return!(""!==a.value)||!(""!==a.value)};var g=d.reportName.match(/\/(.*?)(.*?)(\.jrxml|\.report)/);b.report=d,b.report.name=g[2],b.htmlParameters=e,b.onPrint=function(){b.report.reportName.endsWith(".report")?c.openStimulsoftReport(b.report.contentData,b.report.parameters,b.report.datasourcesInBand):c.getPDFAsFile(b.report).then(f)},b.onCancel=function(){a.dismiss("cancel")}}angular.module("custom.controllers").controller("ParameterController",a).filter("trusted",["$sce",function(a){return function(b){return a.trustAsHtml(b)}}]).directive("compile",["$compile","$timeout",function(a,b){return{restrict:"A",link:function(c,d){b(function(){a(d.contents())(c)})}}}]).directive("formatDate",function(){return{require:"ngModel",link:function(a,b,c,d){d.$formatters.push(function(a){return a?new Date(a):null})}}}),a.$inject=["$modalInstance","$scope","ReportService","report","htmlParameters"]})();