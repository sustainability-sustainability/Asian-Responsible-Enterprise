import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronDown,
  Target,
  Users,
  Globe,
} from "lucide-react";
import SDGGrid from "./SDGGrid";
import { Button } from "./ui/button";
import { api } from "../utils/api";

interface HomeProps {
  onNavigate?: (tab: string) => void;
}

interface HomeData {
  heroTitle: string;
  heroSubtitle: string;
  statsCovered: string;
  statsPartners: string;
  statsInitiatives: string;
}

const defaultHomeData: HomeData = {
  heroTitle: "Asian Responsible Enterprise Awards",
  heroSubtitle: "The RISE of Sustainability Champion - Asia and the Pacific",
  statsCovered: "17",
  statsPartners: "12+",
  statsInitiatives: "1+",
};

export default function Home({ onNavigate }: HomeProps) {
  const sdgSectionRef = useRef<HTMLElement>(null);
  
  // Load home data from API or use defaults
  const [homeData, setHomeData] = useState<HomeData>(defaultHomeData);
  
  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
  // No API call anymore
  setHomeData(defaultHomeData);
};

  const scrollToSDGs = () => {
    sdgSectionRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-green-600/10 to-purple-600/10"></div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-blue-600 bg-clip-text text-transparent">
              {homeData.heroTitle}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-white mb-8 max-w-3xl mx-auto"
            >
              {homeData.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                onClick={() => onNavigate?.("contact")}
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore the Goals
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToSDGs}
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 rounded-full"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Moving Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-16 left-0 right-0 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-yellow-500/90 to-green-500/90 backdrop-blur-sm py-3 relative">
            <motion.div
              className="flex whitespace-nowrap"
              animate={{ x: [0, -1200] }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <span className="text-white font-medium text-sm px-6">
                🌱 No Poverty
              </span>
              <span className="text-white font-medium text-sm px-6">
                🌾 Zero Hunger
              </span>
              <span className="text-white font-medium text-sm px-6">
                ❤️ Good Health & Well-being
              </span>
              <span className="text-white font-medium text-sm px-6">
                📚 Quality Education
              </span>
              <span className="text-white font-medium text-sm px-6">
                ⚖️ Gender Equality
              </span>
              <span className="text-white font-medium text-sm px-6">
                💧 Clean Water & Sanitation
              </span>
              <span className="text-white font-medium text-sm px-6">
                ⚡ Affordable Clean Energy
              </span>
              <span className="text-white font-medium text-sm px-6">
                💼 Decent Work & Economic Growth
              </span>
              <span className="text-white font-medium text-sm px-6">
                🏗️ Industry & Innovation
              </span>
              <span className="text-white font-medium text-sm px-6">
                🤝 Reduced Inequalities
              </span>
              <span className="text-white font-medium text-sm px-6">
                🏙️ Sustainable Cities
              </span>
              <span className="text-white font-medium text-sm px-6">
                ♻️ Responsible Consumption
              </span>
              <span className="text-white font-medium text-sm px-6">
                🌍 Climate Action
              </span>
              <span className="text-white font-medium text-sm px-6">
                🐠 Life Below Water
              </span>
              <span className="text-white font-medium text-sm px-6">
                🌳 Life on Land
              </span>
              <span className="text-white font-medium text-sm px-6">
                ⚖️ Peace & Justice
              </span>
              <span className="text-white font-medium text-sm px-6">
                🤝 Partnerships for Goals
              </span>
              <span className="text-white font-medium text-sm px-6">
                🌱 No Poverty
              </span>
              <span className="text-white font-medium text-sm px-6">
                🌾 Zero Hunger
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-br from-yellow-400/20 to-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {homeData.statsCovered}
              </h3>
              <p className="text-gray-600">Global Goals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {homeData.statsPartners}
              </h3>
              <p className="text-gray-600">UN Member States</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {homeData.statsInitiatives}
              </h3>
              <p className="text-gray-600">Target Year</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SDG Grid Section */}
      <section ref={sdgSectionRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-500 via-blue-600 to-green-600 bg-clip-text text-transparent Dark:bg-gradient-to-r from-white-500 via-yellow-600 to-white-600">
              The 17 Global Goals
            </h2>
            <p className="text-xl text-gray-600 dark:text-white max-w-3xl mx-auto">
              Discover how each goal contributes to building a
              more sustainable, equitable, and prosperous world
              for everyone.
            </p>
          </motion.div>

          <SDGGrid />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 via-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Join the Global Movement
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Together, we can achieve the Sustainable
              Development Goals and create a better world for
              future generations.
            </p>
            <Button
              size="lg"
              onClick={() => {
                onNavigate?.("contact");
                // Scroll to top after a short delay to allow navigation
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Involved
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}