import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { 
  Home as HomeIcon, 
  Award, 
  Target, 
  Newspaper, 
  Calendar, 
  BookOpen, 
  Users, 
  Mail,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Search
} from 'lucide-react';

import DashboardAwards from './dashboard/DashboardAwards';
import DashboardMission from './dashboard/DashboardMission';
import DashboardNews from './dashboard/DashboardNews';
import DashboardEvents from './dashboard/DashboardEvents';
import DashboardPublications from './dashboard/DashboardPublications';
import DashboardCommunity from './dashboard/DashboardCommunity';
import DashboardContact from './dashboard/DashboardContact';
import DashboardTheme from './dashboard/DashboardTheme';
import DashboardSEO from './dashboard/DashboardSEO';

interface DashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const dashboardNavItems = [

  { id: 'awards', label: 'Awards', icon: Award, component: DashboardAwards },
  { id: 'mission', label: 'Mission', icon: Target, component: DashboardMission },
  { id: 'news', label: 'News', icon: Newspaper, component: DashboardNews },
  { id: 'events', label: 'Events', icon: Calendar, component: DashboardEvents },
  { id: 'publications', label: 'Publications', icon: BookOpen, component: DashboardPublications },
  { id: 'community', label: 'Community', icon: Users, component: DashboardCommunity },
  { id: 'contact', label: 'Contact Us', icon: Mail, component: DashboardContact },
  { id: 'seo', label: 'SEO', icon: Search, component: DashboardSEO },
  { id: 'theme', label: 'Theme', icon: Sun, component: DashboardTheme },
];

export default function Dashboard({ user, onLogout, isDark, onToggleTheme }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('awards');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const ActiveComponent = dashboardNavItems.find(item => item.id === activeSection)?.component || DashboardAwards;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 h-16 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b z-50 flex items-center justify-between px-6`}>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
            ARE OPC Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="rounded-full"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <div className="text-right">
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          <Button
            onClick={onLogout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 w-64 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-r transition-transform duration-300 z-40 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="p-4 space-y-2">
            {dashboardNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-yellow-500 to-blue-600 text-white shadow-lg'
                      : isDark
                      ? 'text-gray-300 hover:bg-slate-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 lg:ml-64 p-6 transition-all duration-300 ${!sidebarOpen ? 'ml-0' : ''}`}>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        </main>
      </div>
    </div>
  );
}