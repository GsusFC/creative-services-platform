import { CaseStudy } from '@/types/case-study';

export async function syncStudyWithNotion(study: CaseStudy): Promise<boolean> {
  try {
    const response = await fetch('/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sync',
        id: study.id,
        data: study
      }),
    });

    if (!response.ok) {
      throw new Error(`Error syncing with Notion: ${response.statusText}`);
    }

    const result = await response.json();
    return !result.error;
  } catch (error) {
    console.error('Error syncing with Notion:', error);
    return false;
  }
}
