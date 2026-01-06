import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import logoImage from "figma:asset/52a6961ac67c010b9b64abc7b78abdf19a234eb0.png";
import Home from "./components/Home";
import Awards from "./components/Awards";
import Mission from "./components/Mission";
import News from "./components/News";
import Community from "./components/Community";
import Contact from "./components/Contact";
import Publications from "./components/Publications";
import Events from "./components/Events";
import AuthModal from "./components/AuthModal";
import Dashboard from "./components/Dashboard";
import SEO, { seoConfig } from "./components/SEO";

const navItems = [
  { id: "home", label: "Home", component: Home },
  { id: "awards", label: "Awards", component: Awards },
  { id: "mission", label: "Mission", component: Mission },
  { id: "news", label: "News", component: News },
  { id: "events", label: "Events", component: Events },
  { id: "publications", label: "Publications", component: Publications },
  { id: "community", label: "Community", component: Community },
  { id: "contact", label: "Contact Us", component: Contact },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Load the owner's default theme mode preference
    const defaultMode = localStorage.getItem('defaultThemeMode');
    return defaultMode === 'dark';
  });
  const [designTheme, setDesignTheme] = useState<"playful" | "corporate">("playful");
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const ActiveComponent =
    navItems.find((item) => item.id === activeTab)?.component ||
    Home;

  // Check for saved user session
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowDashboard(true);
    }
    
    // Load saved design theme
    const savedTheme = localStorage.getItem('designTheme');
    if (savedTheme === 'corporate' || savedTheme === 'playful') {
      setDesignTheme(savedTheme);
    }
    
    // Hint for admin access (will only show in browser console)
    console.log('%c🔐 Admin Access Hint', 'color: #fbbf24; font-size: 16px; font-weight: bold;');
    console.log('%cClick the logo 5 times quickly to access the admin dashboard', 'color: #60a5fa; font-size: 14px;');
  }, []);

  // Listen for theme changes from dashboard
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem('designTheme');
      if (savedTheme === 'corporate' || savedTheme === 'playful') {
        setDesignTheme(savedTheme);
        console.log(`%c🎨 Design Theme Changed to: ${savedTheme.toUpperCase()}`, `color: ${savedTheme === 'corporate' ? '#1e3a8a' : '#fbbf24'}; font-size: 14px; font-weight: bold;`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Reset logo click count after 2 seconds
  useEffect(() => {
    if (logoClickCount > 0) {
      const timer = setTimeout(() => setLogoClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [logoClickCount]);

  // Handle logo clicks for hidden admin access
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    
    if (newCount === 5) {
      setShowAuthModal(true);
      setLogoClickCount(0);
    }
  };

  const handleLogin = (userData: { email: string; name: string }) => {
    console.log('🔓 handleLogin called with:', userData);
    setUser(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setShowDashboard(true);
    console.log('✅ Dashboard should now be visible');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    setShowDashboard(false);
  };

  // Handle theme change - MUST be before any conditional returns
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Scroll to top when changing tabs - MUST be before any conditional returns
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Track mouse position for fancy effects - MUST be before any conditional returns
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (isDark) {
      document.addEventListener(
        "mousemove",
        updateMousePosition,
      );
      return () =>
        document.removeEventListener(
          "mousemove",
          updateMousePosition,
        );
    }
  }, [isDark]);

  // If logged in and showing dashboard, render dashboard
  if (showDashboard && user) {
    return (
      <>
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />
        <Toaster />
      </>
    );
  }

  return (
      <div
        className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
          designTheme === 'corporate'
            ? isDark
              ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
              : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
            : isDark
              ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
              : "bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50"
        }`}
      >
        {/* SEO Component - dynamically updates based on active tab */}
        <SEO {...(seoConfig[activeTab as keyof typeof seoConfig] || seoConfig.home)} />

        {/* Light mode nature background - ONLY FOR PLAYFUL THEME */}
        {!isDark && designTheme === 'playful' && (
          <>
            {/* Nature background pattern */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='40' cy='40' r='1.5'/%3E%3Cpath d='M10 15c2-2 5-2 7 0s2 5 0 7-5 2-7 0-2-5 0-7z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Floating nature elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
              {/* Large floating leaves */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`leaf-${i}`}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -50, 0],
                    x: [0, 20, 0],
                    rotate: [0, 360],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 15 + Math.random() * 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-green-500/30">
                    <path
                      fill="currentColor"
                      d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22.45C8.66,16.06 11.26,10.26 17,8.29C17,8.19 17,8.1 17,8Z"
                    />
                  </svg>
                </motion.div>
              ))}

              {/* Small floating particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `linear-gradient(45deg, ${
                      i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#fbbf24' : '#3b82f6'
                    }, ${
                      i % 3 === 0 ? '#059669' : i % 3 === 1 ? '#f59e0b' : '#1d4ed8'
                    })`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    x: [0, 15, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}

              {/* Organic shapes */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`shape-${i}`}
                  className="absolute"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.15, 0.05],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20 + Math.random() * 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className={`w-16 h-16 rounded-full blur-sm ${
                      i % 3 === 0 
                        ? 'bg-gradient-to-r from-green-200 to-blue-200' 
                        : i % 3 === 1 
                        ? 'bg-gradient-to-r from-yellow-200 to-green-200'
                        : 'bg-gradient-to-r from-blue-200 to-yellow-200'
                    }`}
                  />
                </motion.div>
              ))}

              {/* Flowing wave elements */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`wave-${i}`}
                  className="absolute w-32 h-1 opacity-10"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${20 + i * 20}%`,
                    background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                  }}
                  animate={{
                    x: [-100, window.innerWidth + 100],
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 12 + Math.random() * 8,
                    repeat: Infinity,
                    delay: i * 3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Nature-inspired corner decorations */}
            <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-10">
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
                  <path
                    fill="currentColor"
                    d="M50 10 C60 20, 70 30, 60 40 C50 50, 40 40, 30 30 C20 20, 30 10, 50 10 Z"
                    opacity="0.3"
                  />
                </svg>
              </motion.div>
            </div>

            <div className="fixed bottom-0 right-0 w-40 h-40 pointer-events-none z-10">
              <motion.div
                className="absolute inset-0 opacity-8"
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400">
                  <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.1" />
                  <circle cx="30" cy="30" r="15" fill="currentColor" opacity="0.1" />
                  <circle cx="70" cy="70" r="12" fill="currentColor" opacity="0.1" />
                </svg>
              </motion.div>
            </div>
          </>
        )}

        {/* Dark mode floating particles */}
        {isDark && designTheme === 'playful' && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 15, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
  
        {/* Mouse cursor glow effect for dark mode */}
        {isDark && designTheme === 'playful' && (
          <motion.div
            className="fixed pointer-events-none z-20 mix-blend-difference"
            style={{
              left: mousePosition.x - 20,
              top: mousePosition.y - 20,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full blur-sm"></div>
          </motion.div>
        )}
  
        {/* Navigation Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
          }}
          className={`sticky top-0 z-50 transition-all duration-500 ${
            designTheme === 'corporate'
              ? isDark
                ? "bg-slate-900/95 backdrop-blur-xl border-b border-gray-700 shadow-lg"
                : "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-md"
              : isDark
                ? "bg-slate-900/95 backdrop-blur-xl border-b border-yellow-400/20 shadow-2xl shadow-yellow-400/10"
                : "bg-white/90 backdrop-blur-xl border-b border-gold/20 shadow-xl"
          }`}
        >
          {isDark && designTheme === 'playful' && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-blue-400/5 to-green-400/5"></div>
          )}
  
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex justify-between items-center h-20">
              {/* Enhanced Logo */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-4 cursor-pointer relative"
                onClick={handleLogoClick}
              >
                {/* Hidden click counter indicator */}
                {logoClickCount > 0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs text-white z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {logoClickCount}
                  </motion.div>
                )}
                <motion.div
                  className="relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={logoImage}
                    alt="Asian Responsible Enterprise, OPC Logo"
                    className="h-13 w-auto object-contain dark:brightness-0 invert"
                  />
                  {isDark && (
                    <motion.div
                      className="absolute inset-0 "
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>
                <div className="flex flex-col">
                  <motion.span
                    className={`text-xl font-bold tracking-tight ${
                      isDark
                        ? "bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent"
                        : "bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  ></motion.span>
                  <motion.span
                    className="text-xs text-muted-foreground font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  ></motion.span>
                </div>
              </motion.div>
  
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(item.id)}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * index,
                      duration: 0.5,
                    }}
                    className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 group ${
                      activeTab === item.id
                        ? isDark
                          ? "bg-gradient-to-r from-blue-400 to-blue-300 text-slate-900 shadow-lg shadow-blue-400/25"
                          : "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/25"
                        : isDark
                          ? "text-gray-300 hover:text-white hover:bg-slate-800/50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-white/60"
                    }`}
                  >
                    {activeTab === item.id && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 via-blue-400/20 to-green-400/20"
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">
                      {item.label}
                    </span>
                    {isDark && activeTab === item.id && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
  
              {/* Theme Toggle & Mobile Menu */}
              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <motion.button
                  onClick={() => setIsDark(!isDark)}
                  whileHover={{ scale: 1.05, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark
                      ? "bg-gradient-to-r from-blue-400/20 to-blue-300/20 text-blue-400 hover:from-blue-400/30 hover:to-blue-300/30"
                      : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600 hover:from-blue-200 hover:to-blue-300"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sun className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Moon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isDark && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(251, 191, 36, 0)",
                          "0 0 20px rgba(251, 191, 36, 0.3)",
                          "0 0 0px rgba(251, 191, 36, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.button>
  
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`lg:hidden p-3 ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-slate-800/50"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() =>
                    setMobileMenuOpen(!mobileMenuOpen)
                  }
                >
                  <motion.div
                    animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {mobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </motion.div>
                </Button>
              </div>
            </div>
          </div>
  
          {/* Enhanced Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`lg:hidden overflow-hidden ${
                  isDark
                    ? "bg-slate-900/98 backdrop-blur-xl border-t border-yellow-400/20"
                    : "bg-white/98 backdrop-blur-xl border-t border-gold/20"
                }`}
              >
                <div className="px-6 py-4 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.3,
                      }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-5 py-4 rounded-xl font-medium transition-all duration-300 relative group ${
                        activeTab === item.id
                          ? isDark
                            ? "bg-gradient-to-r from-blue-400 to-blue-300 text-slate-900"
                            : "bg-gradient-to-r from-blue-600 to-blue-400 text-white"
                          : isDark
                            ? "text-gray-300 hover:text-white hover:bg-slate-800/70"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/70"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {item.label}
                        {isDark && activeTab === item.id && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Zap className="w-4 h-4" />
                          </motion.div>
                        )}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
  
        {/* Main Content */}
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ActiveComponent onNavigate={setActiveTab} />
            </motion.div>
          </AnimatePresence>
        </main>
  
        {/* Enhanced Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className={`relative py-12 transition-all duration-500 ${
            isDark
              ? "bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900"
              : "bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900"
          }`}
        >
          {isDark && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full opacity-30"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${20 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>
          )}
  
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              className="flex items-center justify-center space-x-4 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="relative"
                animate={isDark ? { scale: [1, 1.05, 1] } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={logoImage}
                  alt="Asian Responsible Enterprise, OPC Logo"
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
                {isDark && (
                  <motion.div
                    className="absolute inset-0 brightness-0 invert"
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>
              <span className={`text-2xl font-bold text-white`}>
                Asian Responsible Enterprise, OPC
              </span>
            </motion.div>
  
            <motion.p
              className="text-gray-400 text-lg mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Working together for a sustainable future • Inspired
              by the UN Sustainable Development Goals
            </motion.p>
  
            {isDark && (
              <motion.div
                className="text-yellow-400/60 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              ></motion.div>
            )}
          </div>
        </motion.footer>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />

        {/* Toast Notifications */}
        <Toaster />
      </div>
  );
}