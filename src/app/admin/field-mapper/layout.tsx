import { FEATURES } from '@/config/features';
import { redirect } from 'next/navigation';

export default function FieldMapperBaseLayout({ children }: { children: React.ReactNode }) {
  if (!FEATURES.fieldMapper.enabled || !FEATURES.fieldMapper.versions.base) {
    redirect('/admin/not-available');
  }
  return <>{children}</>;
}