import mongoose from 'mongoose';

const placementDriveSchema = new mongoose.Schema(
  {
    driveId: {
      type: String,
      required: [true, 'Drive ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      index: true
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    jobType: {
      type: String,
      default: 'Full-Time',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    salary: {
      type: String,
      default: ''
    },
    salaryBreakup: {
      type: String,
      default: ''
    },
    ctc: {
      type: String,
      required: [true, 'CTC package is required'],
      trim: true
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, 'Openings must be at least 1']
    },
    applicationsCount: {
      type: Number,
      default: 0
    },
    shortlistedCount: {
      type: Number,
      default: 0
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
      index: true
    },
    driveDate: {
      type: String,
      default: ''
    },
    eligibility: {
      minCgpa: {
        type: Number,
        default: 6.0,
        min: 0,
        max: 10
      },
      maxBacklogs: {
        type: Number,
        default: 0,
        min: 0
      },
      departments: {
        type: [String],
        default: ['Computer Science & Engineering', 'Information Technology']
      },
      courses: {
        type: [String],
        default: ['B.Tech']
      },
      batches: {
        type: [String],
        default: ['2021-2025']
      },
      requiredSkills: {
        type: [String],
        default: []
      }
    },
    selectionProcess: {
      type: [String],
      default: ['Online Assessment', 'Technical Interview', 'HR Interview']
    },
    status: {
      type: String,
      enum: ['Draft', 'Open', 'In Progress', 'Closed', 'Completed', 'Cancelled'],
      default: 'Open',
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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

const PlacementDrive = mongoose.model('PlacementDrive', placementDriveSchema);

export default PlacementDrive;
