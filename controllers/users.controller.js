import User from '../models/User.js';
import Service from '../models/Services.js';
import Booking from '../models/Bookings.js';
import Transaction from '../models/Transaction.js';
import {
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS,
} from '../data/seedData.js';

export const getAllUsers = async (req, res) => {
  try {
    const { role, search, isBlocked } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (isBlocked !== undefined) {
      filter.isBlocked = isBlocked === 'true' || isBlocked === true;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { businessName: regex }];
    }

    const users = await User.find(filter).sort({ createdAt: -1 }).exec();
    return res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const createOrUpdateUser = async (req, res) => {
  try {
    const { email, name, role, businessName, image, phone, bio } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = new User({
        _id: req.body._id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name || 'WedPlan Member',
        email: email.toLowerCase(),
        role: role || 'customer',
        businessName,
        image,
        phone,
        bio,
        subscriptionPlan: req.body.subscriptionPlan || 'free',
        isBlocked: false,
      });
      await user.save();
      return res.status(201).json(user);
    } else {
      if (name) user.name = name;
      if (image) user.image = image;
      if (businessName) user.businessName = businessName;
      if (phone) user.phone = phone;
      if (bio) user.bio = bio;
      user.updatedAt = new Date();
      await user.save();
      return res.status(200).json(user);
    }
  } catch (err) {
    console.error('Error in createOrUpdateUser:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const safeData = { ...req.body };

    // Prevent direct modification of role and subscription through profile update
    delete safeData.role;
    delete safeData.subscriptionPlan;
    delete safeData.subscriptionExpiresAt;
    delete safeData.isBlocked;

    safeData.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(id, safeData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Error updating user profile:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    user.updatedAt = new Date();
    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    console.error('Error toggling user block:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const seedDatabase = async (req, res) => {
  try {
    const force = req.query.force === 'true';

    const userCount = await User.countDocuments();
    const serviceCount = await Service.countDocuments();

    if (!force && userCount > 0 && serviceCount > 0) {
      return res.status(200).json({
        message: 'Database already has data. Use ?force=true to reset.',
        stats: { users: userCount, services: serviceCount },
      });
    }

    if (force) {
      await User.deleteMany({});
      await Service.deleteMany({});
      await Booking.deleteMany({});
      await Transaction.deleteMany({});
    }

    // Insert seeds if empty
    if ((await User.countDocuments()) === 0) {
      await User.insertMany(INITIAL_USERS);
    }
    if ((await Service.countDocuments()) === 0) {
      await Service.insertMany(INITIAL_SERVICES);
    }
    if ((await Booking.countDocuments()) === 0) {
      await Booking.insertMany(INITIAL_BOOKINGS);
    }
    if ((await Transaction.countDocuments()) === 0) {
      await Transaction.insertMany(INITIAL_TRANSACTIONS);
    }

    return res.status(200).json({
      message: 'Database seeded successfully',
      stats: {
        users: await User.countDocuments(),
        services: await Service.countDocuments(),
        bookings: await Booking.countDocuments(),
        transactions: await Transaction.countDocuments(),
      },
    });
  } catch (err) {
    console.error('Error seeding database:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
