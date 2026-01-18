import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import NotFound from "../NotFound";
import AddProductForm from "./AddProductForm";

export default function AddProduct() {
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
    return <AddProductForm />;
  } else {
    return <NotFound />;
  }
}
