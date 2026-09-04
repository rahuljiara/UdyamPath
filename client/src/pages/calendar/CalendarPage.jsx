import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Clock,
  MapPin,
  List,
  Grid,
  Building2,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import EventDetailsModal from '../../components/calendar/EventDetailsModal';
import { calendarService } from '../../services/calendarService';
import { formatDate } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const eventCategories = [
  { label: 'All Events', value: 'All', color: '#64748B' },
  { label: 'Placement Drives', value: 'Drive', color: '#2F8F78' },
  { label: 'Assessments / Tests', value: 'Assessment', color: '#38BDF8' },
  { label: 'Application Deadlines', value: 'Deadline', color: '#F59E0B' },
  { label: 'Pre-Placement Talks', value: 'Pre-Placement Talk', color: '#A855F7' },
  { label: 'Interviews', value: 'Interview', color: '#EC4899' }
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const navigate = useNavigate();

  // Current viewed month and year
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'agenda'
  const [eventType, setEventType] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected event for modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await calendarService.getEvents({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        eventType
      });
      setEvents(data);
    } catch (err) {
      console.error('Error loading calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, eventType]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Build grid days for month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Get events for specific date string YYYY-MM-DD
  const getEventsForDay = (dayNumber) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    return events.filter((e) => e.date === formattedDate);
  };

  const handleExportAllICal = () => {
    const icsHeader = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UdyamPath//Placement Calendar//EN'
    ];

    const icsEvents = events.map((e) =>
      [
        'BEGIN:VEVENT',
        `SUMMARY:${e.title}`,
        `DESCRIPTION:${e.description || ''}`,
        `LOCATION:${e.location || ''}`,
        `DTSTART:${e.date.replace(/-/g, '')}T090000Z`,
        `DTEND:${e.date.replace(/-/g, '')}T180000Z`,
        'END:VEVENT'
      ].join('\r\n')
    );

    const icsFooter = ['END:VCALENDAR'];
    const icsContent = [...icsHeader, ...icsEvents, ...icsFooter].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UdyamPath_Calendar_${monthName}_${year}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Placement Drive Calendar"
        subtitle="Schedule of campus recruitment drives, assessment deadlines, and pre-placement talks"
        breadcrumbs={[{ label: 'Calendar' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExportAllICal}
            className="text-xs"
          >
            Export iCal
          </Button>
        }
      />

      {/* 2. Month Navigation & Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-border-color shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Navigation buttons and Month Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-700"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-700"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-text-primary">
            {monthName} {year}
          </h3>
        </div>

        {/* Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
          >
            {eventCategories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-text-primary'
              }`}
              title="Month Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('agenda')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'agenda' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-text-primary'
              }`}
              title="Agenda List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Legend Pills */}
      <div className="flex flex-wrap items-center gap-3 text-xs bg-white p-3 rounded-xl border border-border-color shadow-subtle">
        <span className="font-semibold text-text-secondary text-[11px] uppercase tracking-wider">
          Legend:
        </span>
        {eventCategories.slice(1).map((cat) => (
          <div key={cat.value} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-text-secondary text-[11px]">{cat.label}</span>
          </div>
        ))}
      </div>

      {/* 4. Display: Grid vs Agenda View */}
      {loading ? (
        <div className="bg-white rounded-xl border border-border-color py-24">
          <Loading message="Syncing placement drive calendar schedule..." />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="bg-white rounded-xl border border-border-color shadow-subtle overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-border-color bg-slate-50/80 text-center text-xs font-bold text-text-secondary py-2.5">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border-color/70 text-xs">
            {/* Empty offset days */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-[110px] bg-slate-50/40 p-2 text-slate-300" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNumber = idx + 1;
              const dayEvents = getEventsForDay(dayNumber);
              const isToday =
                new Date().getDate() === dayNumber &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={`day-${dayNumber}`}
                  className={`min-h-[110px] p-2 transition-colors flex flex-col justify-between ${
                    isToday ? 'bg-primary-soft/20' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-primary text-white' : 'text-text-primary'
                      }`}
                    >
                      {dayNumber}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-text-muted font-medium">
                        {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Event pills for this date */}
                  <div className="space-y-1 overflow-y-auto max-h-[75px]">
                    {dayEvents.map((evt) => (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={() => setSelectedEvent(evt)}
                        className="w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold text-white truncate block transition-transform hover:scale-[1.02] shadow-xs"
                        style={{ backgroundColor: evt.color || '#2F8F78' }}
                        title={`${evt.title} (${evt.time})`}
                      >
                        {evt.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda List View */
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="bg-white rounded-xl border border-border-color p-4 shadow-subtle hover:border-primary/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-3 h-12 rounded-full shrink-0"
                    style={{ backgroundColor: evt.color || '#2F8F78' }}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-text-primary text-sm">{evt.title}</h4>
                      <span
                        className="px-2 py-0.2 rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: evt.color || '#2F8F78' }}
                      >
                        {evt.type}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">
                      {evt.company} • {evt.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-text-secondary shrink-0">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(evt.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {evt.time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <Card className="p-12 text-center text-xs text-text-muted">
              No calendar events found for the selected month and filter.
            </Card>
          )}
        </div>
      )}

      {/* 5. Event Details Modal */}
      <EventDetailsModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  );
};

export default CalendarPage;
