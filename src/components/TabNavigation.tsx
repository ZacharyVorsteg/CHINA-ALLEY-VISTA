import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'border-slate-900 text-slate-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`-ml-0.5 mr-2 h-5 w-5 transition-colors ${
                isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
              }`} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;