'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectDetail {
  title: string
  description: string
  client: string
  services: string[]
  year: string
  heroImage: string
  content: {
    type: 'text' | 'image' | 'video' | 'grid'
    value: string | string[]
    size?: 'small' | 'medium' | 'large' | 'full'
    layout?: 'left' | 'right' | 'center'
  }[]
  nextProject: {
    title: string
    slug: string
    image: string
  }
}

// This would come from your CMS or API
const PROJECT_DATA: ProjectDetail = {
  title: 'ADIDAS ORIGINALS',
  description: 'DIGITAL CAMPAIGN FOR NEW COLLECTION LAUNCH FEATURING DYNAMIC VISUALS AND INTERACTIVE ELEMENTS',
  client: 'ADIDAS',
  services: ['BRAND CAMPAIGN', 'ART DIRECTION', 'MOTION DESIGN', 'DIGITAL DESIGN'],
  year: '2024',
  heroImage: '/projects/adidas-hero.jpg',
  content: [
    {
      type: 'text',
      value: 'WE COLLABORATED WITH ADIDAS ORIGINALS TO CREATE A DIGITAL-FIRST CAMPAIGN FOR THEIR LATEST COLLECTION. THE PROJECT FOCUSED ON BRINGING THE BRAND\'S HERITAGE INTO A CONTEMPORARY CONTEXT.',
      size: 'large'
    },
    {
      type: 'image',
      value: '/projects/adidas-1.jpg',
      size: 'full'
    },
    {
      type: 'grid',
      value: ['/projects/adidas-2.jpg', '/projects/adidas-3.jpg'],
      size: 'full'
    },
    {
      type: 'text',
      value: 'THE CAMPAIGN LEVERAGES CUTTING-EDGE ANIMATION AND INTERACTIVE ELEMENTS TO CREATE AN IMMERSIVE DIGITAL EXPERIENCE THAT CELEBRATES THE BRAND\'S ICONIC DESIGN LANGUAGE.',
      size: 'medium',
      layout: 'right'
    },
    {
      type: 'video',
      value: '/projects/adidas-video.mp4',
      size: 'full'
    }
  ],
  nextProject: {
    title: 'NIKE ACG',
    slug: 'nike-acg',
    image: '/projects/nike-hero.jpg'
  }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={PROJECT_DATA.heroImage}
          alt={PROJECT_DATA.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1 
            className="text-8xl text-center"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {PROJECT_DATA.title}
          </motion.h1>
        </div>
      </motion.section>

      {/* Project Info */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            className="space-y-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div>
              <h2 className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>CLIENT</h2>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-geist-mono)' }}>{PROJECT_DATA.client}</p>
            </div>
            <div>
              <h2 className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>SERVICES</h2>
              <div className="space-y-1">
                {PROJECT_DATA.services.map((service, index) => (
                  <p key={index} className="text-2xl" style={{ fontFamily: 'var(--font-geist-mono)' }}>{service}</p>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>YEAR</h2>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-geist-mono)' }}>{PROJECT_DATA.year}</p>
            </div>
          </motion.div>
          <motion.p 
            className="text-2xl leading-relaxed"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {PROJECT_DATA.description}
          </motion.p>
        </div>
      </section>

      {/* Project Content */}
      <section className="space-y-24 mb-24">
        {PROJECT_DATA.content.map((item, index) => {
          if (item.type === 'text') {
            return (
              <motion.div 
                key={index}
                className={`container mx-auto px-4 ${
                  item.size === 'large' ? 'max-w-4xl' :
                  item.size === 'medium' ? 'max-w-2xl' : 'max-w-xl'
                } ${
                  item.layout === 'right' ? 'ml-auto' :
                  item.layout === 'center' ? 'mx-auto' : ''
                }`}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p 
                  className="text-3xl leading-relaxed"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  {item.value}
                </p>
              </motion.div>
            )
          }

          if (item.type === 'image') {
            return (
              <motion.div 
                key={index}
                className="relative h-screen"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src={item.value as string}
                  alt=""
                  fill
                  className="object-cover"
                />
              </motion.div>
            )
          }

          if (item.type === 'grid') {
            return (
              <motion.div 
                key={index}
                className="container mx-auto px-4 grid grid-cols-2 gap-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {(item.value as string[]).map((src, i) => (
                  <div key={i} className="relative aspect-square">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            )
          }

          if (item.type === 'video') {
            return (
              <motion.div 
                key={index}
                className="relative h-screen"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <video
                  src={item.value as string}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )
          }
        })}
      </section>

      {/* Next Project */}
      <Link href={`/work/${PROJECT_DATA.nextProject.slug}`}>
        <motion.section 
          className="relative h-screen cursor-pointer group"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={PROJECT_DATA.nextProject.image}
            alt={PROJECT_DATA.nextProject.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p 
              className="text-xl mb-4"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              NEXT PROJECT
            </motion.p>
            <motion.h2 
              className="text-6xl text-center"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {PROJECT_DATA.nextProject.title}
            </motion.h2>
          </div>
        </motion.section>
      </Link>
    </div>
  )
}
