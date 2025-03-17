import { FlagSystem } from './components/FlagSystem';
import './styles/typography.css';
import './styles/components.css';
import './styles/reset.css';

export default function FlagSystemPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <FlagSystem />
    </div>
  );
}
