/*global tx*/
tx.directive("document", function () {
    'use strict';
    return {
        restrict: "EA",
        templateUrl: "templates/document.html",
        scope: {
            doc: '=',
            data: '='
        },
        link: function (scope, elem, attrs) {
            
        }
    };
});
             