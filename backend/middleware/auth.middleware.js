const { verifyToken } = require('../config/jwt');
const prisma = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch user based on type
    if (decoded.type === 'admin') {
      const admin = await prisma.adminUser.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
      });

      if (!admin || !admin.isActive) {
        return res.status(401).json({ error: 'Admin account not found or inactive' });
      }

      req.user = { ...admin, type: 'admin' };
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, firstName: true, lastName: true, phone: true },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = { ...user, type: 'user' };
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, firstName: true, lastName: true },
        });
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  optionalAuth,
};
