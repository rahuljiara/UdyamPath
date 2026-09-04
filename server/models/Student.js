import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID / Roll number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    fullName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Student institutional email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    dateOfBirth: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: 'Male'
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      index: true
    },
    deptCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    departmentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    },
    course: {
      type: String,
      default: 'B.Tech',
      trim: true
    },
    batch: {
      type: String,
      default: '2021-2025',
      trim: true,
      index: true
    },
    semester: {
      type: Number,
      default: 8
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0']
    },
    backlogs: {
      type: Number,
      default: 0,
      min: [0, 'Backlogs count cannot be negative']
    },
    skills: {
      type: [String],
      default: []
    },
    programmingLanguages: {
      type: [String],
      default: []
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    portfolio: {
      type: String,
      default: ''
    },
    placementStatus: {
      type: String,
      enum: ['Not Placed', 'Placed', 'Seeking', 'Not Eligible', 'Applied', 'Shortlisted', 'Unplaced', 'Ineligible', 'In Process'],
      default: 'Seeking',
      index: true
    },
    placedCompany: {
      type: String,
      default: null
    },
    placedPackage: {
      type: String,
      default: null
    },
    isEligible: {
      type: Boolean,
      default: true
    },
    avatar: {
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

// Pre-save hook to generate fullName and ensure isEligible consistency
studentSchema.pre('save', function (next) {
  this.fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
  if (this.backlogs > 0 || this.cgpa < 6.0) {
    // If student has critical backlogs
    if (this.placementStatus === 'Ineligible' || this.placementStatus === 'Not Eligible') {
      this.isEligible = false;
    }
  }
  next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
