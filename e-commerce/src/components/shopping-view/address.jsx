import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

// UI Components from shadcn/ui
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
// --- UPDATE: Import Tooltip components ---
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


// Your existing components and store actions
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { addNewAddress, deleteAddress, editAddress, fetchAddresses } from "@/store/shop/address-slice/index.js";

const initialAddressFormData = {
  name: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  notes: "",
};

// --- UPDATED AddressCard Component ---
function AddressCard({ addressInfo, onEdit, onDelete, onSelect, selectedId }) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Card
          onClick={() => onSelect(addressInfo._id)}
          className={`cursor-pointer transition-all duration-300 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 ${selectedId === addressInfo._id ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'}`}
        >
          <CardContent className="p-3 pb-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-base">{addressInfo.name}</p>
                <p className="text-sm text-muted-foreground">{addressInfo.city}, {addressInfo.zip}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-1 px-2 pb-2 pt-0">
            {/* --- UPDATE: Edit button with Tooltip --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(addressInfo); }}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit Address</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>

            {/* --- UPDATE: Delete button with Tooltip --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(addressInfo); }}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Address</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </CardFooter>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 max-h-48 overflow-y-auto" side="top" align="center">
        <div className="space-y-2">
          <h4 className="font-semibold">{addressInfo.name}</h4>
          <p className="text-sm">{addressInfo.street}</p>
          <p className="text-sm">{addressInfo.city}, {addressInfo.state} {addressInfo.zip}</p>
          <p className="text-sm">Phone: {addressInfo.phone}</p>
          {addressInfo.notes && <p className="text-sm text-muted-foreground">Notes: {addressInfo.notes}</p>}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}


// --- Main Address Component ---
function Address({ setCurrentSelectedAddress, selectedId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector(state => state.shoppingAddress);

  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddresses(user.id));
    }
  }, [dispatch, user?.id]);

  function isFormValid() {
    return Object.entries(formData)
      .filter(([key]) => key !== 'notes')
      .every(([, value]) => value.trim() !== '');
  }

  function handleEditAddress(address) {
    setCurrentEditedId(address._id);
    setFormData({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone,
      notes: address.notes || "",
    });
    setOpenAddressDialog(true);
  }

  function handleAddNewAddress() {
    if (addressList.length >= 4) {
      toast.error("You can add a maximum of 4 addresses.", {
        description: "Please remove an address before adding a new one.",
      });
      return;
    }
    setCurrentEditedId(null);
    setFormData(initialAddressFormData);
    setOpenAddressDialog(true);
  }

  function handleManageAddress(event) {
    event.preventDefault();
    const action = currentEditedId
      ? editAddress({ userId: user?.id, addressId: currentEditedId, formData })
      : addNewAddress({ ...formData, userId: user.id });

    dispatch(action).then(response => {
      if (response.payload?.success) {
        dispatch(fetchAddresses(user.id));
        toast.success(`Address ${currentEditedId ? 'updated' : 'added'} successfully`);
        setOpenAddressDialog(false);
      } else {
        toast.error(response.payload?.message || "An error occurred.");
      }
    });
  }

  function handleDeleteAddress(address) {
    dispatch(deleteAddress({ userId: user?.id, addressId: address._id })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAddresses(user?.id));
        toast.success("Address deleted successfully");
      } else {
        toast.error(data.payload?.message || "Failed to delete address.");
      }
    });
  }

  return (
    // --- UPDATE: Added TooltipProvider to enable tooltips within this component ---
    <TooltipProvider>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Addresses</CardTitle>
          <Button onClick={handleAddNewAddress}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addressList && addressList.length > 0 ? (
              addressList.map((addressItem) => (
                <AddressCard
                  key={addressItem._id}
                  addressInfo={addressItem}
                  selectedId={selectedId}
                  onSelect={setCurrentSelectedAddress}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                />
              ))
            ) : (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No addresses found. Add one to get started!
              </p>
            )}
          </div>
        </CardContent>

        <Dialog open={openAddressDialog} onOpenChange={setOpenAddressDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {currentEditedId ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <CommonForm
                formControls={addressFormControls}
                formData={formData}
                setFormData={setFormData}
                buttonText={currentEditedId ? 'Update Address' : 'Save Address'}
                onSubmit={handleManageAddress}
                isBtnDisabled={!isFormValid()}
              />
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  );
}

export default Address;
