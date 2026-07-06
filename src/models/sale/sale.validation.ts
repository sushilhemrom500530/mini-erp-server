import { z } from "zod";

const createSaleValidationSchema = z.object({
  products: z
    .array(
      z.object({
        product: z
          .string({
            message: "Product ID is required.",
          })
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product reference ID format."),

        quantity: z
          .number({
            message: "Quantity is required.",
          })
          .int()
          .positive("Quantity must be at least 1."),
      }),
    )
    .min(1, "A sale transaction must contain at least one product."),
});

export const SaleValidations = {
  createSaleValidationSchema,
};
