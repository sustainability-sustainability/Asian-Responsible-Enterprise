import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  X, 
  Users, 
  Wheat, 
  HeartPulse, 
  GraduationCap, 
  Scale, 
  Droplets, 
  Zap, 
  Briefcase, 
  Factory, 
  UsersRound, 
  Building2, 
  Recycle, 
  Globe, 
  Fish, 
  TreePine, 
  Handshake 
} from 'lucide-react';
import noPovertySDG from 'figma:asset/cf850a383750826c56fb347fa95ed36d9809b522.png';
import zeroHungerSDG from 'figma:asset/659efdd8e88a77a509061daeeca82c960ae7a07f.png';
import goodHealthSDG from 'figma:asset/224c16d4ab2fcceb5121542341ac2124296fa640.png';
import qualityEducationSDG from 'figma:asset/d4ce12c2ee620e3dc1a7cbfc6e4bc649a2dd872c.png';
import genderEqualitySDG from 'figma:asset/12e89fc296cfa8c0fbda6b6ca63a32e5aadf3839.png';
import cleanWaterSDG from 'figma:asset/99711ff3424d6b2e42e9e8dbe755a2bd40edbce7.png';
import affordableEnergySDG from 'figma:asset/e354890182db0c0c32074d3545835e4ff5c461c3.png';
import decentWorkSDG from 'figma:asset/d463409bd6b137b9ea22bef4f82b32f76dbb968d.png';
import industryInnovationSDG from 'figma:asset/ee535cb0e7ddc889640bf00c1f75e52ee454c717.png';
import reducedInequalitySDG from 'figma:asset/791d1db621c9965b58a6417f7b7e11b38791ddf2.png';
import sustainableCitiesSDG from 'figma:asset/3bcc6d0acefe93b02b548155cfafe33836f40319.png';
import responsibleConsumptionSDG from 'figma:asset/66a43068d85fcfa8e82add73493e3aa03e646847.png';
import climateActionSDG from 'figma:asset/102f54d3b857955265df7bdd65dea8ee87876597.png';
import lifeBelowWaterSDG from 'figma:asset/50f7f10bcaf96548451bdb891dd8ba55083a5992.png';
import lifeOnLandSDG from 'figma:asset/d2a2182d5d3eee1b96d1ca2eca83e40178445d38.png';
import peaceJusticeSDG from 'figma:asset/1519d846fd230ce5d497d4b09b81f78945a1611e.png';
import partnershipsSDG from 'figma:asset/3fe1916187afcc34e4908c681b5604f0adebf230.png';

