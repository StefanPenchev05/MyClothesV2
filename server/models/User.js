import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    min: 2,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  role: {
    type: String,
    enum: ["standartUser", "desginer", "admin"],
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
      linkedIn: String
    },
    skills: [String],
    favoriteQuote: {
      type: String,
      max: 100
    },
    languages: [String],
    achievements: [String],
    education: {
      school: String,
      degree: String,
      fieldOfStudy: String,
      graduationYear: Number
    },
    workExperience: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date
    }]
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