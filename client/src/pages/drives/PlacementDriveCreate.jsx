import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DriveForm from '../../components/drives/DriveForm';
import { driveService } from '../../services/driveService';
import { ROUTES } from '../../routes/paths';

const PlacementDriveCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      const newDrive = await driveService.create(formData);
      navigate(ROUTES.DRIVES.DETAILS(newDrive.id));
    } catch (err) {
      console.error('Error creating placement drive:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Create Placement Drive"
        subtitle="Post a campus recruitment drive with eligibility criteria, timeline, and package"
        breadcrumbs={[
          { label: 'Placement Drives', to: ROUTES.DRIVES.ROOT },
          { label: 'Create Drive' }
        ]}
      />

      <DriveForm onSubmit={handleCreate} loading={loading} isEdit={false} />
    </div>
  );
};

export default PlacementDriveCreate;