const sdgData = [
  { 
    id: 1, 
    title: 'No Poverty', 
    color: '#fbbf24', 
    gradient: 'from-yellow-400 to-yellow-600', 
    icon: Users,
    iconColor: '#FFD700',
    iconBg: 'bg-amber-900/30',
    iconImage: 'https://images.unsplash.com/photo-1603100915384-f5eb8c1bab7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3ZlcnR5JTIwaGVscGluZyUyMGhhbmRzfGVufDF8fHx8MTc2MjM0OTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'End poverty in all its forms everywhere',
    longDescription: 'Eradicating poverty in all its forms remains one of the greatest challenges facing humanity. While the number of people living in extreme poverty dropped by more than half between 1990 and 2015, too many are still struggling for the most basic human needs.',
    targets: ['By 2030, eradicate extreme poverty for all people everywhere', 'Reduce at least by half the proportion of men, women and children of all ages living in poverty'],
    progress: 65,
    image: noPovertySDG
  },
  { 
    id: 2, 
    title: 'Zero Hunger', 
    color: '#fde047', 
    gradient: 'from-yellow-300 to-yellow-500', 
    icon: Wheat,
    iconColor: '#D4AF37',
    iconBg: 'bg-yellow-900/30',
    iconImage: 'https://images.unsplash.com/photo-1595360584848-6404da6fe097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGdyYWluJTIwaGFydmVzdHxlbnwxfHx8fDE3NjIzODc2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'End hunger, achieve food security and improved nutrition',
    longDescription: 'The number of undernourished people has dropped by almost half in the past two decades because of rapid economic growth and increased agricultural productivity.',
    targets: ['End hunger and ensure access by all people to safe, nutritious food', 'End all forms of malnutrition'],
    progress: 70,
    image: zeroHungerSDG
  },
  { 
    id: 3, 
    title: 'Good Health and Well-being', 
    color: '#10b981', 
    gradient: 'from-green-400 to-green-600', 
    icon: HeartPulse,
    iconColor: '#EF4444',
    iconBg: 'bg-red-100/40',
    iconImage: 'https://images.unsplash.com/photo-1665315469403-fde8e923f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoJTIwc3RldGhvc2NvcGV8ZW58MXx8fHwxNzYyMzc3NzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Ensure healthy lives and promote well-being for all',
    longDescription: 'Significant strides have been made in increasing life expectancy and reducing some of the common killers associated with child and maternal mortality.',
    targets: ['Reduce global maternal mortality ratio', 'End preventable deaths of newborns and children'],
    progress: 72,
    image: goodHealthSDG
  },
  { 
    id: 4, 
    title: 'Quality Education', 
    color: '#3b82f6', 
    gradient: 'from-blue-400 to-blue-600', 
    icon: GraduationCap,
    iconColor: '#1E3A8A',
    iconBg: 'bg-blue-100/40',
    iconImage: 'https://images.unsplash.com/photo-1595315342809-fa10945ed07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZWR1Y2F0aW9uJTIwYm9va3N8ZW58MXx8fHwxNzYyNDEzNTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Ensure inclusive and equitable quality education',
    longDescription: 'Education liberates the intellect, unlocks the imagination and is fundamental for respect of human rights.',
    targets: ['Ensure all girls and boys complete free primary and secondary schooling', 'Ensure equal access to affordable vocational training'],
    progress: 68,
    image: qualityEducationSDG
  },
  { 
    id: 5, 
    title: 'Gender Equality', 
    color: '#06b6d4', 
    gradient: 'from-cyan-400 to-cyan-600', 
    icon: Scale,
    iconColor: '#DB2777',
    iconBg: 'bg-pink-100/40',
    iconImage: 'https://images.unsplash.com/photo-1758368164419-5a1c5e839dd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5kZXIlMjBlcXVhbGl0eSUyMHN5bWJvbHxlbnwxfHx8fDE3NjI0MTM1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Achieve gender equality and empower all women and girls',
    longDescription: 'Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous and sustainable world.',
    targets: ['End all forms of discrimination against women and girls', 'Eliminate all forms of violence against women and girls'],
    progress: 58,
    image: genderEqualitySDG
  },
  { 
    id: 6, 
    title: 'Clean Water and Sanitation', 
    color: '#06b6d4', 
    gradient: 'from-cyan-400 to-blue-500', 
    icon: Droplets,
    iconColor: '#0EA5E9',
    iconBg: 'bg-cyan-100/40',
    iconImage: 'https://images.unsplash.com/photo-1606214554354-06acd2c0480f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGRyb3BsZXQlMjBjbGVhbnxlbnwxfHx8fDE3NjI0MTM1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Ensure availability and sustainable management of water',
    longDescription: 'Clean, accessible water for all is an essential part of the world we want to live in.',
    targets: ['Achieve universal and equitable access to safe drinking water', 'Achieve access to adequate sanitation and hygiene for all'],
    progress: 71,
    image: cleanWaterSDG
  },
  { 
    id: 7, 
    title: 'Affordable and Clean Energy', 
    color: '#fbbf24', 
    gradient: 'from-yellow-400 to-amber-500', 
    icon: Zap,
    iconColor: '#FBBF24',
    iconBg: 'bg-yellow-100/40',
    iconImage: 'https://images.unsplash.com/photo-1655300256620-680cb0f1cec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVsJTIwZW5lcmd5fGVufDF8fHx8MTc2MjQxMzUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Ensure access to affordable, reliable, sustainable energy',
    longDescription: 'Energy is central to nearly every major challenge and opportunity the world faces today.',
    targets: ['Ensure universal access to affordable electricity', 'Increase substantially the share of renewable energy'],
    progress: 76,
    image: affordableEnergySDG
  },
  { 
    id: 8, 
    title: 'Decent Work and Economic Growth', 
    color: '#059669', 
    gradient: 'from-green-500 to-green-700', 
    icon: Briefcase,
    iconColor: '#7C2D12',
    iconBg: 'bg-orange-100/40',
    iconImage: 'https://images.unsplash.com/photo-1583525957908-ac79cf6319a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJyaWVmY2FzZSUyMHdvcmt8ZW58MXx8fHwxNzYyMzUxNDIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Promote sustained, inclusive economic growth',
    longDescription: 'Roughly half the world\'s population still lives on the equivalent of about US$2 a day.',
    targets: ['Sustain per capita economic growth', 'Achieve full and productive employment for all'],
    progress: 64,
    image: decentWorkSDG
  },
  { 
    id: 9, 
    title: 'Industry, Innovation and Infrastructure', 
    color: '#3b82f6', 
    gradient: 'from-blue-500 to-indigo-600', 
    icon: Factory,
    iconColor: '#F97316',
    iconBg: 'bg-orange-100/40',
    iconImage: 'https://images.unsplash.com/photo-1758304481074-19eacd3e385d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwaW5kdXN0cnklMjBpbmZyYXN0cnVjdHVyZXxlbnwxfHx8fDE3NjI0MTM1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Build resilient infrastructure, promote innovation',
    longDescription: 'Investment in infrastructure and innovation are crucial drivers of economic growth and development.',
    targets: ['Develop quality, reliable infrastructure', 'Promote inclusive and sustainable industrialization'],
    progress: 69,
    image: industryInnovationSDG
  },
  { 
    id: 10, 
    title: 'Reduced Inequality', 
    color: '#10b981', 
    gradient: 'from-green-400 to-emerald-600', 
    icon: UsersRound,
    iconColor: '#EC4899',
    iconBg: 'bg-pink-100/40',
    iconImage: 'https://images.unsplash.com/photo-1761957374132-a5137e99f26c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlJTIwY29tbXVuaXR5fGVufDF8fHx8MTc2MjM2NTI2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Reduce inequality within and among countries',
    longDescription: 'Income inequality has increased in nearly everywhere in recent decades, but at different speeds.',
    targets: ['Progressively achieve and sustain income growth', 'Empower and promote social and economic inclusion'],
    progress: 55,
    image: reducedInequalitySDG
  },
  { 
    id: 11, 
    title: 'Sustainable Cities and Communities', 
    color: '#fbbf24', 
    gradient: 'from-amber-400 to-orange-500', 
    icon: Building2,
    iconColor: '#F59E0B',
    iconBg: 'bg-amber-100/40',
    iconImage: 'https://images.unsplash.com/photo-1629652320041-c2c555e68101?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NjI0MTM1MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Make cities and human settlements inclusive and sustainable',
    longDescription: 'More than half of us live in cities. By 2050, two-thirds of all humanity will call cities home.',
    targets: ['Ensure access to adequate, safe housing', 'Provide access to safe transport systems'],
    progress: 61,
    image: sustainableCitiesSDG
  },
  { 
    id: 12, 
    title: 'Responsible Consumption and Production', 
    color: '#059669', 
    gradient: 'from-emerald-500 to-green-700', 
    icon: Recycle,
    iconColor: '#10B981',
    iconBg: 'bg-green-100/40',
    iconImage: 'https://images.unsplash.com/photo-1605050714296-ef81755470ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBzdXN0YWluYWJpbGl0eSUyMGVudmlyb25tZW50fGVufDF8fHx8MTc2MjQxMzUxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Ensure sustainable consumption and production patterns',
    longDescription: 'Worldwide consumption and production drive the global economy but rely on the use of the natural environment.',
    targets: ['Implement sustainable management of natural resources', 'Reduce waste generation through prevention and recycling'],
    progress: 52,
    image: responsibleConsumptionSDG
  },
  { 
    id: 13, 
    title: 'Climate Action', 
    color: '#059669', 
    gradient: 'from-green-600 to-green-800', 
    icon: Globe,
    iconColor: '#3B82F6',
    iconBg: 'bg-blue-100/40',
    iconImage: 'https://images.unsplash.com/photo-1742412615753-187a80f4e30c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMGNsaW1hdGUlMjBwbGFuZXR8ZW58MXx8fHwxNzYyNDEzNTExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Take urgent action to combat climate change',
    longDescription: 'Climate change is now affecting every country on every continent.',
    targets: ['Strengthen resilience to climate-related hazards', 'Integrate climate change measures into policies'],
    progress: 48,
    image: climateActionSDG
  },
  { 
    id: 14, 
    title: 'Life Below Water', 
    color: '#06b6d4', 
    gradient: 'from-cyan-500 to-blue-600', 
    icon: Fish,
    iconColor: '#0284C7',
    iconBg: 'bg-sky-100/40',
    iconImage: 'https://images.unsplash.com/photo-1668663516335-cc480a98766a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdGVyJTIwZmlzaHxlbnwxfHx8fDE3NjI0MTM1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Conserve and sustainably use the oceans and seas',
    longDescription: 'The world\'s oceans drive global systems that make the Earth habitable for humankind.',
    targets: ['Prevent and reduce marine pollution', 'Sustainably manage and protect marine ecosystems'],
    progress: 56,
    image: lifeBelowWaterSDG
  },
  { 
    id: 15, 
    title: 'Life on Land', 
    color: '#10b981', 
    gradient: 'from-green-500 to-green-700', 
    icon: TreePine,
    iconColor: '#059669',
    iconBg: 'bg-emerald-100/40',
    iconImage: 'https://images.unsplash.com/photo-1614022837662-e74b0b53dcf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlcyUyMG5hdHVyZXxlbnwxfHx8fDE3NjIzMzM3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Protect, restore and promote sustainable use of ecosystems',
    longDescription: 'Nature is critical to our survival and provides our air, water and nourishment.',
    targets: ['Ensure conservation of mountain ecosystems', 'Combat desertification and restore degraded land'],
    progress: 50,
    image: lifeOnLandSDG
  },
  { 
    id: 16, 
    title: 'Peace and Justice Strong Institutions', 
    color: '#3b82f6', 
    gradient: 'from-blue-600 to-indigo-700', 
    icon: Scale,
    iconColor: '#1E40AF',
    iconBg: 'bg-indigo-100/40',
    iconImage: 'https://images.unsplash.com/photo-1687289133469-b2a07a13b78b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdXN0aWNlJTIwc2NhbGVzJTIwbGF3fGVufDF8fHx8MTc2MjM2MDE2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Promote peaceful and inclusive societies',
    longDescription: 'Access to justice for all, and building effective, accountable institutions at all levels.',
    targets: ['Reduce all forms of violence', 'Develop effective, accountable institutions'],
    progress: 62,
    image: peaceJusticeSDG
  },
  { 
    id: 17, 
    title: 'Partnerships to achieve the Goal', 
    color: '#fbbf24', 
    gradient: 'from-yellow-500 to-amber-600', 
    icon: Handshake,
    iconColor: '#0369A1',
    iconBg: 'bg-sky-100/40',
    iconImage: 'https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kc2hha2UlMjBwYXJ0bmVyc2hpcCUyMGJ1c2luZXNzfGVufDF8fHx8MTc2MjM1MDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Strengthen global partnerships for sustainable development',
    longDescription: 'Successful sustainable development agenda requires partnerships between governments, private sector and civil society.',
    targets: ['Strengthen domestic resource mobilization', 'Enhance global partnership for sustainable development'],
    progress: 73,
    image: partnershipsSDG
  },
];

