import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES } from '../routes/paths';
import logoImg from '../assets/logo/Logo.png';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <img src={logoImg} alt="UdyamPath Logo" className="w-12 h-12 object-contain mb-4" />
      <div className="w-16 h-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold text-2xl mb-4">
        404
      </div>
      <h1 className="text-xl font-bold text-text-primary tracking-tight mb-1.5">
        Page Not Found
      </h1>
      <p className="text-xs text-text-muted max-w-sm mb-6">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button
        variant="primary"
        size="sm"
        icon={Home}
        onClick={() => navigate(ROUTES.DASHBOARD)}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
