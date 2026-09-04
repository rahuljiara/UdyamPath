import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import CompanyForm from '../../components/companies/CompanyForm';
import { companyService } from '../../services/companyService';
import { ROUTES } from '../../routes/paths';

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      const newCompany = await companyService.create(formData);
      navigate(ROUTES.COMPANIES.DETAILS(newCompany.id));
    } catch (err) {
      console.error('Error creating company:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Add Partner Company"
        subtitle="Register a corporate recruiter for campus placement drives"
        breadcrumbs={[
          { label: 'Companies', to: ROUTES.COMPANIES.ROOT },
          { label: 'Add Company' }
        ]}
      />

      <CompanyForm onSubmit={handleCreate} loading={loading} isEdit={false} />
    </div>
  );
};

export default CompanyCreate;
