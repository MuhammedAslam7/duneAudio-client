import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserHomeQuery } from "@/services/api/user/userApi";
import { ProductCard } from "@/components/user/layouts/ProductCard";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { FooterUser } from "@/components/user/layouts/FooterUser";

export function UserHomePage() {
  const { data, isLoading, error } = useUserHomeQuery();

  const topCard = data?.slice(0, 4);
  const downCard = data?.slice(4);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  if (error) {
    return <h3>Erron on loading Home page, please try later..</h3>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarUser />
      <SecondNavbarUser />
      <section className="relative">
        <img
          src="/banners/c-d-x-HwwQZZdQHtc-unsplash.jpg"
          alt="Hero headphones"
          className="h-[605px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container flex items-center mx-auto h-full px-4">
            <div className="flex w-[400px] mt-20 bg-black h-[200px] bg-opacity-40 ml-[200px] flex-col justify-center items-center text-white">
              <h1 className="text-4xl text-white font-bold">TOP DEAL TODAY!</h1>
              <p className="mt-2 text-2xl">FRAGRANCE</p>
              <span className=" mt-2 text-xs">
                Get upto <span className="text-yellow-500">50%</span> off Today
                Only
              </span>
              <Button className="mt-6 w-fit bg-red-600 hover:bg-red-700">
                SHOP NOW
              </Button>
            </div>
          </div>
        </div>
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 m-auto max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topCard?.map((product) => (
              <ProductCard
                key={product?._id}
                productId={product?._id}
                variantId={product?.variants[0]._id}
                productName={product?.productName}
                description={product?.description}
                price={product?.price}
                thumbnailImage={product?.thumbnailImage}
                discountedPrice={product?.discountedPrice}

              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <img
          src="/banners/hakii-official-9Fu5O1sR4mc-unsplash.jpg"
          alt="Hero headphones"
          className="h-[575px] w-full object-cover"
        />
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-4">
          <Button className="bg-blue-600 px-6 py-2 text-white rounded">
            NEW ARRIVAL
          </Button>
          <h2 className="text-center text-3xl font-bold text-white">
            TOP DEAL
          </h2>
          <h2 className="text-center text-3xl font-bold text-white">
            NEW ACCESSORIES
          </h2>
          <Button className="px-6 py-3 bg-yellow-500 text-black font-bold rounded">
            SHOP NOW
          </Button>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Listen to the Noise
          </h2>
          <div className="grid grid-cols-1 max-w-7xl m-auto gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {downCard?.map((product) => (
              <ProductCard
                key={product?._id}
                productId={product?._id}
                variantId={product?.variants[0]._id}
                productName={product?.productName}
                description={product.description}
                price={product?.price}
                thumbnailImage={product?.thumbnailImage}
                discountedPrice={product?.discountedPrice}
                // images={product.images}
              />
            ))}
          </div>
        </div>
      </section>
      <FooterUser />
    </div>
  );
}
