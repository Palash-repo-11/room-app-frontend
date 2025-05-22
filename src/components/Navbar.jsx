import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import { isAuthenticated, logout, getUser } from "../auth";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">MeetApp</Link>
      <div>
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
