import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      <div className="container mx-auto pt-[80px] pb-24 relative">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-druk text-[clamp(2rem,5vw,4rem)] uppercase mb-6">{title}</h1>
          {description && (
            <p className="font-geist text-white/60 max-w-2xl">{description}</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
