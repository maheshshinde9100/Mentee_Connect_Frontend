import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    // Validate user structure
                    if (parsedUser && typeof parsedUser === 'object') {
                        setAuthState(prev => ({
                            ...prev,
                            user: {
                                ...parsedUser,
                                role: parsedUser.role || 'STUDENT' // Default role
                            },
                            loading: false
                        }));
                        return;
                    }
                }
                setAuthState(prev => ({ ...prev, loading: false }));
            } catch (error) {
                console.error('Auth initialization error:', error);
                setAuthState(prev => ({ ...prev, loading: false, error }));
            }
        };

        initializeAuth();
    }, []);

    // const login = async (email, password) => {
    //     setAuthState(prev => ({ ...prev, loading: true }));
    //     try {
    //         const response = await apiLogin(email, password);
    //
    //         if (response?.success) {
    //             const userData = {
    //                 email: email,
    //                 role: response.user.role,
    //                 // Add other user fields if available
    //             };
    //
    //             localStorage.setItem('user', JSON.stringify(userData));
    //             setAuthState({
    //                 user: userData,
    //                 loading: false,
    //                 error: null
    //             });
    //             return { success: true };
    //         }
    //         throw new Error('Login failed');
    //     } catch (error) {
    //         setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
    //         throw error;
    //     }
    // };

    const login = async (email, password) => {
        setAuthState(prev => ({ ...prev, loading: true }));
        try {
            const response = await apiLogin(email, password);

            if (response?.success) {
                // Common user data
                const userData = {
                    email: email,
                    role: response.user.role,
                    id: response.user.id, // Include the ID from response
                    name: response.user.name, // Include name for both roles
                    // For students
                    ...(response.user.role === 'STUDENT' && {
                        mentorName: response.user.mentorName
                    }),
                    // For mentors
                    ...(response.user.role === 'MENTOR' && {
                        expertise: response.user.expertise
                    })
                };

                localStorage.setItem('user', JSON.stringify(userData));
                setAuthState({
                    user: userData,
                    loading: false,
                    error: null
                });
                return { success: true };
            }
            throw new Error('Login failed');
        } catch (error) {
            setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setAuthState({
            user: null,
            loading: false,
            error: null
        });
    };

    return (
        <AuthContext.Provider value={{
            user: authState.user,
            loading: authState.loading,
            error: authState.error,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};