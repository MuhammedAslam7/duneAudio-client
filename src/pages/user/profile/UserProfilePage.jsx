import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { FooterUser } from "@/components/user/layouts/FooterUser";
import { useState, useEffect } from "react";
import { SidebarProfile } from "@/components/user/layouts/SidebarProfile";
import { ConfirmationModal } from "@/components/user/modals/ConfirmationModal";
import { useProfileDataQuery } from "@/services/api/user/userApi";
import { ProfileEditModal } from "@/components/user/modals/ProfileEditModal";
import { useUpdateProfileMutation } from "@/services/api/user/userApi";
import { useToaster } from "@/utils/Toaster";

export function UserProfilePage() {
  const toast = useToaster();
  const { data: profileData, isLoading } = useProfileDataQuery();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();
  const [data, setData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (profileData) {
      setData({
        username: profileData.username || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
      });
    }
  }, [profileData]);
  const handleEdit = () => {
    setModalData(data);
    setModalOpen(true);
  };
  const handleSave = (updatedData) => {
    setData(updatedData);
    setModalOpen(false);
  };

  const saveChanges = (e) => {
    e.preventDefault();
    setConfirmModalOpen(true);
  };

  const confirmSaveChanges = async () => {
    try {
      await updateProfile(data).unwrap();
      setConfirmModalOpen(false);
      toast("Success", "Profile Details Updated Successfully", "#22c55e");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!profileData) {
    return <h1>Failed to load profile data.</h1>;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarUser />
      <SecondNavbarUser />
      <div className="max-w-5xl mx-auto flex mt-8">
        <SidebarProfile heading="User Profile" />
        <div className="flex-1">
          <Card className="p-6 bg-white rounded-lg shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Your Profile
                </h2>
                <p className="text-gray-600">
                  Manage your personal information
                </p>
              </div>
              <div className="relative group inline-block cursor-pointer">
                <Edit
                  className="h-7 w-7"
                  title="Edit Profile"
                  onClick={handleEdit}
                />
                <span className="absolute invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  Edit Profile
                </span>
              </div>
            </div>
            <div className="grid md:grid-cols-1 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="username"
                      value={data?.username}
                      className="pr-10"
                      onChange={(e) =>
                        setData({ ...data, [e.target.name]: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      value={data?.email}
                      className="pr-10"
                      onChange={(e) =>
                        setData({ ...data, [e.target.name]: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Input
                      value={data?.phone}
                      name="phone"
                      onChange={(e) =>
                        setData({ ...data, [e.target.name]: e.target.value })
                      }
                      readOnly
                      type="number"
                      className="pr-10"
                    />
                  </div>
                </div>

                <Button
                  onClick={saveChanges}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  APPLY CHANGES
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <FooterUser />
      <ProfileEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        modalData={modalData}
        setModalData={setModalData}
        title="Edit Profile"
        description="Edit your profile details below and save changes."
      />
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmSaveChanges}
        title="Are You Sure"
        message="Once you save this Details, It will be permanently added to your account for future use."
        confirmText="Yes, Change it"
        cancelText="No, Cancel"
      />
    </div>
  );
}
