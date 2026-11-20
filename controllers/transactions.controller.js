import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const getAllTransactions = async (req, res) => {
  try {
    const { vendorId } = req.query;
    const filter = {};
    if (vendorId) filter.vendorId = vendorId;

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 }).exec();
    return res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const {
      vendorId,
      vendorName,
      vendorEmail,
      amount,
      currency,
      stripeSessionId,
      stripeSubscriptionId,
      status,
    } = req.body;

    if (!vendorId || !stripeSessionId) {
      return res.status(400).json({ message: 'vendorId and stripeSessionId are required' });
    }

    const transactionData = {
      _id: req.body._id || `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      vendorId,
      vendorName: vendorName || 'Vendor',
      vendorEmail: vendorEmail || '',
      plan: 'premium',
      amount: amount || 49.0,
      currency: currency || 'usd',
      stripeSessionId,
      stripeSubscriptionId: stripeSubscriptionId || `sub_${Date.now()}`,
      status: status || 'succeeded',
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    return res.status(201).json(transaction);
  } catch (err) {
    console.error('Error creating transaction:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const upgradeToPremium = async (req, res) => {
  try {
    const { vendorId, stripeSessionId } = req.body;
    if (!vendorId) {
      return res.status(400).json({ message: 'vendorId is required' });
    }

    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const sessionId =
      stripeSessionId || `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create transaction record
    const transaction = new Transaction({
      _id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      vendorId: vendor._id,
      vendorName: vendor.name,
      vendorEmail: vendor.email,
      plan: 'premium',
      amount: 49.0,
      currency: 'usd',
      stripeSessionId: sessionId,
      stripeSubscriptionId: `sub_stripe_${Date.now()}`,
      status: 'succeeded',
    });
    await transaction.save();

    // Update vendor subscription plan to premium
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    vendor.subscriptionPlan = 'premium';
    vendor.subscriptionExpiresAt = oneYearFromNow;
    vendor.updatedAt = new Date();
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: 'Vendor upgraded to Premium successfully',
      vendor,
      transaction,
    });
  } catch (err) {
    console.error('Error upgrading to premium:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
