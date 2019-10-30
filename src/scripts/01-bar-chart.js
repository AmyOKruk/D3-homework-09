import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, height])

const ColorScale = d3
  .scaleOrdinal()
  .domain(['Asia', 'Europe', 'Africa', 'N. America', 'S. America'])
  .range(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'])

d3.csv(require('../data/countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  d3.select('#Asia').on('click', function() {
    console.log('clicked')

    svg.selectAll('rect').attr('fill', 'lightgrey')

    svg
      .selectAll('.asia')
      .attr('fill', '#8dd3c7')
      .raise()
  })

  d3.select('#Africa').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg
      .selectAll('.africa')
      .attr('fill', '#bebada')
      .raise()
  })

  d3.select('#NAmerica').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg
      .selectAll('.namerica')
      .attr('fill', '#fb8072')
      .raise()
  })

  d3.select('#GDP').on('click', function() {
    console.log('clicked')
    svg
      .selectAll('rect')
      .attr('fill', function(d) {
        if (d.gdp_per_capita < 5000) {
          return '#fdb462'
        } else {
          return 'lightgrey'
        }
      })
      .raise()
  })

  d3.select('#Continent').on('click', function() {
    console.log('clicked')
    svg
      .selectAll('rect')
      .attr('fill', d => ColorScale(d.continent))
      .raise()
  })

  d3.select('#Reset').on('click', function() {
    console.log('clicked')
    svg
      .selectAll('rect')
      .attr('fill', 'pink')
      .raise()
  })

  /* Add your rectangles here */
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => yPositionScale(d.life_expectancy))
    .attr('fill', 'pink')
    .attr('x', d => xPositionScale(d.country))
    .attr('y', d => height - yPositionScale(d.life_expectancy))
    .attr('class', d => d.continent.toLowerCase().replace(/[^a-z]*/g, ''))

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}
