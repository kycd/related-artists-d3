
function drawRelatingGraph(graph) {
    var width = 1024,
        height = 768;

    var cr = 30;
    // 箭頭隨圓半徑位移

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-600)
        .linkDistance(300)
        .size([width, height]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
    var defs = svg.append("defs");

    var arrowMarker = defs.append("marker")
        .attr({
            id: "arrow",
            markerUnits: "strokeWidth",
            markerHeight: 12,
            markerWidth: 12,
            viewBox: "0 0 12 12",
            refX: cr + 2,
            refY: 6,
            orient: "auto"
        });

    var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

    arrowMarker.append("path")
        .attr({
            d: arrow_path,
            fill: "#000"
        });


    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var glink = svg.append("g").attr("class", "link");
    var link = glink.selectAll(".link1")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("class", "link1")
        .attr("marker-end", "url(#arrow)")
        .style("stroke-width", function (d) { return Math.sqrt(d.value); });

    var gnode = svg.append("g").attr("class", "node");
    var gg = gnode
        .selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "gr");

    var gtext = svg.append("g").attr("class", "text");
    var ntext = svg.selectAll("g.gr")
        .each(function (d, i) {
            gtext.append("text")
                .attr("class", "name name_" + d.id)
                .text(d.name)
                .attr("text-anchor", "middle")
                .style({ opacity: 0 });
        });

    // create background image pattern
    gg.each(function (d, i) {
        defs.append('pattern')
        .attr({
            "id": 'image_' + d.id,
            "x": 0,
            "y": 0,
            "height": 1,
            "width": 1
        });
        defs.select('#image_' + d.id)
        .append('image')
        .attr({
            x: 0,
            y: 0,
            width: cr*2,
            height: cr*2,
            "xlink:href": d.image.url
        })
    })


    var node = gg
        .append("circle")
        .attr("class", "node")
        .attr("r", cr)
        .style('fill', function(d){ return "url(#image_" + d.id + ")";})
        .call(force.drag);

//    node.append("title")
//        .text(function (d) { return d.title; });

    node.each(function (d, i) {
        var circleObj = d3.select(this);
        d3.select(this)
            .on("mouseenter", function () {
                gtext.select('.name_' + d.id)
                    .style({ opacity: 1.0 })
            })
            .on("mouseleave", function () {
                gtext.select('.name_' + d.id)
                .style({ opacity: 0 });
            })
    });

    force.on("tick", function () {
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });

        node.each(function (d, i) {
            gtext.select('.name_' + d.id)
                .attr({
                    x: d.x,
                    y: d.y - cr - 5
                });
        });
    });
}
