import React from 'react';
import { LightbulbIcon } from 'lucide-react';

export default function TipsPanel() {
  return (
    <div className="border border-yellow-900/20 rounded-md overflow-hidden">
      <div className="bg-yellow-950/30 p-3 border-b border-yellow-900/30">
        <h4 className="text-yellow-300 text-sm font-medium flex items-center gap-2">
          <LightbulbIcon className="h-4 w-4" />
          Tips & Hints
        </h4>
      </div>
      <div className="p-3 text-sm text-gray-300">
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-yellow-500/20 p-1 rounded mr-2 mt-0.5">
              <LightbulbIcon className="h-3 w-3 text-yellow-400" />
            </div>
            <span className="text-xs">Drag and drop fields to create new mappings.</span>
          </li>
          <li className="flex items-start">
            <div className="bg-yellow-500/20 p-1 rounded mr-2 mt-0.5">
              <LightbulbIcon className="h-3 w-3 text-yellow-400" />
            </div>
            <span className="text-xs">Incompatible field types will be highlighted in red.</span>
          </li>
          <li className="flex items-start">
            <div className="bg-yellow-500/20 p-1 rounded mr-2 mt-0.5">
              <LightbulbIcon className="h-3 w-3 text-yellow-400" />
            </div>
            <span className="text-xs">Use the test button to verify mappings with real Notion data.</span>
          </li>
          <li className="flex items-start">
            <div className="bg-yellow-500/20 p-1 rounded mr-2 mt-0.5">
              <LightbulbIcon className="h-3 w-3 text-yellow-400" />
            </div>
            <span className="text-xs">Save your mappings before navigating away from this page.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
