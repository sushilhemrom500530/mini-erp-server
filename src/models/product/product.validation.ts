import { z } from "zod";

const createProductValidationSchema = z.object({
  productName: z
    .string({
      message: "Product name is required.",
    })
    .trim()
    .min(2, "Product name must be at least 2 characters long."),

  sku: z
    .string({
      message: "SKU code is required.",
    })
    .trim()
    .toUpperCase(),

  category: z
    .string({
      message: "Category is required.",
    })
    .trim(),

  purchasePrice: z
    .number({
      message: "Purchase price is required.",
    })
    .positive("Purchase price must be greater than 0."),

  sellingPrice: z
    .number({
      message: "Selling price is required.",
    })
    .positive("Selling price must be greater than 0."),

  stockQuantity: z
    .number({
      message: "Stock quantity is required.",
    })
    .int()
    .nonnegative("Stock quantity cannot be negative."),

  productImage: z.string().url("Product image must be a valid URL.").optional(),
});

const updateProductValidationSchema = createProductValidationSchema.partial();

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
