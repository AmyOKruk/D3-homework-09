import * as d3 from 'd3'

// Set up margin/height/width

const margin = { top: 30, left: 30, right: 100, bottom: 30 }
const height = 700 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

// Add your svg

const svg = d3
  .select('#chart-05')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)

const parseTime = d3.timeParse('%B-%y')

// Create your scales

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#fbb4ae',
    '#b3cde3',
    '#ccebc5',
    '#decbe4',
    '#fed9a6',
    '#ffffcc',
    '#e5d8bd',
    '#fddaec',
    '#f2f2f2'
  ])

const xPositionScale = d3.scaleLinear().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([180, 340])
  .range([height, 0])

// Create a d3.line function that uses your scales
const line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data
d3.csv(require('../data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Write your ready function

function ready(datapoints) {
  // Convert your months to dates

  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.month)
  })

  const dates = datapoints.map(function(d) {
    return d.datetime
  })

  const dateMax = d3.max(dates)
  const dateMin = d3.min(dates)

  xPositionScale.domain([dateMin, dateMax])
  // Group your data together
  const nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  console.log(nested)
  // Draw your lines

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    // .attr('stroke', 'black')
    .attr('fill', 'none')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 3)
  // Add your text on the right-hand side
  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('x', width)
    .attr('y', function(d) {
      const datapoints = d.values
      const July = datapoints.find(d => d.month === 'July-17')
      return yPositionScale(July.price)
    })
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .attr('dx', 8)
    .attr('fill', 'black')
    .attr('dy', function(d) {
      // Only push these two cities down some
      if (
        d.key === 'U.S.' ||
        d.key === 'West South Central' ||
        d.key === 'South Atlantic'
      ) {
        return -5
      }
      if (d.key === 'Middle Atlantic') {
        return 5
      } else {
        return 0
      }
    })

  nested.forEach(function(d) {
    // iterate over all the data for line to get the last point of a line.
    const last = d.values[d.values.length - d.values.length]
    console.log('Look:', last)
    svg
      .selectAll('circle')
      .data(nested)
      .enter()
      .append('circle')
      .attr('cx', width)
      .attr('cy', function(d) {
        const datapoints = d.values
        console.log('cy datapoints is', datapoints)
        const July = datapoints.find(d => d.month === 'July-17')
        return yPositionScale(July.price)
      })
      .attr('r', 3)
      .attr('fill', function(d) {
        return colorScale(d.key)
      })
  })
  // Add your title

  // Add the shaded rectangle

  svg
    .data(nested)
    .append('rect')
    .lower()
    .attr('fill', 'blue')
    .attr('opacity', 0.1)
    .attr('width', function(d) {
      const datapoints = d.values
      const Dec = datapoints.find(d => d.month === 'December-16')
      const Feb = datapoints.find(d => d.month === 'February-17')
      console.log('const Dec is', Dec)
      console.log('const Feb is', Feb)
      // xScale(d.end_dt) - xScale(d.start_dt)
      return xPositionScale(Feb.datetime) - xPositionScale(Dec.datetime)
    })
    .attr('height', height)
    // const datapoints = d.values
    .attr('y', 0)
    .attr('x', function(d) {
      const datapoints = d.values
      const Dec = datapoints.find(d => d.month === 'December-16')
      return xPositionScale(Dec.datetime)
    })

  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %Y'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale).tickSize(-width)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
