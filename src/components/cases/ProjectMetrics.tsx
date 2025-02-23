'use client'

import { ProjectMetrics as Metrics } from '@/types/projects'
import { motion } from 'framer-motion'

interface Props {
  metrics: Metrics[]
  color: string
}

export function ProjectMetrics({ metrics, color }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-lg"
          style={{ backgroundColor: color + '10' }}
        >
          <div className="space-y-2">
            <p 
              className="text-3xl font-druk"
              style={{ color }}
            >
              {metric.value}
            </p>
            <p className="text-white font-mono uppercase tracking-wider text-sm">
              {metric.label}
            </p>
            {metric.description && (
              <p className="text-white/60 text-sm">
                {metric.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
