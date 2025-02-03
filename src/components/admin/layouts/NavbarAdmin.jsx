import {
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useSelector } from "react-redux";
import { useAdminlogoutMutation } from "@/services/api/user/authApi";
import { adminLogout } from "@/redux/slices/AdminSlice";
import { useDispatch } from "react-redux";

export function NavbarAdmin({ isDarkMode, setIsDarkMode, pageName }) {
  const adminEmail = useSelector((state) => state.admin.email);
  const [adminlogout, { isLoading }] = useAdminlogoutMutation();

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await adminlogout().unwrap();
      console.log("Logout");
      dispatch(adminLogout());

      window.location.href = "/admin/sign-in";
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors duration-300 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {pageName}
        </h1>
        <div className="flex items-center gap-4">
        
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <User className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoading ? "Logging Out..." : "Logout"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-blue-600"
            />
            {isDarkMode ? (
              <Moon className="h-4 w-4 text-gray-400" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-400" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
