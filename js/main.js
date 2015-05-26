/*global angular, console */
var primary = "#489BD5";
var Secondary = "#B3D548"; 
var tx = angular.module('tx', ['ngSanitize', 'txServices']);
var log = console.log;

tx.controller('txCtrl', function ($scope, db) {
    'use strict';
    /*Paramters----------------------------------------*/
    $scope.glyphs = ["word","vennGlyph","paralelBar", "horizontalBar", "slider", "smallVennGlyph", "slider2"];
    $scope.selectedGlyph = $scope.glyphs[6];
    
    /*State--------------------------------------------*/
    $scope.state = {};
    $scope.data = {stats: {}};
    var state = $scope.state;
    var data = $scope.data;
    var stats = $scope.data.stats;
    /*Actions------------------------------------------*/
    $scope.doSearch = function () {
        db.getKeyWords(state.query).then(function(result){
            data.stats.count = result.aggregations.NAME.doc_count;
            data.keywords = result.aggregations.NAME.buckets;
            data.topicDocuments = result.hits.hits;
            $scope.updateStats();
        });
    };
    
    $scope.updateStats = function() {
        data.stats.globalCount = 8089872;
        data.stats.maxBg_count = d3.max(data.keywords, function(d){return d.bg_count;});
    }
    
    $scope.init = function(){
        db.params({
            host: "vgc.poly.edu/projects/r2sense",
            user: "user",
            password: "123456",
            index: "twitter2",
            type: "status"
        });
        
        state.query = 'violence';
        $scope.doSearch();
    }
    
});



tx.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
