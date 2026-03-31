import { Google } from "@ariajdev/company-colored-icon";
const OAuth = () => {
  const handleGoogleLogin = () => {
    // Here you would trigger your OAuth login flow
    console.log("Google login clicked");
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-2 px-4 py-2 border border-white text-white w-full justify-center rounded-md hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
      >
        <Google className="w-5 h-5" />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default OAuth;
