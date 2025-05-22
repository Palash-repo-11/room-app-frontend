import React, { useState } from "react";
import axios from "axios";
import { useMeeting } from "../provider/MeetingProvider";
import { loginLocal } from "../auth";

const LoginModal = ({ onClose, onSuccess }) => {
    const { setUserId, setIsVarified, setUserInfo } = useMeeting();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:7500/login/newuser", {
                email,
                name,
                profileImage: null,
            });
            console.log(res, "res")
            if (res.data && res.data.id) {
                loginLocal(res.data.id)
                setUserId(res.data.id);
                setUserInfo(res.data);
                setIsVarified(true);
                onSuccess();
            }
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 border rounded mb-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
