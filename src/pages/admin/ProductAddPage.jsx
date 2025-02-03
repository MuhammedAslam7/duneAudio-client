import { useState, useEffect, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload } from "lucide-react";
import {
  useAddProductsMutation,
  useGetCategoryAndBrandQuery,
} from "@/services/api/admin/adminApi";
import { useToaster } from "@/utils/Toaster";
import { ImageCropModal } from "@/components/admin/modals/ImageCropModal";
import { ConfirmDialog } from "@/components/admin/modals/ConfirmDilalog";
import axios from "axios";

const validationSchema = Yup.object().shape({
  productName: Yup.string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive")
    .min(0, "Price cannot be negative"),
  stock: Yup.number()
    .required("Stock is required")
    .integer("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  categoryName: Yup.string().required("Category is required"),
  brandName: Yup.string().required("Brand is required"),
  color: Yup.string().required("Color is required"),
});

export function ProductAddPage() {
  const toast = useToaster();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [images, setImages] = useState([]);
  const [addProducts, { isLoading }] = useAddProductsMutation();
  const { data, isLoading: isGetting } = useGetCategoryAndBrandQuery();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [formValues, setFormValues] = useState(null);
  const { categories, brands } = data || {};
  const [resetFormFn, setResetFormFn] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleImageUpload = useCallback(
    (files) => {
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

      const newImages = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    },
    [toast]
  );

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
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { resetForm }) => {
    setFormValues(values);
    setIsConfirmModalOpen(true);
    setResetFormFn(resetForm);
  };

  const confirmSubmit = async () => {
    setIsConfirmModalOpen(false);

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
        ...formValues,
        images: imageUrls,
      };

      await addProducts(productData).unwrap();
      toast("Success", "Product Added Successfully", "#22c55e");
      if (resetFormFn) {
        resetFormFn();
      }

      Formik.values = {};
      setImages([]);
      setFormValues(null);
    } catch (error) {
      console.log({ error: error.message });
      toast("Error", "Failed to add product. Please try again", "#ff0000");
    }
  };

  if (isGetting) {
    return <h1 className="text-3xl font-medium">Loading...</h1>;
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="ADD PRODUCT"
        />
        <div className="flex-1 overflow-auto p-4">
          <Card className="w-full max-w-7xl mx-auto h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <Formik
                initialValues={{
                  productName: "",
                  price: "",
                  stock: "",
                  description: "",
                  categoryName: "",
                  brandName: "",
                  color: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form className="space-y-6 flex-grow">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      <div className="col-span-2 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="productName"
                              className="text-sm font-medium"
                            >
                              Product Name
                            </Label>
                            <Field
                              as={Input}
                              id="productName"
                              name="productName"
                              placeholder="Enter product name"
                              className={`mt-1 ${
                                errors.productName && touched.productName
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {errors.productName && touched.productName && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.productName}
                              </div>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="brand"
                              className="text-sm font-medium"
                            >
                              Brand
                            </Label>
                            <Select
                              value={values.brandName}
                              onValueChange={(value) =>
                                setFieldValue("brandName", value)
                              }
                            >
                              <SelectTrigger
                                id="brand"
                                className={`mt-1 ${
                                  errors.brandName && touched.brandName
                                    ? "border-red-500"
                                    : ""
                                }`}
                              >
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                              <SelectContent>
                                {brands?.map((brand, index) => (
                                  <SelectItem key={index} value={brand}>
                                    {brand}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.brandName && touched.brandName && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.brandName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="price"
                              className="text-sm font-medium"
                            >
                              Price
                            </Label>
                            <Field
                              as={Input}
                              id="price"
                              type="number"
                              name="price"
                              placeholder="Enter price"
                              className={`mt-1 ${
                                errors.price && touched.price
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {errors.price && touched.price && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.price}
                              </div>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="stock"
                              className="text-sm font-medium"
                            >
                              Stock
                            </Label>
                            <Field
                              as={Input}
                              id="stock"
                              type="number"
                              name="stock"
                              placeholder="Enter stock quantity"
                              className={`mt-1 ${
                                errors.stock && touched.stock
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {errors.stock && touched.stock && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.stock}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                          >
                            Description
                          </Label>
                          <Field
                            as={Textarea}
                            id="description"
                            name="description"
                            placeholder="Enter product description"
                            rows={3}
                            className={`mt-1 ${
                              errors.description && touched.description
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          {errors.description && touched.description && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.description}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="category"
                              className="text-sm font-medium"
                            >
                              Category
                            </Label>
                            <Select
                              value={values.categoryName}
                              onValueChange={(value) =>
                                setFieldValue("categoryName", value)
                              }
                            >
                              <SelectTrigger
                                id="category"
                                className={`mt-1 ${
                                  errors.categoryName && touched.categoryName
                                    ? "border-red-500"
                                    : ""
                                }`}
                              >
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories?.map((category, index) => (
                                  <SelectItem key={index} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.categoryName && touched.categoryName && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.categoryName}
                              </div>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="color"
                              className="text-sm font-medium"
                            >
                              Color
                            </Label>
                            <Select
                              value={values.color}
                              onValueChange={(value) =>
                                setFieldValue("color", value)
                              }
                            >
                              <SelectTrigger
                                id="color"
                                className={`mt-1 ${
                                  errors.color && touched.color
                                    ? "border-red-500"
                                    : ""
                                }`}
                              >
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Black">Black</SelectItem>
                                <SelectItem value="White">White</SelectItem>
                                <SelectItem value="Red">Red</SelectItem>
                                <SelectItem value="Blue">Blue</SelectItem>
                                <SelectItem value="Green">Green</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.color && touched.color && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.color}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1 space-y-6">
                        <div>
                          <Label
                            htmlFor="images"
                            className="text-sm font-medium"
                          >
                            Product Images
                          </Label>
                          <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4">
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
                                onChange={(e) =>
                                  handleImageUpload(e.target.files)
                                }
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {images?.length > 0 && (
                          <div className="flex flex-wrap sm:grid sm:grid-cols-3 sm:flex-col gap-2 mt-2">
                            {images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image?.preview}
                                  alt={`Product image ${index + 1}`}
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

                        <Button
                          type="submit"
                          className="w-full text-sm font-medium py-2 mt-4"
                          disabled={isLoading}
                        >
                          {isLoading ? "Adding Product" : "Add Product"}
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </main>
      <ConfirmDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmSubmit}
        title="Confirm Product Addition"
        description="Are you sure you want to add this product?"
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
}
