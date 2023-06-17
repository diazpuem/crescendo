import { createContext, useState } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (val) => {},
});

export default AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value = {
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: setIsLoggedIn
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
