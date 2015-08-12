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
  var selectedNodes = [undefined, undefined];
  var width = 960,
      height = 500;

  var currentLine = [];
  var maxMinWeight = 10000000;
  var currentEdge = -1;

  var settledNodes = [];
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
    var i = selectedNodes.indexOf(node);
    console.log(node);
    var color = "#0F0";
    if(i == 0)
      color = "#08D";
    else if(i == 1)
      color = "#F00";
    return color;

  }

  function colorLines(pathIn){
    console.log(pathIn);
    console.log(lastAddedNode);
    if(lastAddedNode != undefined &&
      lastAddedNode.minPath.indexOf(pathIn) >= 0) {
      return "#EE0"
    }
    // else if(lastAddedNode != undefined && pathIn.source.index == 0){
    //   var i = lastAddedNode.minPath.indexOf(pathIn);
    //   console.log(i);
    //   console.log(lastAddedNode.minPath[0]);
    //   console.log(pathIn);
    //   return "#000";
    // }
  }

  function selectNode(selectedNode){
    // if the selected node isn't the destination, it becomes it. 
    if (selectedNodes.indexOf(selectedNode) < 1){
      // move the current destination to the source, and add this as destination;
      selectedNodes[0] = selectedNodes[1];
      selectedNodes[1] = selectedNode;
       // Update the nodes…
      svg.selectAll("circle").style("fill", color);
      if(selectedNodes[0] != undefined){
        calulatePath();
      }
      svg.selectAll("path").style("stroke", colorLines);
    }
  };

  var lastAddedNode;

  function calulatePath(){
    //set up the nodes appropriately.
    unsettledNodes = JSON.parse(JSON.stringify(nodes));
    settledNodes = [];

    for (var ind in unsettledNodes) {
      if (unsettledNodes.hasOwnProperty(ind)) {
        var curNode = unsettledNodes[ind];
        curNode.minPath = [];
        curNode.minDistance = maxMinWeight;
      }
    };

    if(selectedNodes.indexOf(undefined) < 0){
      // we have a path potentially!
      var firstNode = unsettledNodes[selectedNodes[0].name];
      firstNode.minDistance = 0;
      var destNode = unsettledNodes[selectedNodes[1].name];
      lastAddedNode = firstNode; 

      settledNodes.push(firstNode);
      delete unsettledNodes[selectedNodes[0].name];

      while(lastAddedNode != undefined &&
        lastAddedNode.name != destNode.name)
      {
        relaxNeighbors(lastAddedNode);
        lastAddedNode = extractMinimum(unsettledNodes);
      }
    }
  };

  function relaxNeighbors(node){
    var filteredLinks = links.filter(function(link){
      return link.source.index == node.index;
    });
    filteredLinks.forEach(function(link){
      var targetNode = unsettledNodes[link.target.name];
      if(targetNode != undefined)
      {
        var thisLinkPathDist = node.minDistance+link.value;
        if(targetNode.minDistance > thisLinkPathDist){
          targetNode.minPath = JSON.parse(JSON.stringify(node.minPath));
          targetNode.minPath.push(link);
          targetNode.minDistance = thisLinkPathDist;
        }
      }
    })

  }

  function extractMinimum(set){
    var nextMin = maxMinWeight;
    var nextNode = undefined;
    for (var prop in unsettledNodes) {
      if (unsettledNodes.hasOwnProperty(prop)) {
        var curNode = unsettledNodes[prop];
        if(curNode.minDistance < nextMin){
          nextMin = curNode.minDistance;
          nextNode = curNode;
        }
      }
    };
    if(nextNode != undefined){
      delete unsettledNodes[nextNode.name];
      settledNodes[nextNode.name] = nextNode;
    }
    return nextNode;
  }
});