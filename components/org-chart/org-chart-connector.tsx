'use client'

interface OrgChartConnectorProps {
  startX: number
  startY: number
  endX: number
  endY: number
}

export function OrgChartConnector({ startX, startY, endX, endY }: OrgChartConnectorProps) {
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <path
        d={`M ${startX} ${startY} L ${startX} ${endY} L ${endX} ${endY}`}
        stroke="rgb(34 197 94 / 0.3)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  )
}
