import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetOffersQuery,
  useUpdateOfferStatusMutation,
  useDeleteOfferMutation,
} from "@/services/api/admin/adminApi";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/modals/ConfirmDilalog";
import { MdDelete } from "react-icons/md";

export const OfferPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();
  const { data: offers, isLoading } = useGetOffersQuery();
  const [updateOfferStatus] = useUpdateOfferStatusMutation();
  const [deleteOffer] = useDeleteOfferMutation();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleToggle = (offer) => {
    setSelectedOffer(offer);
    setShowModal(true);
  };

  const cancelToggle = () => {
    setShowModal(false);
    setSelectedOffer(null);
  };

  const confirmToggle = async () => {
    if (selectedOffer) {
      try {
        await updateOfferStatus({
          offerId: selectedOffer._id,
          status: !selectedOffer?.listed,
        }).unwrap();
        setSelectedOffer(null);
        setShowModal(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async (offer) => {
    setSelectedOffer(offer);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setSelectedOffer(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      await deleteOffer({ offerId: selectedOffer._id }).unwrap();
      setSelectedOffer(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="OFFER PAGE"
        />

        <div className="p-6 space-y-8">
          <div className="flex justify-end items-center">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate("/admin/offers/add-offer")}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Offers
            </Button>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 dark:bg-gray-800">
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                Offer List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-orange-600 uppercase">
                      Title
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Discount
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Duration
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Products
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Categories
                    </TableHead>
                    <TableHead className="text-right text-orange-600 uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers?.map((offer) => (
                    <TableRow key={offer._id}>
                      <TableCell className="font-medium">
                        {offer.title}
                      </TableCell>
                      <TableCell>
                        {offer.discountValue}
                        {offer.discountType === "percentage" ? "%" : " Rs"}
                      </TableCell>
                      <TableCell>
                        <p>
                          {offer.startDate
                            ? format(
                                new Date(offer?.startDate),
                                "d-M-yyyy h:mm a"
                              )
                            : "Invalid Date"}
                        </p>
                        <p>
                          {offer?.endDate
                            ? format(
                                new Date(offer?.endDate),
                                "d-M-yyyy h:mm a"
                              )
                            : "Invalid Date"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            offer.listed
                              ? new Date() < new Date(offer?.startDate)
                                ? "bg-blue-500 text-white"
                                : new Date() <= new Date(offer?.endDate)
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                              : "bg-gray-500 text-white"
                          }
                        >
                          {offer.listed
                            ? new Date() < new Date(offer?.startDate)
                              ? `Offer starts at ${new Date(
                                  offer.startDate
                                ).toLocaleString()}`
                              : new Date() <= new Date(offer?.endDate)
                              ? "Active"
                              : "Expired"
                            : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {offer.products.map((product, index) => (
                          <React.Fragment
                            key={product.id || product.productName || index}
                          >
                            {product.productName}
                            <br />
                          </React.Fragment>
                        ))}
                      </TableCell>
                      <TableCell>
                        {offer.categories.map((category, index) => (
                          <React.Fragment
                            key={category.id || category.name || index}
                          >
                            {category.name}
                            <br />
                          </React.Fragment>
                        ))}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleDelete(offer)}
                          >
                            <MdDelete />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              navigate(`/admin/offers/edit-offer/${offer._id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit offer</span>
                          </Button>
                          <Switch
                            checked={offer?.listed}
                            onCheckedChange={() => handleToggle(offer)}
                            className="data-[state=checked]:bg-green-500"
                          >
                            <span className="sr-only">
                              {offer.listed
                                ? "Deactivate offer"
                                : "Activate offer"}
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
        </div>
      </main>
      <ConfirmDialog
        isOpen={showModal}
        onClose={cancelToggle}
        onConfirm={confirmToggle}
        title="Confirm Action"
        description={`Are you sure you want to ${
          selectedOffer?.listed ? "unlist" : "list"
        } this offer`}
      />
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Action"
        description={`Are you sure you want to delete this offer..This will be permenently delete from the applied products and categories`}
      />
    </div>
  );
};
