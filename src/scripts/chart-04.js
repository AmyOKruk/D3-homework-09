import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 100, bottom: 30 }

const height = 300 - margin.top - margin.bottom

const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-04')
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

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('x', width)
    .attr('y', function(d) {
      const datapoints = d.values
      // var decData = datapoints[datapoints.length - 1]
      // find datapoint for month 12
      const decData = datapoints.find(d => +d.Year === 2014)
      return yPositionScale(decData.Value)
    })
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .attr('dx', 8)
    .attr('fill', function(d) {
      // Only push these two cities down some
      if (d.key === 'Germany') {
        return 'red'
      } else {
        return 'black'
      }
    })

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    // .attr('stroke', 'black')
    .attr('stroke', function(d) {
      // Only push these two cities down some
      if (d.key === 'Germany') {
        return 'red'
      } else {
        return 'black'
      }
    })
    .attr('d', function(d) {
      return line(d.values)
    })

  nested.forEach(function(d) {
    // iterate over all the data for line to get the last point of a line.
    const last = d.values[d.values.length - 1]
    svg
      .append('circle')
      .attr('cx', function(d) {
        return xPositionScale(last.Year)
      })
      .attr('cy', function(d) {
        return yPositionScale(last.Value)
      })
      .attr('r', 3)
      .attr('fill', function(d) {
        // Only push these two cities down some
        if (last.Country === 'Germany') {
          return 'red'
        } else {
          return 'black'
        }
      })
  })

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale).tickSize(0)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
