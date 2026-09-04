import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    interviewId: {
      type: String,
      trim: true
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
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
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
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
    position: {
      type: String,
      default: ''
    },
    round: {
      type: String,
      required: [true, 'Interview round title is required'],
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Interview date is required']
    },
    startTime: {
      type: String,
      default: '10:00 AM'
    },
    endTime: {
      type: String,
      default: '11:00 AM'
    },
    mode: {
      type: String,
      default: 'Online'
    },
    meetingLink: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    interviewer: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
      index: true
    },
    feedback: {
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

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
