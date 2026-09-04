import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    offerId: {
      type: String,
      trim: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      index: true
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    studentDepartment: {
      type: String,
      default: ''
    },
    studentAvatar: {
      type: String,
      default: ''
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
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive'
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    ctc: {
      type: String,
      required: [true, 'CTC package is required'],
      trim: true
    },
    salaryBreakup: {
      type: String,
      default: ''
    },
    offerDate: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)
    },
    joiningDate: {
      type: String,
      default: ''
    },
    offerLetterUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Offered', 'Accepted', 'Declined', 'Expired'],
      default: 'Offered',
      index: true
    },
    notes: {
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

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
