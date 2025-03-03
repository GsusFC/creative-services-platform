import { FEATURES } from '@/config/features';
import { redirect } from 'next/navigation';

export default function FieldMapperFunctionalLayout({ children }: { children: React.ReactNode }) {
  if (!FEATURES.fieldMapper.enabled || !FEATURES.fieldMapper.versions.functional) {
    redirect('/admin/not-available');
  }
  return <>{children}</>;
}