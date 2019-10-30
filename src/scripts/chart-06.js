import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 120 - margin.top - margin.bottom

const width = 100 - margin.left - margin.right

const container = d3.select('#chart-06')

// Create our scales
const xPositionScale = d3
  .scaleLinear()
  .domain([12, 55])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

const formater = d3.format('.2f')

// Create a line generator
// This explains how to compute
// the points that make up the line

const line = d3
  .area()
  .x(d => {
    return xPositionScale(d.Age)
  })
  .y0(height)
  .y1(d => {
    return yPositionScale(d.ASFR_jp)
  })

const line2 = d3
  .area()
  .x(d => {
    return xPositionScale(d.Age)
  })
  .y0(height)
  .y1(d => {
    return yPositionScale(d.ASFR_us)
  })

// Read in files
d3.csv(require('../data/fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const name = d.key
      const datapoints = d.values
      const svg = d3.select(this)

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', function(d) {
          return line(datapoints)
        })
        .attr('fill', 'aqua')
        .attr('opacity', 0.5)

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', function(d) {
          console.log('chart 6: this nested thing is', d)
          return line2(datapoints)
        })
        .attr('fill', 'red')
        .attr('opacity', 0.5)

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 0 - margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .text(name)

      svg
        .append('text')
        .attr('x', 30)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .attr('fill', 'aqua')
        .text(
          formater(
            d3.sum(d.values, function(d) {
              return +d.ASFR_jp
            })
          )
        )

      svg
        .append('text')
        .attr('x', 40)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .attr('fill', 'red')
        .text(
          formater(
            d3.sum(d.values, function(d) {
              return +d.ASFR_us
            })
          )
        )

      const xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      const yAxis = d3.axisLeft(yPositionScale).tickValues([0.0, 0.1, 0.2, 0.3])
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
