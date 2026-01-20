import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/contexts/UserContext";
import { useNavigate } from "react-router";

export default function UserRestrict({ element }: { element: ReactNode }) {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading</div>;
  }
  if (user) {
    return element;
  }
}
