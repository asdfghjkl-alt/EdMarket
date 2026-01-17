import { useAuth } from "../contexts/UserContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="m-6 text-center">
      <h1 className="text-6xl">Welcome to EdMarket!</h1>
    </div>
  );
}
