import { JwtUserPayload } from "../../middlewares/auth";
import { Product } from "../product/product.model";
import { Sale } from "../sale/sale.model";

const getDashboardStats = async (user: JwtUserPayload) => {
  const { role } = user;

  const [totalProducts, lowStockProducts, recentProducts] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),
    Product.countDocuments({ isDeleted: false, stockQuantity: { $lt: 5 } }),
    Product.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-isDeleted -__v")
      .lean(),
  ]);

  if (role === "admin" || role === "manager") {
    const [totalSales, revenueData] = await Promise.all([
      Sale.countDocuments(),
      Sale.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$grandTotal" },
          },
        },
      ]),
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    return {
      totalProducts,
      lowStockProducts,
      recentProducts,
      totalSales,
      totalRevenue,
    };
  }

  return {
    totalProducts,
    lowStockProducts,
    recentProducts,
  };
};

export const DashboardService = {
  getDashboardStats,
};
