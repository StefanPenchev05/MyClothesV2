import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    min: [2, "First Name must be at least 2 characters"],
    max: 50,
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    minlength: [2, "Last Name must be at least 2 characters"],
    max: 50,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [2, "Username must be at least 2 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"],
    validate: {
      validator: async (value) => {
        const userCount = await User.countDocuments({ username: value });
        return !userCount;
      },
      message: "Username already exists",
    },
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: async (value) => {
        const emailCount = await User.countDocuments({ email: value });
        return !emailCount;
      },
      message: "Email already exists",
    },
    unique: true,
    trim: true,
    lowwercase: true,
    max: 50,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    min: 8,
  },
  role: {
    type: String,
    enum: ["standartUser", "desginer", "admin"],
    default: "standartUser",
  },
  profileDetails: {
    bio: {
      type: String,
      max: 230,
    },
    profilePicturePath: {
      type: String,
      default: "",
    },
    occupation: String,
    birthday: Date,
    hobbies: [String],
    socialMedia: {
      twitter: String,
      instagram: String,
      linkedIn: String,
    },
    skills: [String],
    favoriteQuote: {
      type: String,
      max: 100,
    },
    languages: [String],
    achievements: [String],
    education: {
      school: String,
      degree: String,
      fieldOfStudy: String,
      graduationYear: Number,
    },
    workExperience: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
      },
    ],
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  savedProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  chatSessions: [
    {
      type: Schema.Types.ObjectId,
      ref: "ChatSession",
    },
  ],
});

export const User = model("User", userSchema);
