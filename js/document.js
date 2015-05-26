tx.directive("document", function() {
    return{
        restrict: "EA",
        templateUrl: "templates/document.html",
        scope: {
            doc: '=',
            data: '='
        },
        link: function(scope, elem, attrs){
            
        }
    }
});
             