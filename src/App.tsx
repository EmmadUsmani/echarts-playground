import { useEffect, useRef } from "react"
import { init, type EChartsType } from "echarts"
import { Decimal } from "decimal.js"

type Datum = {
  x: number
  y: number | null
  y2: number | null
}

function interpolateY(currDatum: Datum, prevDatum: Datum, x: number) {
  if (currDatum.y == null || prevDatum.y == null) {
    return null
  }

  const slope = (currDatum.y - prevDatum.y) / (currDatum.x - prevDatum.x)
  const intercept = currDatum.y - slope * currDatum.x
  return slope * x + intercept
}

function interpolateY2(currDatum: Datum, prevDatum: Datum, x: number) {
  if (currDatum.y2 == null || prevDatum.y2 == null) {
    return null
  }

  const slope = (currDatum.y2 - prevDatum.y2) / (currDatum.x - prevDatum.x)
  const intercept = currDatum.y2 - slope * currDatum.x
  return slope * x + intercept
}

const DATA = [
  { x: 1, y: 1, y2: 5 },
  { x: 2, y: 2, y2: 4 },
  { x: 2.1, y: 2, y2: 0 },
  // { x: 2.11, y: null, y2: 5 },
  { x: 3, y: 2, y2: 1 },
  { x: 4, y: 2, y2: 0.5 },
  { x: 5, y: 2, y2: 7.111 },
]

let minInterval = new Decimal(Infinity)
for (let i = 1; i < DATA.length; i++) {
  minInterval = new Decimal(
    Decimal.min(Decimal.abs(DATA[i].x - DATA[i - 1].x), minInterval)
  )
}

const minX = Decimal.min(...DATA.map((datum) => datum.x))
const maxX = Decimal.max(...DATA.map((datum) => datum.x))

const newData: {
  x: number
  y: number | null
  y2: number | null
  originalX: number | null
}[] = [{ ...DATA[0], originalX: DATA[0].x }]
let dataIndex = 1
for (
  let i = Decimal.add(minX, minInterval);
  i <= Decimal.add(maxX, minInterval) && dataIndex < DATA.length;
  i = Decimal.add(i, minInterval).toDecimalPlaces(5)
) {
  const currDatum = DATA[dataIndex]
  const prevDatum = DATA[dataIndex - 1]

  // keep "jumping" the minInterval, if we jump over a value in DATA we add it to newData
  if (i >= new Decimal(DATA[dataIndex].x)) {
    newData.push({
      x: i.toDecimalPlaces(5).toNumber(),
      y: DATA[dataIndex].y,
      y2: DATA[dataIndex].y2,
      originalX: DATA[dataIndex].x,
    })
    dataIndex++
  } else {
    newData.push({
      x: i.toDecimalPlaces(5).toNumber(),
      y: null,
      y2: null,
      // y: interpolateY(currDatum, prevDatum, i.toDecimalPlaces(5).toNumber()),
      // y2: interpolateY2(currDatum, prevDatum, i.toDecimalPlaces(5).toNumber()),
      originalX: null,
    })
  }
}

function getSymbol(value: any) {
  if (value.originalX === null) {
    return "none"
  }
  return "circle"
}

const OPTION = {
  dataset: {
    dimensions: ["x", "y", "y2"],
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
      stack: "stack",
      areaStyle: {
        opacity: 1,
        origin: 0,
      },
      encode: {
        x: "x",
        y: "y",
      },
      triggerLineEvent: false,
      connectNulls: true,
      symbol: getSymbol,
      // smooth: true,
      // step: true,
    },
    {
      type: "line",
      stack: "stack",
      areaStyle: {
        opacity: 1,
        origin: 0,
      },
      emphasis: {
        disabled: true,
      },
      stackStrategy: "all",
      encode: {
        x: "x",
        y: "y2",
      },
      connectNulls: true,
      symbol: getSymbol,
      // smooth: true,
      // step: true,
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
    chartRef.current.dispatchAction({ type: "highlight", seriesIndex: 0 })
  }, [])

  return <div ref={chartElemRef} />
}
