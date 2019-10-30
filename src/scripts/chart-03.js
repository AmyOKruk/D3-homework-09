import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 100, bottom: 30 }

const height = 300 - margin.top - margin.bottom

const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-03')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create our scales

const xPositionScale = d3
  .scaleLinear()
  .domain([2000, 2014])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 500])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3'])

const line = d3
  .line()
  .x(d => xPositionScale(d.Year))
  .y(d => yPositionScale(d.Value))
// Create a line generator
// This explains how to compute
// the points that make up the line

// Read in files
d3.csv(require('../data/air-emissions.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Draw the lines
  const nested = d3
    .nest()
    .key(d => d.Country)
    .entries(datapoints)

  console.log(nested)

  // svg
  //   .selectAll('text')
  //   .data(nested)
  //   .enter()
  //   .append('text')
  //   .text(d => d.key)
  //   .attr('x', width)
  //   .attr('y', function(d) {
  //     const datapoints = d.values
  //     // var decData = datapoints[datapoints.length - 1]
  //     // find datapoint for month 12
  //     const decData = datapoints.find(d => +d.month === 12)
  //     return yPositionScale(decData.high)
  //   })
  //   .attr('font-size', 12)
  //   .attr('dx', 5)
  //   .attr('dy', function(d) {
  //     // Only push these two cities down some
  //     if (d.key === 'Melbourne' || d.key === 'Stockholm') {
  //       return 5
  //     } else {
  //       return 0
  //     }
  //   })
  //   .attr('alignment-baseline', 'middle')

  const line = d3
    .area()
    .x(d => {
      return xPositionScale(d.Year)
    })
    .y0(height)
    .y1(d => {
      return yPositionScale(d.Value)
    })

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', d => colorScale(d.key))
    .attr('opacity', 0.8)
    .attr('d', function(d) {
      console.log('this nested thing is', d)
      // Takes all of the datapoints in that
      // group and feeds them to the line
      // generator that we made before
      return line(d.values)
    })

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
