const prisma = require('../config/database');

// Get site settings
const getSettings = async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();

    // Convert to object format
    const settingsObj = {};
    settings.forEach((setting) => {
      if (setting.type === 'json') {
        settingsObj[setting.key] = JSON.parse(setting.value);
      } else if (setting.type === 'number') {
        settingsObj[setting.key] = parseFloat(setting.value);
      } else if (setting.type === 'boolean') {
        settingsObj[setting.key] = setting.value === 'true';
      } else {
        settingsObj[setting.key] = setting.value;
      }
    });

    res.json({ settings: settingsObj });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Get specific setting
const getSetting = async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    let value = setting.value;
    if (setting.type === 'json') {
      value = JSON.parse(value);
    } else if (setting.type === 'number') {
      value = parseFloat(value);
    } else if (setting.type === 'boolean') {
      value = value === 'true';
    }

    res.json({ key: setting.key, value, type: setting.type });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

module.exports = {
  getSettings,
  getSetting,
};
