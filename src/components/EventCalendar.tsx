import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, MapPin, Clock, Tag } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Event {
  id: number;
  title: string;
  description: string;
  month: string;
  year: string;
  day?: number;
  location: string;
  category: string;
  sdg: number;
  image?: string;
}

interface EventCalendarProps {
  events: Event[];
  isDark: boolean;
  designTheme: 'playful' | 'corporate';
}

const SDG_COLORS: { [key: number]: string } = {
  1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D',
  5: '#FF3A21', 6: '#26BDE2', 7: '#FCC30B', 8: '#A21942',
  9: '#FD6925', 10: '#DD1367', 11: '#FD9D24', 12: '#BF8B2E',
  13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B', 16: '#00689D',
  17: '#19486A'
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBREVIATIONS: { [key: string]: number } = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
};

export default function EventCalendar({ events, isDark, designTheme }: EventCalendarProps) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Parse events and map them to calendar dates
  const eventsWithDates = useMemo(() => {
    return events.map(event => {
      const monthIndex = MONTH_ABBREVIATIONS[event.month];
      const year = parseInt(event.year);
      
      // If event has a specific day, use it. Otherwise, assign to the 15th of the month
      const day = event.day || 15;
      
      return {
        ...event,
        monthIndex,
        parsedYear: year,
        day
      };
    });
  }, [events]);

  // Get events for selected month/year
  const monthEvents = useMemo(() => {
    return eventsWithDates.filter(event => 
      event.monthIndex === selectedMonth && event.parsedYear === selectedYear
    );
  }, [eventsWithDates, selectedMonth, selectedYear]);

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return monthEvents.filter(event => event.day === day);
  };

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (selectedDate === null) return monthEvents;
    return getEventsForDay(selectedDate);
  }, [selectedDate, monthEvents]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days: (number | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [selectedMonth, selectedYear]);

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setSelectedDate(null);
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
    setSelectedDate(currentDate.getDate());
  };

  const isToday = (day: number | null) => {
    if (day === null) return false;
    return (
      day === currentDate.getDate() &&
      selectedMonth === currentDate.getMonth() &&
      selectedYear === currentDate.getFullYear()
    );
  };

  const hasEvents = (day: number | null) => {
    if (day === null) return false;
    return getEventsForDay(day).length > 0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar View */}
      <div className="lg:col-span-2">
        <Card className={`${isDark ? 'bg-slate-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {MONTHS[selectedMonth]} {selectedYear}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                  className={`${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-gray-200 hover:bg-slate-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Today
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevMonth}
                    className={`${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-gray-200 hover:bg-slate-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                    className={`${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-gray-200 hover:bg-slate-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div
                  key={day}
                  className={`text-center py-2 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              <AnimatePresence mode="wait">
                {calendarDays.map((day, index) => {
                  const dayHasEvents = hasEvents(day);
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const isSelected = day === selectedDate;
                  const isTodayDate = isToday(day);

                  return (
                    <motion.button
                      key={`${selectedMonth}-${selectedYear}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.01 }}
                      onClick={() => day && setSelectedDate(isSelected ? null : day)}
                      disabled={day === null}
                      className={`
                        relative aspect-square p-2 rounded-lg transition-all
                        ${day === null ? 'cursor-default' : 'cursor-pointer'}
                        ${isSelected
                          ? isDark
                            ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                            : 'bg-blue-500 text-white ring-2 ring-blue-300'
                          : isTodayDate
                            ? isDark
                              ? 'bg-blue-900/30 text-blue-300 ring-2 ring-blue-500'
                              : 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                            : dayHasEvents
                              ? isDark
                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                              : isDark
                                ? 'hover:bg-slate-700/50 text-gray-400'
                                : 'hover:bg-gray-50 text-gray-600'
                        }
                      `}
                    >
                      {day && (
                        <>
                          <span className="text-sm font-medium">{day}</span>
                          {dayHasEvents && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                              {dayEvents.slice(0, 3).map((event, i) => (
                                <div
                                  key={i}
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: SDG_COLORS[event.sdg] }}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Legend */}
            <div className={`mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${isDark ? 'bg-blue-900/30 ring-2 ring-blue-500' : 'bg-blue-100 ring-2 ring-blue-400'}`} />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`} />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Has Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`} />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Selected</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="lg:col-span-1">
        <Card className={`sticky top-24 ${isDark ? 'bg-slate-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <CalendarIcon className="w-5 h-5" />
                {selectedDate
                  ? `Events on ${MONTHS[selectedMonth]} ${selectedDate}`
                  : `Events in ${MONTHS[selectedMonth]}`
                }
              </h3>
              <Badge variant="secondary">
                {selectedDateEvents.length}
              </Badge>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {selectedDateEvents.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No events {selectedDate ? 'on this day' : 'this month'}</p>
                  </motion.div>
                ) : (
                  selectedDateEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border-l-4 transition-all hover:scale-[1.02] cursor-pointer ${
                        isDark
                          ? 'bg-slate-700/50 hover:bg-slate-700'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      style={{ borderLeftColor: SDG_COLORS[event.sdg] }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-medium text-sm line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {event.title}
                        </h4>
                      </div>

                      <p className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {event.description}
                      </p>

                      <div className="space-y-1.5">
                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Tag className="w-3 h-3" />
                          <span>{event.category}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Badge
                          className="text-xs text-white"
                          style={{ backgroundColor: SDG_COLORS[event.sdg] }}
                        >
                          SDG {event.sdg}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}