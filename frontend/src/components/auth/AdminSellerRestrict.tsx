import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/UserContext";
import NotFound from "@/pages/NotFound";

export default function AdminSellerRestrict({
  element,
}: {
  element: ReactNode;
}) {
  const { loading, user } = useAuth();

  const [role, setRole] = useState<undefined | "buyer" | "seller" | "admin">(
    undefined,
  );

  useEffect(() => {
    if (!loading) {
      setRole(user?.role);
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading</div>;
  }
  if (role === "seller" || role === "admin") {
    return element;
  } else {
    return <NotFound />;
  }
}
