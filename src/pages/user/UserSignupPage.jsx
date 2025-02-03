import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSignUpMutation } from "@/services/api/user/authApi";
import { useGoogleAuth } from "@/utils/GoogleAuth";

export const UserSignupPage = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  //rtk query mutation hook
  const [signup, { isLoading }] = useSignUpMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  //client side validation
  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // Validates 10-digit phone numbers
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, one uppercase, one lowercase, one digit, one special character
    const nameRegex = /^[a-zA-Z\s]{3,30}$/; // Only letters and spaces, min 3, max 30 characters
    //Name validation
    if (!formData.username.trim()) {
      newErrors.username = "Name is Required";
    } else if (!nameRegex.test(formData.username)) {
      newErrors.username =
        "Name must be in 3-30 characters and contain only letters";
    }
    //Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is Required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email is Invalid";
    }
    //phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is Required";
    }
    //  else if (!phoneRegex.test(formData.phone)) {
    //   newErrors.phone = "Phone Number must be 10 digits";
    // }
    // Password validation
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
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await signup(formData).unwrap();
        setSuccessMessage("OTP Send to email");
        navigate("/verify-otp", { state: { email: formData.email } });

        console.log(response.message);
        setErrors({});
      } catch (error) {
        setErrors({ apiError: error?.data?.message });

        console.log(error);
      }
    }
  };

  // Google Oauth
  const { handleGoogleClick } = useGoogleAuth();

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {" "}
        <div className="bg-white p-8 rounded-lg border">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-3 flex justify-center items-center flex-col">
              <h3 className="text-gray-800 text-2xl font-bold flex items-center justify-center h-full">
                Account Signup
              </h3>
              {/* on success */}
              {successMessage && (
                <span className="" style={{ color: "green" }}>
                  {successMessage}
                </span>
              )}
              {/* on error */}
              {errors.apiError && (
                <span className="text-red-500 self-center">
                  {errors.apiError}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {" "}
              <div>
                <label className="text-gray-800 text-sm mb-1 block">Name</label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-3 pr-8 py-1.5 rounded-md outline-black"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="10"
                      cy="7"
                      r="6"
                      data-original="#000000"
                    ></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
                {errors.username && (
                  <span style={{ color: "red" }}>{errors.username}</span>
                )}
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">
                  Email Id
                </label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-3 pr-8 py-1.5 rounded-md outline-black"
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
                        <path
                          d="M0 512h512V0H0Z"
                          data-original="#000000"
                        ></path>
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
                  <span style={{ color: "red" }}>{errors.email}</span>
                )}
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-3 pr-8 py-1.5 rounded-md outline-black"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6.62 10.79a15.09 15.09 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27 11.34 11.34 0 0 0 3.58.73 1 1 0 0 1 1 1v3.55a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1h3.54a1 1 0 0 1 1 1 11.34 11.34 0 0 0 .74 3.58 1 1 0 0 1-.26 1.11z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
                {errors.phone && (
                  <span style={{ color: "red" }}>{errors.phone}</span>
                )}
              </div>
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
              </div>
              {errors.password2 && (
                <span style={{ color: "red" }}>{errors.password2}</span>
              )}
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full py-2 px-4 text-sm font-semibold rounded-md bg-black hover:bg-black-700 text-white focus:outline-none"
              >
                {isLoading ? "Creating Account...." : "Create Account"}
              </button>
            </div>

            <div className="mt-3">
              <button
                onClick={handleGoogleClick}
                type="button"
                className="w-full px-4 py-2 flex items-center justify-center rounded-md text-gray-800 text-sm font-semibold border-none outline-none bg-gray-100 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  fill="#fff"
                  className="inline shrink-0 mr-3"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                    data-original="#fbbd00"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                    data-original="#0f9d58"
                  />
                  <path
                    fill="#31aa52"
                    d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                    data-original=""
                  />
                  <path
                    fill="#3c79e6"
                    d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                    data-original="#3c79e6"
                  />
                  <path
                    fill="#cf2d48"
                    d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                    data-original="#cf2d48"
                  />
                  <path
                    fill="#eb4132"
                    d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                    data-original="#eb4132"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="text-gray-800 text-sm mt-3 text-center">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-blue-600 font-semibold hover:underline ml-1"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
