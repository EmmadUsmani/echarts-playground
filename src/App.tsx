import { useEffect, useRef } from "react"
import { init, type EChartsType } from "echarts"

const OPTION = {
  series: [
    {
      type: "sunburst",
      radius: ["40%", "70%"],
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
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
