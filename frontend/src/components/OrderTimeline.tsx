import type { Order } from '../types'

const steps = [
  { key: 'processing', label: 'Processing' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out-for-delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
] as const

export function OrderTimeline({ order }: { order: Order }) {
  return (
    <div className="timeline">
      {steps.map((step, index) => {
        const isActive = step.key === order.status
        const isComplete = steps.findIndex((s) => s.key === order.status) >= index
        return (
          <div key={step.key} className={`timeline-step ${isComplete ? 'complete' : ''} ${isActive ? 'active' : ''}`}>
            <div className="dot" />
            <span>{step.label}</span>
          </div>
        )
      })}
    </div>
  )
}

