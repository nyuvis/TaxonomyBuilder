/*global tx, d3, venn, primary, Secondary*/
/*jslint evil: true */
tx.directive("keyword", function () {
    'use strict';
    return {
        restrict: "EA",
        scope: {
            word: '=',
            data: '=',
            glyph: '='
        },
        link: function (scope, elem, attrs) {
            var element = d3.select(elem[0]),
                li = d3.select(elem[0].parentNode);
            li.attr("class", "glyp_" + scope.glyph);
            eval(scope.glyph + "(element, li, scope.word, scope.data)");
            scope.$watch(function () {return scope.glyph; }, function () {
                element.text("");
                li.attr("class", "glyp_" + scope.glyph);
                eval(scope.glyph + "(element, li, scope.word, scope.data)");
            });
            
            scope.$watch(function () {return scope.data.keywords.length; }, function () {
                element.text("");
                li.attr("class", "glyp_" + scope.glyph);
                eval(scope.glyph + "(element, li, scope.word, scope.data)");
            });
        }
    };
});

function wordGlyph(element, li, word, data) {
    'use strict';
    var max = Math.max(data.stats.count, data.stats.maxBg_count),
        sizeScale = d3.scale.linear().range([14, 40]).domain([1, max]),
        inColorScale = d3.scale.linear().range([primary, "#c9c986", "#d7191c", "#d7191c"]).domain([0, 0.05, 0.80, 1]),
        propTopic = word.doc_count / data.stats.count;
    element.text(word.key).style({
        "font-size": sizeScale(word.bg_count) + "px",
        color: inColorScale(propTopic)
    });
}
             
function vennGlyph(element, li, word, data) {
    'use strict';
    var width = 80,
        height = 120,
    
        gliphy = element.append("svg")
            .attr("width", width)
            .attr("height", width),
    
    /*Arc Score ------------------------------*/
        radius = Math.min(width, height) / 2,
        cValue = function (d) { return d.score; },
        color = d3.scale.linear()
            .range(['#de5139', '#ede5a4', '#769517'])
            .domain([0, 0.5, 1]),
        anScore = (word.score * 360),

        scoreArc = d3.svg.arc()
            .innerRadius(radius - 6)
            .outerRadius(radius - 2)
            .startAngle(0)
            .endAngle(-anScore * (Math.PI / 180)),

        scoreArcBase = d3.svg.arc()
            .innerRadius(radius - 6)
            .outerRadius(radius - 2)
            .startAngle(0)
            .endAngle(360 * (Math.PI / 180)),
        
        sets = [
            {sets: ['word'], size:  word.bg_count},
            {sets: ['topic'], size: data.stats.count},
            {sets: ['word', 'topic'], size: word.doc_count}
        ],

        chart = venn.VennDiagram()
            .width(width)
            .height(width),
        
        label;
    
    gliphy.append("g")
        .attr("transform", "translate(0,0)")
        .datum(sets).call(chart);

    gliphy.append("path")
        .attr("class", "scoreArcBase")
        .attr("d", scoreArcBase)
        .attr("transform", "translate(" + radius + "," + radius + ")")
        .style({fill: "#eee"});

    gliphy.append("path")
        .attr("class", "scoreArc")
        .attr("d", scoreArc)
        .style("fill", function (d) { return color(cValue(word)); })

        .attr("transform", "translate(" + radius + "," + radius + ")");
    
    /*Venn ---------------------------------------*/
    gliphy.selectAll(".venn-circle path")
        .style("stroke", "#aaa");
    
    gliphy.selectAll(".venn-circle text").remove();
    
    /*Label --------------------------------------*/
    label = element
        .append("h1")
        .attr("title", word.key)
        .style({
            'font-size': "12px",
            'font-weight': "normal",
            margin: "0px",
            padding: "0px",
            color: "#226695"
        })
        .text(word.key);
}

function smallVennGlyph(element, li, word, data) {
    'use strict';
    var width = 60,
        height = 50,
        sets,
        chart,
        veen,
        label,
    
        gliphy = element.append("svg")
            .attr("width", width)
            .attr("height", height);
    
        
    
    /*Venn ---------------------------------------*/
    sets = [
        {sets: ['word'], size:  word.bg_count},
        {sets: ['topic'], size: data.stats.count},
        {sets: ['word', 'topic'], size: word.doc_count}
    ];

    chart = venn.VennDiagram()
        .width(width)
        .height(width);
    veen = gliphy.append("g")
        .attr("transform", "translate(0,0)")
        .datum(sets).call(chart);
    
    gliphy.selectAll(".venn-circle path")
        .style("stroke", "#aaa");
    
    gliphy.selectAll(".venn-circle text").remove();
    
    /*Label --------------------------------------*/
    label = element
        .append("h1")
        .attr("title", word.key)
        .style({
            'font-size': "14px",
            'font-weight': "normal",
            margin: "0px",
            padding: "0px",
            color: "#226695"
        })
        .text(word.key);
}

