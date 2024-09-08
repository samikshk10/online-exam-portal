import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CookieStorage } from '../../helper/CookieStorage';
import { SessionStorage } from '../../helper/sessionStorage';
import { verifyToken } from '../../services/userServices';

function PrivateRoute({ children }: React.PropsWithChildren<any>) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const token = CookieStorage.getCookieItem('authToken');

            if (token) {
                try {
                    const verifyTokenResponse = await verifyToken(token);
                    console.log('verifyTokenResponse', verifyTokenResponse);
                    if (verifyTokenResponse?.success) {
                        console.log('herehrherherhehr');
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                    }
                } catch (error) {
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return <>{children}</>;
}

export default PrivateRoute;
