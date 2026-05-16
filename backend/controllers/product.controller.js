const prisma = require('../config/database');

// Get all products with filters
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      gender,
      minPrice,
      maxPrice,
      size,
      color,
      sort = 'createdAt',
      order = 'desc',
      search,
      isFeatured,
      isNew,
      isBestSeller,
      onSale,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {
      isActive: true,
      ...(gender && { gender }),
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(minPrice || maxPrice ? {
        price: {
          ...(minPrice && { gte: parseFloat(minPrice) }),
          ...(maxPrice && { lte: parseFloat(maxPrice) }),
        },
      } : {}),
      ...(isFeatured === 'true' && { isFeatured: true }),
      ...(isNew === 'true' && { isNew: true }),
      ...(isBestSeller === 'true' && { isBestSeller: true }),
      ...(onSale === 'true' && { onSale: true }),
    };

    // Filter by size or color if provided
    if (size || color) {
      where.variants = {
        some: {
          ...(size && { size }),
          ...(color && { color }),
          stock: { gt: 0 },
          isActive: true,
        },
      };
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { [sort]: order },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            size: true,
            color: true,
            colorHex: true,
            stock: true,
            price: true,
          },
        },
      },
    });

    // Calculate available colors and sizes
    const productsWithMeta = products.map((product) => {
      const colors = [...new Set(product.variants.map((v) => ({ name: v.color, hex: v.colorHex })))];
      const sizes = [...new Set(product.variants.map((v) => v.size))];
      const inStock = product.variants.some((v) => v.stock > 0);

      return {
        ...product,
        availableColors: colors,
        availableSizes: sizes,
        inStock,
      };
    });

    res.json({
      products: productsWithMeta,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product by slug
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
          orderBy: [{ size: 'asc' }, { color: 'asc' }],
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Increment view count
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          where: { isActive: true, stock: { gt: 0 } },
          select: {
            color: true,
            colorHex: true,
          },
        },
      },
    });

    // Calculate review statistics
    const reviewStats = {
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 0,
      totalReviews: product.reviews.length,
    };

    res.json({
      product: {
        ...product,
        reviewStats,
      },
      relatedProducts,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    res.json({ products });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      take: 8,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          where: { isActive: true, stock: { gt: 0 } },
          select: {
            color: true,
            colorHex: true,
          },
        },
      },
    });

    res.json({ products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  getProductById,
  searchProducts,
  getFeaturedProducts,
};
