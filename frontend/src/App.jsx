import { Routes } from "react-router-dom";
import "./App.css";
import FloatingShape from "./components/FloatingShape";
import AppRoutes from "./Routes/routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-blue-400"
        size="w-64 h-64"
        top="-10%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-sky-300"
        size="w-48 h-48"
        top="60%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-indigo-400"
        size="w-32 h-32"
        top="40%"
        left="-5%"
        delay={2}
      />
      <AppRoutes />
      <Toaster />
    </div>
  );
}

export default App;
