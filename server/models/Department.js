import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide department name'],
      unique: true,
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Please provide department code'],
      unique: true,
      uppercase: true,
      trim: true
    },
    hod: {
      type: String,
      default: ''
    },
    hodUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: {
      type: String,
      default: ''
    },
    studentCount: {
      type: Number,
      default: 0
    },
    placedStudents: {
      type: Number,
      default: 0
    },
    averagePackage: {
      type: String,
      default: '0.0 LPA'
    },
    highestPackage: {
      type: String,
      default: '0.0 LPA'
    },
    isActive: {
      type: Boolean,
      default: true
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

const Department = mongoose.model('Department', departmentSchema);

export default Department;
