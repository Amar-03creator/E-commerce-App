const express = require('express');
const { fetchAddresses, addAddress, editAddress, deleteAddress } = require('../../controllers/shop/address-controllers');


const router = express.Router();

router.post('/add', addAddress);
router.get('/get/:userId', fetchAddresses);
router.put('/edit/:userId/:addressId', editAddress);
router.delete('/delete/:userId/:addressId', deleteAddress);

module.exports = router;