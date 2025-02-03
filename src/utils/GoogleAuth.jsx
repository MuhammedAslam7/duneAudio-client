import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "@/config/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { useSignWithGoogleAuthMutation } from "@/services/api/user/authApi";
import { useNavigate } from "react-router-dom";

export const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signWithGoogleAuth] = useSignWithGoogleAuthMutation();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const response = await signWithGoogleAuth({
        username: result?.user?.displayName,
        email: result?.user?.email,
      }).unwrap();
      const user = response?.data?.user;
      const token = response?.accessToken;
      dispatch(setUser({ user }));
      localStorage.setItem("userToken", token);
      navigate("/home");
    } catch (error) {
      console.error("Google Authentication Error:", error.message);
    }
  };
  return { handleGoogleClick };
};
