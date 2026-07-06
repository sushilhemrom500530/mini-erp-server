import { JwtUserPayload } from "../../middlewares/auth";
import { Product } from "../product/product.model";
import { Sale } from "../sale/sale.model";

const getDashboardStats = async (user: JwtUserPayload) => {
  const { role } = user;

  const [totalProducts, lowStockProducts] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),
    Product.countDocuments({ isDeleted: false, stockQuantity: { $lt: 5 } }),
  ]);

  if (role === "admin" || role === "manager") {
    const totalSales = await Sale.countDocuments();
    return { totalProducts, lowStockProducts, totalSales };
  }

  return { totalProducts, lowStockProducts };
};

export const DashboardService = {
  getDashboardStats,
};
