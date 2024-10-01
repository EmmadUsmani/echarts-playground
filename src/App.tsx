import { useEffect, useRef } from "react"
import { init, SankeySeriesOption, type EChartsType } from "echarts"

import { QUERY_RESULTS, DIMENSIONS, METRIC_INDEX } from "./data"

type Row = (string | number | null)[]

type ColDesc = {
  name: string
  index: number
}

type Link = {
  source: string
  target: string
  value: number
}

function getNodeName(row: Row, colDesc: ColDesc) {
  let dimensionValue = row[colDesc.index]
  if (dimensionValue == null) {
    dimensionValue = "(empty)"
  }

  return `${dimensionValue}_${colDesc.name}`
}

const NULL_CHAR = "\0"
const EDGE_KEY_SEPARATOR = `${NULL_CHAR}_EDGE_KEY_SEPARATOR_${NULL_CHAR}`

function getEdgeKey(row: Row, source: ColDesc, dest: ColDesc) {
  return `${getNodeName(row, source)}${EDGE_KEY_SEPARATOR}${getNodeName(
    row,
    dest
  )}`
}

function getSourceTargetFromEdgeKey(edgeKey: string) {
  const [source, target] = edgeKey.split(EDGE_KEY_SEPARATOR)
  return { source, target }
}

function getMetricValue(row: Row) {
  const value = row[METRIC_INDEX]

  if (typeof value !== "number") {
    return 0
  }
  return value
}

export function App() {
  const nodes = new Set<string>()

  QUERY_RESULTS.forEach((row) => {
    DIMENSIONS.forEach((colDesc) => {
      nodes.add(getNodeName(row, colDesc))
    })
  })

  const edges = new Map<string, number>()

  QUERY_RESULTS.forEach((row) => {
    for (let i = 1; i < DIMENSIONS.length; i++) {
      const source = DIMENSIONS[i - 1]
      const dest = DIMENSIONS[i]

      const edgeKey = getEdgeKey(row, source, dest)
      const edgeValue = edges.get(edgeKey) ?? 0

      const metricValue = getMetricValue(row)
      edges.set(edgeKey, edgeValue + metricValue)
    }
  })

  const links: Link[] = []
  edges.forEach((value, key) => {
    const { source, target } = getSourceTargetFromEdgeKey(key)
    links.push({ source, target, value })
  })

  const series: SankeySeriesOption = {
    type: "sankey",
    data: Array.from(nodes).map((name) => ({ name })),
    links,
  }
  const option = {
    series: [series],
  }

  const chartElemRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<EChartsType>()

  useEffect(() => {
    chartRef.current = init(chartElemRef.current, null, {
      width: 1000,
      height: 500,
      renderer: "svg",
    })
    chartRef.current.setOption(option)

    chartRef.current.on("mouseup", (params) => {
      console.log(params)
    })
  }, [option])

  return <div ref={chartElemRef} />
}
