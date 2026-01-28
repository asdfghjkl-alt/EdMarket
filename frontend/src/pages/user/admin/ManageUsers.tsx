import api from "@/api/axios";
import UserManageView from "@/components/auth/UserManageView";
import Loading from "@/components/ui/Loading";
import type { User } from "@/types/user";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/auth");
        setUsers(data.body.users);
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setErrMsg(err.response?.data.message);
        } else {
          console.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, []);

  const onUserRoleUpdate = (
    userId: string,
    role: "buyer" | "seller" | "admin",
  ) => {
    setUsers((prevUsers: User[]) =>
      prevUsers.map((user: User) => {
        if (user._id === userId) {
          return { ...user, role };
        }
        return user;
      }),
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="m-6 text-center">
      <h1 className="m-5 text-4xl">Manage Users</h1>
      <p className="text-red-500">{errMsg}</p>

      <div className="flex flex-col gap-4">
        <div className="hidden rounded-md bg-gray-100 p-4 font-bold text-gray-700 md:grid md:grid-cols-4 md:gap-4">
          <div className="col-span-1">Username</div>
          <div className="col-span-1">Email</div>
          <div className="col-span-1">Role</div>
          <div className="col-span-1">Edit User</div>
        </div>
        {users.map((user: User) => {
          return (
            <UserManageView user={user} onUserRoleUpdate={onUserRoleUpdate} />
          );
        })}
      </div>
    </div>
  );
}
