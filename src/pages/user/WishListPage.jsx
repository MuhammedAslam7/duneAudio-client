import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { useGetWishlistQuery } from "@/services/api/user/userApi";
import { useAddToCartMutation } from "@/services/api/user/userApi";
import { useToaster } from "@/utils/Toaster";
import { useRemoveWishlistItemMutation } from "@/services/api/user/userApi";
import { Heart, ShoppingBag } from "lucide-react";
import { FooterUser } from "@/components/user/layouts/FooterUser";
import { useNavigate } from "react-router-dom";

export const WishListPage = () => {
  const toast = useToaster();
  const navigate = useNavigate();
  const { data, isLoading } = useGetWishlistQuery();
  const [addToCart] = useAddToCartMutation();
  const [removeWishlistItem] = useRemoveWishlistItemMutation();

  const { wishlist } = data || { wishlist: [] };
  console.log(wishlist);

  const handleAddToCart = async (id, color) => {
    try {
      const response = await addToCart({
        productId: id,
        color,
      }).unwrap();
      toast("Success", response?.message, "#22c55e");
    } catch (error) {
      console.log();
      if (error.status == 409) {
        toast("Error", error?.data?.message, "#f97316");
      } else {
        console.log(error);
        toast("Error", "An Error Occured Please try again later..", "#ff0000");
      }
    }
  };

  const handleRemove = async (productId, variantId) => {
    try {
      console.log(productId);
      await removeWishlistItem({ productId, variantId }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarUser />
      <SecondNavbarUser />
      {wishlist?.length > 0 ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlist?.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>
                      <Card className="p-4 w-full">
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="flex-shrink-0">
                            <img
                              onClick={() => navigate(`/product-details/${product?.productId}`)}
                              className="h-24 w-24 object-contain rounded-md"
                              src={product?.variant?.images[0]}
                              alt={product?.productName}
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium line-clamp-1">
                              {product?.productName}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {product?.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </TableCell>
                    <TableCell className="text-lg font-semibold">
                      {product?.discountedPrice ? (
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 line-through">
                            ₹{product?.price?.toFixed(2)}
                          </p>
                          <p className="text-lg text-green-600 font-bold">
                            ₹{product?.discountedPrice?.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-lg text-gray-800 font-bold">
                          ₹{product?.price?.toFixed(2)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() =>
                            handleRemove(
                              product?.productId,
                              product?.variant?._id
                            )
                          }
                        >
                          Remove
                        </Button>
                        <Button
                          onClick={() =>
                            handleAddToCart(
                              product?.productId,
                              product?.variant?.color
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      ) : (
        <Card className="w-full mt-10 max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Your Wishlist</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
            <p className="text-center text-muted-foreground">
              Items added to your wishlist will appear here. Start adding items
              you love!
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => navigate("/product-list")}
              className="flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Start Shopping</span>
            </Button>
          </CardFooter>
        </Card>
      )}
      <FooterUser />
    </div>
  );
};
