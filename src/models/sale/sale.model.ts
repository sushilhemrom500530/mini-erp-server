import { Schema, model } from "mongoose";
import { ISale } from "./sale.interface";

const saleProductItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const saleSchema = new Schema<ISale>(
  {
    soldBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [saleProductItemSchema],

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    saleDate: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Sale = model<ISale>("Sale", saleSchema);