export default function SDGGrid() {
  const [selectedSDG, setSelectedSDG] = useState<typeof sdgData[0] | null>(null);
  const [hoveredSDG, setHoveredSDG] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sdgData.map((sdg, index) => (
          <motion.div
            key={sdg.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.7, 
              delay: index * 0.08,
              type: "spring",
              stiffness: 120,
              damping: 20
            }}
            whileHover={{ 
              scale: 1.06, 
              rotate: 1,
              y: -8,
              transition: { duration: 0.3, type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSDG(sdg)}
            onMouseEnter={() => setHoveredSDG(sdg.id)}
            onMouseLeave={() => setHoveredSDG(null)}
            className={`relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer bg-gradient-to-br ${sdg.gradient} hover:shadow-2xl transition-all duration-300`}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredSDG === sdg.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-2xl border border-white/20 min-w-max max-w-xs"
                >
                  <div className="text-sm font-medium text-center">
                    {sdg.description}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900/95"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/20 translate-y-12 -translate-x-12"></div>
            </div>
            
            <div className="relative p-4 sm:p-5 md:p-6 text-white min-h-[280px] sm:min-h-[320px] md:min-h-[340px] lg:min-h-[320px] xl:min-h-[360px] flex flex-col justify-between bg-[rgba(255,255,255,0)]">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className="w-16 h-16 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <sdg.icon 
                    className="w-10 h-10 text-white drop-shadow-lg" 
                    strokeWidth={2}
                  />
                </motion.div>
                <motion.span 
                  className="text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30"
                  whileHover={{ scale: 1.05 }}
                >
                  SDG {sdg.id}
                </motion.span>
              </div>
              
              {/* Image */}
              <motion.div 
                className="w-full h-24 sm:h-28 md:h-32 lg:h-28 xl:h-32 mb-4 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center group-hover:border-white/50 transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                {sdg.image ? (
                  <img 
                    src={sdg.image} 
                    alt={`${sdg.title} illustration`}
                    className="w-full h-full object-contain rounded-lg p-1"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-white/60">Add Image</p>
                  </div>
                )}
              </motion.div>
              
              <div>
                <h3 className="text-lg font-bold mb-3 leading-tight tracking-wide">
                  {sdg.title}
                </h3>
                
                <motion.div 
                  className="h-1.5 bg-white/30 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                >
                  <motion.div
                    className="h-full bg-white/70 rounded-full"
                    initial={{ width: "30%" }}
                    whileHover={{ width: `${sdg.progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Enhanced Hover Effects */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ 
                background: [
                  "linear-gradient(45deg, rgba(255,255,255,0.05), rgba(0,0,0,0.05))",
                  "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.05))",
                  "linear-gradient(225deg, rgba(255,255,255,0.05), rgba(0,0,0,0.1))",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={false}
              whileHover={{
                background: [
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  "linear-gradient(90deg, transparent, transparent, transparent)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>

      {/* Pokemon Card Style Modal */}
      <Dialog open={!!selectedSDG} onOpenChange={() => setSelectedSDG(null)}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl p-0 overflow-hidden"
          {...(selectedSDG && { 'aria-describedby': `sdg-${selectedSDG.id}-description` })}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>
              {selectedSDG ? `SDG ${selectedSDG.id}: ${selectedSDG.title}` : 'Sustainable Development Goal Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedSDG && (
            <ScrollArea className="h-full max-h-[90vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                className="space-y-6 p-6"
              >
              {/* Header */}
              <div className={`relative rounded-2xl p-6 text-white bg-gradient-to-br ${selectedSDG.gradient} overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 translate-y-12 -translate-x-12"></div>
                
                <div className="relative flex items-center justify-between mb-4">
                  <motion.div 
                    className="relative w-24 h-24 flex items-center justify-center rounded-3xl shadow-2xl"
                    initial={{ rotate: -15, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    style={{
                      background: `linear-gradient(135deg, ${selectedSDG.iconColor}dd, ${selectedSDG.iconColor})`
                    }}
                  >
                    {/* Inner glow */}
                    <div 
                      className="absolute inset-0 rounded-3xl opacity-50 blur-md"
                      style={{
                        background: `linear-gradient(135deg, ${selectedSDG.iconColor}, transparent)`
                      }}
                    />
                    
                    {/* Icon shadow layer */}
                    <div className="absolute inset-0 rounded-3xl" style={{
                      boxShadow: `
                        inset 0 -3px 12px rgba(0,0,0,0.4),
                        inset 0 3px 12px rgba(255,255,255,0.3),
                        0 12px 32px ${selectedSDG.iconColor}70,
                        0 6px 16px ${selectedSDG.iconColor}50
                      `
                    }} />
                    
                    <selectedSDG.icon 
                      className="w-12 h-12 relative z-10" 
                      strokeWidth={2.5}
                      style={{ 
                        color: '#ffffff',
                        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))'
                      }}
                    />
                    
                    {/* Glossy overlay effect */}
                    <div 
                      className="absolute inset-0 rounded-3xl opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)'
                      }}
                    />
                  </motion.div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                    SDG {selectedSDG.id}
                  </Badge>
                </div>
                
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold mb-2"
                >
                  {selectedSDG.title}
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/90 text-lg"
                >
                  {selectedSDG.description}
                </motion.p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/80">Global Progress</span>
                    <span className="text-sm font-bold text-white">{selectedSDG.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white/80 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSDG.progress}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About this Goal</h3>
                  <p 
                    id={`sdg-${selectedSDG.id}-description`}
                    className="text-gray-700 leading-relaxed"
                  >
                    {selectedSDG.longDescription}
                  </p>
                </div>

                {/* Key Targets */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Key Targets</h3>
                  <div className="space-y-2">
                    {selectedSDG.targets.map((target, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedSDG.gradient} mt-2 flex-shrink-0`}></div>
                        <p className="text-gray-700">{target}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* SDG Image */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="h-48 sm:h-56 md:h-64 lg:h-56 xl:h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden"
                >
                  {selectedSDG.image ? (
                    <motion.img 
                      src={selectedSDG.image} 
                      alt={`${selectedSDG.title} illustration`}
                      className="w-full h-full object-contain rounded-lg p-2"
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-300/50 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Add SDG Image</p>
                      <p className="text-gray-400 text-sm mt-1">Drag & drop or click to upload</p>
                    </div>
                  )}
                </motion.div>

                {/* Additional Content Sections for Scrollable Experience */}
                
                {/* Quick Facts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Facts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg bg-gradient-to-br ${selectedSDG.gradient} text-white`}>
                      <div className="text-2xl font-bold mb-1">{selectedSDG.progress}%</div>
                      <div className="text-sm opacity-90">Global Progress</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-100">
                      <div className="text-2xl font-bold mb-1 text-gray-900">2030</div>
                      <div className="text-sm text-gray-600">Target Year</div>
                    </div>
                  </div>
                </motion.div>

               

                {/* Related SDGs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Related Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: Math.min(5, 17 - selectedSDG.id) }, (_, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="border-gray-300 text-gray-600 hover:border-gray-400"
                      >
                        SDG {((selectedSDG.id + i) % 17) + 1}
                      </Badge>
                    ))}
                  </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className={`p-6 rounded-xl bg-gradient-to-br ${selectedSDG.gradient} text-white`}
                >
                  <h3 className="text-xl font-bold mb-2">Get Involved</h3>
                  <p className="text-white/90 mb-4">
                    Join the global movement to achieve this Sustainable Development Goal. Every action counts towards building a better future.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors"
                    >
                      Learn More
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors"
                    >
                      Take Action
                    </motion.button>
                  </div>
                </motion.div>
                </motion.div>
              </motion.div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}