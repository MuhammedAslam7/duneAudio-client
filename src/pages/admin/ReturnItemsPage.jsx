import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarAdmin } from '@/components/admin/layouts/SidebarAdmin';
import { NavbarAdmin } from '@/components/admin/layouts/NavbarAdmin';
import { useGetReturnOrdersQuery, useUpdateReturnStatusMutation } from '@/services/api/admin/adminApi';

export const ReturnItemsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState("dark");
  const [updateReturnStatus] = useUpdateReturnStatusMutation()
  const { data, isLoading } = useGetReturnOrdersQuery();
  const { orders } = data || { orders: [] };

  const handleReturn = async(orderId, itemId, result) => {
    try {
      await updateReturnStatus({orderId, itemId, result}).unwrap()
      
    } catch (error) {
      console.log(error)
      
    }
  };

 
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1 flex flex-col overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="RETURN ORDERS"
        />
        
        <div className="p-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              ) : orders.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No return orders found</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                            <p className="font-medium dark:text-white">{order._id.slice(-8)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                            <p className="font-medium dark:text-white">{formatDate(order.orderAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                            <p className="font-medium dark:text-white capitalize">{order.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                            <div className="font-medium dark:text-white">
                              {formatPrice(order.payableAmount)}
                              {order.totalDiscount > 0 && (
                                <span className="text-green-600 text-sm ml-2">
                                  (-{formatPrice(order.totalDiscount)})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="divide-y dark:divide-gray-700">
                        {order.products.map((product) => (
                          <div key={product._id} className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="w-24 h-24 flex-shrink-0">
                                <img
                                  src={product.productId.variants.find(v => v._id === product.variantId)?.images[0] || product.productId.thumbnailImage}
                                  alt={product.productId.productName}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>

                              {/* Product Details */}
                              <div className="flex-grow">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {product.productId.productName}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {product.productId.description}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-4">
                                  <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Price: </span>
                                    <span className="font-medium dark:text-white">
                                      {formatPrice(product.productId.discountedPrice || product.productId.price)}
                                      {product.productId.discountedPrice && (
                                        <span className="text-sm text-gray-500 line-through ml-2">
                                          {formatPrice(product.productId.price)}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Quantity: </span>
                                    <span className="font-medium dark:text-white">{product.quantity}</span>
                                  </div>
                                  <div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      product.itemStatus === 'Return Requested' ? 'bg-orange-100 text-orange-800' :
                                      product.itemStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {product.itemStatus}
                                    </span>
                                  </div>
                                </div>
                                {product.itemReturnReason && (
                                  <div className="mt-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Return Reason: </span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{product.itemReturnReason}</span>
                                  </div>
                                )}
                                
                                {product.itemStatus === 'Return Requested' && (
                                  <div className="mt-4 flex gap-3">
                                    <Button
                                      onClick={() => handleReturn(order._id, product._id, "Returned")}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Accept Return
                                    </Button>
                                    <Button
                                      onClick={() => handleReturn(order._id, product._id, "Delivered")}
                                      variant="destructive"
                                    >
                                      Decline Return
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Order Status: </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.orderStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Payment Status: </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};


