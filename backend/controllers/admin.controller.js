const prisma = require('../config/database');

// Dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.user.count();
    const totalRevenue = await prisma.order.aggregate({
      where: { status: 'delivered' },
      _sum: { total: true },
    });

    const pendingOrders = await prisma.order.count({
      where: { status: 'pending' },
    });

    const processingOrders = await prisma.order.count({
      where: { status: 'processing' },
    });

    const lowStockProducts = await prisma.productVariant.count({
      where: { stock: { lte: 10 } },
    });

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders,
        processingOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const total = await prisma.order.count({ where });

    const orders = await prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
      updateData.paymentStatus = 'paid'; // Mark payment as paid when delivered
    }
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Get all products (admin)
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, category, gender, isActive } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { categoryId: parseInt(category) }),
      ...(gender && { gender }),
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
    };

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            stock: true,
            price: true,
          },
        },
      },
    });

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      salePrice,
      sku,
      categoryId,
      gender,
      isFeatured,
      isNew,
      isBestSeller,
      onSale,
      material,
      fit,
      tags,
      metaTitle,
      metaDescription,
      images,
      variants,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku,
        categoryId: parseInt(categoryId),
        gender,
        isFeatured: isFeatured || false,
        isNew: isNew || false,
        isBestSeller: isBestSeller || false,
        onSale: onSale || false,
        material,
        fit,
        tags: tags ? JSON.stringify(tags) : null,
        metaTitle,
        metaDescription,
        images: images && images.length > 0 ? {
          create: images.map((img, index) => ({
            url: img.url,
            altText: img.altText || name,
            sortOrder: index + 1,
            isPrimary: index === 0,
          })),
        } : undefined,
        variants: variants && variants.length > 0 ? {
          create: variants.map((variant) => ({
            size: variant.size,
            color: variant.color,
            colorHex: variant.colorHex,
            sku: variant.sku,
            stock: variant.stock || 0,
            price: variant.price ? parseFloat(variant.price) : null,
          })),
        } : undefined,
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      salePrice,
      sku,
      categoryId,
      gender,
      isFeatured,
      isNew,
      isBestSeller,
      onSale,
      isActive,
      material,
      fit,
      tags,
      metaTitle,
      metaDescription,
    } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(price && { price: parseFloat(price) }),
        ...(salePrice !== undefined && { salePrice: salePrice ? parseFloat(salePrice) : null }),
        ...(sku && { sku }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(gender && { gender }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isNew !== undefined && { isNew }),
        ...(isBestSeller !== undefined && { isBestSeller }),
        ...(onSale !== undefined && { onSale }),
        ...(isActive !== undefined && { isActive }),
        ...(material !== undefined && { material }),
        ...(fit !== undefined && { fit }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Update stock
const updateStock = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { stock } = req.body;

    const variant = await prisma.productVariant.update({
      where: { id: parseInt(variantId) },
      data: { stock: parseInt(stock) },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      message: 'Stock updated successfully',
      variant,
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    const total = await prisma.user.count({ where });

    const customers = await prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    res.json({
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// Get contact messages
const getContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = isRead !== undefined ? { isRead: isRead === 'true' } : {};

    const total = await prisma.contactMessage.count({ where });

    const messages = await prisma.contactMessage.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
};

// Mark message as read
const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });

    res.json({
      message: 'Message marked as read',
      contactMessage: message,
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({ coupons });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

// Create coupon
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      perUserLimit,
      validFrom,
      validUntil,
    } = req.body;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        perUserLimit: perUserLimit ? parseInt(perUserLimit) : null,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
      },
    });

    res.status(201).json({
      message: 'Coupon created successfully',
      coupon,
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

// Update coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, ...updateData } = req.body;

    const coupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({
      message: 'Coupon updated successfully',
      coupon,
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};

// Update site settings
const updateSetting = async (req, res) => {
  try {
    const { key, value, type = 'text' } = req.body;

    let stringValue = value;
    if (type === 'json') {
      stringValue = JSON.stringify(value);
    } else if (typeof value !== 'string') {
      stringValue = String(value);
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: stringValue, type },
      create: { key, value: stringValue, type },
    });

    res.json({
      message: 'Setting updated successfully',
      setting,
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

// Get all categories (admin - includes inactive)
const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get all categories admin error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getAllCustomers,
  getContactMessages,
  markMessageAsRead,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  updateSetting,
  getAllCategoriesAdmin,
};
