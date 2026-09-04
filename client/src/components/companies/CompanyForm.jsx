import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Building2, MapPin, User, Globe, IndianRupee } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { ROUTES } from '../../routes/paths';

const industryOptions = [
  'Technology & Cloud',
  'IT Services & Consulting',
  'Consumer Internet & Tech',
  'Management & Technology Consulting',
  'Networking & Cybersecurity',
  'Investment Banking & FinTech',
  'Automotive & Manufacturing',
  'Healthcare & Pharmaceuticals',
  'E-Commerce & Retail'
];

const typeOptions = [
  'MNC / Product',
  'Product / Tech Unicorn',
  'MNC / IT Services',
  'MNC / Consulting',
  'MNC / Investment Bank',
  'Startup / Early Stage',
  'Core Engineering'
];

const tierOptions = [
  'Tier 1 (Super Dream - 20+ LPA)',
  'Tier 1 (Dream - 12-20 LPA)',
  'Tier 2 (6-12 LPA)',
  'Mass Recruiter (3.5-6 LPA)'
];

const CompanyForm = ({ initialData, onSubmit, loading = false, isEdit = false }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    companyId: initialData?.companyId || '',
    logo: initialData?.logo || '',
    industry: initialData?.industry || 'Technology & Cloud',
    type: initialData?.type || 'MNC / Product',
    tier: initialData?.tier || 'Tier 1 (Dream)',
    website: initialData?.website || '',
    location: initialData?.location || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    employeeCount: initialData?.employeeCount || '1,000+',
    averagePackage: initialData?.averagePackage || '',
    description: initialData?.description || '',
    contactPerson: initialData?.contactPerson || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
    status: initialData?.status || 'Active'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Company name is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errs.contactEmail = 'Please enter a valid email address';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. General Company Profile */}
      <Card
        title="Company Information"
        subtitle="Corporate profile, industry category, tier, and branding"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Microsoft India"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Company Code / ID</label>
            <input
              type="text"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              placeholder="e.g. COMP008 (Auto-assigned if empty)"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Active">Active Partner</option>
              <option value="Inactive">Inactive / Paused</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Industry</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {industryOptions.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Company Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Campus Placement Tier</label>
            <select
              name="tier"
              value={formData.tier}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {tierOptions.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Company Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://company.com"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Logo URL (Optional)</label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Average Offered CTC</label>
            <input
              type="text"
              name="averagePackage"
              value={formData.averagePackage}
              onChange={handleChange}
              placeholder="e.g. 18.0 LPA"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block font-medium text-text-secondary mb-1">Company Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief overview of the company, domain focus, and hiring expectations..."
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
            />
          </div>
        </div>
      </Card>

      {/* 2. Locations & Operations */}
      <Card
        title="Location & Workforce"
        subtitle="Headquarters, recruitment locations, and employee count"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Primary Location(s) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru / Hyderabad"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.location ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.location && <p className="text-rose-500 text-[11px] mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Bengaluru"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">State / Region</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Karnataka"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Total Employee Count</label>
            <input
              type="text"
              name="employeeCount"
              value={formData.employeeCount}
              onChange={handleChange}
              placeholder="e.g. 15,000+ (India)"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </Card>

      {/* 3. Recruiter & HR Contact Information */}
      <Card
        title="Recruiter / HR Contact"
        subtitle="Key point of contact for campus recruitment coordinate"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g. Sneha Kulkarni"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Official HR Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="hr-campus@company.com"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.contactEmail ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.contactEmail && <p className="text-rose-500 text-[11px] mt-1">{errors.contactEmail}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Contact Phone</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="+91 98112 34567"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(isEdit && initialData?.id ? ROUTES.COMPANIES.DETAILS(initialData.id) : ROUTES.COMPANIES.ROOT)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={Save}
          loading={loading}
        >
          {isEdit ? 'Save Changes' : 'Register Company'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
