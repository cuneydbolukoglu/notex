import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import utils from "@/utils";

const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        if (typeof window !== "undefined") {
          const isAuthPage = pathname.startsWith("/auth");
          
          try {
            // Server-side token validation
            const response = await fetch('/api/auth/validate');
            const data = await response.json();
            
            if (data.valid) {
              setIsAuthenticated(true);
              // Token geçerli ama auth sayfasındaysa anasayfaya yönlendir
              if (isAuthPage) {
                router.push("/");
              }
            } else {
              setIsAuthenticated(false);
              // Token geçersiz ve auth sayfasında değilse login'e yönlendir
              if (!isAuthPage) {
                router.push("/auth/login");
              }
            }
          } catch (error) {
            console.error("Auth validation error:", error);
            setIsAuthenticated(false);
            if (!isAuthPage) {
              router.push("/auth/login");
            }
          }
          
          setLoading(false);
        }
      };

      checkAuth();
    }, [pathname, router]);

    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          Loading...
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;