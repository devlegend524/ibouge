import React from 'react'
import HighchartsReact from 'highcharts-react-official'

const MapChart = ({ options, highcharts, containerProps }) => <HighchartsReact
  highcharts={highcharts}
  constructorType={'mapChart'}
  allowChartUpdate = { true }
  immutable = { false }
  updateArgs = { [true, true, true] }
  containerProps = {containerProps}
  options={options}
/>

export default MapChart