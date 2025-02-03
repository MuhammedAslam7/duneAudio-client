import { useCallback, useEffect, useState } from "react";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { ImageCropModal } from "@/components/admin/modals/ImageCropModal";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ConfirmDialog } from "@/components/admin/modals/ConfirmDilalog";
import axios from "axios";
import { useAddVariantsMutation } from "@/services/api/admin/adminApi";
import { useToaster } from "@/utils/Toaster";

export const ProductsVariantsAddPage = () => {
  const productName = useLocation().state?.productName;
  const toast = useToaster();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({ color: "", stock: "" });
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [addVariants, { isLoading }] = useAddVariantsMutation();
  const { productId } = useParams();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = useCallback((files) => {
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const openCropModal = (image, index) => {
    setCurrentImage(image.preview);
    setCurrentImageIndex(index);
    setCropModalOpen(true);
  };

  const handleCropComplete = (croppedImageUrl) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[currentImageIndex] = {
        ...newImages[currentImageIndex],
        preview: croppedImageUrl,
      };
      return newImages;
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmModalOpen(true);
  };

  const confirmSubmit = async () => {
    setConfirmModalOpen(false);

    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const formData = new FormData();
          formData.append("file", image.file);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUD_NAME
            }/image/upload`,
            formData
          );
          return response.data.secure_url;
        })
      );

      const productData = {
        ...formData,
        images: imageUrls,
      };
      await addVariants({ productData, productId }).unwrap();
      toast("Success", "Variant Added Successfully", "#22c55e");
      setFormData({ color: "", stock: "" });
      setImages([]);
    } catch (error) {
      if (error?.data) {
        toast("Error", error?.data?.message, "#ff0000");
      } else {
        toast("Error", "Network Error", "#ff000");
        console.log(error);
      }
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="ADD VARIANTS"
        />
        <div className="flex-1 overflow-auto p-6">
          <Card className="w-full h-full">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <CardContent className="flex-grow flex flex-col pt-4 items-center text-xl">
                <h1 className="text-yellow-500 font-bold">{productName}</h1>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full mt-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        className="mt-3"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        className="mt-3"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-3">
                    <Label>Product Images</Label>
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-8">
                      <label
                        htmlFor="images"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">
                          Upload images (max 5)
                        </span>
                        <Input
                          id="images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.preview}
                              alt={`product image ${index + 1}`}
                              className="cursor-pointer w-full object-cover rounded-md"
                              onClick={() => openCropModal(image, index)}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-center gap-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1) || navigate("/admin/products")}
                  className="w-full sm:w-auto bg-red-500"
                >
                  Back
                </Button>
                <Button type="submit" className="w-full sm:w-auto mb-10">
                  {isLoading ? "Adding New Variant" : "Add New Variant"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <ConfirmDialog
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmSubmit}
        title="Confirm Variant Addition"
        description="Are you sure you want to add this Variant?"
      />
      {currentImage && (
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          imageUrl={currentImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};
