import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Target,
  Heart,
  Globe,
  Users,
  Lightbulb,
  Shield,
  Award,
  Trophy,
  Star,
  Gift,
  Network,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { api } from "../utils/api";

const iconMap: { [key: number]: JSX.Element } = {
  0: <Award className="w-8 h-8" />,
  1: <Trophy className="w-8 h-8" />,
  2: <Target className="w-8 h-8" />,
  3: <Shield className="w-8 h-8" />,
  4: <Lightbulb className="w-8 h-8" />,
  5: <Globe className="w-8 h-8" />,
};

const objectiveIconMap: { [key: number]: JSX.Element } = {
  0: <Award className="w-8 h-8" />,
  1: <Target className="w-8 h-8" />,
  2: <Trophy className="w-8 h-8" />,
  3: <Network className="w-8 h-8" />,
  4: <BookOpen className="w-8 h-8" />,
};

const benefitsCategories = [
  { id: "recognition", label: "Recognition & Awards" },
  { id: "networking", label: "Networking Opportunities" },
  { id: "marketing", label: "Marketing & Exposure" },
  { id: "development", label: "Business Development" },
];

const benefitsContent = {
  recognition: [
    {
      title: "Climate Neutral Awards Trophy",
      description: "Prestigious physical award recognizing your commitment to sustainability and environmental leadership.",
    },
    {
      title: "Official Certification",
      description: "Digital and physical certificates validating your achievements in CSR and environmental sustainability.",
    },
    {
      title: "Annual Gala Recognition",
      description: "Special recognition at our exclusive annual awards gala with industry leaders and dignitaries.",
    },
  ],
  networking: [
    {
      title: "Exclusive Industry Events",
      description: "Access to private networking events with fellow awardees, sustainability experts, and government officials.",
    },
    {
      title: "Best Practice Exchanges",
      description: "Opportunities to share and learn innovative sustainability solutions from leading organizations.",
    },
    {
      title: "Government Liaison",
      description: "Direct access to policy makers and government officials working on climate and sustainability initiatives.",
    },
  ],
  marketing: [
    {
      title: "Luxury Coffee Table Magazine",
      description: "Feature story and photo spread in our high-end publication distributed across Asia Pacific.",
    },
    {
      title: "Digital Media Coverage",
      description: "Comprehensive coverage across our digital platforms and partner media networks.",
    },
    {
      title: "International Exposure",
      description: "Global recognition through our international partnerships and media distribution network.",
    },
  ],
  development: [
    {
      title: "Sustainability Consulting",
      description: "Access to expert guidance on implementing and improving your sustainability strategies.",
    },
    {
      title: "Partnership Opportunities",
      description: "Connections with potential business partners, investors, and collaborators in the sustainability space.",
    },
    {
      title: "Market Access",
      description: "Enhanced credibility and access to sustainability-focused markets and procurement opportunities.",
    },
  ],
};

export default function Mission() {
  const [activeBenefitCategory, setActiveBenefitCategory] = useState("recognition");
  const [missionPillars, setMissionPillars] = useState<any[]>([]);
  const [objectivesData, setObjectivesData] = useState<any[]>([]);
  const [heroTitle, setHeroTitle] = useState("Our Mission");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "We are dedicated to advancing corporate social responsibility and environmental sustainability across Asia and the Pacific by recognizing and celebrating exemplary leadership in ethical governance, climate action, and green innovation."
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMissionContent();
  }, []);

  const loadMissionContent = async () => {
    try {
      const data = await api.getMission();
      if (data && data.content) {
        setHeroTitle(data.content.heroTitle || "Our Mission");
        setHeroSubtitle(data.content.heroSubtitle || heroSubtitle);
        
        if (data.content.pillars && data.content.pillars.length > 0) {
          const pillarsWithIcons = data.content.pillars.map((pillar: any, index: number) => ({
            ...pillar,
            icon: iconMap[index] || <Award className="w-8 h-8" />
          }));
          setMissionPillars(pillarsWithIcons);
        }
        
        if (data.content.objectives && data.content.objectives.length > 0) {
          const objectivesWithIcons = data.content.objectives.map((obj: any, index: number) => ({
            ...obj,
            icon: objectiveIconMap[index] || <Target className="w-8 h-8" />
          }));
          setObjectivesData(objectivesWithIcons);
        }
      }
    } catch (error) {
      console.error('Error loading mission content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl text-black font-bold mb-6 dark:text-white">
            {heroTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto dark:text-white mb-8">
            {heroSubtitle}
          </p>
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-700 rounded-3xl p-12 text-white text-center mb-20"
        >
          <h2 className="text-3xl font-bold mb-6">
            Our Vision
          </h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
          Asian Responsible Enterprise, OPC envisions a future
where sustainability is at the heart of every enterprise,
recognizing and honoring individuals and
organizations that champion responsible and ethical
practices to drive positive environmental and social
impact across Asia and the Pacific.
          </p>
        </motion.div>

        {/* Mission Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white mb-8">
            Our Mission Pillars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missionPillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${pillar.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {pillar.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Objectives Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Our Objectives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectivesData.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${objective.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {objective.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                      {objective.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {objective.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits of Awardees Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Benefits of Awardees
          </h2>
          
          {/* Navigation Bar for Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {benefitsCategories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveBenefitCategory(category.id)}
                variant={activeBenefitCategory === category.id ? "default" : "outline"}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeBenefitCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-blue-50 border-gray-300"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Benefits Content */}
          <motion.div
            key={activeBenefitCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefitsContent[activeBenefitCategory as keyof typeof benefitsContent].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full mr-3"></div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Commitment Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20 shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Our Commitment
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8">
            We are committed to measuring our progress, sharing
            our learnings, and adapting our approach based on
            evidence and feedback. Through transparent reporting
            and continuous improvement, we ensure that our
            efforts contribute meaningfully to the global agenda
            for sustainable development.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full"
            >
              Evidence-Based Decisions
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-green-100 text-green-800 px-6 py-3 rounded-full"
            >
              Continuous Learning
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-purple-100 text-purple-800 px-6 py-3 rounded-full"
            >
              Global Collaboration
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}