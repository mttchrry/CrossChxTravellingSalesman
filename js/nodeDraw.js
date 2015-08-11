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
  var selectedNodes = [-1, -1];
  console.log(selectedNodes);
  var width = 960,
      height = 500;

  var currentLine = [];
  var minWeight = 10000000;
  var currentEdge = -1;

  var settledNode = [];
  var unsettledNodes = [];

  var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(function(link){
        var dist = link.value*20;
        return dist;
      })
      .charge(-600)
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
      .attr("r", 5)
      .style("fill", color)
      .on("click", selectNode);

  // add the text 
  node.append("text")
      .attr("class", "nodeText")
      .attr("x", 12)
      .attr("dy", ".0em")
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

  function color(node){
    var i = selectedNodes.indexOf(node.index);
  
    var color = "#0F0";
    if(i == 0)
      color = "#08D";
    else if(i == 1)
      color = "#F00";
    return color;

  }

  function selectNode(selectedNode){
    console.log(selectedNode.name);
    // if the selected node isn't the destination, it becomes it. 
    if (selectedNodes.indexOf(selectedNode.index) < 1){
      // move the current destination to the source, and add this as destination;
      selectedNodes[0] = selectedNodes[1];
      selectedNodes[1] = selectedNode.index;
       // Update the nodes…
      svg.selectAll("circle").style("fill", color);
      if(selectedNodes[0] >= 0){
        calulatePath();
      }
    }
  };

  function calulatePath(){
    //set up the nodes appropriately.
    unsettledNodes = [];

    for (var ind in nodes) {
      if (nodes.hasOwnProperty(ind)) {
        var curNode = nodes[ind];
        console.log(curNode);
        curNode.minPath = [];
        curNode.minDistance = minWeight;
        unsettledNodes.push(curNode);
      }
    };


    if(selectedNodes.indexOf(-1) < 0){
      // we have a path potentially!
      console.log(selectedNodes);
      console.log(unsettledNodes);
      var firstNode = unsettledNodes[selectedNodes[0]];
      var destNode = unsettledNodes[selectedNodes[1]];
      var lastAddedNode = firstNode; 

      while(lastAddedNode.index != destNode.index)
      {
        RelaxNeighbors(lastAddedNode);
        var minNode = ExtractMinimum()
        var nextEdgeWeights
      }
    }
  };

  function relaxNeighbors(node){
    var filteredLinks = links.filter(function(link){
      return link.source.index = node.index;
    });

  }

  function extractMinimum(set){

  }

});