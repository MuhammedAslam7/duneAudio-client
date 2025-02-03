import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminSignInMutation } from "@/services/api/user/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/redux/slices/AdminSlice";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [adminSignIn, { isLoading }] = useAdminSignInMutation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validation = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email is Invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    // else if(!passwordRegex.test(formData.password)) {
    //   newErrors.password = "Invalid password format"
    // }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await adminSignIn(formData).unwrap();
      navigate("/admin/products");
      const admin = response?.data?.admin;
      const token = response?.accessToken;
      dispatch(setAdmin({ admin }));
      localStorage.setItem("adminToken", token);
      setErrors({});
    } catch (error) {
      console.log(error);
      setErrors({ apiError: error?.data?.message });
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      {" "}
      <div
        className="w-full max-w-md bg-black p-8 rounded-lg"
        style={{ border: "2px solid gray" }}
      >
        <form
          className=" flex flex-col w-full justify-between"
          onSubmit={handleSubmit}
        >
          <div className="mb-3 flex justify-center items-center flex-col">
            <h3 className="text-white text-2xl font-bold flex items-center justify-center h-full">
              Admin Signin
            </h3>
            <span className="text-gray-200 text-xs mt-3">
              Only Admins are allowed to Login through this Interface
            </span>

            <div className="w-full h-px bg-yellow-500 my-4"></div>
            {/* on success
            {successMessage && (
              <span className="" style={{ color: "green" }}>
                {successMessage}
              </span>
            )} */}

            {errors.apiError && (
              <span className="text-red-500 self-center">
                {errors.apiError}
              </span>
            )}
          </div>

          <div className=" flex flex-col space-y-3">
            {" "}
            <div>
              <label className="text-gray-200 text-sm mb-1 block">
                Email Id
              </label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-black border border-gray-300 w-full text-sm text-gray-200 pl-3 pr-8 py-1.5 rounded-md outline-white"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-4 h-4 absolute right-3"
                  viewBox="0 0 682.667 682.667"
                >
                  <defs>
                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                      <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                    </clipPath>
                  </defs>
                  <g
                    clipPath="url(#a)"
                    transform="matrix(1.33 0 0 -1.33 0 682.667)"
                  >
                    <path
                      fill="none"
                      strokeMiterlimit="10"
                      strokeWidth="40"
                      d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                      data-original="#000000"
                    ></path>
                    <path
                      d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </div>
              {errors.email && (
                <span className="text-red-600 font-medium">{errors.email}</span>
              )}
            </div>
            <div>
              <label className="text-gray-200 text-sm mb-1 block">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-black border border-gray-300 w-full text-sm text-gray-200 pl-3 pr-8 py-1.5 rounded-md outline-white"
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
                <span className="text-red-600 font-medium">
                  {errors.password}
                </span>
              )}
            </div>
            <span className=" text-gray-200 self-end text-xs font-medium">
              Forgot Password?
            </span>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 text-sm font-semibold rounded-md bg-white hover:bg-black-700 text-black focus:outline-none"
            >
              {isLoading ? "Signing.. In" : "Sign In"}
            </button>
          </div>

          <p className="text-gray-200 text-sm mt-3 text-center">
            Dont have an account?{" "}
            <Link
              href="javascript:void(0);"
              className="text-blue-600 font-semibold hover:underline ml-1"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
