import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const steps = [
  {
    title: 'BRIEF',
    description: 'We start by understanding your needs, goals, and vision. Our team works closely with you to define project scope, objectives, and deliverables.',
    image: '/images/process/brief.jpg'
  },
  {
    title: 'RESEARCH',
    description: 'Our team conducts thorough research on your industry, competitors, and target audience to ensure our creative solutions are strategic and effective.',
    image: '/images/process/research.jpg'
  },
  {
    title: 'IDEATION',
    description: 'We brainstorm and develop multiple creative concepts, exploring different approaches to solve your challenges innovatively.',
    image: '/images/process/ideation.jpg'
  },
  {
    title: 'CREATION',
    description: 'Our skilled creative team brings the chosen concept to life, crafting high-quality deliverables that align with your brand and objectives.',
    image: '/images/process/creation.jpg'
  },
  {
    title: 'REVIEW',
    description: 'You review our work and provide feedback. We refine and iterate based on your input to ensure the final product exceeds expectations.',
    image: '/images/process/review.jpg'
  },
  {
    title: 'DELIVERY',
    description: 'Once approved, we deliver your project in all required formats, along with any necessary documentation or guidelines.',
    image: '/images/process/delivery.jpg'
  }
]

export function Process() {
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Hero Section */}
      <div className="text-center mb-24">
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl text-white mb-8"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        >
          Our Process
        </h1>
        <p 
          className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          We follow a structured yet flexible creative process that ensures high-quality results while maintaining clear communication and collaboration throughout the project.
        </p>
      </div>

      {/* Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300"
          >
            <div className="relative h-48">
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 
                className="text-2xl text-white mb-4"
                style={{ fontFamily: 'var(--font-druk-text-wide)' }}
              >
                {index + 1}. {step.title}
              </h3>
              <p 
                className="text-white/60"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-24">
        <h2 
          className="text-3xl text-white mb-8"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        >
          Ready to Start Your Project?
        </h2>
        <a 
          href="/pricing" 
          className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all duration-300"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          GET STARTED
        </a>
      </div>
    </div>
  )
}
