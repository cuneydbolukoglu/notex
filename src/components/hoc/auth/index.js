import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import utils from "@/utils";

const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const token = utils.cookieManager.get("token");
        const isAuthPage = pathname.startsWith("/auth");

        // Token yoksa ve auth sayfasında değilse login'e yönlendir
        if (!token && !isAuthPage) {
          router.push("/auth/login");
        }

        // Token varsa ama auth sayfasındaysa anasayfaya yönlendir
        if (token && isAuthPage) {
          router.push("/");
        }

        setLoading(false);
      }
    }, [pathname]);

    if (loading) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;