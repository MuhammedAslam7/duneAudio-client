import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { SidebarProfile } from "@/components/user/layouts/SidebarProfile";
import { useAddAddressMutation } from "@/services/api/user/userApi";
import { ConfirmationModal } from "@/components/user/modals/ConfirmationModal";
import { useToaster } from "@/utils/Toaster";
import { useGetAddressQuery } from "@/services/api/user/userApi";
import { Edit } from "lucide-react";
import { ProfileEditModal } from "@/components/user/modals/ProfileEditModal";
import {
  useUpdateAddressMutation,
  useDeleteAddresssMutation,
} from "@/services/api/user/userApi";
import { MdDelete } from "react-icons/md";
import { FooterUser } from "@/components/user/layouts/FooterUser";

export function UserAddressPage() {
  const toast = useToaster();
  const { data: response = {}, isLoading } = useGetAddressQuery();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddresss] = useDeleteAddresssMutation();
  const addresses = Array.isArray(response.addresses) ? response.addresses : [];
  const [addAddress] = useAddAddressMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    landMark: "",
    pincode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !newAddress.fullName ||
      !newAddress.email ||
      !newAddress.phone ||
      !newAddress.country ||
      !newAddress.state ||
      !newAddress.city ||
      !newAddress.landMark ||
      !newAddress.landMark
    ) {
      toast("Error", "Fill the all fields", "#ff0000");
    } else {
      setModalOpen(true);
    }
  };

  const confirmAddAddress = async () => {
    try {
      await addAddress({ newAddress }).unwrap();
      toast("success", "Address added Successfully", "#22c55e");
      setNewAddress({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        landMark: "",
        pincode: "",
      });
      setModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (address) => {
    const { _id, ...editAddress } = address;
    setSelectedId(_id);
    setModalData(editAddress);
    setEditModalOpen(true);
  };
  const confirmChanges = async (updatedData) => {
    try {
      await updateAddress({ id: selectedId, updatedData }).unwrap();
      selectedId(null);
      toast("Success", "Address Updated Succesfully", "#22c55e");
    } catch (error) {
      console.log(error);
    }

    setEditModalOpen(false);
  };
  const handleDelete = (address) => {
    const { _id } = address;
    setSelectedId(_id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAddresss({ id: selectedId }).unwrap();
      toast("Success", "Address Deleted Successfully", "#22c55e");
      setDeleteModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavbarUser />
      <SecondNavbarUser />
      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
          <SidebarProfile heading="Address Page" />
          <div className="flex-1 space-y-8">
            <div className="grid gap-8 md:grid-cols-[1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={newAddress.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={newAddress.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={newAddress.country}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={newAddress.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="landMark">LandMark</Label>
                        <Input
                          id="landMark"
                          name="landMark"
                          value={newAddress.landMark}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={newAddress.pincode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Address
                    </Button>
                  </form>
                </CardContent>
              </Card>
              {isLoading ? (
                <h1 className="text-lg font-normal">
                  No Addresses Added Yet..
                </h1>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">YOUR ADDRESSES</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {addresses?.map((address) => (
                        <Card key={address?._id}>
                          <CardContent className="p-4 flex justify-between">
                            <div>
                              <p className="font-semibold">
                                {address?.fullName}
                              </p>
                              <p>{address?.email}</p>
                              <p>{address?.phone}</p>
                              <p>{`${address?.city}, ${address?.state}, ${address?.country}`}</p>
                              <p>{`Near ${address?.landMark}`}</p>
                              <p>{`Pincode: ${address?.pincode}`}</p>
                            </div>
                            <div>
                              <div className=" relative group inline-block cursor-pointer">
                                <Edit
                                  className="h-7 w-7"
                                  title="Edit Address"
                                  onClick={() => handleEdit(address)}
                                />
                                <span className="absolute invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                  Edit Address
                                </span>
                              </div>
                              <div className="relative group inline-block cursor-pointer">
                                <MdDelete
                                  className="h-8 w-8"
                                  title="Delete Address"
                                  onClick={() => handleDelete(address)}
                                />
                                <span className="absolute invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                  Delete Address
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAddAddress}
        title="Are You Sure"
        message="Once you save this address, it will be permanently added to your account for future use."
        confirmText="Yes, Add it"
        cancelText="No, Cancel"
      />
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Are You Sure"
        message="Once you Delete this address, it will be permanently delete from  your account"
        confirmText="Delete it"
        cancelText="Cancel"
      />
      <ProfileEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={confirmChanges}
        modalData={modalData}
        setModalData={setModalData}
        title="Edit Address"
        description="Edit your Address details below and save changes."
      />
      <FooterUser />
    </div>
  );
}
