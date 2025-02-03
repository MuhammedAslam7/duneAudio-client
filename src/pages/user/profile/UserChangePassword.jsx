import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { SidebarProfile } from "@/components/user/layouts/SidebarProfile";
import { ConfirmationModal } from "@/components/user/modals/ConfirmationModal";
import { useToaster } from "@/utils/Toaster";
import { useChangePasswordMutation } from "@/services/api/user/userApi";
import { FooterUser } from "@/components/user/layouts/FooterUser";

export function UserChangePassword() {
  const toast = useToaster();
  const [changePassword] = useChangePasswordMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setformData] = useState({
    password: "",
    newPassword: "",
    newPassword2: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password || !formData.newPassword || !formData.newPassword2) {
      return toast("Error", "Fill the all fields", "#ff0000");
    }
    if (formData.newPassword !== formData.newPassword2) {
      return toast("Error", "New Password are Not Matching", "#ff0000");
    }
    setModalOpen(true);
  };

  const confirmChangePassword = async () => {
    const password = formData.password;
    const newPassword = formData.newPassword;
    try {
      await changePassword({ password, newPassword }).unwrap();
      toast("success", "Password Updated Successfully", "#22c55e");
      setformData({
        password: "",
        newPassword: "",
        newPassword2: "",
      });
    } catch (error) {
      console.log(error);
      toast("Error", error?.data?.message, "#ff0000");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavbarUser />
      <SecondNavbarUser />
      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
          <SidebarProfile heading="Password Page" />
          <div className="flex-1 space-y-8">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center uppercase">
                    Change Your Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-1">
                      <div className="space-y-2">
                        <Label htmlFor="password">Current Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Enter New-Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="Password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword2">
                          Confirm New-Password
                        </Label>
                        <Input
                          id="newPassword2"
                          name="newPassword2"
                          type="password"
                          value={formData.newPassword2}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Change Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmChangePassword}
        title="Are You Sure"
        message="Once you save this password, It will be permanently added to your account for future use."
        confirmText="Yes, Change it"
        cancelText="No, Cancel"
      />
      <FooterUser />
    </div>
  );
}
