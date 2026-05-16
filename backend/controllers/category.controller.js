const prisma = require('../config/database');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const { gender, includeSubcategories = 'true' } = req.query;

    const where = {
      isActive: true,
      ...(gender && { gender }),
    };

    const categories = await prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: includeSubcategories === 'true' ? {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      } : false,
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get category by slug
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Get main categories (no parent)
const getMainCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get main categories error:', error);
    res.status(500).json({ error: 'Failed to fetch main categories' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  getMainCategories,
};
