import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUser, isAuthenticated } from "../auth";
import LoginModal from "../components/LoginModal";
import { useMeeting } from "../provider/MeetingProvider";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const {
    userId, setUserId,
    isVarified, setIsVarified,
    userInfo, setUserInfo,
  } = useMeeting();

  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleStart = () => {
    if (isVarified) {
      navigate("/dashboard");
    } else {
      setShowLogin(true);
    }
  };

  const varifyUser = async () => {
    try {
      const localUserId = getUser();
      setUserId(localUserId);
      console.log(localUserId)
      if (localUserId) {
        const response = await axios.post('http://localhost:7500/users/varifyUser', {
          userId: localUserId
        });

        if (response.data?.userStatus === 'EXISTING USER') {
          setUserInfo(response.data.user);
          setIsVarified(true);
        } else {
          setUserInfo(null);
          setIsVarified(false);
        }
      } else {
        setUserInfo(null);
        setIsVarified(false);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setUserInfo(null);
      setIsVarified(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    varifyUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Welcome to MeetApp</h1>
        <p className="text-gray-600 mb-6 text-lg max-w-2xl">
          This is a mini Google Meet clone. Here's how to use it:
        </p>
        <ul className="text-left max-w-xl mx-auto mb-6 list-disc list-inside text-gray-700">
          <li>Click "Start Your Meeting" to begin</li>
          <li>Login if you're not already</li>
          <li>Create a room and share the link</li>
          <li>Enjoy your secure, private video calls</li>
        </ul>
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md"
        >
          Start Your Meeting
        </button>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={(user) => {
            setUserInfo(user);
            setIsVarified(true);
            setShowLogin(false);
            navigate("/dashboard");
          }}
        />
      )}
    </>
  );
};

export default Home;
