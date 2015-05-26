tx.directive("keyword", function() {
    return{
        restrict: "EA",
        scope: {
            word: '=',
            data: '=',
            glyph: '='
        },
        link: function(scope, elem, attrs){
            var element = d3.select(elem[0]);
            var li = d3.select(elem[0].parentNode);
            li.attr("class","glyp_" + scope.glyph)
            eval(scope.glyph + "(element, li, scope.word, scope.data)");
            scope.$watch(function() {return scope.glyph}, function(){
                element.text("");
                li.attr("class","glyp_" + scope.glyph)
                eval(scope.glyph + "(element, li, scope.word, scope.data)");
            })
        }
    }
});

function word(element, li, word, data){
    element.text(word.key);
}
             
function vennGlyph(element, li, word, data){
    var width = 80,
        height = 120
    
    var gliphy = element.append("svg")
        .attr("width", width)
        .attr("height", width)
    
    /*Arc Score ------------------------------*/
    var radius = Math.min(width, height) / 2,
        cValue = function(d) { return d.score;},
        color = d3.scale.linear()
            .range(['#de5139','#ede5a4','#769517'])
            .domain([0,0.5,1]),
        anScore = (word.score * 360);

    var scoreArc = d3.svg.arc()
        .innerRadius(radius-6)
        .outerRadius(radius-2)
        .startAngle(0 * (Math.PI/180)) 
        .endAngle(-anScore * (Math.PI/180)) 

    var scoreArcBase = d3.svg.arc()
        .innerRadius(radius-6)
        .outerRadius(radius-2)
        .startAngle(0 * (Math.PI/180)) 
        .endAngle(360 * (Math.PI/180)) 

    gliphy.append("path")
        .attr("class", "scoreArcBase")
        .attr("d", scoreArcBase)
        .attr("transform", "translate(" + radius +"," + radius +")")
        .style({fill: "#eee"})

    gliphy.append("path")
        .attr("class", "scoreArc")
        .attr("d", scoreArc)
        .style("fill", function(d) { return color(cValue(word));}) 

        .attr("transform", "translate(" + radius +"," + radius +")")
    
    /*Venn ---------------------------------------*/
     var sets = [ 
        {sets: ['word'], size:  word.bg_count}, 
        {sets: ['topic'], size: data.stats.count},
        {sets: ['word','topic'], size: word.doc_count}];

    var chart = venn.VennDiagram() 
        .width(width)
        .height(width)
    var veen = gliphy.append("g")
        .attr("transform", "translate(" + 0 +"," + 0 +")")
        .datum(sets).call(chart)
    
    gliphy.selectAll(".venn-circle path")
        .style("stroke", "#aaa");
    
    gliphy.selectAll(".venn-circle text").remove();
    
    /*Label --------------------------------------*/
    var label = element
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

function smallVennGlyph(element, li, word, data){
    var width = 60,
        height = 50
    
    var gliphy = element.append("svg")
        .attr("width", width)
        .attr("height", height)
    
   
    
    /*Venn ---------------------------------------*/
     var sets = [ 
        {sets: ['word'], size:  word.bg_count}, 
        {sets: ['topic'], size: data.stats.count},
        {sets: ['word','topic'], size: word.doc_count}];

    var chart = venn.VennDiagram() 
        .width(width)
        .height(width)
    var veen = gliphy.append("g")
        .attr("transform", "translate(" + 0 +"," + 0 +")")
        .datum(sets).call(chart)
    
    gliphy.selectAll(".venn-circle path")
        .style("stroke", "#aaa");
    
    gliphy.selectAll(".venn-circle text").remove();
    
    /*Label --------------------------------------*/
    var label = element
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

function paralelBar(element, li, word, data){
    var width = 80,
        height = 120
    
    var glyph = element.append("svg")
        .attr("width", width)
        .attr("height", width)
    
    var size = 2;
    
    var propInside = word.doc_count/data.stats.count;
    var propOutside = word.bg_count/data.stats.globalCount;
    var inScale = d3.scale.linear().range([width-size,size]).domain([0,1])
    
    glyph.append("circle")
        .attr("cx", size)
        .attr("cy", inScale(propInside))
        .attr("r",  size);
    
    glyph.append("circle")
        .attr("cx", (width-size) +"px")
        .attr("cy", inScale(propOutside))
        .attr("r","2px");
     
    glyph.append("line")
        .attr("x1", size)
        .attr("y1", inScale(propInside))  
        .attr("x2", (width-size))  
        .attr("y2", inScale(propOutside))
        .style({stroke: "black", "stroke-width":1})
    
    var label = element
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


function horizontalBar(element, li, word, data){
    var width = 80,
        height = 120
    
    var propInside = word.doc_count/data.stats.count;
    var propOutside = word.bg_count/data.stats.globalCount;
   
    var inScale = d3.scale.linear().range([0,width/2]).domain([0,1])
    var outScale = d3.scale.linear().range([0,width/2]).domain([0,data.stats.maxBg_count])
    
    var label = element
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
     var glyph = element.append("svg")
        .attr("width", width)
        .attr("height", width)
     
    glyph.append("rect")
        .attr("height",5)
        .attr("width", inScale(propInside))
        .attr("x", width/2-inScale(propInside))
        .attr("fill", primary);
    glyph.append("rect")
        .attr("height",5)
        .attr("width", outScale(word.bg_count))
        .attr("fill", Secondary)
        .attr("x", width/2);
}

function slider(element, li, word, data){
    var width = 140,
        height = 140
    
    var propInside = word.doc_count/word.bg_count;
    var propTopic = word.doc_count/data.stats.count;
   
    var inScale = d3.scale.linear().range([0,width]).domain([0,1])
    var outScale = d3.scale.linear().range([0,width]).domain([0,word.bg_count])
    
    var label = element
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
     var glyph = element.append("svg")
        .attr("width", width)
        .attr("height", width)
         
    glyph.append("rect")
        .attr("height",5)
        .attr("width", outScale(word.bg_count))
        .attr("fill", "#e3e8d2")
        .attr("x", 0)
        .attr("y", 6)
    glyph.append("rect")
        .attr("height",5)
        .attr("width", inScale(propInside))
        .attr("x", 0)
        .attr("y", 6)
        .attr("fill", primary);
    
     glyph.append("rect")
        .attr("height",5)
        .attr("width", width)
        .attr("fill", "hsl(32, 100%, 87%)")
        .attr("y", 0)
        .attr("x", 0);
    glyph.append("rect")
        .attr("height",5)
        .attr("width", inScale(propTopic))
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", primary);
    
    var max = Math.max(data.stats.count, data.stats.maxBg_count);
    if(word.bg_count > data.stats.count){
        
        var tpScale = d3.scale.linear().range([0,width]).domain([0,max])
        
        glyph.append("rect")
            .attr("height",5)
            .attr("width", tpScale(word.bg_count))
            .attr("x", 0)
            .attr("y", 20)
            .attr("fill", Secondary);
        
        glyph.append("rect")
            .attr("height",5)
            .attr("width", tpScale(data.stats.count))
            .attr("x", 0)
            .attr("y", 25)
            .attr("fill", "#FF9203");
        /*
        var path = "M 0 8 L 0 20 L "+ tpScale(word.bg_count) +" 20 L "+width+" 8";
        glyph.append("path")
            .attr("d", path)
            .style({fill: "#eee"});*/
        
    } else {
        
        var tpScale = d3.scale.linear().range([0,width]).domain([0,max])
        
        glyph.append("rect")
            .attr("height",5)
            .attr("width", tpScale(data.stats.count))
            .attr("x", 0)
            .attr("y", 25)
            .attr("fill", "#FF9203");
        
         glyph.append("rect")
            .attr("height",5)
            .attr("width", tpScale(word.bg_count))
            .attr("x", 0)
            .attr("y", 20)
            .attr("fill", Secondary);
        /*
        var path = "M 0 8 L 0 20 L "+ tpScale(word.bg_count) +" 20 L "+width+" 8";
        glyph.append("path")
            .attr("d", path)
            .style({fill: "#f0f0f0"});*/
    }
}

function slider2(element, li, word, data){
    var width = 140,
        height = 140
    
    var propInside = word.doc_count/word.bg_count;
    var propTopic = word.doc_count/data.stats.count;
   
    var inScale = d3.scale.linear().range([1,width]).domain([0,1])
    var outScale = d3.scale.linear().range([1,width]).domain([1,word.bg_count])
    
    var label = element
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
     var glyph = element.append("svg")
        .attr("width", width)
        .attr("height", width)
         
    glyph.append("rect")
        .attr("height",5)
        .attr("width", outScale(word.bg_count))
        .attr("fill", "#e3e8d2")
        .attr("x", 0)
        .attr("y", 6)
    glyph.append("rect")
        .attr("height",5)
        .attr("width", inScale(propInside))
        .attr("x", 0)
        .attr("y", 6)
        .attr("fill", primary);
    
     glyph.append("rect")
        .attr("height",5)
        .attr("width", width)
        .attr("fill", "hsl(32, 100%, 87%)")
        .attr("y", 0)
        .attr("x", 0);
    glyph.append("rect")
        .attr("height",5)
        .attr("width", inScale(propTopic))
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", primary);
    
    var max = Math.max(data.stats.count, data.stats.maxBg_count);
   
        
    var tpScale = d3.scale.linear().range([1,width]).domain([0,max])

    glyph.append("rect")
        .attr("height",5)
        .attr("width", tpScale(word.bg_count))
        .attr("x", 0)
        .attr("y", 20)
        .attr("fill", Secondary);

    glyph.append("rect")
        .attr("height",5)
        .attr("width", tpScale(data.stats.count))
        .attr("x", 0)
        .attr("y", 15)
        .attr("fill", "#FF9203");
    /*
    var path = "M 0 8 L 0 20 L "+ tpScale(word.bg_count) +" 20 L "+width+" 8";
    glyph.append("path")
        .attr("d", path)
        .style({fill: "#eee"});*/
        
    
}








