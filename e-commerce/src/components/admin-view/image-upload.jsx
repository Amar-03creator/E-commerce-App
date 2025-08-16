import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import apiClient from '../../api/axiosConfig';
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  setImageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  isEditMode,
  isCustomStyling = false
}) {

  const inputRef = useRef(null);
  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);

    // CORRECTED: Uses the relative path
    const response = await apiClient.post('/api/admin/products/upload-image', data);
    
    console.log(response, "response");
    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary()
  }, [imageFile])

  return (
    <div className={`w-full ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div onDragOver={handleDragOver} onDrop={handleDrop} className={`${isEditMode ? "opacity-60" : ""}border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center`}>
        <Input
          id='image-upload'
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {
          !imageFile ? (
            <Label htmlFor="image-upload" className={`${isEditMode ? "cursor-not-allowed" : ""}flex flex-col items-center justify-center h-32 cursor-pointer`}>
              <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
              <span>Drag & drop or click to upload image</span>
            </Label>) : imageLoadingState ? (
              <Skeleton className="w-full h-10 bg-gray-200" />
            ) : (<div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileIcon className="w-10 h-10 text-muted-foreground mr-2" />
              </div>
              <p className="text-sm font-medium">{imageFile.name}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
            )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
