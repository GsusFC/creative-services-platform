/**
 * Página de Field Mapper V4
 */

import FieldMapperV4 from '@/components/field-mapper-v4/client/FieldMapperV4';

export const metadata = {
  title: 'Field Mapper V4',
  description: 'Mapeo simplificado entre Notion y Case Studies',
};

export default function FieldMapperV4Page() {
  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Field Mapper V4</h1>
      <div className="h-[calc(100vh-150px)]">
        <FieldMapperV4 />
      </div>
    </div>
  );
}
