// get the data
d3.csv("Routes.csv", function(error, links) {

  var nodes = {};

  // Compute the distinct nodes from the links.
  links.forEach(function(link) {
      link.source = nodes[link.source] || 
          (nodes[link.source] = {name: link.source});
      link.target = nodes[link.target] || 
          (nodes[link.target] = {name: link.target});
      link.value = +link.value;
  });

  console.log(links);

  var width = 960,
      height = 500;

  var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(function(link){
        var dist = link.value*10;
        console.log(dist);
        return dist;
      })
      .charge(-300)
      .on("tick", tick)
      .start();

  var svg = d3.select("#RouteGraph").append("svg")
      .attr("width", width)
      .attr("height", height);

  // build the arrow.
  svg.append("svg:defs").selectAll("marker")
      .data(["end"])
    .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

  // add the links and the arrows
  var path = svg.append("svg:g").selectAll("path")
      .data(force.links())
    .enter().append("svg:path")
      .attr("class", "link")
      .attr("marker-end", "url(#end)");

  // define the nodes
  var node = svg.selectAll(".node")
      .data(force.nodes())
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  // add the nodes
  node.append("circle")
      .attr("r", 5);

  // add the text 
  node.append("text")
      .attr("x", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  // add the curvy lines
  function tick() {
      path.attr("d", function(d) {
          var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy);
          return "M" + 
              d.source.x + "," + 
              d.source.y + "A" + 
              dr + "," + dr + " 0 0,1 " + 
              d.target.x + "," + 
              d.target.y;
      });

      node
          .attr("transform", function(d) { 
              return "translate(" + d.x + "," + d.y + ")"; });
  }

});


// (function (d3, _) {
//   'use strict';
//   console.log('Started!');

//   var nodes = []

//   $(document).ready(function() {
//     $.ajax({
//         type: "GET",
//         url: "Routes.csv",
//         dataType: "text",
//         success: function(data) {processData(data);}
//      });
//   });

//   var routesArray = [];
//   function processData(allText){ 
//     var textComingIn = "";
//     if(allText != undefined)
//       textComingIn = allText;
//     var allTextLines = textComingIn.split(/\r\n|\n/);
//     var headers = allTextLines[0].split(',');

//     for (var i=1; i<allTextLines.length; i++) {
//         var data = allTextLines[i].split(',');
//         if (data.length == headers.length) {

//             var tarr = [];
//             for (var j=0; j<headers.length; j++) {
//                 tarr.push(data[j]);
//             }
//             var dist = tarr[2]*10;
//             console.log(dist);
//             var route = { 
//               src: tarr[0],
//               dest: tarr[1], 
//               distance: tarr[2]
//             };
//             routesArray.push(route);
//         }
//     }
//     CreateNodes();
//   }

//   function CreateNodes() {
//     var latestNodeIndex = 0;
//     for(var i =0; i< routesArray.length; i++){
//       var source = routesArray[i].src;
//       var dest = routesArray[i].dest;
//       var index = _.find(nodes, function(existingNode){
//         return source == existingNode.name;
//       });
//       if(index == undefined){
//         var node = {
//           name: source,
//           index: latestNodeIndex};
//         nodes.push(node);
//         console.log("Latest Node Index = ")
//         console.log(latestNodeIndex)
//         index = latestNodeIndex;
//         latestNodeIndex++;
//       }
//       else{
//         console.log("elseStatemetnIndex = ")
//         console.log(index)
//         index=index.index;
//       }
//       console.log(index);
//       //Set the route's source to the index of the node now that it is known
//       routesArray[i].source = index;

//       index = _.find(nodes, function(existingNode){
//         return dest == existingNode.name;
//       })
//       if(index == undefined){
//         var node = {
//           name: dest,
//           index: latestNodeIndex};
//         nodes.push(node);
//         index = latestNodeIndex;
//         latestNodeIndex++;
//       }
//       else
//         index = index.index;
//       // set the route's target index now that we know it.
//       routesArray[i].target = index;
//     }
//     console.log(nodes);
//     console.log(routesArray);
//     CreateForces();
//     DrawGraph();
//   }

//   var force;

//   function CreateForces() {
//     force = d3.layout.force()
//     .nodes(nodes)
//     .links(routesArray)
//     .linkStrength(0.1)
//     .friction(0.9)
//     .linkDistance(function(link){
//       return link.distance * 10;
//     })
//     .charge(-30)
//     .gravity(0.1)
//     .theta(0.8)
//     .alpha(0.1)
//     .start();
//   }

//   var width = 960,
//       height = 500,
//       centered,
//       dotscale = 5,
//       cities = [];

//   var path = d3.geo.path();

//   var svg = d3.select("#RouteGraph").append("svg")
//       .attr("width", width)
//       .attr("height", height);

//   // Arrows
//   svg.append("svg:defs")
//     .append("svg:marker")
//       .attr("id", "directed-line")
//       .attr("viewBox", "0 0 10 10")
//       .attr("refX", 15)
//       .attr("refY", 1.5)
//       .attr("markerWidth", 6)
//       .attr("markerHeight", 6)
//       .attr("orient", "auto")
//     .append("svg:path")
//       .attr("d", "M0,-5L10,0L0,5");

//   svg.append("rect")
//       .attr("class", "background")
//       .attr("width", width)
//       .attr("height", height)
//       .on('click', clickMap);

//   function DrawGraph(){
//     console.log("amazeballs");

//     var node = svg.selectAll("circle").data(nodes)
//       .enter().append("circle")
//       .attr("class", "city")
//       .call(force.drag);

//     node.append("text")
//       .attr("dx", 12)
//       .attr("dy", ".35em")
//       .text(function(d) {return d.name});

//     var link = svg.selectAll("path.connection").data(routesArray)
//       .enter().append("path")
//         .attr('class', 'connection')
//         .attr("marker-end", "url(#directed-line)");

//     console.log(routesArray);
//     console.log(nodes);
//     console.log(svg);
//     console.log(force);
//   }

//   function clickMap () {
//     cities.push(d3.mouse(this));
//     drawCities();
//   }

//   function reset () {
//     cities = [];
//     svg.selectAll('circle').remove();
//     svg.selectAll('path.connection').remove();
//   }

//   function drawCities() {
//     console.log(svg);
//     svg.selectAll('circle').data(nodes).enter()
//       .append('circle')
//         .attr('cx', function (d) { return d[0]; })
//         .attr('cy', function (d) { return d[1]; })
//         .attr('r', dotscale)
//         .attr('class', 'city');
//   }

//   function drawPaths(ipath) {
//     var paths = _.map(_.zip(ipath.slice(0,ipath.length-1), ipath.slice(1)), function (pair) {
//       return [cities[pair[0]], cities[pair[1]]]
//       }).slice();

//     svg.selectAll('path.connection').remove();
//     svg.selectAll('path.connection').data(paths).enter()
//       .append('path')
//       .attr('d', function(d) {
//         var dx = d[1][0] - d[0][0],
//         dy = d[1][1] - d[0][1],
//         dr = Math.sqrt(dx * dx + dy * dy);
//         return "M" + d[0][0] + "," + d[0][1] + "A" + dr + "," + dr + " 0 0,1 " + d[1][0] + "," + d[1][1];
//       })
//       .attr('class', 'connection')
//       .attr("marker-end", "url(#directed-line)");
//   }

// })(d3, _);