function paralelBar(element, li, word, data) {
    'use strict';
    var width = 80,
        height = 120,
    
        glyph = element.append("svg")
            .attr("width", width)
            .attr("height", width),
    
        size = 2,
    
        propInside = word.doc_count / data.stats.count,
        propOutside = word.bg_count / data.stats.globalCount,
        inScale = d3.scale.linear().range([width - size, size]).domain([0, 1]),
        label;
    
    glyph.append("circle")
        .attr("cx", size)
        .attr("cy", inScale(propInside))
        .attr("r",  size);
    
    glyph.append("circle")
        .attr("cx", (width - size) + "px")
        .attr("cy", inScale(propOutside))
        .attr("r", "2px");
     
    glyph.append("line")
        .attr("x1", size)
        .attr("y1", inScale(propInside))
        .attr("x2", (width - size))
        .attr("y2", inScale(propOutside))
        .style({stroke: "black", "stroke-width": 1});
    
    label = element
        .append("h1")
        .attr("title", word.key)
        .style({
            'font-size': "12px",
            'font-weight': "normal",
            margin: "0px",
            padding: "0px",
            color: "#226695"
        })
        .text(word.key);
}


function horizontalBar(element, li, word, data) {
    'use strict';
    var width = 80,
        height = 120,
        
        propInside = word.doc_count / data.stats.count,
        propOutside = word.bg_count / data.stats.globalCount,
   
        inScale = d3.scale.linear().range([0, width / 2]).domain([0, 1]),
        outScale = d3.scale.linear().range([0, width / 2]).domain([0, data.stats.maxBg_count]),
    
        label = element
            .append("h1")
            .attr("title", word.key)
            .style({
                'font-size': "14px",
                'font-weight': "normal",
                margin: "0px",
                padding: "0px",
                color: "#226695"
            })
            .text(word.key),
        
        glyph = element.append("svg")
            .attr("width", width)
            .attr("height", width);
     
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", inScale(propInside))
        .attr("x", width / 2 - inScale(propInside))
        .attr("fill", primary);
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", outScale(word.bg_count))
        .attr("fill", Secondary)
        .attr("x", width / 2);
}

function slider(element, li, word, data) {
    'use strict';
    var width = 140,
        height = 140,
        tpScale,
    
        propInside = word.doc_count / word.bg_count,
        propTopic = word.doc_count / data.stats.count,

        inScale = d3.scale.linear().range([0, width]).domain([0, 1]),
        outScale = d3.scale.linear().range([0, width]).domain([0, word.bg_count]),

        label = element
            .append("h1")
            .attr("title", word.key)
            .style({
                'font-size': "14px",
                'font-weight': "normal",
                margin: "0px",
                padding: "0px",
                color: "#226695"
            })
            .text(word.key),

        glyph = element.append("svg")
            .attr("width", width)
            .attr("height", width),
        
        max = Math.max(data.stats.count, data.stats.maxBg_count);
         
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", outScale(word.bg_count))
        .attr("fill", "#e3e8d2")
        .attr("x", 0)
        .attr("y", 6);
    
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", inScale(propInside))
        .attr("x", 0)
        .attr("y", 6)
        .attr("fill", primary);
    
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", width)
        .attr("fill", "hsl(32, 100%, 87%)")
        .attr("y", 0)
        .attr("x", 0);
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", inScale(propTopic))
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", primary);
    
    if (word.bg_count > data.stats.count) {
        
        tpScale = d3.scale.linear().range([0, width]).domain([0, max]);
        
        glyph.append("rect")
            .attr("height", 5)
            .attr("width", tpScale(word.bg_count))
            .attr("x", 0)
            .attr("y", 20)
            .attr("fill", Secondary);
        
        glyph.append("rect")
            .attr("height", 5)
            .attr("width", tpScale(data.stats.count))
            .attr("x", 0)
            .attr("y", 25)
            .attr("fill", "#FF9203");
        
    } else {
        
        tpScale = d3.scale.linear().range([0, width]).domain([0, max]);
        
        glyph.append("rect")
            .attr("height", 5)
            .attr("width", tpScale(data.stats.count))
            .attr("x", 0)
            .attr("y", 25)
            .attr("fill", "#FF9203");
        
        glyph.append("rect")
            .attr("height", 5)
            .attr("width", tpScale(word.bg_count))
            .attr("x", 0)
            .attr("y", 20)
            .attr("fill", Secondary);
    }
}

