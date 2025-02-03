import { useState, useEffect } from "react";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { Card, CardContent, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, PlusIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToaster } from "@/utils/Toaster";
import {
  useGetAllProductsQuery,
  useUpdateProductStatusMutation,
} from "@/services/api/admin/adminApi";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/admin/modals/ConfirmDilalog";

export function ProductPage() {
  const toast = useToaster();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([])
  const [totalPage, setTotalPage] = useState()
  const [currentPage, setCurrentPage] = useState()
  const [limit] = useState(6);
  const { data, isLoading, error } = useGetAllProductsQuery({page, limit});

  useEffect(() => {
  if (data && data.products && data.currentPage && data.totalPage && data.totalProducts) {
    setProducts(data?.products)
    setTotalPage(data?.totalPage)
    setCurrentPage(data?.currentPage)
  }
}, [data]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateProductStatus] = useUpdateProductStatusMutation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleToggleClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  const confirmToggleProduct = async () => {
    if (selectedProduct) {
      try {
        await updateProductStatus({
          id: selectedProduct?._id,
          listed: !selectedProduct?.listed,
        }).unwrap();

        toast(
          "Success",
          `${selectedProduct?.productName} ${
            selectedProduct?.listed ? "unlisted" : "listed"
          } successfully.`,
          "#22c55e"
        );
      } catch (error) {
        console.error("Failed to update product status:", error);

        toast(
          "Error",
          "Failed to update product status. Please try again.",
          "#ff0000"
        );
      }
    }

    setShowModal(false);
    setSelectedProduct(null);
  };

  const cancelToggle = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        Error loading products.
      </div>
    );

    const handleNextPage = () => {
      if (page < totalPage) setPage(page + 1);
    };
  
    const handlePreviousPage = () => {
      if (page > 1) setPage(page - 1);
    };
  

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1   ">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="PRODUCTS MANAGEMENT"
        />
        <div className="p-6 space-y-8">
          <div className="flex justify-end items-center">
            <Button
              onClick={() => navigate("/admin/products/add-products")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
          <Card className="shadow-lg">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-orange-600 uppercase">
                      Image
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Product
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Category
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Brand
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Price
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Stock
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-orange-600 uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product?._id}>
                      <TableCell>
                        <img
                          src={product?.thumbnailImage}
                          alt={product?.name}
                          className="w-12 h-12 object-contain rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product?.productName}
                      </TableCell>
                      <TableCell>{product?.category?.name}</TableCell>
                      <TableCell>{product?.brand?.name}</TableCell>
                      <TableCell>₹ {product?.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="grid grid-cols-3 gap-y-1 gap-x-0">
                              {product?.variants?.map((variant, index) => (
                                
                                <div
                                key={index}
                                className="w-7 h-7 rounded-lg border flex items-center justify-center"
                                style={{ backgroundColor: variant?.color }}
                              >
                                <span
                                  className={`text-xs px-1 rounded ${
                                    variant?.color === "White" || variant?.color == "white" ? "text-black" : "text-white"
                                  }`}
                                >
                                  {variant.stock}
                                </span>
                              </div>
                                  
                                
                              ))}
                            </div>  
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={product?.listed ? "success" : "secondary"}
                          className={`font-semibold bh bg-red-700 ${
                            product?.listed ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {product?.listed ? "Listed" : "Unlisted"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            className="h-8 w-8"
                            title="Add Variants"
                            onClick={() =>
                              navigate(
                                `/admin/products/add-variants/${product?._id}`,
                                { state: { productName: product?.productName } }
                              )
                            }
                          >
                            <PlusIcon />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            title="Edit Product"
                            onClick={() =>
                              navigate(
                                `/admin/products/edit-products/${product?._id}`
                              )
                            }
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit product</span>
                          </Button>
                          <Switch
                            checked={product?.listed}
                            onCheckedChange={() => handleToggleClick(product)}
                            className="data-[state=checked]:bg-green-500"
                          >
                            <span className="sr-only">
                              {product?.listed
                                ? "Unlist product"
                                : "List product"}
                            </span>
                          </Switch>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPage}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={page === totalPage}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={showModal}
        onClose={cancelToggle}
        onConfirm={confirmToggleProduct}
        title="Confirm Action"
        description={`Are you sure you want to ${
          selectedProduct?.listed ? "unlist" : "list"
        } this product? This action can be reversed later.`}
      />
    </div>
  );
}
