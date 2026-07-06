import { Types } from "mongoose";

export interface ISaleProductItem {
  product: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ISale {
  soldBy: Types.ObjectId;
  products: ISaleProductItem[];
  grandTotal: number;
  saleDate: Date;
}
