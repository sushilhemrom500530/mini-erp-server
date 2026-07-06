import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { Sale } from "./sale.model";
import { ISale, ISaleProductItem } from "./sale.interface";
import { Product } from "../product/product.model";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../shared/queryBuilder";

const getAll = async (query: any) => {
  const filter: any = { ...query, isDeleted: false };

  const productQuery = new QueryBuilder<ISale>(Sale.find(), filter)
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

const createSale = async (
  soldBy: string,
  payload: { products: { product: string; quantity: number }[] },
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let grandTotal = 0;
    const saleItemsHistory: ISaleProductItem[] = [];

    for (const item of payload.products) {
      const productObj = await Product.findById(item.product).session(session);

      if (!productObj || productObj.isDeleted) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `Product ID ${item.product} does not exist.`,
        );
      }

      if (productObj.stockQuantity < item.quantity) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for "${productObj.productName}". Requested: ${item.quantity}, Available: ${productObj.stockQuantity}`,
        );
      }

      // calculate total price per product
      const unitPrice = productObj.sellingPrice;
      const totalPrice = unitPrice * item.quantity;
      grandTotal += totalPrice;

      saleItemsHistory.push({
        product: new mongoose.Types.ObjectId(item.product),
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });

      // reduce product stock
      productObj.stockQuantity -= item.quantity;
      await productObj.save({ session });
    }

    const [newSale] = await Sale.create(
      [
        {
          soldBy,
          products: saleItemsHistory,
          grandTotal,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return newSale;
  } catch (error) {
    // Revert state shifts if a step triggers an exception
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const SaleService = {
  getAll,
  createSale,
};
