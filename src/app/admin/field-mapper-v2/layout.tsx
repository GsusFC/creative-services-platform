import { FEATURES } from '@/config/features';
import { redirect } from 'next/navigation';

export default function FieldMapperV2Layout({ children }: { children: React.ReactNode }) {
  if (!FEATURES.fieldMapper.enabled || !FEATURES.fieldMapper.versions.v2) {
    redirect('/admin/not-available');
  }
  return <>{children}</>;
}