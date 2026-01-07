import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users,
  MessageCircle,
  Calendar,
  MapPin,
  Heart,
  Star,
  ArrowRight,
  Play,
  PlayCircle,
  Video,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { api } from "../utils/api";

// Empty arrays instead of defaults
const defaultCommunityStats: any[] = [];

const defaultProjects: any[] = [];

const defaultEvents: any[] = [];

const defaultVideos: any[] = [];

const defaultTestimonials: any[] = [];


// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm text-gray-600 dark:text-gray-300 px-4">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function Community() {
  const [theme, setTheme] = useState<string>("colorful");
  const [communityStats, setCommunityStats] = useState(defaultCommunityStats);
  const [projects, setProjects] = useState(defaultProjects);
  const [events, setEvents] = useState(defaultEvents);
  const [videos, setVideos] = useState(defaultVideos);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  // Pagination states
  const [videosPage, setVideosPage] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [testimonialsPage, setTestimonialsPage] = useState(1);
  const [showAllVideos, setShowAllVideos] = useState(false);

  // Video modal state
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const itemsPerPage = 6;

  // Navigation helper to go to Contact section
  const navigateToContact = () => {
    // Trigger navigation to Contact Us section
    window.dispatchEvent(new CustomEvent('navigate-to-section', { detail: 'contact' }));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadData();
    // Monitor video element intersection for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const videoCard = entry.target as HTMLElement;
          videoCard.classList.add('in-view');
        }
      });
    });

    // Observe video cards when they mount
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach((card) => observer.observe(card));

    return () => {
      videoCards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('siteTheme') || 'colorful';
    setTheme(savedTheme);

    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('siteTheme') || 'colorful';
      setTheme(newTheme);
    };

    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getCommunity();
      if (data) {
        if (data.stats && Array.isArray(data.stats)) {
          const statsWithIcons = data.stats.map((stat: any, index: number) => ({
            ...stat,
            icon: defaultCommunityStats[index]?.icon || <Users className="w-6 h-6" />
          }));
          setCommunityStats(statsWithIcons);
        }
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events);
        }
        if (data.videos && Array.isArray(data.videos)) {
          setVideos(data.videos);
        }
        if (data.testimonials && Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        }
      }
    } catch (error) {
      console.error('Error loading community data from API:', error);
      // Use defaults on error
    }
  };

  // Get paginated items
  const getPaginatedItems = (items: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items: any[]) => Math.ceil(items.length / itemsPerPage);

  // Separate featured and non-featured videos
  const featuredVideos = videos.filter(v => v.featured);
  const regularVideos = videos.filter(v => !v.featured);
  
  // Display videos based on showAllVideos state
  const displayedVideos = showAllVideos 
    ? getPaginatedItems(regularVideos, videosPage)
    : regularVideos.slice(0, 3);

  const paginatedProjects = getPaginatedItems(projects, projectsPage);
  const paginatedEvents = getPaginatedItems(events, eventsPage);
  const paginatedTestimonials = getPaginatedItems(testimonials, testimonialsPage);

  // Theme-based styling
  const getThemeColors = () => {
    if (theme === "corporate") {
      return {
        gradient: "from-blue-900 via-blue-800 to-slate-800",
        cardBg: "bg-white dark:bg-slate-800",
        textPrimary: "text-slate-900 dark:text-white",
        textSecondary: "text-slate-600 dark:text-slate-300",
        accentGradient: "from-blue-600 to-blue-800",
        badgeBg: "bg-blue-600",
        hoverShadow: "hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50",
      };
    }
    return {
      gradient: "from-purple-600 via-pink-600 to-blue-600",
      cardBg: "bg-white/80 backdrop-blur-sm",
      textPrimary: "text-gray-900 dark:text-white",
      textSecondary: "text-gray-600 dark:text-gray-300",
      accentGradient: "from-purple-500 via-pink-500 to-blue-500",
      badgeBg: "bg-gradient-to-r from-purple-500 to-pink-500",
      hoverShadow: "hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50",
    };
  };

  const colors = getThemeColors();

  // Handle video click
  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    return url;
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
            Our Community
          </h1>
          <p className={`text-xl ${colors.textSecondary} max-w-3xl mx-auto mb-8`}>
            Join a global network of changemakers, innovators,
            and advocates working together to achieve the
            Sustainable Development Goals.
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {communityStats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`${colors.cardBg} rounded-xl p-6 text-center shadow-lg border border-white/20 ${colors.hoverShadow} transition-all duration-300`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${colors.accentGradient} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                {stat.icon}
              </div>
              <h3 className={`text-2xl font-bold ${colors.textPrimary} mb-1`}>
                {stat.value}
              </h3>
              <p className={`${colors.textSecondary} text-sm`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Community Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden mb-16 h-64 md:h-80"
        >
          <img
            src="https://images.unsplash.com/photo-1658734029438-d97357737bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NTg1ODAwODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Diverse community collaboration"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-80 flex items-center justify-center`}>
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the Movement
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Be part of a community that's changing the world
              </p>
              <Button 
                onClick={navigateToContact}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full"
              >
                Join Community
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Video Showcase Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
              Community in Action
            </h2>
            <p className={`text-xl ${colors.textSecondary} max-w-3xl mx-auto`}>
              Watch inspiring stories and educational content
              from our global community of changemakers.
            </p>
          </div>

          {/* Featured Video */}
       {/* Featured Video */}
{featuredVideos.length > 0 && (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.6 }}
    className="mb-12"
  >
    {featuredVideos.map((video) => (
      <div key={video.id} className="relative group">
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
          onClick={() => handleVideoClick(video)}
        >
          <ImageWithFallback
            src={
              video.thumbnail?.startsWith("data:") || video.thumbnail?.startsWith("http")
                ? video.thumbnail
                : `https://images.unsplash.com/1200x600?${video.thumbnail || "default"}`
            }
            alt={video.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Play Button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 shadow-2xl cursor-pointer group-hover:bg-white transition-all duration-300">
              <PlayCircle
                className={`w-16 h-16 ${
                  theme === "corporate" ? "text-blue-600" : "text-purple-600"
                } group-hover:${
                  theme === "corporate" ? "text-blue-700" : "text-purple-700"
                }`}
              />
            </div>
          </motion.div>

          {/* Video Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${colors.badgeBg} text-white border-none`}>
                {video.category}
              </Badge>
              <span className="text-white/80 text-sm flex items-center gap-1">
                <Video className="w-4 h-4" />
                {video.duration}
              </span>
              <span className="text-white/80 text-sm">{video.views} views</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {video.title}
            </h3>
            <p className="text-white/90 text-lg max-w-2xl">{video.description}</p>
          </div>
        </div>
      </div>
    ))}
  </motion.div>
)}

{/* Video Grid */}
{displayedVideos.length > 0 && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedVideos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.7 + index * 0.1,
          }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="group cursor-pointer"
          onClick={() => handleVideoClick(video)}
        >
          <Card
            className={`h-full ${colors.cardBg} border border-white/20 shadow-lg ${colors.hoverShadow} transition-all duration-300 overflow-hidden`}
          >
            <div className="relative">
              <ImageWithFallback
                src={
                  video.thumbnail?.startsWith("data:") || video.thumbnail?.startsWith("http")
                    ? video.thumbnail
                    : `https://images.unsplash.com/400x250?${video.thumbnail || "default"}`
                }
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play
                    className={`w-6 h-6 ${
                      theme === "corporate" ? "text-blue-600" : "text-purple-600"
                    } ml-1`}
                  />
                </motion.div>
              </div>

              {/* Video Duration */}
              <div className="absolute bottom-3 right-3">
                <Badge className="bg-black/70 text-white border-none text-xs">
                  {video.duration}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge
                  variant="outline"
                  className={`${
                    theme === "corporate"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200"
                  }`}
                >
                  {video.category}
                </Badge>
                <span className={`${colors.textSecondary} text-sm`}>
                  {video.views} views
                </span>
              </div>

              <h3
                className={`font-bold ${colors.textPrimary} mb-2 group-hover:${
                  theme === "corporate" ? "text-blue-600" : "text-purple-600"
                } transition-colors duration-200`}
              >
                {video.title}
              </h3>

              <p className={`${colors.textSecondary} text-sm leading-relaxed`}>
                {video.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    {/* Pagination for Videos when showing all */}
    {showAllVideos && getTotalPages(regularVideos) > 1 && (
      <Pagination
        currentPage={videosPage}
        totalPages={getTotalPages(regularVideos)}
        onPageChange={setVideosPage}
      />
    )}
  </>
)}

{/* View All Videos Button */}
{regularVideos.length > 3 && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 1.2 }}
    className="text-center mt-12"
  >
    <Button
      onClick={() => {
        setShowAllVideos(!showAllVideos);
        setVideosPage(1);
      }}
      className={`bg-gradient-to-r ${colors.accentGradient} text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <Video className="w-5 h-5 mr-2" />
      {showAllVideos ? "Show Less" : "View All Videos"}
      <ArrowRight className="w-5 h-5 ml-2" />
    </Button>
  </motion.div>
)}
</motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className={`text-3xl font-bold text-center mb-12 ${colors.textPrimary}`}>
            Featured Community Projects
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {paginatedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className={`h-full ${colors.cardBg} border border-white/20 shadow-lg ${colors.hoverShadow} transition-all duration-300`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${colors.badgeBg} text-white border-none`}>
                        SDG {project.sdg}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={colors.textPrimary}
                      >
                        {project.category}
                      </Badge>
                    </div>
                    <CardTitle className={`text-xl group-hover:${theme === 'corporate' ? 'text-blue-600' : 'text-purple-600'} transition-colors duration-200 ${colors.textPrimary}`}>
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`${colors.textSecondary} mb-4 leading-relaxed`}>
                      {project.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className={colors.textSecondary}>
                          Progress
                        </span>
                        <span className={`font-medium ${colors.textPrimary}`}>
                          {project.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${project.progress}%`,
                          }}
                          transition={{
                            duration: 1,
                            delay: 0.5,
                          }}
                          className={`bg-gradient-to-r ${colors.accentGradient} h-2 rounded-full`}
                        />
                      </div>
                    </div>

                    <div className={`flex items-center justify-between text-sm ${colors.textSecondary}`}>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.members} members
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination for Projects */}
          {getTotalPages(projects) > 1 && (
            <Pagination
              currentPage={projectsPage}
              totalPages={getTotalPages(projects)}
              onPageChange={setProjectsPage}
            />
          )}
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className={`text-3xl font-bold text-center mb-12 ${colors.textPrimary}`}>
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginatedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{ scale: 1.02 }}
                className={`${colors.cardBg} rounded-xl p-6 border border-white/20 shadow-lg ${colors.hoverShadow} transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${colors.badgeBg} text-white border-none`}>
                    SDG {event.sdg}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={colors.textPrimary}
                  >
                    {event.type}
                  </Badge>
                </div>

                <h3 className={`text-lg font-bold ${colors.textPrimary} mb-3`}>
                  {event.title}
                </h3>

                <div className={`space-y-2 text-sm ${colors.textSecondary}`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {event.attendees} expected attendees
                  </div>
                </div>

              
              </motion.div>
            ))}
          </div>

          {/* Pagination for Events */}
          {getTotalPages(events) > 1 && (
            <Pagination
              currentPage={eventsPage}
              totalPages={getTotalPages(events)}
              onPageChange={setEventsPage}
            />
          )}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mb-16"
        >
          <h2 className={`text-3xl font-bold text-center mb-12 ${colors.textPrimary}`}>
            Community Voices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paginatedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{ scale: 1.02 }}
                className={`${colors.cardBg} rounded-xl p-6 border border-white/20 shadow-lg ${colors.hoverShadow} transition-all duration-300`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <ImageWithFallback
                    src={testimonial.avatar.startsWith('data:') || testimonial.avatar.startsWith('http') 
                      ? testimonial.avatar 
                      : `https://images.unsplash.com/100x100?${testimonial.avatar}`}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className={`font-semibold ${colors.textPrimary}`}>
                      {testimonial.name}
                    </h4>
                    <p className={`text-sm ${colors.textSecondary}`}>
                      {testimonial.role}
                    </p>
                    <p className={`text-xs ${colors.textSecondary}`}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className={`${colors.textSecondary} italic leading-relaxed`}>
                  "{testimonial.message}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pagination for Testimonials */}
          {getTotalPages(testimonials) > 1 && (
            <Pagination
              currentPage={testimonialsPage}
              totalPages={getTotalPages(testimonials)}
              onPageChange={setTestimonialsPage}
            />
          )}
        </motion.div>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className={`bg-gradient-to-r ${colors.accentGradient} rounded-2xl p-12 text-white text-center`}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of changemakers and start your
            journey towards sustainable impact.
          </p>
          <Button
            onClick={navigateToContact}
            variant="outline"
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full border-none"
          >
            Join Community
          </Button>
        </motion.div>
      </div>

    {/* Video Modal */}
<Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
  <DialogContent
    className="max-w-4xl p-0 overflow-hidden"
    aria-describedby={selectedVideo ? "video-description" : undefined}
  >
    {selectedVideo && (
      <div className="relative">
        {/* Video Player or Thumbnail */}
        {selectedVideo.videoUrl && getYouTubeEmbedUrl(selectedVideo.videoUrl) ? (
          <iframe
            src={getYouTubeEmbedUrl(selectedVideo.videoUrl) || ""}
            title={selectedVideo.title}
            className="w-full h-96 md:h-[500px]"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative">
            <ImageWithFallback
              src={
                selectedVideo.thumbnail?.startsWith("data:") ||
                selectedVideo.thumbnail?.startsWith("http")
                  ? selectedVideo.thumbnail
                  : `https://images.unsplash.com/1200x600?${selectedVideo.thumbnail || "default"}`
              }
              alt={selectedVideo.title}
              className="w-full h-96 md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Video URL not provided</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Info */}
        <div className="p-6 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Badge className={`${colors.badgeBg} text-white border-none`}>
              {selectedVideo.category}
            </Badge>
            <span className={`${colors.textSecondary} text-sm flex items-center gap-1`}>
              <Video className="w-4 h-4" />
              {selectedVideo.duration}
            </span>
            <span className={`${colors.textSecondary} text-sm`}>
              {selectedVideo.views} views
            </span>
          </div>
          <h2 className={`text-2xl font-bold ${colors.textPrimary} mb-3`}>
            {selectedVideo.title}
          </h2>
          <p
            id="video-description"
            className={`${colors.textSecondary} leading-relaxed`}
          >
            {selectedVideo.description}
          </p>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

    </div>
  );
}