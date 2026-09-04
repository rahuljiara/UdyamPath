import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import CompanyForm from '../../components/companies/CompanyForm';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { companyService } from '../../services/companyService';
import { ROUTES } from '../../routes/paths';

const CompanyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await companyService.getById(id);
        setCompany(data);
      } catch (err) {
        console.error('Error fetching company for edit:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setSubmitting(true);
      const updated = await companyService.update(id, formData);
      navigate(ROUTES.COMPANIES.DETAILS(updated.id));
    } catch (err) {
      console.error('Error updating company:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading company details for editing..." className="py-24" />;
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Company Not Found"
          breadcrumbs={[{ label: 'Companies', to: ROUTES.COMPANIES.ROOT }, { label: 'Edit' }]}
        />
        <EmptyState
          title="Company not found"
          description="The company partner record you are trying to edit was not found."
          actionLabel="Back to Companies"
          onAction={() => navigate(ROUTES.COMPANIES.ROOT)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`Edit ${company.name}`}
        subtitle={`Update corporate profile, recruiter contacts, and category for ${company.companyId}`}
        breadcrumbs={[
          { label: 'Companies', to: ROUTES.COMPANIES.ROOT },
          { label: company.name, to: ROUTES.COMPANIES.DETAILS(company.id) },
          { label: 'Edit' }
        ]}
      />

      <CompanyForm
        initialData={company}
        onSubmit={handleUpdate}
        loading={submitting}
        isEdit={true}
      />
    </div>
  );
};

export default CompanyEdit;
