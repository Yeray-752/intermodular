import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Al cargar la app, revisamos si hay un token
    const token = localStorage.getItem('token');
    if (token) {
      // Opcional: Aquí podrías decodificar el token para sacar el nombre del usuario
      setUser({ loggedIn: true }); 
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ loggedIn: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};