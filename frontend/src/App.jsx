import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SelectRole from "./pages/SelectRole";
import StudentRegister from "./pages/StudentRegister";
import RecruiterRegister from "./pages/RecruiterRegister";
import Pending from "./pages/Pending";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import UserApprovalList from "./pages/UserApprovalList.jsx";
import UserApprovalDetail from "./pages/UserApprovalDetail.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
      
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SelectRole />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/recruiter" element={<RecruiterRegister />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/user-approval" element={<UserApprovalList />} />
        <Route path="/user-approval/:id" element={<UserApprovalDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
