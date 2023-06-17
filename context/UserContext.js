import { createContext, useState } from "react";

export const UserContext = createContext({
    user: {},
    setUserState: (val) => {},
});

export const initialUserState = {
    name: "",
    userRole: null,
    userBandRole: null,
    bandName: "",
    bandCode: "",
    progress: 0,
    email: "",
    pwd: ""
};

const UserContextProvider = ({ children }) => {

    const [userState, setUserState] = useState(initialUserState);

    const updateUserStateObject = (vals) => {
        setUserState({
            ...userState,
            ...vals,
        });
    };

    const value = {
        user: userState,
        setUserState: updateUserStateObject,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;