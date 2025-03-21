import { CaseStudyDetailContent } from '../../components/notion/CaseStudyDetailContent'

interface CaseStudyDetailProps {
  params: {
    id: string
  }
}

export default async function CaseStudyDetail({ params }: CaseStudyDetailProps) {
  return <CaseStudyDetailContent id={params.id} />
}
