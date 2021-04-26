var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom

// create svg wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// d3.csv("./data/data.csv").then(function(stateData) {
//     console.log(stateData);

// function yScaleBuilder(some_data) {
//     var yScaleBuilt=d3.scaleLinear()
//                  .domain(d3.extent(some_data))
//                  .range([0, height])
//     return yScaleBuilt
// }

// create scale for age

// import data and scale functions
// .then(data=>console.log(data))
d3.csv('assets/data/data.csv').then(function (data) {
  
    // parse data
    data.forEach(function(data) {
      data.age = +data.age;
      data.income = +data.income;
      data.obesity = +data.obesity;
    });

  var xScale = d3.scaleLinear()
    .domain(d3.extent(data.map(state => state.age))) //d3.extent returns array of min and max
    .range([0, width])

  var yScale = d3.scaleLinear()
    .domain(d3.extent(data.map(state => state['obesity'])))
    .range([height, 0])

  // Create axis functions
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  // Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles
  var circlesGroup = chartGroup.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', datum => xScale(datum['age']))
    .attr('cy', one_state => yScale(one_state['obesity']))
    .attr('r', 15)
    .attr('fill', 'blue')
    .attr('opacity', '.5')

  var circleLabels = chartGroup.selectAll().data(data).enter().append("text");

  circleLabels
  .attr("x", function(d) {
    return xScale(d.age);
  })
  .attr("y", function(d) {
    return yScale(d.obesity);
  })
  .text(function(d) {
    return d.abbr;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");



chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Obesity (%)");

chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("Age")



  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Age: ${d.age} <br>Obesity: ${d.obesity}`);
    });

  // Create tooltip in the chart

  circlesGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("click", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });



  

});

























