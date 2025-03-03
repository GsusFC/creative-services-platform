import { FEATURES } from '@/config/features';
import { redirect } from 'next/navigation';

export default function FieldMapperV4Layout({ children }: { children: React.ReactNode }) {
  if (!FEATURES.fieldMapper.enabled || !FEATURES.fieldMapper.versions.v4) {
    redirect('/admin/not-available');
  }
  return <>{children}</>;
}