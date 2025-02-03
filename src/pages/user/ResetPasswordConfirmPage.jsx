import { useState } from "react";
import { useConfirmResetPasswordMutation } from "@/services/api/user/authApi";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const ResetPasswordConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const email = location.state?.email;
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [confirmResetPassword, { isLoading }] =
    useConfirmResetPasswordMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const validation = () => {
    let newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    // } else if (!passwordRegex.test(formData.password)) {
    //   newErrors.password = "Password must be at least 8 characters, with uppercase, lowercase, number, and special character";
    // }

    // Confirm password validation
    if (!formData.password2.trim()) {
      newErrors.password2 = "Confirm password is required";
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsConfirmModalOpen(true);
  };
  const confirmSubmit = async () => {
    setIsConfirmModalOpen(false);
    try {
      const newPassword = formData.password;
      await confirmResetPassword({ newPassword, email }).unwrap();
      navigate("/sign-in");
      setErrors({});
    } catch (error) {
      setErrors({ apiError: error?.data?.message });
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {" "}
        <div className="bg-white p-8 rounded-lg border">
          <form
            className=" flex flex-col w-full justify-between"
            onSubmit={handleSubmit}
          >
            <div className="mb-3 flex justify-center items-center flex-col">
              <h3 className="text-gray-800 text-2xl font-bold flex items-center justify-center h-full">
                Reset Your Password
              </h3>
              {/* on success
            {successMessage && (
              <span className="" style={{ color: "green" }}>
                {successMessage}
              </span>
            )} */}

              {errors.apiError && (
                <span className="text-red-500 self-center mt-1 text-lg font-semibold">
                  {errors.apiError}
                </span>
              )}
            </div>

            <div className=" flex flex-col space-y-3">
              {" "}
              <div>
                <label className="text-gray-800 text-sm mb-1 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-3 pr-8 py-1.5 rounded-md outline-black"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-3 cursor-pointer"
                    viewBox="0 0 128 128"
                    onClick={togglePasswordVisibility}
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
                {errors.password && (
                  <span style={{ color: "red" }}>{errors.password}</span>
                )}
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password2"
                    type={passwordVisible ? "text" : "password"}
                    value={formData.password2}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-3 pr-8 py-1.5 rounded-md outline-black"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-3 cursor-pointer"
                    viewBox="0 0 128 128"
                    onClick={togglePasswordVisibility}
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
                {errors.password2 && (
                  <span style={{ color: "red" }}>{errors.password2}</span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full py-2 px-4 text-sm font-semibold rounded-md bg-black hover:bg-black-700 text-white focus:outline-none"
              >
                RESET PASSWORD
              </button>
            </div>
          </form>
        </div>
      </div>
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reset Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to continue with your new Password
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
