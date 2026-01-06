import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid,
  CalendarDays,
  ZoomIn,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent } from "./ui/dialog";
import EventCalendar from "./EventCalendar";
import { api } from "../utils/api";

interface EventPhoto {
  _id?: string;
  url: string;
  caption: string;
}

interface Event {
  _id?: string;
  month: string;
  year: number;
  title: string;
  description: string;
  photos: EventPhoto[];
  // Optional fields for calendar view
}

export default function Events() {
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [direction, setDirection] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"gallery" | "calendar">("gallery");

  // Start with empty list — no defaults
  const [eventsData, setEventsData] = useState<Event[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.getEvents();
      if (data && Array.isArray(data) && data.length > 0) {
        setEventsData(data);
        // Set initial month-year selection to the first event
        setSelectedMonthYear(`${data[0].month} ${data[0].year}`);
      } else {
        setEventsData([]);
      }
    } catch (error) {
      console.error("Error loading events from API:", error);
      setEventsData([]); // no defaults
    }
  };

  // Get unique month-year combinations
  const monthYearOptions = eventsData.map(
    (event) => `${event.month} ${event.year}`
  );

  // Get current event based on selected month-year
  const currentEvent =
    eventsData.length > 0
      ? eventsData.find(
          (event) => `${event.month} ${event.year}` === selectedMonthYear
        ) || eventsData[0]
      : null;

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setDirection(0);
  };

  const handleNext = () => {
    if (selectedPhotoIndex !== null && currentEvent) {
      setDirection(1);
      setSelectedPhotoIndex(
        (selectedPhotoIndex + 1) % currentEvent.photos.length
      );
    }
  };

  const handlePrevious = () => {
    if (selectedPhotoIndex !== null && currentEvent) {
      setDirection(-1);
      setSelectedPhotoIndex(
        selectedPhotoIndex === 0
          ? currentEvent.photos.length - 1
          : selectedPhotoIndex - 1
      );
    }
  };

  // Add state at the top of your component
  const [photoPage, setPhotoPage] = useState(1);
  const photosPerPage = 9;

  // Calculate slice
  const totalPhotos = currentEvent?.photos?.length || 0;
  const totalPages = Math.ceil(totalPhotos / photosPerPage);
  const startIndex = (photoPage - 1) * photosPerPage;
  const endIndex = startIndex + photosPerPage;
  const currentPhotos = currentEvent?.photos?.slice(startIndex, endIndex) || [];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-2xl"
          >
            <Calendar className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4"
          >
            Events Gallery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Explore our memorable moments and impactful events throughout the
            year
          </motion.p>

          {/* View Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-xl border border-gray-200 dark:border-slate-700">
              <Button
                variant={viewMode === "gallery" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("gallery")}
                className={`gap-2 ${
                  viewMode === "gallery"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <Grid className="w-4 h-4" />
                Gallery View
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={`gap-2 ${
                  viewMode === "calendar"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Calendar View
              </Button>
            </div>
          </motion.div>

          {/* Month/Year Selector - Only show in Gallery View */}
          {viewMode === "gallery" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-xl border border-gray-200 dark:border-slate-700">
                <Calendar className="w-5 h-5 text-purple-600 ml-2" />
                <select
                  value={selectedMonthYear}
                  onChange={(e) => setSelectedMonthYear(e.target.value)}
                  className="bg-transparent text-lg font-semibold text-gray-900 dark:text-white border-0 focus:outline-none focus:ring-0 cursor-pointer pr-8"
                >
                  {monthYearOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Conditional rendering based on view mode */}
        {viewMode === "calendar" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EventCalendar
              events={eventsData.map((event) => ({
                id: event.id,
                title: event.title,
                description: event.description,
                month: event.month.slice(0, 3), // Convert "January" to "Jan"
                year: event.year.toString(),
                image: event.photos[0]?.url,
              }))}
              isDark={document.documentElement.classList.contains("dark")}
              designTheme="playful"
            />
          </motion.div>
        ) : (
          <>
            {/* Event Info */}
            <AnimatePresence mode="wait">
              {currentEvent ? (
                <motion.div
                  key={selectedMonthYear}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 mb-12 text-white shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">
                        {currentEvent.title}
                      </h2>
                      <p className="text-white/90 text-lg mb-4">
                        {currentEvent.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-white/20 text-white border-white/30">
                          <ImageWithFallback className="w-3 h-3 mr-1" />
                          {currentEvent.photos?.length || 0} Photos
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {currentEvent.month} {currentEvent.year}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <p className="text-gray-500">No events available.</p>
              )}
            </AnimatePresence>

        
            {/* Photo Grid */}
            <AnimatePresence mode="wait">
              {currentPhotos.length > 0 ? (
                <>
                  <motion.div
                    key={selectedMonthYear + photoPage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {currentPhotos.map((photo, index) => (
                      <motion.div
                        key={photo._id || index}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.05, y: -8 }}
                        onClick={() => handlePhotoClick(startIndex + index)}
                        className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-xl bg-gray-200 dark:bg-slate-700 aspect-square"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <p className="text-white font-semibold text-lg mb-2">
                              {photo.caption}
                            </p>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                              <ZoomIn className="w-4 h-4" />
                              <span>Click to view</span>
                            </div>
                          </div>
                        </div>
                        {/* Photo number badge */}
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-900 dark:text-white shadow-lg">
                          {startIndex + index + 1}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                
                </>
              ) : (
                <p className="text-gray-500">No photos available.</p>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 gap-2">
        <Button
          size="sm"
          disabled={photoPage === 1}
          onClick={() => setPhotoPage(photoPage - 1)}
          className={`rounded-full px-4 ${
            photoPage === 1
              ? "bg-gray-300 dark:bg-slate-700 text-gray-500"
              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
          }`}
        >
          Prev
        </Button>

        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            size="sm"
            onClick={() => setPhotoPage(i + 1)}
            className={`rounded-full w-8 h-8 ${
              photoPage === i + 1
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700"
            }`}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          size="sm"
          disabled={photoPage === totalPages}
          onClick={() => setPhotoPage(photoPage + 1)}
          className={`rounded-full px-4 ${
            photoPage === totalPages
              ? "bg-gray-300 dark:bg-slate-700 text-gray-500"
              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
          }`}
        >
          Next
        </Button>
      </div>

      {/* Photo Modal */}
      <Dialog
        open={selectedPhotoIndex !== null}
        onOpenChange={() => setSelectedPhotoIndex(null)}
      >
        <DialogContent
          className="max-w-6xl w-full h-[90vh] bg-black/95 border-0 p-0 overflow-hidden"
          aria-describedby={
            selectedPhotoIndex !== null ? "photo-caption" : undefined
          }
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Photo counter */}
            {selectedPhotoIndex !== null && (
              <div className="absolute top-6 left-6 z-50 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white font-semibold">
                {selectedPhotoIndex + 1} / {currentEvent.photos.length}
              </div>
            )}

            {/* Navigation buttons */}
            {selectedPhotoIndex !== null && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrevious}
                  className="absolute left-6 z-50 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNext}
                  className="absolute right-6 z-50 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </motion.button>
              </>
            )}

            {/* Photo display with animation */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {selectedPhotoIndex !== null && (
                <motion.div
                  key={selectedPhotoIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                    rotateY: { duration: 0.5 },
                  }}
                  className="relative w-full h-full flex flex-col items-center justify-center p-12"
                >
                  <motion.img
                    src={currentEvent.photos[selectedPhotoIndex].url}
                    alt={currentEvent.photos[selectedPhotoIndex].caption}
                    className="max-w-full max-h-[calc(100%-120px)] object-contain rounded-xl shadow-2xl"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Caption */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 text-center"
                  >
                    <p
                      id="photo-caption"
                      className="text-white text-xl font-semibold"
                    >
                      {currentEvent.photos[selectedPhotoIndex].caption}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyboard hints */}
            {selectedPhotoIndex !== null && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white/70 text-sm">
                <span>← Previous</span>
                <span>|</span>
                <span>Next →</span>
                <span>|</span>
                <span>ESC to close</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
