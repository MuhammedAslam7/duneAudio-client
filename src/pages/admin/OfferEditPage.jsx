import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateOfferMutation } from "@/services/api/admin/adminApi";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { useEffect, useState } from "react";
import { useGetAllCategoryProductNamesQuery } from "@/services/api/admin/offerApi";
import { useGetOfferByIdQuery } from "@/services/api/admin/adminApi";

const OfferSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters")
    .required("Description is required"),
  discountType: Yup.string()
    .oneOf(["percentage", "amount"], "Invalid discount type")
    .required("Discount type is required"),
  discountValue: Yup.number()
    .when("discountType", {
      is: "percentage",
      then: (schema) => schema.min(1).max(80).required(),
      otherwise: (schema) => schema.min(1).required(),
    })
    .required("Discount value is required"),
  applicationType: Yup.string()
    .oneOf(["category", "product"], "Invalid application type")
    .required("Application type is required"),
  categoryId: Yup.array().when("applicationType", {
    is: "category",
    then: (schema) =>
      schema
        .min(1, "At least one category is required")
        .required("Categories are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  productId: Yup.array().when("applicationType", {
    is: "product",
    then: (schema) =>
      schema
        .min(1, "At least one product is required")
        .required("Products are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
});

export const OfferEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { data: categoriesAndProducts } = useGetAllCategoryProductNamesQuery();
  const { data: offer, isLoading } = useGetOfferByIdQuery(id);
  const [updateOffer] = useUpdateOfferMutation();

  const { products, categories } = categoriesAndProducts || {
    products: [],
    categories: [],
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const determineApplicationType = (offer) => {
    if (offer.products && offer.products.length > 0) return "product";
    if (offer.categories && offer.categories.length > 0) return "category";
    return "category";
  };

  const initialValues = {
    title: offer?.title || "",
    description: offer?.description || "",
    discountType: offer?.discountType || "percentage",
    discountValue: offer?.discountValue || "",
    applicationType: determineApplicationType(offer),
    categoryId: offer?.categories?.map((cat) => cat._id) || [],
    productId: offer?.products?.map((prod) => prod._id) || [],
    startDate: formatDateForInput(offer?.startDate) || "",
    endDate: formatDateForInput(offer?.endDate) || "",
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      console.log(values);
      const result = await updateOffer({ id, values }).unwrap();
      console.log(result)
        navigate("/admin/offers");
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1 flex flex-col overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="EDIT OFFER"
        />
        <div className="container mx-auto p-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Edit Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={initialValues}
                validationSchema={OfferSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Offer Title</Label>
                      <Field
                        name="title"
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.title && touched.title ? "border-red-500" : ""
                        }`}
                      />
                      {errors.title && touched.title && (
                        <div className="text-red-500 text-sm">
                          {errors.title}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Field
                        name="description"
                        as="textarea"
                        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.description && touched.description
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {errors.description && touched.description && (
                        <div className="text-red-500 text-sm">
                          {errors.description}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <Label>Discount Type</Label>
                          <RadioGroup
                            value={values.discountType}
                            onValueChange={(value) =>
                              setFieldValue("discountType", value)
                            }
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="percentage"
                                id="percentage"
                              />
                              <Label htmlFor="percentage">Percentage</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                disabled={values.applicationType === "category"}
                                value="amount"
                                id="amount"
                              />
                              <Label htmlFor="amount">Fixed Amount</Label>
                            </div>
                          </RadioGroup>
                          {errors.discountType && touched.discountType && (
                            <div className="text-red-500 text-sm">
                              {errors.discountType}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="discountValue">
                            Discount Value{" "}
                            {values.discountType === "percentage"
                              ? "(%)"
                              : "(₹)"}
                          </Label>
                          <Field
                            name="discountValue"
                            type="number"
                            disabled={
                              values.applicationType === "category" &&
                              values.discountType === "amount"
                            }
                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                              errors.discountValue && touched.discountValue
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          {errors.discountValue && touched.discountValue && (
                            <div className="text-red-500 text-sm">
                              {errors.discountValue}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <Label>Application Type</Label>
                          <RadioGroup
                            value={values.applicationType}
                            onValueChange={(value) => {
                              setFieldValue("applicationType", value);
                              setFieldValue("categoryId", []);
                              setFieldValue("productId", []);
                              if (
                                value === "category" &&
                                values.discountType === "amount"
                              ) {
                                setFieldValue("discountType", "percentage");
                              }
                            }}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="category" id="category" />
                              <Label htmlFor="category">Category</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="product" id="product" />
                              <Label htmlFor="product">Product</Label>
                            </div>
                          </RadioGroup>
                          {errors.applicationType &&
                            touched.applicationType && (
                              <div className="text-red-500 text-sm">
                                {errors.applicationType}
                              </div>
                            )}
                        </div>

                        {values.applicationType === "category" && (
                          <div className="space-y-2">
                            <Label htmlFor="categoryId">
                              Select Categories
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  {values.categoryId.length > 0
                                    ? `${values.categoryId.length} categories selected`
                                    : "Select categories"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <ScrollArea className="h-[200px]">
                                  {categories.map((category) => (
                                    <div
                                      key={category._id}
                                      className="flex items-center space-x-2 p-2"
                                    >
                                      <Checkbox
                                        id={`category-${category._id}`}
                                        checked={values.categoryId.includes(
                                          category._id
                                        )}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setFieldValue("categoryId", [
                                              ...values.categoryId,
                                              category._id,
                                            ]);
                                          } else {
                                            setFieldValue(
                                              "categoryId",
                                              values.categoryId.filter(
                                                (id) => id !== category._id
                                              )
                                            );
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`category-${category._id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {category.name}
                                      </label>
                                    </div>
                                  ))}
                                </ScrollArea>
                              </PopoverContent>
                            </Popover>
                            {errors.categoryId && touched.categoryId && (
                              <div className="text-red-500 text-sm">
                                {errors.categoryId}
                              </div>
                            )}
                          </div>
                        )}

                        {values.applicationType === "product" && (
                          <div className="space-y-2">
                            <Label htmlFor="productId">Select Products</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  {values.productId.length > 0
                                    ? `${values.productId.length} products selected`
                                    : "Select products"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <ScrollArea className="h-[200px]">
                                  {products.map((product) => (
                                    <div
                                      key={product._id}
                                      className="flex items-center space-x-2 p-2"
                                    >
                                      <Checkbox
                                        id={`product-${product._id}`}
                                        checked={values.productId.includes(
                                          product._id
                                        )}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setFieldValue("productId", [
                                              ...values.productId,
                                              product._id,
                                            ]);
                                          } else {
                                            setFieldValue(
                                              "productId",
                                              values.productId.filter(
                                                (id) => id !== product._id
                                              )
                                            );
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`product-${product._id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {product.productName} , ₹{product.price}
                                      </label>
                                    </div>
                                  ))}
                                </ScrollArea>
                              </PopoverContent>
                            </Popover>
                            {errors.productId && touched.productId && (
                              <div className="text-red-500 text-sm">
                                {errors.productId}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Field
                          name="startDate"
                          type="datetime-local"
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.startDate && touched.startDate
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.startDate && touched.startDate && (
                          <div className="text-red-500 text-sm">
                            {errors.startDate}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Field
                          name="endDate"
                          type="datetime-local"
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.endDate && touched.endDate
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.endDate && touched.endDate && (
                          <div className="text-red-500 text-sm">
                            {errors.endDate}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/offers")}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Offer"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
