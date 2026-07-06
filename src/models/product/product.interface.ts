import { Types, Model } from "mongoose";

export interface IProduct {
  owner: Types.ObjectId;
  productName: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  productImage?: string;
  isDeleted: boolean;
}

export type ProductModel = Model<IProduct, Record<string, never>>;
