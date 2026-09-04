import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Building2, Briefcase, ExternalLink, Download } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const EventDetailsModal = ({ isOpen, onClose, event }) => {
  const navigate = useNavigate();

  if (!event) return null;

  const handleDownloadICal = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UdyamPath//Placement Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${event.location || ''}`,
      `DTSTART:${event.date.replace(/-/g, '')}T090000Z`,
      `DTEND:${event.date.replace(/-/g, '')}T180000Z`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      subtitle={`${event.type} Event • ${formatDate(event.date)}`}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={handleDownloadICal} icon={Download}>
            Export iCal
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Top Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2.5 py-1 rounded-full font-semibold text-white text-[11px]"
            style={{ backgroundColor: event.color || '#2F8F78' }}
          >
            {event.type}
          </span>
          <span className="font-semibold text-text-primary text-xs">
            {event.company}
          </span>
        </div>

        {/* Date & Time */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-text-primary">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-semibold">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <span className="font-semibold text-text-secondary block mb-1">Details & Schedule:</span>
            <p className="text-text-secondary leading-relaxed bg-white border border-border-color p-3 rounded-lg">
              {event.description}
            </p>
          </div>
        )}

        {/* Related Drive Link */}
        {event.driveId && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-text-muted">Associated Campus Drive:</span>
            <Button
              variant="outline"
              size="sm"
              icon={ExternalLink}
              onClick={() => {
                onClose();
                navigate(ROUTES.DRIVES.DETAILS(event.driveId));
              }}
              className="text-xs"
            >
              View Placement Drive
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EventDetailsModal;
