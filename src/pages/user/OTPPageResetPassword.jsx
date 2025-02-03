import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useResetVerifyOTpMutation,
  useResendOTPMutation,
} from "@/services/api/user/authApi";

export const OTPPageResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  console.log(email);
  const [resetVerifyOTp, { isLoading }] = useResetVerifyOTpMutation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});

  // Resend Variables
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [resendErrors, setResendErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(() => {
    const savedTimer = localStorage.getItem("resendTimer");
    const savedTime = localStorage.getItem("resendTime");
    if (savedTimer && savedTime) {
      const passedTime = Math.floor(
        (Date.now() - parseInt(savedTime, 10)) / 1000
      );
      const remainingTime = Math.max(0, parseInt(savedTimer, 10) - passedTime);
      return remainingTime;
    }
    return 10;
  });

  useEffect(() => {
    localStorage.clear("resendTimer");
    localStorage.clear("resendTime");
  }, []);

  ////////////////
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          localStorage.setItem("resendTimer", newTimer.toString());
          localStorage.setItem("resendTime", Date.now().toString());
          return newTimer;
        });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");

    const newOtp = [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6 && /^\d$/.test(value)) {
        newOtp[index] = value;
      }
    });
    setOtp(newOtp);
  };
  const validation = (otpValue) => {
    let newErrors = {};
    if (otpValue.length < 6) {
      newErrors.otp = "A Valid OTP is required";
    }
    return newErrors;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    console.log("Verifying OTP:", otpValue);
    if (!email) {
      console.log("Email not found in loc state");
      return;
    }

    const validationErrors = validation(otpValue);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return setServerErrors({});
    }
    try {
      await resetVerifyOTp({ email, otpValue }).unwrap();
      setErrors({});
      navigate("/confirm-reset-password", { state: { email: email } });
    } catch (error) {
      setServerErrors({ apiError: error?.data?.message });
      console.log(error?.data?.message);
    }
  };

  // resend handling function
  const handleResend = async (e) => {
    e.preventDefault();
    setResendErrors({});
    setErrors({});
    if (isResending) return;

    try {
      await resendOTP({ email }).unwrap();
      console.log("get response");
      setResendTimer(10);
      localStorage.setItem("resendTimer", "60");
      localStorage.setItem("resendTime", Date.now().toString());

      setSuccessMessage("Resend OTP successfully");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      setResendErrors({ apiError: error.data.message });
      console.log(error?.data?.message);
    }
  };
  return (
    <div className="w-full flex flex-col items-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-40">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Email Verification
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Enter the 6-digit verification code that was sent to your Email.
      </p>

      {errors.otp && (
        <span className=" text-red-500 absolute mt-[92px] font-bold ">
          {errors.otp}
        </span>
      )}
      {serverErrors.apiError && (
        <span className=" text-red-500 absolute mt-[92px] font-bold ">
          {serverErrors.apiError}
        </span>
      )}

      <div className="flex justify-center gap-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-gray-50"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="w-full py-3 bg-black text-white rounded-lg hover:bg-slate-800 transition-colors mb-4"
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center">
        <span className="text-gray-600">Didn't receive code? </span>
        <button
          onClick={handleResend}
          disabled={resendTimer > 0 || isResending}
          className={`text-blue-600 hover:underline font-medium ${
            resendTimer > 0 || isResending
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isResending
            ? "Resending..."
            : resendTimer > 0
            ? `Resend in ${resendTimer}s`
            : "Resend"}
        </button>
      </div>
      {successMessage && (
        <div className="text-green-700 font-bold">{successMessage}</div>
      )}
      {resendErrors.apiError && (
        <div className="text-red-600 font-bold">{resendErrors.apiError}</div>
      )}
    </div>
  );
};
