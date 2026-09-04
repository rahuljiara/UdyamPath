import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: [true, 'Application ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true
    },
    studentName: {
      type: String,
      default: ''
    },
    studentEmail: {
      type: String,
      default: ''
    },
    studentDepartment: {
      type: String,
      default: ''
    },
    studentCgpa: {
      type: Number,
      default: 0
    },
    studentAvatar: {
      type: String,
      default: ''
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: [true, 'Placement drive reference is required'],
      index: true
    },
    driveId: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: ''
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    currentStage: {
      type: String,
      enum: [
        'Application',
        'Aptitude Test',
        'Technical Test',
        'Technical Interview',
        'HR Interview',
        'Final Selection'
      ],
      default: 'Application'
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Rejected',
        'Selected',
        'Withdrawn'
      ],
      default: 'Applied',
      index: true
    },
    notes: {
      type: String,
      default: ''
    },
    rejectionReason: {
      type: String,
      default: ''
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

// Crucial: Compound Unique Index ensuring student cannot apply twice to the same drive
applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
