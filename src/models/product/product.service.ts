import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import QueryBuilder from "../../shared/queryBuilder";

const getAll = async (query: any) => {
  const filter: any = { ...query, isDeleted: false };

  const productQuery = new QueryBuilder<IProduct>(Product.find(), filter)
    .search(["productName", "sku", "category"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const results = await productQuery.modelQuery
    .select("-isDeleted -__v")
    .lean();
  const meta = await productQuery.countTotal();

  return {
    meta,
    results,
  };
};

const createProduct = async (payload: IProduct) => {
  const isSkuExist = await Product.findOne({ sku: payload.sku });
  if (isSkuExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A product with this SKU already exists.",
    );
  }

  const result = await Product.create(payload);
  return result;
};

export const ProductService = {
  createProduct,
  getAll,
};
