import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";


const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {

  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  // const {toast} = useSonner();


  function onSubmit(event) {
    event.preventDefault();

    if (!isFormValid()) {
      // show a red error toast
      toast.error('Please fill out all fields before submitting');
      return;
    }

    currentEditedId !== null
      ? dispatch(editProduct({
        id: currentEditedId, formData
      })
      ).then((data) => {
        console.log(data, "edit");
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          toast.success("Product updated successfully!");
        }
      })
      : dispatch(addNewProduct({
        ...formData,
        image: uploadedImageUrl
      })).then((data) => {
        console.log(data, "data");
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setFormData(initialFormData);
          setImageFile(null);
          setCurrentEditedId(null);
          toast.success("Product added successfully!");
        }
      });
  }

  function handleDelete(getCurrentProductId) {
    console.log(getCurrentProductId, "getCurrentProductId");
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      console.log(data, "delete data");
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success("Product deleted successfully!");
      }
    });


  }

  function isFormValid() {
    // only require title, description, category, brand, price, salePrice, totalStock
    return ["title", "description", "category", "brand", "price", "totalStock", "salePrice"]
      .every(key => formData[key] !== "" && formData[key] != null)
      && uploadedImageUrl !== "";       // optionally still require an uploaded image
  }


  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(formData, "formData");


  return (

    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {
          productList && productList.length > 0 ? productList.map(productItem => <AdminProductTile
            key={productItem._id}
            setFormData={setFormData}
            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            product={productItem}
            handleDelete={handleDelete}
          />
          ) : null
        }
      </div>

      <Sheet open={openCreateProductsDialog} onOpenChange={() => {
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null);
        setFormData(initialFormData);
      }}>

        <SheetContent side='right' className='overflow-auto'>
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <SheetDescription>
              Fill in the details below to create a new product.
            </SheetDescription>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId ? true : false}
          />

          <div className="py-6">
            <CommonForm
              isFormValid={isFormValid}
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId ? "Edit" : "Add"}
              formControls={addProductFormElements} />
          </div>

        </SheetContent>

      </Sheet>


    </Fragment>
  );
}
export default AdminProducts;