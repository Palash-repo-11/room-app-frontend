import React, { createContext, useContext, useEffect, useState } from 'react'
const MeetingContext = createContext()

export const MeetingProvider = ({ children }) => {
    const [userId, setUserId] = useState(null)
    const [userInfo,setUserInfo]=useState(null)
    const [isVarified,setIsVarified]=useState(false)
    const [ownerMeetings, setOwnerMeetings] = useState([]);
    const [memberMeetings, setMemberMeetings] = useState([]);





    const contextValue = {
        userId, setUserId,
        isVarified,setIsVarified,
        userInfo,setUserInfo,
        ownerMeetings, setOwnerMeetings,
        memberMeetings, setMemberMeetings,
    }
    return (
        <MeetingContext.Provider value={contextValue}>
            {children}
        </MeetingContext.Provider>
    )
}



export const useMeeting = () => {
    return useContext(MeetingContext)
}