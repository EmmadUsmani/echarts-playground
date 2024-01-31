import { useEffect, useRef } from "react"
import { init, type EChartsType } from "echarts"

type Datum = {
  x: number
  y: number
}

function interpolateY(currDatum: Datum, prevDatum: Datum, x: number) {
  const slope = (currDatum.y - prevDatum.y) / (currDatum.x - prevDatum.x)
  const intercept = currDatum.y - slope * currDatum.x
  return slope * x + intercept
}

const DATA = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 2.1, y: 3 },
  { x: 2.5, y: 4 },
  { x: 3, y: 5 },
  { x: 3.789, y: 6 },
  { x: 4.23, y: 7 },
  { x: 5, y: 8 },
  { x: 7, y: 9 },
]

let minInterval = Infinity
for (let i = 1; i < DATA.length; i++) {
  minInterval = Math.min(Math.abs(DATA[i].x - DATA[i - 1].x), minInterval)
}

const minX = Math.min(...DATA.map((datum) => datum.x))
const maxX = Math.max(...DATA.map((datum) => datum.x))

const newData = [DATA[0]]
let dataIndex = 1
for (let i = minX + minInterval; i <= maxX + minInterval; i += minInterval) {
  const currDatum = DATA[dataIndex]
  const prevDatum = DATA[dataIndex - 1]

  // keep "jumping" the minInterval, if we jump over a value in DATA we add it to newData
  if (i >= DATA[dataIndex].x) {
    newData.push({ x: i, y: DATA[dataIndex].y })
    dataIndex++
  } else {
    newData.push({ x: i, y: interpolateY(currDatum, prevDatum, i) })
  }
}

const OPTION = {
  dataset: {
    dimensions: ["x", "y"],
    source: newData,
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "line",
      encode: {
        x: "x",
        y: "y",
      },
    },
  ],
  tooltip: {
    trigger: "axis",
  },
}

export function App() {
  const chartElemRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<EChartsType>()

  useEffect(() => {
    chartRef.current = init(chartElemRef.current, null, {
      width: 1000,
      height: 500,
      renderer: "svg",
    })
    chartRef.current.setOption(OPTION)
  }, [])

  return <div ref={chartElemRef} />
}
