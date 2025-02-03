"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Plus, Minus } from "lucide-react";
import {
  useGetProductByIdQuery,
  useUpdateProductByIdMutation,
} from "@/services/api/admin/adminApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageCropModal } from "@/components/admin/modals/ImageCropModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToaster } from "@/utils/Toaster";
import axios from "axios";
export function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToaster();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [images, setImages] = useState([]);
  const { data, isLoading, error } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductByIdMutation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  const { product, categories } = data || {};

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    variants: [],
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category?.name || "",
        brand: product.brand?.name || "",
        variants: product.variants || [],
      });
      if (product.variants && product.variants.length > 0) {
        setImages(
          product.variants[0].images.map((url) => ({
            preview: url,
            file: null,
          }))
        );
      } else {
        setImages([]);
      }
    }
  }, [product]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview && image.file) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  const handleImageUpload = useCallback(
    async (variantIndex, files) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const validFiles = Array.from(files).filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          toast(
            "Error",
            "Only image files (JPEG, PNG, GIF, WEBP) are allowed",
            "#ff0000"
          );
          return false;
        }
        return true;
      });

      validFiles.forEach((file, index) => {
        console.log(`File ${index}:`, file.name);
      });

      const imageUrls = await Promise.all(
        validFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
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

      setFormData((prevFormData) => {
        const updatedVariants = prevFormData.variants.map((variant, vIndex) => {
          if (variantIndex == vIndex) {
            return {
              ...variant,
              images: [...variant.images, ...imageUrls],
            };
          }
          return variant;
        });
        return {
          ...prevFormData,
          variants: updatedVariants,
        };
      });
    },
    [toast, images]
  );
  console.log(formData);

  const openCropModal = (image, index) => {
    setCurrentImage(image.preview);
    setCurrentImageIndex(index);
    setCropModalOpen(true);
  };
  const handleCropComplete = (croppedImageUrl) => {
    console.log(croppedImageUrl);
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[currentImageIndex] = {
        ...newImages[currentImageIndex],
        preview: croppedImageUrl,
      };
      return newImages;
    });
  };
  const removeImage = (variantIndex, imgIndex) => {
    console.log(imgIndex, variantIndex);
    setFormData((prevFormData) => {
      const updatedVariants = prevFormData.variants.map((variant, vIndex) => {
        if (vIndex == variantIndex) {
          return {
            ...variant,
            images: variant.images.filter((_, i) => i != imgIndex),
          };
        }
        return variant;
      });
      return {
        ...prevFormData,
        variants: updatedVariants,
      };
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prevData) => {
      const newVariants = [...prevData.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prevData, variants: newVariants };
    });
  };
  const removeVariant = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      variants: prevData.variants.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };
  const confirmSubmit = async () => {
    setIsConfirmModalOpen(false);
    try {
      console.log(formData);
      await updateProduct({ id, formData }).unwrap();
      toast("Success", "Product Updated Successfully", "#22c55e");
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast("Error", "Error on updating product", "#ff0000");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error: {error.message}
      </div>
    );
  }
  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="EDIT PRODUCT"
        />
        <div className="flex-1 overflow-auto p-6">
          <Card className="w-full">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                <div className="grid lg:grid-cols-[400px_1fr] gap-6 flex-grow">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      <div>
                        <Label
                          htmlFor="productName"
                          className="text-sm font-medium"
                        >
                          Product Name
                        </Label>
                        <Input
                          id="productName"
                          name="productName"
                          value={formData.productName}
                          onChange={handleInputChange}
                          placeholder="Enter product name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium">
                          Price
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="Enter price"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="brand" className="text-sm font-medium">
                        Brand
                      </Label>
                      <Input
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Enter brand"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category
                      </Label>
                      <Select
                        id="category"
                        name="category"
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "category", value },
                          })
                        }
                        className="mt-1"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        rows={5}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {formData?.variants?.map((variant, index) => (
                        <div key={index} className="mt-2 p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg text-yellow-500 font-semibold">
                              {variant?.color}
                            </h4>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeVariant(index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor={`color-${index}`}
                                className="text-sm font-medium"
                              >
                                Color
                              </Label>
                              <Input
                                id={`color-${index}`}
                                value={variant.color}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "color",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter color"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`stock-${index}`}
                                className="text-sm font-medium"
                              >
                                Stock
                              </Label>
                              <Input
                                id={`stock-${index}`}
                                type="number"
                                value={variant.stock}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "stock",
                                    parseInt(e.target.value)
                                  )
                                }
                                placeholder="Enter stock"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="inline-flex flex-col w-full items-center justify-center p-4 mt-3 border border-dashed border-gray-300 rounded-md hover:border-primary transition-colors duration-200 ease-in-out cursor-pointer">
                            <label
                              htmlFor={`images-${index}`}
                              className="cursor-pointer"
                            >
                              <Upload className="w-6 h-6 text-gray-400" />
                            </label>
                            <Input
                              id={`images-${index}`}
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(index, e.target.files)
                              }
                            />
                          </div>

                          <div className="mt-2">
                            <Label className="text-sm font-medium">
                              Images
                            </Label>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              {variant.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Variant ${index + 1} image ${
                                      imgIndex + 1
                                    }`}
                                    className="w-full h-24 object-cover rounded-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index, imgIndex)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/products")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating Product..." : "Update Product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Product Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this product?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
}
