import Product from "../model/product.model.js";
import imagekit from "../config/imagekit.config.js";


export const GetAllProduct = async (req, res) => {
  try {
    const isAll = req.query.all === "true" || req.query.limit === "0" || req.query.limit === "all";
    const page = parseInt(req.query.page) || 1;
    const limit = isAll ? 0 : (parseInt(req.query.limit) || 12);
    const category = req.query.category;
    const search = req.query.search;
    const skip = isAll ? 0 : (page - 1) * limit;

    let filterQuery = {};

    if (category && category.toLowerCase() !== "all") {
      filterQuery.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search && search.trim() !== "") {
      filterQuery.title = { $regex: search.trim(), $options: "i" };
    }

    const totalProducts = await Product.countDocuments(filterQuery);
    const totalPages = isAll ? 1 : (Math.ceil(totalProducts / (limit || 1)) || 1);

    const products = await Product.find(filterQuery)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      message: "All Product Find",
      products,
      totalProducts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const CreateProduct = async (req, res) => {
  try {
    const { title, price, category, description } = req.body;

    const image = req.file;

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const uploadimage = await imagekit.upload({
      file: image.buffer,
      fileName: image.originalname,
      folder:'products'
    });

    const ProductData = await Product.create({
      productimage: uploadimage.url,
      title,
      price,
      category,
      description,
    });

    res.status(201).json({
      message: "Product Created",
      ProductData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const GetProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const GetCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          sampleId: { $first: "$_id" },
          sampleTitle: { $first: "$title" },
          samplePrice: { $first: "$price" },
          sampleDescription: { $first: "$description" },
          sampleImage: { $first: "$productimage" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      message: "Categories fetched",
      categories: categories.map((c) => ({
        name: c._id,
        count: c.count,
        image: c.sampleImage,
        product: {
          _id: c.sampleId,
          title: c.sampleTitle,
          price: c.samplePrice,
          category: c._id,
          description: c.sampleDescription,
          productimage: c.sampleImage,
        },
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
