let margin = [100, 120, 20, 140],
  width = 1280 - margin[1] - margin[3],
  height = 800 - margin[0] - margin[2],
  i = 0,
  duration = 300,
  haschild = "#171717",
  isend = "white",
  root;

let tree = d3.layout.tree()
  .size([height, width]);

let diagonal = d3.svg.diagonal()
  .projection(function (d) {
    return [d.y, d.x];
  });

let vis = d3.select("#body").append("svg:svg")
  .attr("width", width + margin[1] + margin[3])
  .attr("height", height + margin[0] + margin[2])
  .append("svg:g")
  .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

d3.json("./web/db.json", function (json) {
  root = json;
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  update(root);
});

function update(source) {
  let nodes = tree.nodes(root).reverse();
  nodes.forEach(function (d) {
    d.y = d.depth * 180;
  });

  let node = vis.selectAll("g.node")
    .data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

  let nodeEnter = node.enter().append("svg:g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on("click", function (d) {
      toggle(d);
      update(d);
    });

  nodeEnter.append("svg:circle")
    .attr("r", 1e-6)
    .style("fill", function (d) {
      return d._children ? haschild : isend;
    });

  nodeEnter.append('a')
    .attr("target", "_blank")
    .attr("class", "node-item")
    .attr('xlink:href', function (d) {
      return d.url;
    })
    .append("svg:text")
    .attr("x", function (d) {
      return d.children || d._children ? -10 : 10;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function (d) {
      return d.name;
    })
    .style("fill: rgb(0, 0, 0)", function (d) {
      return d.free ? 'black' : '#999';
    })
    .style("fill-opacity", 1e-6);

  nodeEnter.append("svg:title")
    .text(function (d) {
      return d.description;
    });

  // Transition nodes to their new position.
  let nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  nodeUpdate.select("circle")
    .attr("r", 6)
    .style("fill", function (d) {
      return d._children ? haschild : isend;
    });

  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  let nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // Update the links???
  let link = vis.selectAll("path.link")
    .data(tree.links(nodes), function (d) {
      return d.target.id;
    });

  link.enter().insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      let o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function (d) {
      let o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}