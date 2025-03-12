import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import utils from "@/utils";

const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const token = utils.cookieManager.get("token");

        if (!token) {
          router.push("/login"); // Token yoksa login'e yönlendir
        } else if (router.pathname === "/login") {
          router.push("/");
        }
        
        setLoading(false);
      }
    }, []);

    if (loading) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
