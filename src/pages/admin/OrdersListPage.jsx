import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "@/services/api/admin/adminApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const OrdersListPage = () => {
    const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [orders, setOrders] = useState([]);
  const { data, isLoading } = useGetAllOrdersQuery();

  useEffect(() => {
    if (data?.orders) {
      setOrders(data.orders);
      console.log(data?.orders);
    }
  }, [data?.orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      case "Shipped":
        return "blue";
      default:
        return "gray";
    }
  };
  if(isLoading) {
    return <h1 className="text-lg font-sans">Order Loading...</h1>
  }

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="ORDERS PAGE"
        />

        <div>
          <Card className="m-4">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="uppercase">
                    <TableHead className=" text-orange-600">Products</TableHead>
                    <TableHead className=" text-orange-600">
                      Price & quantity
                    </TableHead>
                    <TableHead className=" text-orange-600">
                      Paid Amount
                    </TableHead>
                    <TableHead className=" text-orange-600">
                      Discount
                    </TableHead>
                    <TableHead className=" text-orange-600">Address</TableHead>
                    <TableHead className=" text-orange-600">
                      order Status
                    </TableHead>
                    <TableHead className=" text-orange-600">
                      Payment Method
                    </TableHead>
                    <TableHead className=" text-orange-600">actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order?.orderId}>
                      <TableCell>
                        {order?.products?.map((product, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 mt-3 object-contain rounded-sm"
                          >
                            <img
                              src={product?.variant?.images[0]}
                              className="h-7 w-7"
                            />

                            <p>{product?.productName}</p>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {order?.products.map((product, index) => (
                          <div key={index}>
                            <p>
                              {product?.price} X {product?.quantity} :{" "}
                              {product?.price * product?.quantity}
                            </p>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>₹{order?.payableAmount}</TableCell>
                      <TableCell>₹{order?.totalDiscount}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <p>{order?.address?.fullName}</p>
                          <p>{order?.address?.phone}</p>
                          <p>{order?.address?.country}</p>
                          <p>{order?.address?.state}</p>
                          <p>{order?.address?.pincode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: getStatusColor(order?.orderStatus),
                            color: "white",
                          }}
                        >
                          {order?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{order?.paymentMethod}</TableCell>
                      <TableCell>
                        <Button className="hover:bg-green-500"
                            onClick={() => navigate(`/admin/orders/order-manage/${order?.orderId}`)}
                            >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
