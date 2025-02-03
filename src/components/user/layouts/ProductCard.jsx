import { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAddToWishlistMutation } from '@/services/api/user/userApi';
import { useToaster } from '@/utils/Toaster';

export const ProductCard = ({
  thumbnailImage,
  productName,
  description,
  price,
  productId,
  variantId,
  rating = 4.5,
  reviewCount = 123,
  isNew = false,
  discountPercentage = 0,
  discountedPrice
}) => {
  const toast = useToaster()
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [addToWishlist] = useAddToWishlistMutation()

  const handleCardClick = (e) => {
    if (!e.defaultPrevented) {
      navigate(`/product-details/${productId}`);
    }
  };

  const handleAddToWishlist = async() => {
    try {

      const response = await addToWishlist({productId, variantId}).unwrap()
      toast("Success", response?.message, "#22c55e");
    } catch (error) {
      if (error.status == 400) {
        toast("Item already  in Wishlist", error?.data?.message, "#f97316");
      } else {
        console.log(error);
        toast("Error", "An Error Occured Please try again later..", "#ff0000");
      }
      
    }
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR'
  }).format(price);



  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer bg-white rounded-2xl border-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={thumbnailImage}
          alt={productName}
          className="h-full w-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isNew && (
          <Badge className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-lg rounded-full">
            New Arrival
          </Badge>
        )}
        {discountPercentage > 0 && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-lg rounded-full">
            {discountPercentage}% OFF
          </Badge>
        )}
        <div className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 text-gray-800 hover:bg-white hover:text-pink-600 shadow-lg transition-transform duration-300 hover:scale-110 rounded-full h-12 w-12"
            onClick={handleAddToWishlist}
          >
            <Heart  className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 text-gray-800 hover:bg-white hover:text-green-600 shadow-lg transition-transform duration-300 hover:scale-110 rounded-full h-12 w-12"
            onClick={handleCardClick}
          >
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300 truncate">
          {productName}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="mt-3 flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviewCount})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          {discountedPrice ? (
            <>
              <span className="text-2xl font-bold text-red-600">₹{discountedPrice}</span>
              <span className="text-sm text-gray-500 line-through">{formattedPrice}</span>
            </>
          ) : (
          <span className="text-2xl font-bold text-gray-900">₹{price}</span>
          )}
        </div>
        <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
            onClick={handleCardClick}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

