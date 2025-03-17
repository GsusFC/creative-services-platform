import { HaikuSystem } from './components/HaikuSystem';
import './styles/typography.css';
import './styles/components.css';

export default function HaikuSystemPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <HaikuSystem />
    </div>
  );
}
