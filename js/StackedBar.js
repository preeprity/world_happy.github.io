function stacked() {

var svg1 = d3.select('#vizbar1').append('svg').attr("width","1024").attr("height","600");

var margin1 = 80;
var width1 = 1000 - 2 * margin1;
var height1 = 600 - 2 * margin1;

// set x scale
var x = d3.scaleBand()
.rangeRound([0, width1])
.paddingInner(0.3)
.align(0.1);

// set y scale
var y = d3.scaleLinear()
.rangeRound([height1, 0]);

// set the colors
var z = d3.scaleOrdinal()
.range(["lightpink", "red", "brown", "grey", "blue", "lightgreen", "green"]);

var chart1 = svg1.append('g')
    .attr('transform', `translate(65,65)`);

// load the csv and create the chart
d3.csv("data/BarChart_stacked.csv", function(d, i, columns) {
for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
d.total = t;
return d;
}, function(error, data) {
if (error) throw error;

var keys = data.columns.slice(1);

data.sort(function(a, b) { return b.total - a.total; });
x.domain(data.map(function(d) { return d.Region; }));
y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
z.domain(keys);

chart1.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + height1 + ")")
  .call(d3.axisBottom(x));

chart1.append('g')
  .attr("class","axis")
  .attr("transform","translate(" + 0 + " ,0 )")
   .call(d3.axisLeft(y));


chart1.append("g")
.selectAll("g")
.data(d3.stack().keys(keys)(data))
.enter().append("g")
  .attr("fill", function(d) { return z(d.key); })
.selectAll("rect")
.data(function(d) { return d; })
.enter().append("rect")
  .attr("x", function(d) { return x(d.data.Region); })
  .attr("y", function(d) { return y(d[1]); })
  .attr("height", function(d) { return y(d[0]) - y(d[1]); })
  .attr("width", x.bandwidth())
  .on("mouseover", function() { console.log("hi"); tooltip.style("display", null); })
  .on("mouseout", function() { tooltip.style("display", "none"); })
  .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 5;
    var yPosition = d3.mouse(this)[1] - 5;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    console.log(tooltip.select("text").text(d[1]-d[0]));
    tooltip.select("text").text(d[1]-d[0]);
  });
  

var legend = chart1.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)
  .attr("text-anchor", "end")
.selectAll("g")
.data(keys.slice().reverse())
.enter().append("g")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
  .attr("x", width1 - 19)
  .attr("width", 19)
  .attr("height", 19)
  .attr("fill", z);

legend.append("text")
  .attr("x", width1 - 24)
  .attr("y", 9.5)
  .attr("dy", "0.32em")
  .text(function(d) { return d; });
});

// Prep the tooltip bits, initial display is hidden
var tooltip = chart1.append("g")
.attr("class", "tooltip")
.style("display", "none");
  
tooltip.append("rect")
.attr("width", 60)
.attr("height", 20)
.attr("fill", "white")
.style("opacity", 0.5);

tooltip.append("text")
.attr("x", 30)
.attr("dy", "1.2em")
.style("text-anchor", "middle")
.attr("font-size", "12px")
.attr("font-weight", "bold");

}

stacked();