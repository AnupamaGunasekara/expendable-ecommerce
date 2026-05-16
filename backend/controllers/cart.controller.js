const prisma = require('../config/database');

// Get or create cart
const getOrCreateCart = async (userId, sessionId) => {
  let cart;

  if (userId) {
    cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              variant: true,
            },
          },
        },
      });
    }
  } else if (sessionId) {
    cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              variant: true,
            },
          },
        },
      });
    }
  }

  return cart;
};

// Get cart
const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.json({ cart: { items: [] }, total: 0 });
    }

    const cart = await getOrCreateCart(userId, sessionId);

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + parseFloat(price) * item.quantity;
    }, 0);

    res.json({ cart, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'User ID or Session ID required' });
    }

    // Check if product and variant exist
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant || variant.productId !== productId) {
      return res.status(404).json({ error: 'Product variant not found' });
    }

    // Check stock
    if (variant.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId,
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (variant.stock < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
        },
      });
    }

    // Get updated cart
    const updatedCart = await getOrCreateCart(userId, sessionId);

    res.json({
      message: 'Item added to cart',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: {
        cart: true,
        variant: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Verify ownership
    if (
      (userId && cartItem.cart.userId !== userId) ||
      (sessionId && cartItem.cart.sessionId !== sessionId)
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check stock
    if (cartItem.variant.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity },
    });

    // Get updated cart
    const cart = await getOrCreateCart(userId, sessionId);

    res.json({
      message: 'Cart updated',
      cart,
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: { cart: true },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Verify ownership
    if (
      (userId && cartItem.cart.userId !== userId) ||
      (sessionId && cartItem.cart.sessionId !== sessionId)
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete item
    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });

    // Get updated cart
    const cart = await getOrCreateCart(userId, sessionId);

    res.json({
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    const cart = await getOrCreateCart(userId, sessionId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
