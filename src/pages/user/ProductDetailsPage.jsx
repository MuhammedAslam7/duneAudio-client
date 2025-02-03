import { useState, useEffect } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { useProductDetailsQuery } from "@/services/api/user/userApi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAddToCartMutation, useAddToWishlistMutation } from "@/services/api/user/userApi";
import { useToaster } from "@/utils/Toaster";
export function ProductDetailsPage() {
  const toast = useToaster();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { id } = useParams();
  const { data, isLoading, error } = useProductDetailsQuery(id);
  const [images, setImages] = useState([]);
  const [color, setColor] = useState();
  const [stock, setStock] = useState();
  const [variantId, setVariantId] = useState()
  const [currentVariant, setCurrentVariant] = useState();
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [addToCart] = useAddToCartMutation();
  const [addToWishlist]  = useAddToWishlistMutation()
  const userId = useSelector((state) => state?.user?.userId);
  const {product} = data || {}
  useEffect(() => {
    console.log("Product variants in useEffect:", product?.variants);
    if (product?.variants?.length > 0) {
      setImages(product?.variants[0]?.images);
      setColor(product?.variants[0]?.color);
      setStock(product?.variants[0]?.stock);
      setVariantId(product?.variants[0]?._id)
      setCurrentVariant(0);
    }
  }, [product?.variants]);
  
  const discountPercentage = ((product?.price - product?.discountedPrice) / product?.price) * 100
  const variants = product?.variants || [];

  // const decreaseQuantity = () => {
  //   if (quantity > 1) {
  //     setQuantity(quantity - 1);
  //   }
  // };

  // const increaseQuantity = () => {
  //   setQuantity(quantity + 1);
  // };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images?.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images?.length) % images?.length);
  };

  const toggleWishlist = async() => {
    try {

      const response = await addToWishlist({productId: product._id, variantId}).unwrap()
      toast("Success", response?.message, "#22c55e");
    } catch (error) {
      if (error.status == 400) {
        toast("Item already  in cart", error?.data?.message, "#f97316");
      } else {
        console.log(error);
        toast("Error", "An Error Occured Please try again later..", "#ff0000");
      }
      
    }
  };

  const handleMouseMove = (event) => {
    const { left, top, width, height } = event.target.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = async () => {
    try {
      const response = await addToCart({
        productId: id,
        color,
      }).unwrap();
      toast("Success", response?.message, "#22c55e");
    } catch (error) {
      if (error.status == 409) {
        toast("Item already  in cart", error?.data?.message, "#f97316");
      } else {
        console.log(error);
        toast("Error", "An Error Occured Please try again later..", "#ff0000");
      }
    }
  };

  const handleVariantChange = (variant, index) => {
    setImages(variant?.images);
    setColor(variant?.color);
    setStock(variant?.stock);
    setVariantId(variant?._id)
    setCurrentVariant(index);
  };

  if (isLoading) {
    return <p>Loading Product Details......</p>;
  }
  if (!product || error) {
    return <p>Unable to see product details, please try again later....</p>;
  }

  return (
    <div className="container mx-auto bg-gray-50">
      <NavbarUser />
      <SecondNavbarUser />

      <div className="grid md:grid-cols-2 max-w-7xl gap-12 mt-7 mx-auto">
        <div className="flex gap-4">
          <div className="gap-5 flex flex-col">
            {images?.map((image, index) => (
              <div
                key={index}
                className="w-16 h-16 p-1 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={image}
                  alt={image || `Variant ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  onMouseEnter={() => setCurrentImage(index)}
                />
              </div>
            ))}
          </div>
          <Card className="relative overflow-hidden rounded-xl w-full shadow-lg h-[550px]">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage}
                    className="relative w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <img
                      src={images?.[currentImage]}
                      alt={`boAt Rockerz 425 - Image ${currentImage + 1}`}
                      className="w-full h-full object-contain "
                      style={{
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        transform: isZoomed ? "scale(2)" : "scale(1)",
                        transition: "transform 0.2s ease-out",
                      }}
                      onMouseEnter={() => setIsZoomed(true)}
                      onMouseLeave={() => setIsZoomed(false)}
                      onMouseMove={handleMouseMove}
                    />
                  </motion.div>
                </AnimatePresence>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md transition-transform hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md transition-transform hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-4 pb-4">
                {images?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentImage === index
                        ? "bg-primary scale-125"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {product?.productName}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                - 2 Customer Reviews
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            {product?.discountedPrice ? (
              <>
                <span className="text-2xl font-bold text-primary">
                  ₹{product?.discountedPrice}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {product?.price}
                </span>
                <Badge variant="destructive" className="text-xs">
                  {Math.ceil(discountPercentage)}% OFF
                </Badge>{" "}
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">
                ₹{product?.price}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700 font-medium">
            {product?.description}
          </p>

          {/* <div className="space-y-1">
            <label
              htmlFor="quantity"
              className="block text-xs font-medium text-gray-700"
            >
              Quantity:
            </label>
            <div className="flex items-center gap-2">
              <Button
                onClick={decreaseQuantity}
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                -
              </Button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-12 text-center border rounded-md p-1 text-sm"
                min="1"
              />
              <Button
                onClick={increaseQuantity}
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                +
              </Button>
            </div>
          </div> */}

          <Badge
            variant="secondary"
            className={`${
              stock > 1
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : stock === 1
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {stock > 1
              ? "In Stock"
              : stock === 1
              ? "Only 1 Left"
              : "Out of Stock"}
          </Badge>

          <div className="flex gap-2">
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm py-1">
              BUY NOW
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-sm py-1"
                    variant="secondary"
                    onClick={handleAddToCart}
                    disabled={stock == 0}
                  >
                    <ShoppingCart className="mr-1 h-3 w-3" /> ADD TO CART
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add this item to your cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button
            variant="outline"
            className={`w-full flex items-center gap-1 transition-colors text-sm py-1 ${
              isWishlisted ? "bg-pink-100 text-pink-600 hover:bg-pink-200" : ""
            }`}
            onClick={toggleWishlist}
          >
            <Heart
              className={`h-3 w-3 ${isWishlisted ? "fill-current" : ""}`}
            />
            {isWishlisted ? "WISHLISTED" : "ADD TO WISHLIST"}
          </Button>

          <div className="space-y-2 pt-4 border-t text-xs">
            <p className="flex justify-between">
              <span className="font-medium text-gray-600">BRAND:</span>
              <span className="text-gray-800 font-bold">
                {product?.brand?.name}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-gray-600">CATEGORY:</span>
              <span className="text-gray-800 font-bold">
                {product?.category?.name}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-gray-600">COLOR:</span>
              <span className="text-gray-800 font-bold">{color}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-gray-600">WARRANTY:</span>
              <span className="text-gray-800 font-bold">
                1 Year Manufacturer Warranty
              </span>
            </p>
          </div>

          <div className="gap-7 flex">
            {variants?.map((variant, index) => (
              <div
                key={index}
                style={{
                  border:
                    currentVariant === index
                      ? `2px solid ${color}`
                      : "2px solid gray",
                }}
                className={`w-10 h-10 p-1 rounded-lg shadow-md transition-all flex items-center flex-col
              ${
                currentVariant === index
                  ? "shadow-lg scale-110"
                  : "hover:border-gray-400"
              }
            `}
              >
                <img
                  src={variant?.images[0]}
                  alt={variant || `Variant ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  onClick={() => handleVariantChange(variant, index)}
                />
                <p className="mt-1 text-sm font-medium">{variant?.color}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
