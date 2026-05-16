const prisma = require('../config/database');

// Submit contact message
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    res.status(201).json({
      message: 'Your message has been sent successfully. We will get back to you soon.',
      contactMessage,
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
};

module.exports = {
  submitContactMessage,
};
