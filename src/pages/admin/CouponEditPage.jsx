import { useGetCouponByIdQuery, useUpdateCouponMutation } from "@/services/api/admin/adminApi";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { useEffect, useState } from "react";

const OfferSchema = Yup.object().shape({
  couponCode: Yup.string()
    .matches(/^[A-Z0-9]+$/, "Coupon code must contain only uppercase letters and numbers")
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be less than 20 characters")
    .required("Coupon code is required"),
  discountAmount: Yup.number()
    .positive("Discount amount must be positive")
    .required("Discount amount is required"),
  minPurchaseAmount: Yup.number()
    .positive("Minimum purchase amount must be positive")
    .required("Minimum purchase amount is required"),
  expirationDate: Yup.date()
    .min(new Date(), "Expiration date must be in the future")
    .required("Expiration date is required"),
});

export const CouponEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { data, isLoading } = useGetCouponByIdQuery(id);
  const [updateCoupon] = useUpdateCouponMutation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    
    const timezoneOffset = date.getTimezoneOffset();
    
    const adjustedDate = new Date(date.getTime() - (timezoneOffset * 60000));
    
    return adjustedDate.toISOString().slice(0, 16);
  };

  const formatDateForSubmission = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    
    return date.toISOString();
  };

  const initialValues = {
    couponCode: data?.coupon?.couponCode || "",
    discountAmount: data?.coupon?.discountAmount || "",
    minPurchaseAmount: data?.coupon?.minPurchaseAmount || "",
    expirationDate: formatDateForInput(data?.coupon?.expirationDate) || "",
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const submissionValues = {
        ...values,
        expirationDate: formatDateForSubmission(values.expirationDate),
      };

      const updateData = {
        id,
        values: submissionValues,
      };
      
      await updateCoupon(updateData).unwrap();
      navigate("/admin/coupons");
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
      } else {
        console.error("Update failed:", error);
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
          pageName="EDIT COUPON"
        />
        <div className="container mx-auto p-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Edit Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={initialValues}
                validationSchema={OfferSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="couponCode">Coupon Code</Label>
                      <Field
                        name="couponCode"
                        id="couponCode"
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.couponCode && touched.couponCode ? "border-red-500" : ""
                        }`}
                      />
                      {errors.couponCode && touched.couponCode && (
                        <div className="text-red-500 text-sm">{errors.couponCode}</div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="discountAmount">Discount Amount</Label>
                        <Field
                          type="number"
                          name="discountAmount"
                          id="discountAmount"
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.discountAmount && touched.discountAmount
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.discountAmount && touched.discountAmount && (
                          <div className="text-red-500 text-sm">{errors.discountAmount}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minPurchaseAmount">Minimum Purchase Amount</Label>
                        <Field
                          type="number"
                          name="minPurchaseAmount"
                          id="minPurchaseAmount"
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.minPurchaseAmount && touched.minPurchaseAmount
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.minPurchaseAmount && touched.minPurchaseAmount && (
                          <div className="text-red-500 text-sm">
                            {errors.minPurchaseAmount}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expirationDate">Expiration Date</Label>
                      <Field
                        name="expirationDate"
                        id="expirationDate"
                        type="datetime-local"
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.expirationDate && touched.expirationDate
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {errors.expirationDate && touched.expirationDate && (
                        <div className="text-red-500 text-sm">{errors.expirationDate}</div>
                      )}
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/coupons")}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
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