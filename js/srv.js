/*global angular, console */
/*jslint nomen: true*/
var txServices = angular.module('txServices', ['elasticsearch']);
txServices.factory('db', function (esFactory) {
    'use strict';
    var self = {};

    self.params = function (params) {
        console.log(params);
        Object.keys(params).forEach(function (p) {
            self[p] = params[p];
        });
      
    };
    
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
        exclude = exclude || "";
        exclude += "@.*|_link|";
        exclude += self.getWordsFromQuery(query).join("|");
        console.log(exclude);
        var q = {
            "fields": ["text"],
            "query": {
                "query_string": {
                    "default_field": "text",
                    "query": query,
                    default_operator: "AND" 
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
        };
        
        return self.client().search({
            index: self.index,
            type: self.type,
            size: 200,
            body: q
        });
    };
    
    self.getDocuments = function (query) {
        var q = {
            "fields": ["text"],
            "query": {
                "query_string": {
                    "default_field": "text",
                    "query": query,
                    default_operator: "AND" 
                }
            },
            "highlight": {"fields": {"text": {}}}
        };
        
        return self.client().search({
            index: self.index,
            type: self.type,
            size: 200,
            body: q
        });
    };
    
    self.getWordsFromQuery = function (query) {
        var ignore = ["and", "or", "not"],
            replace = ["+", "-", "~"],
            result = [];
        
        query = query.toLowerCase();
        query.split(' ').forEach(function (word) {
            word = word.replace(/\+|\-|\~|\"/i, "");
            if (ignore.indexOf(word) === -1) {
                result.push(word);
            }
        });
        return result;
    };
    
    return self;
});