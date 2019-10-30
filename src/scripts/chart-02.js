import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

console.log('Building chart 2')

const svg = d3
  .select('#chart-02')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create your scales

const xPositionScale = d3
  .scaleLinear()
  .domain([2000, 2010])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 16])
  .range([height, 0])

// Create a d3.line function

const line = d3
  .line()
  .x(d => xPositionScale(d.TIME))
  .y(d => yPositionScale(d.Value))

const colorScale = d3
  .scaleOrdinal()
  // .domain(['Australia', 'Korea', 'Estonia', 'Indonesia', 'Colombia'])
  .range(['red', 'orange', 'yellow', 'green', 'blue', 'purple'])

// Import your data file
d3.csv(require('../data/alcohol-consumption.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Draw your dots
  // Draw your lines
  const nested = d3
    .nest()
    .key(d => d.LOCATION)
    .entries(datapoints)

  console.log(nested)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('cx', function(d) {
      return xPositionScale(d.TIME)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.Value)
    })
    .attr('fill', d => colorScale(d.LOCATION))

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', d => colorScale(d.key))

  // Add your axes

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
