import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // TanStack Query to fetch session info
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['authSession'],
        queryFn: async () => {
            const res = await apiFetch("/getNavbar");
            if (res.status === 401 || res.status === 403) {
                return { value: false };
            }
            if (!res.ok) {
                throw new Error("Session retrieval failed");
            }
            return res.json();
        }
    });

    const IsLogin = data?.value || false;
    const session = data?.data || null;
    const isAdmin = data?.isAdmin || false;
    const isMember = data?.isMember || false;

    const logout = async () => {
        try {
            await apiFetch("/logout");
            refetch(); // Refetch will clear session state
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const value = {
        user: session,
        isLoading,
        IsLogin,
        isAdmin,
        isMember,
        refetchAuth: refetch,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
};
