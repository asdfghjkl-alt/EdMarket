import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/UserContext";
import NotFound from "@/pages/NotFound";

export default function AdminRestrict({ element }: { element: ReactNode }) {
  const { loading, user } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsAdmin(user?.isAdmin as boolean);
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading</div>;
  }
  if (isAdmin) {
    return element;
  } else {
    return <NotFound />;
  }
}
