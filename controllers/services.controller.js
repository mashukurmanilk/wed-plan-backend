import Service from '../models/Services.js';
import User from '../models/User.js';

export const getAllServices = async (req, res) => {
  try {
    const { category, status, isActive, vendorId, search, featured, limit } = req.query;
    const filter = {};

    if (category && category !== 'All' && category !== 'All Categories') {
      filter.$or = [{ category: category }, { catagory: category }];
    }

    if (status) {
      filter.status = status;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true' || isActive === true;
    }

    if (vendorId) {
      filter.vendorId = vendorId;
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true' || featured === true;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { serviceName: regex },
        { description: regex },
        { vendorName: regex },
        { location: regex },
      ];
    }

    let query = Service.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const services = await query.exec();
    return res.status(200).json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    return res.status(200).json(service);
  } catch (err) {
    console.error('Error fetching service by ID:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      serviceName,
      vendorId,
      category,
      description,
      price,
      priceUnit,
      location,
      images,
      features,
    } = req.body;

    if (!serviceName || !vendorId || !category || !description || price === undefined || !location) {
      return res.status(400).json({ message: 'Missing required service fields' });
    }

    // Check vendor's subscription plan & active service count
    const vendor = await User.findById(vendorId);
    const isFreePlan = !vendor || vendor.subscriptionPlan !== 'premium';

    if (isFreePlan) {
      const activeCount = await Service.countDocuments({
        vendorId,
        isActive: true,
      });

      if (activeCount >= 3) {
        return res.status(403).json({
          message: 'Free tier vendors can publish a maximum of 3 active services. Please upgrade to Premium.',
        });
      }
    }

    const serviceData = {
      ...req.body,
      _id: req.body._id || `srv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: category,
      catagory: category,
      vendorName: req.body.vendorName || vendor?.name || 'Wedding Vendor',
      vendorBusinessName: req.body.vendorBusinessName || vendor?.businessName || vendor?.name,
      vendorAvatar: req.body.vendorAvatar || vendor?.image,
      vendorRating: req.body.vendorRating || 5.0,
      vendorReviewCount: req.body.vendorReviewCount || 1,
      priceUnit: priceUnit || 'Starting Package',
      status: req.body.status || 'pending',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      featured: req.body.featured || false,
    };

    const service = new Service(serviceData);
    await service.save();

    return res.status(201).json(service);
  } catch (err) {
    console.error('Error creating service:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    if (updateData.category) {
      updateData.catagory = updateData.category;
    }

    const service = await Service.findByIdAndUpdate(id, updateData, { new: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.status(200).json(service);
  } catch (err) {
    console.error('Error updating service:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    return res.status(200).json({ message: 'Service deleted successfully', id });
  } catch (err) {
    console.error('Error deleting service:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const toggleServiceActive = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // If activating, verify free plan limit
    if (!service.isActive) {
      const vendor = await User.findById(service.vendorId);
      const isFreePlan = !vendor || vendor.subscriptionPlan !== 'premium';
      if (isFreePlan) {
        const activeCount = await Service.countDocuments({
          vendorId: service.vendorId,
          isActive: true,
        });
        if (activeCount >= 3) {
          return res.status(403).json({
            message: 'Free tier limit reached (maximum 3 active services). Please upgrade to Premium.',
          });
        }
      }
    }

    service.isActive = !service.isActive;
    service.updatedAt = new Date();
    await service.save();

    return res.status(200).json(service);
  } catch (err) {
    console.error('Error toggling service active:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.status(200).json(service);
  } catch (err) {
    console.error('Error updating service status:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
