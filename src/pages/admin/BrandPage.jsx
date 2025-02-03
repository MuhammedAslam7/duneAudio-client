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
  useGetAllBrandsQuery,
  useUpdateBrandStatusMutation,
  useUpdateBrandMutation,
} from "@/services/api/admin/adminApi";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/admin/modals/ConfirmDilalog";
import { EditModal } from "@/components/admin/modals/EditModal";
import { useToaster } from "@/utils/Toaster";

export function BrandPage() {
  const toast = useToaster();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { data: brands = [], isLoading, error } = useGetAllBrandsQuery();

  console.log(brands);

  const [showModal, setShowModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [updateCategoryStatus] = useUpdateBrandStatusMutation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateBrand] = useUpdateBrandMutation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleToggleClick = (brand) => {
    setSelectedBrand(brand);
    setShowModal(true);
  };
  const confirmToggleCategory = async () => {
    if (selectedBrand) {
      try {
        await updateCategoryStatus({
          id: selectedBrand?._id,
          listed: !selectedBrand?.listed,
        }).unwrap();

        toast(
          "Success",
          `Category ${
            selectedBrand?.listed ? "unlisted" : "listed"
          } successfully.`,
          "#22c55e"
        );
      } catch (error) {
        console.error("Failed to update brand status:", error);

        toast(
          "Error",
          "Failed to update brand status. Please try again.",
          "#ff0000"
        );
      }
    }

    setShowModal(false);
    setSelectedBrand(null);
  };

  const cancelToggle = () => {
    setShowModal(false);
    setSelectedBrand(null);
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setShowEditModal(true);
  };
  const handleSave = async (data) => {
    try {
      await updateBrand({
        id: selectedBrand._id,
        ...data,
      }).unwrap();
      toast("Success", "Brand Updated Successfully", "#22c55e");
    } catch (error) {
      console.error("Failed to update Brand:", error);
      toast("Error", "Failed to update category. Please try again.", "#ff0000");
    }
    setShowEditModal(false);
    setSelectedBrand(null);
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
        Error loading Brands
      </div>
    );

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="BRAND MANAGEMENT"
        />
        <div className="p-6 space-y-8">
          <div className="flex justify-end items-center">
            <Button
              onClick={() => navigate("/admin/brands/add-brands")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Brand
            </Button>
          </div>
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 dark:bg-gray-800">
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                Brand List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-orange-600 uppercase">
                      Brands
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
                  {brands.map((brand) => (
                    <TableRow key={brand?._id}>
                      <TableCell className="font-medium">
                        {brand?.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={brand?.listed ? "success" : "secondary"}
                          className={`font-semibold bh bg-red-700 ${
                            brand?.listed ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {brand?.listed ? "Listed" : "Unlisted"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(brand)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit brand</span>
                          </Button>
                          <Switch
                            checked={brand?.listed}
                            onCheckedChange={() => handleToggleClick(brand)}
                            className="data-[state=checked]:bg-green-500"
                          >
                            <span className="sr-only">
                              {brand?.listed ? "Unlist brand" : "List brand"}
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
          selectedBrand?.listed ? "unlist" : "list"
        } this brand? This action can be reversed later.`}
      />
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        initialData={selectedBrand}
      />
    </div>
  );
}
