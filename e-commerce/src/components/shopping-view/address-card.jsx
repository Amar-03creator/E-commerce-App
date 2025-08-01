import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId
}) {
  return <Card
    className={`cursor-pointer ${selectedId?._id === addressInfo?._id ? "border-zinc-800 border-[4px]" : "border-black"}`}
    onClick={
      setCurrentSelectedAddress
        ? () => setCurrentSelectedAddress(addressInfo)
        : null
    }
  >
    <CardContent className={`${selectedId === addressInfo?._id ? 'border-black' : ''} grid p-4 gap-4`}>
      <Label>Name: {addressInfo.name}</Label>
      <Label>Street: {addressInfo.street}</Label>
      <Label>City: {addressInfo.city}</Label>
      <Label>State: {addressInfo.state}</Label>
      <Label>Zip: {addressInfo.zip}</Label>
      <Label>Phone: {addressInfo.phone}</Label>
      <Label>Notes: {addressInfo.notes}</Label>

    </CardContent>
    <CardFooter className="p-3 flex flex-wrap gap-2 lg:justify-between md:justify-center sm:justify-center">
      <Button className="flex-1 sm:flex-none" onClick={() => handleEditAddress(addressInfo)}>
        Edit
      </Button>
      <Button className="flex-1 sm:flex-none" onClick={() => handleDeleteAddress(addressInfo)}>
        Delete
      </Button>
    </CardFooter>
  </Card>

}

export default AddressCard;