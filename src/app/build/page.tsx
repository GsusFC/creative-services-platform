import { NotionData } from '@/components/NotionData';

export default function BuildPage() {
  return (
    <div className="reduced-container py-24">
      <div className="grid-layout">
        <div className="title-section">
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl text-white mb-12"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            BUILD
          </h1>
        </div>
        <div className="content-section">
          <NotionData />
        </div>
      </div>
    </div>
  );
}
