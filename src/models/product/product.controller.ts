const createProduct = catchAsync(async (req: Request, res: Response) => {
  // If your multiUploadHandler attaches the image path to req.file or req.files
  const imgFile = (req.files as any)?.productImage?.[0];
  const productData = {
    ...req.body,
    ...(imgFile && { productImage: imgFile.path }), // Adjust key based on your file uploader setup
  };

  const result = await ProductService.createProduct(productData);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Product created successfully.",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAll(req.query as any);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products retrieved successfully.",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAll,
};
