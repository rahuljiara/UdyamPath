import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ROUTES } from '../routes/paths';

const PlaceholderPage = ({ title, subtitle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const formattedTitle = title || location.pathname.replace('/', '').toUpperCase() || 'Module';

  return (
    <div className="space-y-6">
      <PageHeader
        title={formattedTitle}
        subtitle={subtitle || 'This module will be populated in subsequent phases.'}
        breadcrumbs={[{ label: formattedTitle }]}
      />

      <Card className="p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mx-auto mb-4">
          <Construction className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          {formattedTitle} Module Ready for Phase Implementation
        </h3>
        <p className="text-xs text-text-muted max-w-md mx-auto mb-6 leading-relaxed">
          The routing, navigation architecture, and data contracts for {formattedTitle} are active.
        </p>
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate(ROUTES.DASHBOARD)}
        >
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
