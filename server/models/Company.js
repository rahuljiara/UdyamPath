import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true
    },
    logo: {
      type: String,
      default: ''
    },
    industry: {
      type: String,
      default: 'Technology & IT Services',
      trim: true,
      index: true
    },
    type: {
      type: String,
      default: 'Product / MNC',
      trim: true
    },
    website: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    city: {
      type: String,
      default: '',
      trim: true
    },
    state: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    employeeCount: {
      type: String,
      default: ''
    },
    contactPerson: {
      type: String,
      default: '',
      trim: true
    },
    contactEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true
    },
    contactPhone: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
      index: true
    },
    tier: {
      type: String,
      default: 'Tier 1',
      trim: true
    },
    averagePackage: {
      type: String,
      default: '0.0 LPA'
    },
    activeDrivesCount: {
      type: Number,
      default: 0
    },
    totalHires: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;
