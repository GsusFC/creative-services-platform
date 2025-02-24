export type PlanFeature = {
  title: string
  description: string
  included: boolean
}

export type Plan = {
  id: string
  name: string
  description: string
  credits: number
  features: PlanFeature[]
  isPopular?: boolean
  isBestValue?: boolean
}

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    description: 'Perfect for small teams and startups',
    credits: 40,
    features: [
      { title: 'ACCESS TO ALL CREATIVE SERVICES', description: 'Full access to our creative services platform', included: true },
      { title: 'DEDICATED CREATIVE TEAM', description: 'Work with our experienced creative professionals', included: true },
      { title: 'PROJECT MANAGEMENT TEAM', description: 'Get support from our project managers', included: true },
      { title: 'UNLIMITED PROJECTS & BRANDS', description: 'No limit on the number of projects or brands', included: true },
      { title: 'UNLIMITED USERS & STORAGE', description: 'Add as many team members as you need', included: true },
      { title: 'AI-ENHANCED CAPABILITIES', description: 'Access to our AI-powered tools', included: true },
      { title: '30-DAY FREE TRIAL', description: 'Try our platform risk-free', included: true },
      { title: 'PRIORITY SUPPORT', description: '24/7 priority customer support', included: false },
      { title: 'CUSTOM WORKFLOWS', description: 'Create and customize your workflows', included: false },
      { title: 'API ACCESS', description: 'Access to our API for custom integrations', included: false }
    ]
  },
  {
    id: 'pro',
    name: 'PRO',
    description: 'Best for growing businesses',
    credits: 120,
    isPopular: true,
    features: [
      { title: 'ACCESS TO ALL CREATIVE SERVICES', description: 'Full access to our creative services platform', included: true },
      { title: 'DEDICATED CREATIVE TEAM', description: 'Work with our experienced creative professionals', included: true },
      { title: 'PROJECT MANAGEMENT TEAM', description: 'Get support from our project managers', included: true },
      { title: 'UNLIMITED PROJECTS & BRANDS', description: 'No limit on the number of projects or brands', included: true },
      { title: 'UNLIMITED USERS & STORAGE', description: 'Add as many team members as you need', included: true },
      { title: 'AI-ENHANCED CAPABILITIES', description: 'Access to our AI-powered tools', included: true },
      { title: '30-DAY FREE TRIAL', description: 'Try our platform risk-free', included: true },
      { title: 'PRIORITY SUPPORT', description: '24/7 priority customer support', included: true },
      { title: 'CUSTOM WORKFLOWS', description: 'Create and customize your workflows', included: true },
      { title: 'API ACCESS', description: 'Access to our API for custom integrations', included: false }
    ]
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    description: 'For large organizations',
    credits: 200,
    isBestValue: true,
    features: [
      { title: 'ACCESS TO ALL CREATIVE SERVICES', description: 'Full access to our creative services platform', included: true },
      { title: 'DEDICATED CREATIVE TEAM', description: 'Work with our experienced creative professionals', included: true },
      { title: 'PROJECT MANAGEMENT TEAM', description: 'Get support from our project managers', included: true },
      { title: 'UNLIMITED PROJECTS & BRANDS', description: 'No limit on the number of projects or brands', included: true },
      { title: 'UNLIMITED USERS & STORAGE', description: 'Add as many team members as you need', included: true },
      { title: 'AI-ENHANCED CAPABILITIES', description: 'Access to our AI-powered tools', included: true },
      { title: '30-DAY FREE TRIAL', description: 'Try our platform risk-free', included: true },
      { title: 'PRIORITY SUPPORT', description: '24/7 priority customer support', included: true },
      { title: 'CUSTOM WORKFLOWS', description: 'Create and customize your workflows', included: true },
      { title: 'API ACCESS', description: 'Access to our API for custom integrations', included: true }
    ]
  }
]

export const faqs = [
  {
    question: 'What are credits?',
    answer: 'Credits are our platform\'s currency for creative services. Each credit can be used to request design work, illustrations, or other creative services. The number of credits required depends on the complexity and scope of the project.'
  },
  {
    question: 'How long do credits last?',
    answer: 'Credits are valid for 12 months from the date of purchase. Unused credits will roll over to the next month within this period.'
  },
  {
    question: 'Can I change my plan?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.'
  },
  {
    question: 'What happens if I run out of credits?',
    answer: 'If you run out of credits, you can purchase additional credits at any time or wait until your next billing cycle when your credits will be replenished.'
  },
  {
    question: 'Do you offer custom plans?',
    answer: 'Yes! For organizations with specific needs, we offer custom plans with tailored credit amounts and features. Contact our sales team to learn more.'
  }
]
