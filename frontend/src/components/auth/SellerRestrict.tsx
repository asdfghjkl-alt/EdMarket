import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/UserContext";
import NotFound from "@/pages/NotFound";

export default function SellerRestrict({ element }: { element: ReactNode }) {
  const { loading, user } = useAuth();

  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsSeller(user?.role === "seller");
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading</div>;
  }
  if (isSeller) {
    return element;
  } else {
    return <NotFound />;
  }
}
