import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowRight, Tag, Newspaper, Play, Eye, ChevronLeft, ChevronRight, X, Filter, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { api } from "../utils/api";

// ✅ keep only categories as default data
const categories = [
  "All News",
  "Climate Action",
  "Zero Hunger",
  "Education",
  "Gender Equality",
  "Clean Energy",
  "Clean Water",
  "Sustainable Cities",
  "Responsible Production",
];

export default function News() {
  const [selectedCategory, setSelectedCategory] = React.useState("All News");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentArticlePage, setCurrentArticlePage] = React.useState(1);
  const [currentVideoPage, setCurrentVideoPage] = React.useState(1);
  const [currentStoryPage, setCurrentStoryPage] = React.useState(1);
  const [currentNewsPage, setCurrentNewsPage] = React.useState(1);
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Modal states
  const [selectedStory, setSelectedStory] = React.useState<any | null>(null);
  const [selectedArticle, setSelectedArticle] = React.useState<any | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<any | null>(null);

  const articlesPerPage = 9;
  const videosPerPage = 6;
  const storiesPerPage = 4;
  const newsPerPage = 9;

  // ✅ no defaultNews, articles, videos arrays anymore
  const [news, setNews] = React.useState<any[]>([]);
  const [loadedArticles, setLoadedArticles] = React.useState<any[]>([]);
  const [loadedVideos, setLoadedVideos] = React.useState<any[]>([]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    loadNewsData();
  }, []);

  const loadNewsData = async () => {
    try {
      const data = await api.getNews();
      if (data) {
        if (Array.isArray(data.stories)) setNews(data.stories);
        if (Array.isArray(data.articles)) setLoadedArticles(data.articles);
        if (Array.isArray(data.videos)) setLoadedVideos(data.videos);
      }
    } catch (error) {
      console.error("Error loading news data from API:", error);
    }
  };
  const filteredNews = news.filter((article) => {
    const matchesCategory =
      selectedCategory === "All News" ||
      article.category === selectedCategory;
    const matchesSearch =
      article.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      article.excerpt
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = news.filter(
    (article) => article.featured,
  );
  const regularNews = news.filter(
    (article) => !article.featured,
  );

  const filteredArticles = loadedArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === "All News" ||
      article.category === selectedCategory;
    const matchesSearch =
      article.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      article.excerpt
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredVideos = loadedVideos.filter((video) => {
    const matchesCategory =
      selectedCategory === "All News" ||
      video.category === selectedCategory;
    const matchesSearch =
      video.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      video.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const paginatedArticles = filteredArticles.slice(
    (currentArticlePage - 1) * articlesPerPage,
    currentArticlePage * articlesPerPage
  );

  const paginatedVideos = filteredVideos.slice(
    (currentVideoPage - 1) * videosPerPage,
    currentVideoPage * videosPerPage
  );

  const paginatedStories = featuredNews.slice(
    (currentStoryPage - 1) * storiesPerPage,
    currentStoryPage * storiesPerPage
  );
  const paginatedNews = filteredNews.slice(
  (currentNewsPage - 1) * newsPerPage,
  currentNewsPage * newsPerPage
);

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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Latest News
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-white">
            Stay updated on the latest developments,
            breakthroughs, and progress in sustainable
            development around the world.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Category Dropdown Filter */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="min-w-[280px] justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-gray-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold">{selectedCategory}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </Button>
              
              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-slate-700 overflow-hidden z-50"
                  >
                    <div className="max-h-[400px] overflow-y-auto">
                      {categories.map((category, index) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                            setCurrentArticlePage(1);
                            setCurrentVideoPage(1);
                            setCurrentStoryPage(1);
                          }}
                          className={`w-full px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all ${
                            selectedCategory === category 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold' 
                              : 'text-gray-700 dark:text-gray-300'
                          } ${index !== categories.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            {selectedCategory === category && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                            <span>{category}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Active Filter Badge */}
            {selectedCategory !== "All News" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2">
                  Filtering by: {selectedCategory}
                  <button
                    onClick={() => {
                      setSelectedCategory("All News");
                      setCurrentArticlePage(1);
                      setCurrentVideoPage(1);
                      setCurrentStoryPage(1);
                    }}
                    className="ml-2 hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Featured News */}
        {featuredNews.length > 0 &&
          selectedCategory === "All News" && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 dark:text-white mb-8">
                Featured Stories
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {paginatedStories.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedStory(article)}
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-none">
                            Featured
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge
                            variant="secondary"
                            className="bg-black/50 text-white border-none"
                          >
                            SDG {article.sdg}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(
                              article.date,
                            ).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                          {article.title}
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-xs dark:text-black mb-8"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {article.category}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination for Stories */}
              {featuredNews.length > storiesPerPage && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-4 mt-12"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="group hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300"
                    onClick={() => setCurrentStoryPage(currentStoryPage - 1)}
                    disabled={currentStoryPage === 1}
                  >
                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.ceil(featuredNews.length / storiesPerPage) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentStoryPage(i + 1)}
                        className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                          currentStoryPage === i + 1
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="group hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300"
                    onClick={() => setCurrentStoryPage(currentStoryPage + 1)}
                    disabled={currentStoryPage * storiesPerPage >= featuredNews.length}
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

        {/* All News */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {selectedCategory === "All News"
              ? "Recent Updates"
              : `${selectedCategory} News`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedStory(article)}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <ImageWithFallback
                     src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-black/50 text-white border-none text-xs"
                      >
                        SDG {article.sdg}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(
                          article.date,
                        ).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-xs dark:text-black"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {article.category}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 text-xs"
                      >
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {Math.ceil(filteredNews.length / newsPerPage) > 1 && (
  <div className="flex items-center justify-center gap-4 mt-12">
    <Button
      onClick={() => setCurrentNewsPage(currentNewsPage - 1)}
      disabled={currentNewsPage === 1}
    >
      <ChevronLeft /> Previous
    </Button>

    <div className="flex items-center gap-2">
      {Array.from({ length: Math.ceil(filteredNews.length / newsPerPage) }).map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentNewsPage(i + 1)}
          className={`w-10 h-10 rounded-lg ${
            currentNewsPage === i + 1
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110"
              : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>

     <Button
      variant="outline"
      size="lg"
      className="bg-white text-black border border-gray-300 
                 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 
                 hover:text-white hover:border-transparent transition-all duration-300"
      onClick={() => setCurrentNewsPage(currentNewsPage + 1)}
      disabled={currentNewsPage * newsPerPage >= filteredNews.length}
    >
      Next
      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
    </Button>
  </div>
)}


        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Let's build a greener future together! 💚
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Stay connected with the latest progress in
            sustainable development. From community projects to
            global breakthroughs, we're sharing stories that
            matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto items-center justify-center">
            <a
              href="https://www.facebook.com/climateneutralawards"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-xl text-center">
                Embark With Us
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Articles Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              In-Depth Articles
            </h2>
          </div>
          
          {/* Magazine-Style Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className={`group cursor-pointer ${
                  article.featured && index === 0 
                    ? 'md:col-span-2 lg:col-span-2 md:row-span-2' 
                    : ''
                }`}
                onClick={() => setSelectedArticle(article)}
              >
                <Card className="h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                  {/* Image Section */}
                  <div className={`relative overflow-hidden ${
                    article.featured && index === 0 
                      ? 'h-96' 
                      : 'h-56'
                  }`}>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none shadow-lg">
                        {article.category}
                      </Badge>
                    </div>
                    
                    {/* Featured Badge */}
                    {article.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg">
                          ⭐ Featured
                        </Badge>
                      </div>
                    )}
                    
                    {/* Title Overlay on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className={`text-white mb-2 group-hover:text-blue-300 transition-colors duration-200 ${
                        article.featured && index === 0 
                          ? 'text-3xl' 
                          : 'text-xl'
                      }`}>
                        {article.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-xs text-white/80">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.author}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <CardContent className="p-6">
                    <p className={`text-gray-600 dark:text-gray-300 leading-relaxed mb-4 ${
                      article.featured && index === 0 
                        ? 'line-clamp-4 text-base' 
                        : 'line-clamp-3 text-sm'
                    }`}>
                      {article.excerpt}
                    </p>
                    
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group/btn w-full justify-between px-0"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                  </CardContent>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl" />
                </Card>
              </motion.div>
            ))}
          </div>

          

          {/* Pagination for Articles */}
          {filteredArticles.length > articlesPerPage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 mt-12"
            >
              <Button
                variant="outline"
                size="lg"
                className="group hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300"
                onClick={() => setCurrentArticlePage(currentArticlePage - 1)}
                disabled={currentArticlePage === 1}
              >
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(filteredArticles.length / articlesPerPage) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentArticlePage(i + 1)}
                    className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                      currentArticlePage === i + 1
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="lg"
                className="group hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300"
                onClick={() => setCurrentArticlePage(currentArticlePage + 1)}
                disabled={currentArticlePage * articlesPerPage >= filteredArticles.length}
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Videos Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Videos
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Video Thumbnail */}
                  <div className="relative h-64 overflow-hidden bg-black">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-90 transition-all duration-500"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300"
                      >
                        <Play className="w-10 h-10 text-purple-600 group-hover:text-white ml-1 transition-colors" fill="currentColor" />
                      </motion.div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-black/70 backdrop-blur-sm text-white border-none">
                        {video.duration}
                      </Badge>
                    </div>
                    
                    {/* Views Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/70 backdrop-blur-sm text-white border-none">
                        <Eye className="w-3 h-3 mr-1" />
                        {video.views} views
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Video Content */}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(video.date).toLocaleDateString()}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-2">
                      {video.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {video.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <Button
                        variant="ghost"
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 w-full justify-center group/btn"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination for Videos */}
          {filteredVideos.length > videosPerPage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 mt-12"
            >
              <Button
                variant="outline"
                size="lg"
                className="group hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                onClick={() => setCurrentVideoPage(currentVideoPage - 1)}
                disabled={currentVideoPage === 1}
              >
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(filteredVideos.length / videosPerPage) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentVideoPage(i + 1)}
                    className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                      currentVideoPage === i + 1
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="lg"
                className="group hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                onClick={() => setCurrentVideoPage(currentVideoPage + 1)}
                disabled={currentVideoPage * videosPerPage >= filteredVideos.length}
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Story Modal (Recent Updates) */}
      <Dialog open={selectedStory !== null} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          aria-describedby={selectedStory ? "story-description" : undefined}
        >
          <button
            onClick={() => setSelectedStory(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {selectedStory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-80 w-full overflow-hidden rounded-xl mb-6">
                <ImageWithFallback
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none">
                    SDG {selectedStory.sdg}
                  </Badge>
                </div>
              </div>
              
              <DialogHeader className="mb-4">
                <Badge className="w-fit mb-3">
                  <Tag className="w-3 h-3 mr-1" />
                  {selectedStory.category}
                </Badge>
                <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedStory.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedStory.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedStory.readTime}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedStory.excerpt}
                </p>
              </div>
              
              {/* Explore More Button */}
              {selectedStory.link && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <Button
                    onClick={() => window.open(selectedStory.link, '_blank', 'noopener,noreferrer')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    size="lg"
                  >
                    Explore More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Article Modal (In-Depth Articles) */}
      <Dialog open={selectedArticle !== null} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent 
          className="max-w-5xl max-h-[90vh] overflow-y-auto"
          aria-describedby={selectedArticle ? "article-description" : undefined}
        >
          <button
            onClick={() => setSelectedArticle(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-96 w-full overflow-hidden rounded-xl mb-6">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none mb-3">
                    {selectedArticle.category}
                  </Badge>
                  {selectedArticle.featured && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none ml-2">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              
              <DialogHeader className="mb-6">
                <DialogTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedArticle.title}
                </DialogTitle>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedArticle.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedArticle.readTime}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    By {selectedArticle.author}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                  {selectedArticle.excerpt}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedArticle.description}
                </p>
              </div>
              
              {/* Explore More Button */}
              {selectedArticle.link && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <Button
                    onClick={() => window.open(selectedArticle.link, '_blank', 'noopener,noreferrer')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    size="lg"
                  >
                    Explore More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Modal (Featured Videos) */}
      <Dialog open={selectedVideo !== null} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent 
          className="max-w-6xl max-h-[90vh] overflow-y-auto p-0"
          aria-describedby={selectedVideo ? "video-description" : undefined}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50 bg-black/50 backdrop-blur-sm p-2 rounded-full"
          >
            <X className="h-5 w-5 text-white" />
            <span className="sr-only">Close</span>
          </button>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Video Player Placeholder */}
              <div className="relative w-full bg-black aspect-video">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/90 to-pink-900/90">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl"
                  >
                    <Play className="w-12 h-12 text-purple-600 ml-2" fill="currentColor" />
                  </motion.div>
                  <p className="text-white text-xl font-semibold mb-2">Video Player</p>
                  <p className="text-white/80 text-sm">Duration: {selectedVideo.duration}</p>
                  <p className="text-white/60 text-xs mt-4 max-w-md text-center px-4">
                    “Click Play Now to begin watching — your featured content is ready to inform and engage.”
                  </p>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-8 bg-white dark:bg-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                    <Eye className="w-3 h-3 mr-1" />
                    {selectedVideo.views} views
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedVideo.date).toLocaleDateString()}
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedVideo.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {selectedVideo.description}
                </p>
                
                {/* Explore More Button */}
                {selectedVideo.link && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                    <Button
                      onClick={() => window.open(selectedVideo.link, '_blank', 'noopener,noreferrer')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      size="lg"
                    >
                      Play Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}