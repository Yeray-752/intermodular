import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importamos el decodificador

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Tiempo actual en segundos

        // Comprobamos si el token ha expirado
        if (decoded.exp < currentTime) {
          console.warn("El token ha expirado. Cerrando sesión...");
          logout(); 
        } else {
          // El token es válido, extraemos los datos del usuario
          setUser({ 
            loggedIn: true, 
            id: decoded.id, 
            rol: decoded.rol 
          });

          // Opcional: Programar un logout automático cuando llegue la hora de expirar
          const timeLeft = (decoded.exp - currentTime) * 1000;
          setTimeout(() => {
            logout();
            alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
          }, timeLeft);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({ 
      loggedIn: true, 
      id: decoded.id, 
      rol: decoded.rol 
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol'); // Limpia también el rol
    setUser(null);
    // window.location.href = "/login"; // Opcional: Redirigir al login al expirar
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};