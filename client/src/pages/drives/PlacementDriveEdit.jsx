import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DriveForm from '../../components/drives/DriveForm';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { driveService } from '../../services/driveService';
import { ROUTES } from '../../routes/paths';

const PlacementDriveEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [drive, setDrive] = useState(null);

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        setLoading(true);
        const data = await driveService.getById(id);
        setDrive(data);
      } catch (err) {
        console.error('Error fetching placement drive for editing:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDrive();
    }
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setSubmitting(true);
      const updated = await driveService.update(id, formData);
      navigate(ROUTES.DRIVES.DETAILS(updated.id));
    } catch (err) {
      console.error('Error updating placement drive:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading placement drive details for editing..." className="py-24" />;
  }

  if (!drive) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Drive Not Found"
          breadcrumbs={[{ label: 'Placement Drives', to: ROUTES.DRIVES.ROOT }, { label: 'Edit' }]}
        />
        <EmptyState
          title="Placement drive not found"
          description="The placement drive record you are trying to edit was not found."
          actionLabel="Back to Drives"
          onAction={() => navigate(ROUTES.DRIVES.ROOT)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`Edit ${drive.title}`}
        subtitle={`Update hiring criteria, rounds, and package for ${drive.companyName}`}
        breadcrumbs={[
          { label: 'Placement Drives', to: ROUTES.DRIVES.ROOT },
          { label: drive.title, to: ROUTES.DRIVES.DETAILS(drive.id) },
          { label: 'Edit' }
        ]}
      />

      <DriveForm
        initialData={drive}
        onSubmit={handleUpdate}
        loading={submitting}
        isEdit={true}
      />
    </div>
  );
};

export default PlacementDriveEdit;
