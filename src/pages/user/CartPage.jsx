import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { FooterUser } from "@/components/user/layouts/FooterUser";
import {
  useUpdateCartQuantityMutation,
  useCartProductsQuery,
  useRemoveCartItemMutation,
  useLazyVerifyStockQuery
} from "@/services/api/user/userApi";
import { useNavigate } from "react-router-dom";
import { useToaster } from "@/utils/Toaster";
import Breadcrumbs from "@/components/user/layouts/Breadcrumbs";

export const CartPage = () => {
  const toast = useToaster();
  const navigate = useNavigate();
  const userId = useSelector((state) => state?.user?.userId);
  const [updateCartQuantity] = useUpdateCartQuantityMutation();
  const { data: cartData, isLoading } = useCartProductsQuery(userId);
  const [verifyStock, {data: result, isLoading: isProceeding}] = useLazyVerifyStockQuery()
  const [removeCartItem] = useRemoveCartItemMutation();
  const [products, setProducts] = useState([]);
  const { items = [], totalPrice, totalDiscount } = cartData || {};
  const [isStockAvailable, setIsStockAvailable] = useState(true);

  useEffect(() => {
    if (items?.length > 0) {
      setProducts(items);
      const hasOutOfStock = items.some((item) => item.variant.stock === 0);
      setIsStockAvailable(!hasOutOfStock);
    }
  }, [items]);


  const updateQuantity = async (productId, variantId, newQuantity, stock, status) => {
    const validQuantity = Math.max(1, newQuantity);
    if (newQuantity == 6) {
      return toast(
        "Limit Exceeds",
        "You can't purchase more than the maximum quantity",
        "#f97316"
      );
    } if(status == "inc") {

      if (newQuantity > stock) {
        return toast("No stock", "No more stock is availabe", "#f97316");
      }
    }
    setProducts(
      products?.map((product) =>
        product.variant._id === variantId
          ? { ...product, quantity: validQuantity }
          : product
      )
    );
    try {
      await updateCartQuantity({
        productId,
        variantId,
        newQuantity: validQuantity,
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const removeProduct = async (productId, variantId) => {
    try {
      await removeCartItem({ productId, variantId }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  const handleProceed = async() => {
    try {
      const response = await verifyStock().unwrap()
      const outOfStock = response.find((res) => res.stock < 0)
      if (outOfStock) {
        console.log(outOfStock)
        toast("Out of Stock", `${outOfStock.productName} is out of ${Math.abs(outOfStock.stock)} stock`, "#f97316");
        return;
      }

        navigate("/checkout-page")
      
    } catch (error) {
      console.log(error)
      
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
          <h1 className="text-2xl font-semibold text-gray-700">
            Loading Your Cart...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarUser />
      <SecondNavbarUser />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs currentPage="Cart" />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SHOPPING CART</h1>
          {items?.length !== 0 && (
            <Link to="/home">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          )}
        </div>
        {items?.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/home">
                <Button size="lg" className="px-8">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {products?.map((product) => (
                <Card
                  key={product?.variant?._id}
                  className="overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div
                        onClick={() =>
                          navigate(`/product-details/${product?.productId}`)
                        }
                        className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                      >
                        <img
                          src={product?.variant?.images[0]}
                          alt={product?.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {product?.productName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {product?.description}
                        </p>
                        <div className="flex items-center justify-between">
                          {product?.discountedPrice ? (
                            <div className="flex space-y-2 space-x-4">
                              <p className="text-2xl font-bold text-gray-900">
                                ₹
                                {Math.ceil(product?.discountedPrice)?.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                              <span className="text-sm line-through text-red-500">
                              ₹{product?.price}
                              </span>
                            </div>
                          ) : (
                            <p className="text-2xl font-bold text-gray-900">₹{product?.price}</p>
                          )}
                          <p
                            className={
                              product?.variant?.stock > 1
                                ? "text-green-600 font-medium"
                                : product?.variant?.stock === 1
                                ? "text-yellow-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {product?.variant?.stock > 1
                              ? "Item In Stock"
                              : product?.variant?.stock === 1
                              ? "Only 1 Item Left"
                              : "Out Of Stock"}
                          </p>
                          <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                updateQuantity(
                                  product?.productId,
                                  product?.variant?._id,
                                  product?.quantity - 1,
                                  product?.variant?.stock,
                                  "dec"
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium text-gray-900">
                              {product?.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                updateQuantity(
                                  product?.productId,
                                  product?.variant._id,
                                  product?.quantity + 1,
                                  product?.variant?.stock,
                                  "inc"
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 px-6 py-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        removeProduct(product?.productId, product?.variant?._id)
                      }
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Discount</span>
                    <span className="font-medium text-green-600">₹{totalDiscount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <div className="flex items-center gap-4">
                      {totalDiscount > 0 && <span className="font-medium line-through text-red-500">₹{totalPrice}</span>}
                    <span className="text-2xl font-bold">₹{totalPrice - totalDiscount}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleProceed}
                    disabled={!isStockAvailable}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
      <FooterUser />
    </div>
  );
};
