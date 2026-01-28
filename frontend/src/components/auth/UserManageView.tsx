import api from "@/api/axios";
import { useAuth } from "@/contexts/UserContext";
import type { User } from "@/types/user";
import { AxiosError } from "axios";
import { useState } from "react";

const validRoles = ["buyer", "admin", "seller"];
const roleClasses: Record<string, string> = {
  buyer: "bg-blue-500 text-blue-100",
  admin: "bg-red-600 text-red-100",
  seller: "bg-orange-400 text-orange-100",
};

export default function UserManageView({
  user,
  onUserRoleUpdate,
}: {
  user: User;
  onUserRoleUpdate: Function;
}) {
  const [role, setRole] = useState(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: currentUser } = useAuth();
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function changeRole(
    userId: string,
    changedRole: "buyer" | "seller" | "admin",
  ) {
    setErrMsg(null);
    setSuccessMsg(null);

    try {
      await api.put(`/auth/${userId}/${changedRole}`);
      setSuccessMsg("Role changed successfully");
      onUserRoleUpdate(userId, changedRole);
    } catch (err) {
      if (err instanceof AxiosError) {
        setErrMsg(err.response?.data.message);
      } else {
        console.error(err);
      }
    }
  }

  async function onSubmit() {
    setIsSubmitting(true);
    await changeRole(user._id, role);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md md:grid md:grid-cols-4 md:items-center md:gap-4">
      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Username:</span>
        <span>{user.username}</span>
      </div>
      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Email:</span>
        <span>{user.email}</span>
      </div>
      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Role:</span>
        <select
          value={role}
          disabled={user._id === currentUser?._id}
          onChange={(e) => setRole(e.target.value as typeof user.role)}
          className={`w-full rounded-md border border-gray-200 p-2 text-center ${roleClasses[role]} disabled:opacity-35`}
        >
          {validRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col md:col-span-1">
        <button
          className="btn btn-edit"
          disabled={
            user._id === currentUser?._id || role === user.role || isSubmitting
          }
          onClick={onSubmit}
        >
          Change Role
        </button>
      </div>
      {(successMsg || errMsg) && (
        <div className="flex flex-col md:col-span-4">
          {successMsg && (
            <p className="animate-fade-in text-center text-green-500">
              {successMsg}
            </p>
          )}
          {errMsg && <p className="text-center text-red-500">{errMsg}</p>}
        </div>
      )}
    </div>
  );
}
