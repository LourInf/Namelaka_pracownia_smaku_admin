import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    surname: String,
    phone: String,
    terms: Boolean,
    paid: Boolean,
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
