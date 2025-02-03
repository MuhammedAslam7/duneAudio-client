"use client";

import { useState, useEffect } from "react";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { useToaster } from "@/utils/Toaster";
// Importing the API hook
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/services/api/admin/adminApi";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/admin/modals/ConfirmDilalog";

export function UsersPage() {
  const toast = useToaster();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { data, isLoading, error } = useGetAllUsersQuery();
  const users = data?.users;

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateUserStatus] = useUpdateUserStatusMutation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleToggleClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };
  const confirmToggleUser = async () => {
    if (selectedUser) {
      try {
        console.log(selectedUser.active);
        await updateUserStatus({
          id: selectedUser._id,
          active: !selectedUser.active,
        }).unwrap();

        toast(
          "Success",
          `${selectedUser.username} ${
            selectedUser.active ? "UnBlocked" : "Blocked"
          } successfully.`,
          "#22c55e"
        );
      } catch (error) {
        console.error("Failed to update User status:", error);

        toast(
          "Error",
          "Failed to update category status. Please try again.",
          "#ff0000"
        );
      }
    }

    setShowModal(false);
    setSelectedUser(null);
  };

  const cancelToggle = () => {
    setShowModal(false);
    setSelectedUser(null);
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
        Error loading Categories
      </div>
    );

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="USERS MANAGEMENT"
        />
        <div className="p-6 space-y-8">
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 dark:bg-gray-800">
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                Users List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-orange-600 uppercase">
                      USERS
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      MOBILE
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      EMAIL
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      JOINED ON
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
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.joinedDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.active ? "success" : "secondary"}
                          className={`font-semibold bh bg-red-700 ${
                            user.active ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {user.active ? "Active" : "Blocked"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              navigate(
                                `/admin/products/edit-products/${category._id}`
                              )
                            }
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit category</span>
                          </Button> */}
                          <Switch
                            checked={user.active}
                            onCheckedChange={() => handleToggleClick(user)}
                            className="data-[state=checked]:bg-green-500"
                          >
                            <span className="sr-only">
                              {user.active ? "Block User" : "Unblock User"}
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
        onConfirm={confirmToggleUser}
        title="Confirm Action"
        description={`Are you sure you want to ${
          selectedUser?.active ? "Block" : "UnBlock"
        } this User? This action can be reversed later`}
      />
    </div>
  );
}
