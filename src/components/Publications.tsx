import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Book, Download, Eye, Calendar, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';

interface Publication {
  _id?: string; // MongoDB ID
  title: string;
  description: string;
  coverImage: string;
  year: string;
  category: string;
  pages: number;
  summary: string;
  tableOfContents: string[];
  pdfFile?: string;
  readOnlineUrl?: string;
  downloadUrl?: string; // legacy field
}

export default function Publications() {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Start with empty list — no defaults
  const [publicationsData, setPublicationsData] = useState<Publication[]>([]);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      const data = await api.getPublications();
      // If your backend returns { publications: [...] }
      if (data && Array.isArray(data.publications)) {
        setPublicationsData(data.publications);
      } else if (Array.isArray(data)) {
        // If backend returns plain array
        setPublicationsData(data);
      } else {
        setPublicationsData([]);
      }
    } catch (error) {
      console.error('Error loading publications from API:', error);
      setPublicationsData([]); // show nothing if API fails
    }
  };

  const itemsPerPage = 6;
  const totalPages = Math.ceil(publicationsData.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPublications = publicationsData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = (publication: Publication) => {
    const pdfData = publication.pdfFile || publication.downloadUrl;
    if (pdfData) {
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = `${publication.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('PDF not available for download.');
    }
  };

  const handleReadOnline = (publication: Publication) => {
    if (publication.readOnlineUrl) {
      window.open(publication.readOnlineUrl, '_blank', 'noopener,noreferrer');
    } else if (publication.pdfFile || publication.downloadUrl) {
      const pdfData = publication.pdfFile || publication.downloadUrl;
      window.open(pdfData, '_blank', 'noopener,noreferrer');
    } else {
      alert('Online reading is not available for this publication.');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-6 shadow-2xl"
          >
            <Book className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent mb-4"
          >
            Publications
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6"
          >
            Explore our comprehensive collection of reports, guides, and research on sustainable development and responsible enterprise
          </motion.p>

          {/* Page indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-slate-700"
          >
            <Book className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages} • {publicationsData.length} Publications
            </span>
          </motion.div>
        </motion.div>

        {/* Publications Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {currentPublications.map((publication, index) => (
              <motion.div
                key={publication.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onMouseEnter={() => setHoveredId(publication.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedPublication(publication)}
                className="group cursor-pointer"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700">
                  {/* Book Cover Image */}
                  <div className="relative h-96 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600">
                    <motion.img
                      src={publication.coverImage}
                      alt={publication.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Overlay on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === publication.id ? 1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: hoveredId === publication.id ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <Eye className="w-12 h-12 text-white" strokeWidth={2} />
                        <span className="text-white font-semibold">View Publication</span>
                      </motion.div>
                    </motion.div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm border-0">
                        {publication.category}
                      </Badge>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
                        {publication.year}
                      </Badge>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {publication.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {publication.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{publication.pages} pages</span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium"
                      >
                        <Book className="w-4 h-4" />
                        <span>Read More</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-6 mb-12"
          >
            {/* Page Navigation Buttons */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === 1
                    ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </motion.button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-110'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === totalPages
                    ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Page Dots Indicator */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => goToPage(pageNum)}
                  className={`transition-all duration-300 rounded-full ${
                    currentPage === pageNum
                      ? 'w-8 h-3 bg-gradient-to-r from-blue-600 to-green-600'
                      : 'w-3 h-3 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Publication Modal */}
      <Dialog open={!!selectedPublication} onOpenChange={() => setSelectedPublication(null)}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border-0 shadow-2xl p-0 overflow-hidden"
          {...(selectedPublication && { 'aria-describedby': `publication-${selectedPublication.id}-description` })}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>
              {selectedPublication ? selectedPublication.title : 'Publication Details'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPublication && (
            <ScrollArea className="h-full max-h-[90vh]">
              <div className="relative">
                {/* Header Image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={selectedPublication.coverImage}
                    alt={selectedPublication.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/30">
                        {selectedPublication.category}
                      </Badge>
                      <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/30">
                        <Calendar className="w-3 h-3 mr-1" />
                        {selectedPublication.year}
                      </Badge>
                      <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/30">
                        <FileText className="w-3 h-3 mr-1" />
                        {selectedPublication.pages} pages
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{selectedPublication.title}</h2>
                    <p className="text-white/90">{selectedPublication.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  {/* Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Book className="w-6 h-6 text-blue-600" />
                      Overview
                    </h3>
                    <p 
                      id={`publication-${selectedPublication.id}-description`}
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                    >
                      {selectedPublication.summary}
                    </p>
                  </motion.div>

                  {/* Table of Contents */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-green-600" />
                      Table of Contents
                    </h3>
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6">
                      <div className="space-y-3">
                        {selectedPublication.tableOfContents.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="flex items-start gap-3 group cursor-pointer hover:bg-white/50 dark:hover:bg-slate-600/50 p-3 rounded-lg transition-all"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <span className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {item}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Book Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Preview</h3>
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-xl overflow-hidden shadow-2xl">
                      <img
                        src={selectedPublication.coverImage}
                        alt={`${selectedPublication.title} preview`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReadOnline(selectedPublication)}
                      className="flex-1 min-w-[200px] px-6 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      Read Online
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadPDF(selectedPublication)}
                      className="flex-1 min-w-[200px] px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </motion.button>
                  </motion.div>

                  {/* Additional Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6"
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">About This Publication</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-white/50 dark:bg-slate-600/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedPublication.year}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-600/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedPublication.pages}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Pages</div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-600/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{selectedPublication.tableOfContents.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Chapters</div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-600/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">PDF</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Format</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}