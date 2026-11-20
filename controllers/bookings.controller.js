import Booking from '../models/Bookings.js';
import Service from '../models/Services.js';
import User from '../models/User.js';

export const getAllBookings = async (req, res) => {
  try {
    const { customerId, vendorId, serviceId, status } = req.query;
    const filter = {};

    if (customerId) filter.customerId = customerId;
    if (vendorId) filter.vendorId = vendorId;
    if (serviceId) filter.serviceId = serviceId;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).exec();
    return res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json(booking);
  } catch (err) {
    console.error('Error fetching booking by ID:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      customerId,
      eventDate,
      eventLocation,
      guestCount,
      message,
    } = req.body;

    if (!serviceId || !customerId || !eventDate || !eventLocation) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Prevent vendors from booking their own service
    if (service.vendorId === customerId) {
      return res.status(400).json({ message: 'Vendors cannot book their own services.' });
    }

    // Check for duplicate active booking for the same service and date
    const duplicate = await Booking.findOne({
      serviceId,
      eventDate,
      status: { $in: ['pending', 'accepted'] },
    });

    if (duplicate) {
      return res.status(400).json({
        message: 'An active booking already exists for this service on this date. Please choose another date.',
      });
    }

    const customer = await User.findById(customerId);

    const bookingData = {
      _id: req.body._id || `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      serviceId,
      serviceName: service.serviceName,
      serviceImage: service.images?.[0] || '',
      serviceCategory: service.category || service.catagory || '',
      vendorId: service.vendorId,
      vendorName: service.vendorName,
      vendorBusinessName: service.vendorBusinessName,
      customerId,
      customerName: customer?.name || req.body.customerName || 'Customer',
      customerEmail: customer?.email || req.body.customerEmail || '',
      customerPhone: customer?.phone || req.body.customerPhone || '',
      eventDate,
      eventLocation,
      estimatedPrice: service.price || 0,
      guestCount: guestCount || 100,
      message: message || '',
      status: 'pending',
    };

    const booking = new Booking(bookingData);
    await booking.save();

    return res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        message: `This booking is already ${booking.status}. Decision is immutable.`,
      });
    }

    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    return res.status(200).json(booking);
  } catch (err) {
    console.error('Error updating booking status:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        message: `Cannot cancel a booking that is already ${booking.status}.`,
      });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    return res.status(200).json(booking);
  } catch (err) {
    console.error('Error cancelling booking:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json({ message: 'Booking deleted successfully', id });
  } catch (err) {
    console.error('Error deleting booking:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
