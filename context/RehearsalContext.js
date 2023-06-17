import { createContext, useState } from "react";

export const RehearsalContext = createContext({
    rehearsal: {},
    setRehearsalState: (val) => {},
});

export const initialRehearsalState = {
    songs: [],
    members: [],
    location: {}
}

const RehearsalContextProvider = ({ children }) => {
    const [rehearsalState, setRehearsalState] = useState(initialRehearsalState);

    const updateRehearsalStateObject = (vals) => {
        setRehearsalState({
            ...rehearsalState,
            ...vals,
        });
    };

    const value = {
        rehearsal: rehearsalState,
        setRehearsalState: updateRehearsalStateObject,
    }

    return (
        <RehearsalContext.Provider value={value}>
            {children}
        </RehearsalContext.Provider>
    );
};

export default RehearsalContextProvider;

