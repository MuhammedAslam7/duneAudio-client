import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddAddressMutation } from "@/services/api/user/userApi";
import { useToaster } from "@/utils/Toaster";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { FooterUser } from "@/components/user/layouts/FooterUser";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  MapPin,
  CreditCard,
  Truck,
  ChevronRight,
  Plus,
  Check,
} from "lucide-react";
import Breadcrumbs from "@/components/user/layouts/Breadcrumbs";
import {
  useCheckoutPageQuery,
  useLazyVerifyStockQuery,
} from "@/services/api/user/userApi";

export function CheckoutPage() {
  const toast = useToaster();
  const location = useLocation();
  const navigate = useNavigate();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const { refetch, data: response = {}, isLoading } = useCheckoutPageQuery();
  const [verifyStock, { data: result, isLoading: isProceeding }] =
    useLazyVerifyStockQuery();
  const [selectedAddress, setSelectedAddress] = useState(
    response?.addresses?.[0]
  );
  console.log(selectedAddress);

  const { cart } = response || {};

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    if (response && response?.addresses?.length > 0) {
      setSelectedAddress(response?.addresses[0]);
    } else {
      setShowNewAddressForm(true);
    }
  }, [response]);

  const validationSchema = yup.object({
    fullName: yup
      .string()
      .trim()
      .matches(/^[A-Za-z\s]+$/, "Full Name can only contain letters and spaces")
      .required("Full Name is required"),
    email: yup
      .string()
      .email("Invalid Email Address")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    country: yup
      .string()
      .trim()
      .min(2, "Country must be at least 2 characters long")
      .required("Country is required"),
    state: yup
      .string()
      .trim()
      .min(2, "State must be at least 2 characters long")
      .required("State is required"),
    pincode: yup
      .string()
      .matches(/^\d+$/, "Pincode must only contain numbers")
      .length(6, "Pincode must be exactly 6 digits")
      .required("Pincode is required"),
    city: yup
      .string()
      .trim()
      .min(2, "City must be at least 2 characters long")
      .required("City is required"),
    landMark: yup
      .string()
      .trim()
      .min(2, "Landmark must be at least 2 characters long")
      .required("Landmark is required"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      landMark: "",
      pincode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await addAddress({ newAddress: values }).unwrap();
        resetForm();
        refetch();
        setShowNewAddressForm(false);
        toast("Success", "Address Added Successfully", "#22c55e");
      } catch (error) {
        console.log(error);
        toast("Error", "Failed to add address", "#ef4444");
      }
    },
  });

  const handleSelectAddress = (index) => {
    setSelectedIndex(index);
    setSelectedAddress(response?.addresses?.[index]);
  };

  const handleProceed = async () => {
    try {
      if (selectedAddress == undefined) {
        return toast(
          "No-Address",
          "Please Add a Adress to continue",
          "#ef4444"
        );
      }
      const response = await verifyStock().unwrap();
      const outOfStock = response.find((res) => res.stock < 0);
      if (outOfStock) {
        console.log(outOfStock);
        toast(
          "Out of Stock",
          `${outOfStock.productName} is out of ${Math.abs(
            outOfStock.stock
          )} stock...Go to page and update the quantity please...`,
          "#f97316"
        );
        return;
      }

      navigate("/payment-page", { state: { selectedAddress } });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavbarUser />
      <SecondNavbarUser />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <Breadcrumbs currentPage="Checkout-page" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                  Delivery Address
                </h2>
              </div>
              <div className="p-6">
                {response?.addresses?.length === 0 ? (
                  <p className="text-gray-600">
                    No addresses found. Please add a new address.
                  </p>
                ) : (
                  <RadioGroup
                    value={selectedIndex.toString()}
                    onValueChange={(value) =>
                      handleSelectAddress(parseInt(value))
                    }
                  >
                    <div className="space-y-4">
                      {response?.addresses?.map((address, index) => (
                        <div
                          key={address?._id}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`address-${index}`}
                          />
                          <Label
                            htmlFor={`address-${index}`}
                            className="flex flex-col cursor-pointer p-4 rounded-lg border border-gray-200 w-full transition-all duration-200 ease-in-out hover:border-gray-400"
                          >
                            <span className="font-semibold text-gray-900">
                              {address?.fullName}
                            </span>
                            <span className="text-sm text-gray-600">
                              {address?.phone}
                            </span>
                            <span className="text-sm text-gray-600">
                              {address?.city}, {address?.state},{" "}
                              {address?.country} - {address?.pincode}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">
                              Landmark: {address?.landMark}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
                <Button
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="mt-4 w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Address
                </Button>
              </div>
            </section>

            {showNewAddressForm && (
              <section className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-100 p-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                    New Address
                  </h2>
                </div>
                <div className="p-6">
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formik.values.fullName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.fullName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.email && formik.errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700"
                        >
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="country"
                          className="text-sm font-medium text-gray-700"
                        >
                          Country
                        </Label>
                        <Input
                          id="country"
                          name="country"
                          value={formik.values.country}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.country && formik.errors.country && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.country}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="state"
                          className="text-sm font-medium text-gray-700"
                        >
                          State
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={formik.values.state}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.state && formik.errors.state && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.state}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="pincode"
                          className="text-sm font-medium text-gray-700"
                        >
                          Pincode
                        </Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formik.values.pincode}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.pincode && formik.errors.pincode && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.pincode}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="city"
                          className="text-sm font-medium text-gray-700"
                        >
                          Town/City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.city && formik.errors.city && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="landMark"
                          className="text-sm font-medium text-gray-700"
                        >
                          Landmark
                        </Label>
                        <Input
                          id="landMark"
                          name="landMark"
                          value={formik.values.landMark}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.landMark && formik.errors.landMark && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.landMark}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Adding New Address
                        </span>
                      ) : (
                        "Save New Address"
                      )}
                    </Button>
                  </form>
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-4">
              <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                  Order Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{cart?.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600 flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    FREE
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Total Discount</span>
                  <span className="font-semibold text-green-500">
                    ₹-{cart?.totalDiscount}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{cart?.totalPrice - cart?.totalDiscount} /-
                  </span>
                </div>
                <Button
                  onClick={handleProceed}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out mt-6 flex items-center justify-center"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterUser />
    </div>
  );
}
