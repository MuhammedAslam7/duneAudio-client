import { useState } from "react";
import { useResetPasswordMutation } from "@/services/api/user/authApi";
import { useNavigate } from "react-router-dom";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validation = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email is Invalid";
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
    try {
      await resetPassword(formData).unwrap();
      navigate("/reset-verify-otp", { state: { email: formData.email } });
      setErrors({});
    } catch (error) {
      setErrors({ apiError: error?.data?.message });
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
                <label className="text-gray-800 text-sm mb-1 block font-medium mb-2">
                  Enter Your Registered Email
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
                  <span className="text-red-600 font-medium">
                    {errors.email}
                  </span>
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
    </div>
  );
};