function slider2(element, li, word, data) {
    'use strict';
    var width = 140,
        height = 140,
    
        propInside = word.doc_count / word.bg_count,
        propTopic = word.doc_count / data.stats.count,

        inScale = d3.scale.linear().range([1, width]).domain([0, 1]),
        outScale = d3.scale.linear().range([1, width]).domain([1, word.bg_count]),
        max = Math.max(data.stats.count, data.stats.maxBg_count),
        
        tpScale = d3.scale.linear().range([1, width]).domain([0, max]),

        label = element
            .append("h1")
            .attr("title", word.key)
            .style({
                'font-size': "14px",
                'font-weight': "normal",
                margin: "0px",
                padding: "0px",
                color: "#226695"
            })
            .text(word.key),
        glyph = element.append("svg")
            .attr("width", width)
            .attr("height", width);
         
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", outScale(word.bg_count))
        .attr("fill", "#e3e8d2")
        .attr("x", 0)
        .attr("y", 6);
    
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", inScale(propInside))
        .attr("x", 0)
        .attr("y", 6)
        .attr("fill", primary);
    
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", width)
        .attr("fill", "hsl(32, 100%, 87%)")
        .attr("y", 0)
        .attr("x", 0);
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", inScale(propTopic))
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", primary);
    
   

    glyph.append("rect")
        .attr("height", 5)
        .attr("width", tpScale(word.bg_count))
        .attr("x", 0)
        .attr("y", 20)
        .attr("fill", Secondary);

    glyph.append("rect")
        .attr("height", 5)
        .attr("width", tpScale(data.stats.count))
        .attr("x", 0)
        .attr("y", 15)
        .attr("fill", "#FF9203");
}

function square(element, li, word, data) {
    'use strict';
    var width = 140,
        height = width - 50,
    
        propInside = word.doc_count / word.bg_count,
        propTopic = word.doc_count / data.stats.count,

        inScale = d3.scale.linear().range([1, width]).domain([0, 1]),
        inColorScale = d3.scale.linear().range(["#d7191c", "#ffffbf", primary]).domain([0, 0.1, 1]),
        
        outScale = d3.scale.linear().range([1, width]).domain([1, word.bg_count]),
        max = Math.max(data.stats.count, data.stats.maxBg_count),
        
        tpScale = d3.scale.linear().range([1, (width * width) / 4]).domain([0, max]),
        label,

        
        glyph = element.append("svg")
            .attr("width", width)
            .attr("height", height);
    
    glyph.append("rect")
        .attr("height", Math.sqrt(tpScale(word.bg_count)))
        .attr("width", Math.sqrt(tpScale(word.bg_count)))
        .attr("x", (width - Math.sqrt(tpScale(word.bg_count))) / 2)
        .attr("y", height - Math.sqrt(tpScale(word.bg_count)))
        .attr("stroke", "#ccc")
        .attr("fill", inColorScale(propTopic));

    glyph.append("rect")
        .attr("height", Math.sqrt(tpScale(word.doc_count)))
        .attr("width", Math.sqrt(tpScale(word.doc_count)))
        .attr("x", (width - Math.sqrt(tpScale(word.doc_count))) / 2)
        .attr("y", height - Math.sqrt(tpScale(word.bg_count)) + (Math.sqrt(tpScale(word.bg_count)) - Math.sqrt(tpScale(word.doc_count))) / 2)
        .attr("stroke", "#000")
        
        .attr("fill", "none");
    
    label = element.append("h1")
        .attr("title", word.key)
        .style({
            'font-size': "14px",
            'font-weight': "normal",
            margin: "0px",
            padding: "0px",
            color: "#226695"
        })
            .text(word.key);
}

function rectangle(element, li, word, data) {
    'use strict';
    var width = 140,
        height = 40,
    
        propInside = word.doc_count / word.bg_count,
        propTopic = word.doc_count / data.stats.count,

        inScale = d3.scale.linear().range([1, width]).domain([0, 1]),
        inColorScale = d3.scale.linear().range(["#d7191c", "#ffffbf", primary]).domain([0, 0.05, 1]),
        
        outScale = d3.scale.linear().range([1, width]).domain([1, word.bg_count]),
        max = Math.max(data.stats.count, data.stats.maxBg_count),
        
        tpScale = d3.scale.linear().range([1, width]).domain([0, max]),
        label,

        
        glyph = element.append("svg")
            .attr("width", width)
            .attr("height", height);
    
    glyph.append("rect")
        .attr("height", 25)
        .attr("width", width)
        .attr("x", 0)
        .attr("y", 5)
        .attr("stroke", "#ccc")
        .attr("fill", "white");
    
    glyph.append("rect")
        .attr("height", 25)
        .attr("width", tpScale(word.bg_count))
        .attr("x", 0)
        .attr("y", 5)
        .attr("fill", inColorScale(propTopic));

    glyph.append("rect")
        .attr("height", 25)
        .attr("width", tpScale(word.doc_count))
        .attr("x", 0)
        .attr("y", 5)
        .attr("opacity", 0.5)
        .attr("fill", "#ccc");
    
    
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", width)
        .attr("x", 0)
        .attr("y", 35)
        .attr("stroke", "#ccc")
        .attr("fill", "white");
    
    glyph.append("rect")
        .attr("height", 5)
        .attr("width", tpScale(data.stats.count))
        .attr("x", 0)
        .attr("y", 35)
        .attr("fill", "#dbc8ae");
    
    
    label = element.append("h1")
        .attr("title", word.key)
        .style({
            'font-size': "14px",
            'font-weight': "normal",
            margin: "0px",
            padding: "0px",
            color: "#226695"
        })
            .text(word.key);
}




