import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../store/authStore";

const OAuth = () => {
  const { googleAuth, isOAuthLoading } = useAuthStore();

  return (
    <GoogleLogin
      disabled={isOAuthLoading}
      onSuccess={async (res) => {
        // Send the ID token from Google to backend for verification
        await googleAuth(res.credential);
      }}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default OAuth;
