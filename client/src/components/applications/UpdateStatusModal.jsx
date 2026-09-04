import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const stages = [
  'Application',
  'Aptitude Test',
  'Technical Test',
  'Technical Interview',
  'HR Interview',
  'Final Selection'
];

const statuses = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Selected',
  'Rejected',
  'Withdrawn'
];

const UpdateStatusModal = ({
  isOpen,
  onClose,
  application,
  onUpdate,
  loading = false
}) => {
  const [currentStage, setCurrentStage] = useState('Application');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (application) {
      setCurrentStage(application.currentStage || 'Application');
      setStatus(application.status || 'Applied');
      setNotes(application.notes || '');
      setRejectionReason(application.rejectionReason || '');
    }
  }, [application]);

  if (!application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      currentStage,
      status,
      notes,
      rejectionReason: status === 'Rejected' ? rejectionReason : ''
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Candidate Stage & Status"
      subtitle={`${application.studentName} • ${application.position} at ${application.companyName}`}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Save}
            onClick={handleSubmit}
            loading={loading}
          >
            Save Progression
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-medium text-text-secondary mb-1">
            Recruitment Stage
          </label>
          <select
            value={currentStage}
            onChange={(e) => setCurrentStage(e.target.value)}
            className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            {stages.map((stg) => (
              <option key={stg} value={stg}>
                {stg}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-text-secondary mb-1">
            Application Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {status === 'Rejected' && (
          <div>
            <label className="block font-medium text-rose-600 mb-1">
              Rejection Reason / Feedback
            </label>
            <textarea
              rows="2"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Did not meet minimum technical interview cutoff in DSA round..."
              className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-500"
            />
          </div>
        )}

        <div>
          <label className="block font-medium text-text-secondary mb-1">
            TPO / Interviewer Internal Notes
          </label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Feedback, test marks, score breakdown, or special instructions..."
            className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </form>
    </Modal>
  );
};

export default UpdateStatusModal;
