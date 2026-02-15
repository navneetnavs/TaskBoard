import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from storage", error);
            return null;
        }
    });

    const [loading] = useState(false); // No longer loading initial state

    const login = (email, password, rememberMe) => {
        // Static validation as per requirements
        return new Promise((resolve, reject) => {
            // Simulate API call delay
            setTimeout(() => {
                if (email === 'intern@demo.com' && password === 'intern123') {
                    const userData = { email, name: 'Intern User', role: 'admin' };
                    setUser(userData);

                    if (rememberMe) {
                        localStorage.setItem('user', JSON.stringify(userData));
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(userData));
                    }
                    resolve(userData);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
