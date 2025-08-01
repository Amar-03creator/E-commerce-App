const Address = require('../../models/Address'); // Import the Address model

const addAddress = async (req, res) => {

  try {
    const { userId,name, street, city, state, zip, phone, notes } = req.body;
    if (!userId || !name || !street || !city || !state || !zip || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newAddress = new Address({
      userId,
      name,
      street,
      city,
      state,
      zip,
      phone,
      notes
    });

    await newAddress.save();
    res.status(201).json({ success: true, message: 'Address added successfully', data: newAddress });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ success: false,message:'Failed to add address', error: error.message });
  }
}

const fetchAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({success: false, message: 'User ID is required' });
    }
    const addresses = await Address.find({ userId });
    res.status(200).json({ success: true, message:"Address fetched successfully", data: addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ success: false,message:'Failed to fetch addresses', error: error.message });
  }
}


// editing an address
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const { name, street, city, state, zip, phone, notes } = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({ success: false, message: 'User ID and Address ID are required' });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { name, street, city, state, zip, phone, notes },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.status(200).json({ success: true, message: 'Address edited successfully', data: updatedAddress });
  } catch (error) {
    console.error('Error editing address:', error);
    res.status(500).json({ success: false, message: 'Failed to edit address', error: error.message });
  }
}

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({ success: false, message: 'User ID and Address ID are required' });
    }

    const deletedAddress = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!deletedAddress) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.status(200).json({ success: true, message: 'Address deleted successfully', data: deletedAddress });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ success: false,message: 'Failed to delete address', error: error.message });
  }
}



module.exports = {
  addAddress,
  fetchAddresses,
  editAddress,
  deleteAddress
};