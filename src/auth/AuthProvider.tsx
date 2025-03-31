import React, { useContext, createContext, useState, useEffect } from "react";
import { AccessTokenResponse, AuthResponse, User } from "../Types/types";
import { API_URL } from "./constants";

interface AuthProviderProps {
    children: React.ReactNode;
}

//Creamos el contexto de la autentificación 
const AuthContext = createContext<{
    isAuthenticated: boolean;
    getAccessToken: () => string;
    saveUser: (userData: AuthResponse) => void;
    logout: () => void;
    user?: User;
}>({
    isAuthenticated: false,
    getAccessToken: () => "",
    saveUser: () => {},
    logout: () => {},
});


//Aqui tenemos el proveedor de autentificación en el que verificamos si el usuario tiene 
export function AuthProvider({ children }: AuthProviderProps) {
   
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState<User>();

    useEffect(() => {
        checkAuth();
    }, []);


    async function requestNewAccessToken(refreshToken: string, userId: number) {
        try {
            const response = await fetch(`${API_URL}/refresh/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
                body: JSON.stringify({ userId }),
            });
            if (response.ok) {
                const json = (await response.json()) as AccessTokenResponse;
                if (json.error) {
                    throw new Error(json.error);
                }
                return json.accessToken;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getUserInfo(accessToken: string) {
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const json = await response.json();
                if (json.error) {
                    throw new Error(json.error);
                }
                return json;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function checkAuth() {
        const refreshToken = getRefreshToken();
        const userId = localStorage.getItem("userId");

        if (refreshToken && userId) {
            const newAccessToken = await requestNewAccessToken(refreshToken, Number(userId));
            if (newAccessToken) {
                const userInfo = await getUserInfo(newAccessToken);
                if (userInfo) {
                    saveSessionInfo(newAccessToken, refreshToken, Number(userId));
                    setUser(userInfo);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    }

    function saveSessionInfo(accessToken: string, refreshToken: string, userId: number) {
        setAccessToken(accessToken);
        localStorage.setItem("token", refreshToken);
        localStorage.setItem("userId", userId.toString());
        setIsAuthenticated(true);
    }

    async function saveUser(userData: AuthResponse) {
        if (!userData.user?.id) {
            console.error("El userData no tiene user.id");
            return;
        }
        saveSessionInfo(userData.accessToken, userData.refreshToken, userData.user.id);
        const userInfo = await getUserInfo(userData.accessToken);
        if (userInfo) {
            setUser(userInfo);
        }
    }

    async function logout() {
        const accessToken = getAccessToken();
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                setAccessToken("");
                setIsAuthenticated(false);
                setUser(undefined);
            } else {
                console.error("Error en el logout");
            }
        } catch (error) {
            console.error("Error al hacer logout:", error);
        }
    }
    

    function getAccessToken() {
        return accessToken;
    }

    function getRefreshToken(): string | null {
        const tokenData = localStorage.getItem("token");
        console.log("Token in localStorage:", tokenData);
        return tokenData || null;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
