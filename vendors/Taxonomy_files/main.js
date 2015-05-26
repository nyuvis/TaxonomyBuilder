/*global angular, console, d3, Autolinker */
var primary = "#489BD5";
var Secondary = "#B3D548";
var tx = angular.module('tx', ['ngSanitize', 'txServices']);
var log = console.log;

tx.controller('txCtrl', function ($scope, db) {
    'use strict';
    /*Paramters----------------------------------------*/
    $scope.glyphs = ["word", "vennGlyph", "paralelBar", "horizontalBar", "slider", "smallVennGlyph", "slider2"];
    $scope.selectedGlyph = $scope.glyphs[6];
    
    /*State--------------------------------------------*/
    $scope.state = {pool:[], ignored: []};
    $scope.data = {stats: {}};
    var state = $scope.state,
        data = $scope.data,
        stats = $scope.data.stats;
    
    /*Actions - Data------------------------------------------*/
    $scope.doSearch = function () {
        db.getKeyWords(state.query).then(function (result) {
            var i;
            data.stats.count = result.aggregations.NAME.doc_count;
            data.keywords = result.aggregations.NAME.buckets;
            data.topicDocuments = result.hits.hits;
            $scope.updateStats();
            for (i = 0; i < data.topicDocuments.length; i++) {
                var doc = data.topicDocuments[i],
                    linkedText = Autolinker.link(doc.highlight.text[0]);
                
                if (linkedText) {
                    doc.highlight.text[0] = linkedText;
                }
            }
        });
    };
    
    $scope.updateStats = function () {
        data.stats.globalCount = 8089872;
        data.stats.maxBg_count = d3.max(data.keywords, function (d) {return d.bg_count; });
    };
    
    $scope.addToPool = function(word){
        state.pool.push(word);
        var idxAdding = data.keywords.findIndex(function(w) {return w.key == word})
        data.keywords.splice(idxAdding, 1);
        $scope.updateStats();
    }
    
    $scope.ignoreWord = function (word) {
        state.ignored.push(word);
        var idxAdding = data.keywords.findIndex(function(w) {return w.key == word})
        data.keywords.splice(idxAdding, 1);
        $scope.updateStats();
    }
      
    /*Actions General -----------------------------------------*/
    $scope.init = function () {
        db.params({
            host: "vgc.poly.edu/projects/r2sense",
            user: "user",
            password: "123456",
            index: "twitter2",
            type: "status"
        });
        
        state.query = 'violence';
        $scope.doSearch();
    };
});



tx.directive('ngEnter', function () {
    'use strict';
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

tx.directive('txDrag', function () {
    'use strict';
    return function (scope, element, attrs) {
        attrs.$set("draggable", true);
        
        element.bind("dragstart", function(event){
            var keyword = scope.$eval(attrs.txDrag);
            event.dataTransfer.setData('keyword', keyword.key);
            console.log("Dragining: " + keyword.key);
        })
    };
});

tx.directive('txDrop', function () {
    'use strict';
    return function (scope, element, attrs) {
        element.bind("dragover", function(e) {
            e.preventDefault(); 
            //e.stopPropagation(); 
            e.dataTransfer.dropEffect = 'move';
            return false;
        });
        
        element.bind("dragenter", function(e) {
          angular.element(e.target).addClass('title-over');
        });

        element.bind("dragleave", function(e) {
          angular.element(e.target).removeClass('title-over'); 
        });
        
        
        element.bind("drop", function(e) {
            e.preventDefault(); 
            angular.element(e.target).removeClass('title-over'); 
            var keyword = e.dataTransfer.getData("keyword");
            var func = scope.$eval(attrs.txDrop)
            scope.$apply(function() {func(keyword)});
        });
    };
});
