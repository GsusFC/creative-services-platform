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
      { title: 'ACCESS TO ALL CREATIVE SERVICES', description: 'Full access to our creative services catalog', included: true },
      { title: 'DEDICATED CREATIVE TEAM', description: 'Work with our experienced creative professionals', included: true },
      { title: 'PROJECT MANAGEMENT TEAM', description: 'Get support from our project managers', included: true },
      { title: 'MULTIPLE BRANDS', description: 'Support for up to 2 brands', included: true },
      { title: 'TEAM MEMBERS', description: 'Up to 3 team members', included: true },
      { title: 'REVISION ROUNDS', description: '2 revision rounds per project', included: true },
      { title: 'BASIC SUPPORT', description: 'Email support with 24h response time', included: true },
      { title: 'SOURCE FILES', description: 'Access to source files', included: false },
      { title: 'RUSH DELIVERY', description: 'Priority delivery for urgent projects', included: false },
      { title: 'DEDICATED ACCOUNT MANAGER', description: 'Personal account manager for your team', included: false }
    ]
  },
  {
    id: 'pro',
    name: 'PRO',
    description: 'Best for growing businesses',
    credits: 120,
    isPopular: true,
    features: [
      { title: 'ACCESS TO ALL CREATIVE SERVICES', description: 'Full access to our creative services catalog', included: true },
      { title: 'DEDICATED CREATIVE TEAM', description: 'Work with our experienced creative professionals', included: true },
      { title: 'PROJECT MANAGEMENT TEAM', description: 'Get support from our project managers', included: true },
      { title: 'MULTIPLE BRANDS', description: 'Support for up to 5 brands', included: true },
      { title: 'TEAM MEMBERS', description: 'Up to 10 team members', included: true },
      { title: 'REVISION ROUNDS', description: '3 revision rounds per project', included: true },
      { title: 'PRIORITY SUPPORT', description: 'Priority email support with 12h response time', included: true },
      { title: 'SOURCE FILES', description: 'Access to source files', included: true },
      { title: 'RUSH DELIVERY', description: 'Priority delivery for urgent projects', included: true },
      { title: 'DEDICATED ACCOUNT MANAGER', description: 'Personal account manager for your team', included: false }
    ]
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    description: 'For large organizations',
    credits: 200,
    isBestValue: true,
    features: [
      { title: 'ACCESS TO ALL CREATIVE SERVICES', description: 'Full access to our creative services catalog', included: true },
      { title: 'DEDICATED CREATIVE TEAM', description: 'Work with our experienced creative professionals', included: true },
      { title: 'PROJECT MANAGEMENT TEAM', description: 'Get support from our project managers', included: true },
      { title: 'MULTIPLE BRANDS', description: 'Unlimited brands', included: true },
      { title: 'TEAM MEMBERS', description: 'Unlimited team members', included: true },
      { title: 'REVISION ROUNDS', description: 'Unlimited revision rounds', included: true },
      { title: 'VIP SUPPORT', description: 'VIP support with 4h response time', included: true },
      { title: 'SOURCE FILES', description: 'Access to source files', included: true },
      { title: 'RUSH DELIVERY', description: 'Priority delivery for urgent projects', included: true },
      { title: 'DEDICATED ACCOUNT MANAGER', description: 'Personal account manager for your team', included: true }
    ]
  }
]

export const faqs = [
  {
    question: 'What are credits?',
    answer: 'Credits are our currency for creative services. Each credit represents a unit of creative work, with different services requiring different amounts of credits based on complexity. For example, a simple logo variation might cost 1 credit, while a complete brand identity could cost 5 credits.'
  },
  {
    question: 'How do revision rounds work?',
    answer: 'Each project includes a set number of revision rounds based on your plan (2 rounds for Starter, 3 for Pro, unlimited for Enterprise). A revision round is your opportunity to request changes to the delivered work. Additional revision rounds can be purchased if needed.'
  },
  {
    question: 'What does rush delivery mean?',
    answer: 'Rush delivery, available in Pro and Enterprise plans, puts your project at the front of our queue. While standard delivery takes 3-5 business days, rush delivery ensures delivery within 1-2 business days depending on project complexity.'
  },
  {
    question: 'How many brands can I manage?',
    answer: 'The number of brands you can manage depends on your plan: Starter supports up to 2 brands, Pro supports up to 5 brands, and Enterprise allows unlimited brands. A brand represents a unique identity with its own visual assets and guidelines.'
  },
  {
    question: 'What support options are available?',
    answer: 'Each plan includes different levels of support: Starter has email support with 24h response time, Pro includes priority support with 12h response time, and Enterprise features VIP support with 4h response time and a dedicated account manager.'
  },
  {
    question: 'What are source files?',
    answer: 'Source files are the original, editable design files (like Adobe Photoshop, Illustrator, or Figma files). Pro and Enterprise plans include access to these files, allowing you to make minor adjustments or use them as a base for future projects.'
  },
  {
    question: 'Can I add more team members?',
    answer: 'Yes, but the number of team members is limited by your plan: Starter allows up to 3 members, Pro up to 10 members, and Enterprise has no limit. Team members can view, comment, and manage projects.'
  },
  {
    question: 'What happens if I run out of credits?',
    answer: 'If you run out of credits, you can purchase additional credit packs at any time without changing your plan. Unused credits roll over to the next month as long as your subscription remains active.'
  }
]
