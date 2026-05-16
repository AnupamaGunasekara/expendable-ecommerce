const prisma = require('../config/database');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ error: 'This email is already subscribed' });
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true },
        });
        return res.json({ message: 'Subscription reactivated successfully' });
      }
    }

    // Create new subscription
    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    res.status(201).json({
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false },
    });

    res.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
};
