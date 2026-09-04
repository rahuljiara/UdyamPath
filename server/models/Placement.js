import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
      index: true
    },
    studentName: {
      type: String,
      default: ''
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
      index: true
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required']
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required']
    },
    ctc: {
      type: String,
      required: [true, 'CTC is required']
    },
    numericCtc: {
      type: Number,
      default: 0
    },
    joiningDate: {
      type: String,
      default: ''
    },
    placementYear: {
      type: String,
      default: '2024-2025',
      index: true
    },
    department: {
      type: String,
      default: '',
      index: true
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer'
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Joined', 'Revoked'],
      default: 'Confirmed'
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

placementSchema.pre('save', function (next) {
  if (this.ctc) {
    const match = this.ctc.match(/(\d+(\.\d+)?)/);
    if (match) {
      this.numericCtc = parseFloat(match[0]);
    }
  }
  next();
});

const Placement = mongoose.model('Placement', placementSchema);

export default Placement;
