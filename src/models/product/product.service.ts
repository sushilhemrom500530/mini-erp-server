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

const getSingleProduct = async (productId: string) => {
  const product = await Product.findById(productId)
    .populate("owner", "fullName email profileUrl")
    .lean();
  if (!product || product.isDeleted) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Product not found or has been removed.",
    );
  }
  return product;
};

const updateProduct = async (productId: string, payload: Partial<IProduct>) => {
  const product = await Product.findById(productId);
  if (!product || product.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found.");
  }

  if (payload.sku && payload.sku !== product.sku) {
    const isSkuExist = await Product.findOne({ sku: payload.sku });
    if (isSkuExist) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "This SKU is already assigned to another product.",
      );
    }
  }

  const result = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteProduct = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product || product.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found.");
  }

  await Product.findByIdAndUpdate(
    productId,
    { isDeleted: true },
    { new: true },
  );

  // we know that, product will delete only one
  return { deletedCount: 1 };
};

export const ProductService = {
  getAll,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
