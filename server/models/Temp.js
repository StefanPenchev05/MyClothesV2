import { Schema, model } from "mongoose";

const TempSchema = new Schema({
  key: { type: String, index: true },
  value: Schema.Types.Mixed,
  expiresAt: { type: Date, expires: 0 },
});

export const Temp = model("Temp", TempSchema);
