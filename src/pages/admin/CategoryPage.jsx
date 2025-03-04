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
import { Plus, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Importing the API hook
import {
  useGetAllCategoriesQuery,
  useUpdateCategoryStatusMutation,
  useUpdateCategoryMutation, // New mutation hook for updating categories
} from "@/services/api/admin/adminApi";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/admin/modals/ConfirmDilalog";
import { EditModal } from "@/components/admin/modals/EditModal";
import { useToaster } from "@/utils/Toaster";

export function CategoryPage() {
  const toast = useToaster();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const {
    data: categories = [],
    isLoading,
    error,
  } = useGetAllCategoriesQuery();

  console.log(categories);

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateCategoryStatus] = useUpdateCategoryStatusMutation();
  const [updateCategory] = useUpdateCategoryMutation(); // New mutation hook
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleToggleClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };
  const confirmToggleCategory = async () => {
    if (selectedCategory) {
      try {
        await updateCategoryStatus({
          id: selectedCategory?._id,
          listed: !selectedCategory?.listed,
        }).unwrap();

        toast(
          "Success",
          `${selectedCategory?.name} Category ${
            selectedCategory?.listed ? "Unlisted" : "Listed"
          } Successfully`,
          "#22c55e"
        );
      } catch (error) {
        console.error("Failed to update category status:", error);

        toast(
          "Error",
          "Failed to update category status. Please try again.",
          "#ff0000"
        );
      }
    }

    setShowModal(false);
    setSelectedCategory(null);
  };

  const cancelToggle = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleSave = async (data) => {
    try {
      await updateCategory({
        id: selectedCategory._id,
        ...data,
      }).unwrap();

      toast("Success", "Category updated successfully.", "#22c55e");
    } catch (error) {
      console.error("Failed to update category:", error);

      toast("Error", "Failed to update category. Please try again", "#ff0000");
    }

    setShowEditModal(false);
    setSelectedCategory(null);
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
          pageName="CATEGORY MANAGEMENT"
        />
        <div className="p-6 space-y-8">
          <div className="flex justify-end items-center">
            <Button
              onClick={() => navigate("/admin/category/add-category")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Categories
            </Button>
          </div>
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 dark:bg-gray-800">
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                Category List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-orange-600 uppercase">
                      Categories
                    </TableHead>
                    <TableHead className="text-orange-600 uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-orange-600 uppercase ">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((category) => (
                    <TableRow key={category?._id}>
                      <TableCell className="font-medium">
                        {category?.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category?.listed ? "success" : "secondary"}
                          className={`font-semibold bh bg-red-700 ${
                            category?.listed ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {category?.listed ? "Listed" : "Unlisted"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit category</span>
                          </Button>
                          <Switch
                            checked={category?.listed}
                            onCheckedChange={() => handleToggleClick(category)}
                            className="data-[state=checked]:bg-green-500"
                          >
                            <span className="sr-only">
                              {category?.listed
                                ? "Unlist category"
                                : "List category"}
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
        onConfirm={confirmToggleCategory}
        title="Confirm Action"
        description={`Are you sure you want to ${
          selectedCategory?.listed ? "unlist" : "list"
        } this category? This action can be reversed later.`}
      />
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        initialData={selectedCategory}
      />
    </div>
  );
}
