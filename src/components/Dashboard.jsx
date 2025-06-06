import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMeeting } from "../provider/MeetingProvider";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth";

const Dashboard = () => {
  const {
    userId, setUserId,
    isVarified, setIsVarified,
    userInfo, setUserInfo,
    ownerMeetings, setOwnerMeetings,
    memberMeetings, setMemberMeetings,
  } = useMeeting();
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const navigate = useNavigate();


  const varifyUser = async () => {
    console.log("klsdhkj")
    try {
      const localUserId = getUser();
      setUserId(localUserId);
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
        navigate('/')
      }
    } catch (error) {
      navigate('/')
    }
  };
  useEffect(() => {
    if (!userId) varifyUser()
  }, [])
  useEffect(() => {

    console.log("jkdsgjji", userId)
    if (!userId) return
    const fetchMeetings = async () => {
      try {
        const [ownerRes, memberRes] = await Promise.all([
          axios.post("http://localhost:7500/users/getallmeetingasowner", { userId }),
          axios.post("http://localhost:7500/users/getallmeetingasmember", { userId }),
        ]);
        setOwnerMeetings(ownerRes.data || []);
        setMemberMeetings(memberRes.data || []);
      } catch (err) {
        console.error("Failed to fetch meetings", err);
      }
    };

    fetchMeetings();
  }, [userId]);

  const handleCreateMeeting = async () => {
    try {
      const res = await axios.post("http://localhost:7500/meeting/createmeeting", { userId });
      console.log(res.data, "res.data")
      if (res.data?.message === 'Meeting created successfully') {
        navigate(`/dashboard/meeting/${res.data.meeting.id}`);
      }
    } catch (err) {
      console.error("Meeting creation failed", err);
    }
  };

  const handleJoinMeeting = () => {
    navigate(`/dashboard/meeting/${joinMeetingId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome, {userInfo?.name}</h1>

      {/* Create and Join Meeting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Create New Meeting</h2>
          <button
            onClick={handleCreateMeeting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Meeting
          </button>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Join Meeting</h2>
          <input
            type="text"
            placeholder="Enter Meeting ID"
            value={joinMeetingId}
            onChange={(e) => setJoinMeetingId(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleJoinMeeting}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Join Meeting
          </button>
        </div>
      </div>

      {/* Owner Meetings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Created Meetings</h2>
        <ul className="list-disc pl-5 text-gray-700">
          {ownerMeetings.length === 0 ? (
            <p className="text-gray-500">No meetings created yet.</p>
          ) : (
            ownerMeetings.map((meeting) => (
              <li
                key={meeting.id}
                className="cursor-pointer hover:underline text-blue-600"
                onClick={() => navigate(`/dashboard/meeting/${meeting.id}`)}
              >
                {meeting.id}
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Joined Meetings */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Meetings You’ve Joined</h2>
        <ul className="list-disc pl-5 text-gray-700">
          {memberMeetings.length === 0 ? (
            <p className="text-gray-500">You haven’t joined any meetings.</p>
          ) : (
            memberMeetings.map((meeting) => (
              <li
                key={meeting.id}
                className="cursor-pointer hover:underline text-blue-600"
                onClick={() => navigate(`/dashboard/meeting/${meeting.id}`)}
              >
                {meeting.id}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>

  );
};

export default Dashboard;
