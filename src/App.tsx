import { useEffect, useRef } from "react"
import { init, SankeySeriesOption, type EChartsType } from "echarts"

const series: SankeySeriesOption = {
  type: "sankey",
  data: [
    {
      name: "a",
    },
    {
      name: "b",
    },
    {
      name: "a1",
    },
    {
      name: "a2",
    },
    {
      name: "b1",
      localX: 0.6773333333333333,
      localY: 0.4949707602339183,
    },
    {
      name: "c",
    },
  ],
  links: [
    {
      source: "a",
      target: "a1",
      value: 5,
    },
    {
      source: "a",
      target: "a2",
      value: 3,
    },
    {
      source: "b",
      target: "b1",
      value: 8,
    },
    {
      source: "a",
      target: "b1",
      value: 3,
    },
    // {
    //   source: 'b1',
    //   target: 'a1',
    //   value: 1
    // },
    {
      source: "c",
      target: "a",
      value: 2,
    },
  ],
}

const OPTION = {
  series: [series],
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

    chartRef.current.on("mouseup", (params) => {
      console.log(params)
    })
  }, [])

  return <div ref={chartElemRef} />
}
