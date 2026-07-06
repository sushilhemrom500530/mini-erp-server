import { Product } from "../product/product.model";
import { Sale } from "../sale/sale.model";

const getDashboardStats = async () => {
  const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),

    Sale.countDocuments(),

    Product.countDocuments({ isDeleted: false, stockQuantity: { $lt: 5 } }),
  ]);

  return {
    totalProducts,
    totalSales,
    lowStockProducts,
  };
};

export const DashboardService = {
  getDashboardStats,
};
