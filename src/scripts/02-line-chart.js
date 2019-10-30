import * as d3 from 'd3'

const margin = { top: 40, left: 50, right: 50, bottom: 40 }

const height = 300 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#line-chart')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const parseTime = d3.timeParse('%Y-%m-%d')

const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([90, 125])
  .range([height, 0])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.Close)
  })
  .curve(d3.curveMonotoneX)

d3.csv(require('../data/AAPL.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.Date)
  })
  const dates = datapoints.map(function(d) {
    return d.datetime
  })

  const dateMax = d3.max(dates)
  const dateMin = d3.min(dates)

  xPositionScale.domain([dateMin, dateMax])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('stroke', '#4cc1fc')
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  svg
    .append('text')
    .text('AAPL stock price')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('font-size', 22)
    .attr('font-weight', 'bold')

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('cx', d => xPositionScale(d.datetime))
    .attr('cy', d => yPositionScale(d.Close))
    .attr('r', 3)
    .attr('fill', '#4cc1fc')

    .on('mouseover', function(d) {
      // mouseover is the event for the cursor going over something.
      // When the mouse goes over, let's look at the datapoint
      console.log('My mouse clicked the datapoint', d)

      // if we want to talk about the actual circle, we use d3.select(this)
      d3.select(this).attr('r', '5')

      // We can use the datapoint to update elements elsewhere on the page
      d3.select('.col-3')
        .append('p')
        .text('Date: ')
        .style('font-weight', 'bold')
        .append('tspan')
        .text(d.Date)
        .style('font-weight', 'normal')

        // d3.select('.col-3')
        .append('p')
        .text('Close: ')
        .style('font-weight', 'bold')
        .append('tspan')
        .text(d.Close)
        .style('font-weight', 'normal')
    })

    .on('mouseout', function(d) {
      // mouseover is the event for the cursor moving off of something

      // When the mouse leaves, let's look at the datapoint
      console.log('My mouse left the datapoint', d)
      d3.select(this).attr('r', '3')

      d3.select('.col-3')
        .selectAll('p')
        .remove()
    })

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %Y'))
    .ticks(5)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([100, 110, 120])
    .tickSize(-width)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg.selectAll('.y-axis path').remove()
  svg
    .selectAll('.y-axis line')
    .attr('stroke-dasharray', 2)
    .attr('stroke', 'grey')
}
