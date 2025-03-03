import Process from '@/components/process/Process';

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="reduced-container pt-32 md:pt-40">
        <div className="grid-layout">
          <div className="title-section">
            <h1 className="text-5xl sm:text-6xl md:text-7xl text-white mb-12">
              PROCESS
            </h1>
          </div>
          <div className="content-section">
            <Process />
          </div>
        </div>
      </div>
    </main>
  )
}
