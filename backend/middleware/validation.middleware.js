const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').isInt().withMessage('Category ID must be an integer'),
  body('gender').isIn(['men', 'women', 'unisex']).withMessage('Gender must be men, women, or unisex'),
  validate,
];

const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  validate,
];

const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  validate,
];

const newsletterValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  productValidation,
  orderValidation,
  contactValidation,
  newsletterValidation,
};
