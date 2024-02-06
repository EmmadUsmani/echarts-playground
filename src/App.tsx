import { useEffect, useRef } from "react"
import { init, type EChartsType } from "echarts"
import { Decimal } from "decimal.js"

const DATA = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 2.1, y: 2 },
  { x: 3, y: 2 },
  { x: 4, y: 2 },
  { x: 6, y: 2 },
]

let minInterval = new Decimal(Infinity)
for (let i = 1; i < DATA.length; i++) {
  minInterval = new Decimal(
    Decimal.min(Decimal.abs(DATA[i].x - DATA[i - 1].x), minInterval)
  )
}

const minX = Decimal.min(...DATA.map((datum) => datum.x))
const maxX = Decimal.max(...DATA.map((datum) => datum.x))

const newData: { x: number; y: number; originalX: number | null }[] = [
  { ...DATA[0], originalX: DATA[0].x },
]
let dataIndex = 1
for (
  let i = Decimal.add(minX, minInterval);
  i <= Decimal.add(maxX, minInterval) && dataIndex < DATA.length;
  i = Decimal.add(i, minInterval)
) {
  // keep "jumping" the minInterval, if we jump over a value in DATA we add it to newData
  if (i >= new Decimal(DATA[dataIndex].x)) {
    newData.push({
      x: i.toDecimalPlaces(5).toNumber(),
      y: DATA[dataIndex].y,
      originalX: DATA[dataIndex].x,
    })
    dataIndex++
  } else {
    newData.push({
      x: i.toDecimalPlaces(5).toNumber(),
      y: null,
      originalX: null,
    })
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
      connectNulls: true,
      symbol: (value) => {
        if (value.originalX === null) {
          return "none"
        }
        return "circle"
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
