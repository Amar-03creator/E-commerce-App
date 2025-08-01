import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAddresses } from "@/store/shop/address-slice/index.js";
import AddressCard from "./address-card";
import { toast } from "sonner";




const initialAddressFormData = {
  name: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector(state => state.shoppingAddress);
  const [currentEditedId, setCurrentEditedId] = useState(null);


  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length > 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast("You can add at most 4 addresses", {
        description: "Please remove an address before adding a new one.",
        icon: "❌",
        duration: 3000,
        className: "bg-red-500 text-white", // Tailwind or your custom classes
      });

      return;

    }

    currentEditedId !== null ? dispatch(editAddress({
      userId: user?.id,
      addressId: currentEditedId,
      formData

    })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAddresses(user?.id))
        setCurrentEditedId(null)
        setFormData(initialAddressFormData)
        toast.success("Address Updated Succesfully");
      }
    }) :
      dispatch(addNewAddress({ ...formData, userId: user.id }))
        .then(response => {
          if (response.payload?.success) {
            dispatch(fetchAddresses(user.id));
            setFormData(initialAddressFormData);
            toast.success("Address Added Succesfully");
          }
        })
        .catch(err => console.error("Add address failed:", err));
  }


  function handleDeleteAddress(getCurrentAddress) {
    console.log(getCurrentAddress);
    dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress?._id })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAddresses(user?.id));
        toast.success("Address deleted successfully");
      }
    })
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id)
    setFormData({
      ...formData,
      name: getCurrentAddress?.name,
      street: getCurrentAddress?.street,
      city: getCurrentAddress?.city,
      state: getCurrentAddress?.state,
      zip: getCurrentAddress?.zip,
      phone: getCurrentAddress?.phone,
      notes: getCurrentAddress?.notes,
    })
  }

  function isFormValid() {
    // Add your form validation logic here
    const mandatoryFields = Object.keys(formData).filter(key => key !== "notes");
    return mandatoryFields.map(key => formData[key] !== "").every(item => item);
  }


  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddresses(user.id));
    }
  }, [dispatch, user?.id]);



  console.log("Address List: ", addressList);

  return <Card>
    <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 ">
      {
        addressList && addressList?.length > 0 ? addressList.map((addressItem) => (<AddressCard
          selectedId={selectedId}
          handleDeleteAddress={handleDeleteAddress}
          key={addressItem._id}
          addressInfo={addressItem}
          handleEditAddress={handleEditAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        ))
          : <p className="text-red-600">No addresses found!</p>
      }
    </div>
    <CardHeader>
      <CardTitle>{
        currentEditedId !== null ? 'Edit Address' : "Add New Address"
      }</CardTitle>
    </CardHeader>
    <CardContent className={"space-y-4"}>
      <CommonForm
        formControls={addressFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText={currentEditedId !== null ? 'Edit Address' : "Add New Address"
        }
        onSubmit={handleManageAddress}
        isBtnDisabled={!isFormValid()}

      />
    </CardContent>
  </Card>
}

export default Address;