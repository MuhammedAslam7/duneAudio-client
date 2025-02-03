import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAddCouponMutation } from "@/services/api/admin/adminApi";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { useEffect, useState } from "react";

const OfferSchema = Yup.object().shape({
  couponCode: Yup.string()
    .matches(
      /^[A-Z0-9]+$/,
      "Coupon code must contain only uppercase letters and numbers"
    )
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be less than 20 characters")
    .required("Coupon code is required"),

  discountAmount: Yup.number()
    .positive("Discount amount must be positive")
    .required("Discount amount is required"),

  minPurchaseAmount: Yup.number()
    .positive("Minimum purchase amount must be positive")
    .required("Minimum purchase amount is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(new Date(), "End date must be in the future"),
});

export const CouponAddPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [addCoupon] = useAddCouponMutation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const initialValues = {
    couponCode: "",
    discountAmount: "",
    minPurchaseAmount: "",
    endDate: "",
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await addCoupon(values).unwrap();
      navigate("/admin/coupons");
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
          pageName="ADD OFFER"
        />
        <div className="container mx-auto p-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Add New Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={initialValues}
                validationSchema={OfferSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="couponCode">Coupon Code</Label>
                      <Field
                        name="couponCode"
                        id="couponCode"
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.couponCode && touched.couponCode
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {errors.couponCode && touched.couponCode && (
                        <div className="text-red-500 text-sm">
                          {errors.couponCode}
                        </div>
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
                          <div className="text-red-500 text-sm">
                            {errors.discountAmount}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minPurchaseAmount">
                          Minimum Purchase Amount
                        </Label>
                        <Field
                          type="number"
                          name="minPurchaseAmount"
                          id="minPurchaseAmount"
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.minPurchaseAmount &&
                            touched.minPurchaseAmount
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.minPurchaseAmount &&
                          touched.minPurchaseAmount && (
                            <div className="text-red-500 text-sm">
                              {errors.minPurchaseAmount}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Field
                          name="endDate"
                          id="endDate"
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
                        {isSubmitting ? "Adding..." : "Add Coupon"}
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
