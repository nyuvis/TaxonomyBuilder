/*global angular, console */
/*jslint nomen: true*/
var txServices = angular.module('txServices', ['elasticsearch']);
txServices.factory('db', function (esFactory) {
    'use strict';
    var self = {};

    self.params = function (params) {
        for (var p in params){
            self[p] = params[p];
        }
    }
    
    self.client = function () {
        if (self._client) {
            return self._client;
        }
        
        var host = "";
        if (self.user && self.user.length > 0) {
            host = "http://" + self.user + ":" + self.password + "@" + self.host;
        } else {
            host = "http://" + self.host;
        }
        
        
        self._client = esFactory({
            host: host,
            apiVersion: '1.4'
        });
        return self._client;
    };
    
    self.getKeyWords = function (query, exclude) {
        var exclude = "@.*|_link|";
        var q = {
            "fields": ["text"], 
            "query": {
                "query_string": {
                      "default_field": "text",
                      "query": "text: " + query
                    }
                }, 
            "highlight": {"fields": {"text": {}}}, 
            "aggs": {
                "NAME": {
                  "significant_terms": {
                    "field": "text",
                    "size": 100,
                    "exclude": exclude,
                      "gnd": {}
                  }
                }
            }
        }
        
        return self.client().search({
          index: self.index,
          type: self.type,
          size: 50,
          body: q
        });
    };
    
    return self;
});