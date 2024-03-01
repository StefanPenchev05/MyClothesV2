import { Schema, model } from "mongoose";

const productSchema = new Schema({
  desginerID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: [true, "Please provide us with a title of the product!"],
    min: [5, "Too few characters title"],
    max: 20,
  },
  description: {
    type: String,
    required: [true, "Please provide us with a description of the product!"],
    maxLength: [260, "Too long description."],
  },
  imagesPath: [String],
  createDate: {
    type: Date,
    required: [true, "Date is required"],
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      commentText: String,
      createDate: Date,
    },
  ],
});
