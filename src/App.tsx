import { useEffect, useRef, useState } from "react"
import { init, type EChartsType } from "echarts"
import Tippy from "@tippyjs/react"

const OPTION = {
  series: [
    {
      type: "sunburst",
      radius: ["40%", "70%"],
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
      ],
    },
  ],
}

export function App() {
  const chartElemRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<EChartsType>()
  const [tooltipTarget, setTooltipTarget] = useState<HTMLElement | null>(null)

  function hoverHandler(event: any) {
    setTooltipTarget(event.event.event.target)
  }

  useEffect(() => {
    chartRef.current = init(chartElemRef.current, null, {
      width: 1000,
      height: 500,
      renderer: "svg",
    })
    chartRef.current.setOption(OPTION)

    chartRef.current.on("mouseover", hoverHandler)

    return () => {
      chartRef.current?.off("mouseover", hoverHandler)
    }
  }, [])

  return (
    <>
      <div ref={chartElemRef} />
      <Tippy content={<div>Tippy Content</div>} reference={tooltipTarget} />
    </>
  )
}
