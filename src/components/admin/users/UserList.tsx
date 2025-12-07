import React, { useEffect, useMemo, useState } from "react";
import { adminUsersAPI } from "../../../services/admin";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { User } from "../../../types";

export type UserListProps = {
  onEdit: (user: User) => void;
  onCreate: () => void;
  onDeleted?: (userId: string) => void;
};

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span
    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}
  >
    {label}
  </span>
);

const ConfirmDialog: React.FC<{
  title: string;
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const UserList: React.FC<UserListProps> = ({ onEdit, onCreate, onDeleted }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "PATIENT" | "DOCTOR">(
    "ALL"
  );
  const [confirm, setConfirm] = useState<{ open: boolean; user?: User }>({
    open: false,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await adminUsersAPI.list();
        const list = res.users || res;
        if (mounted) setUsers(list);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let data = users;
    // Backend uses 'type' field, frontend uses 'role' - handle both
    if (roleFilter !== "ALL") {
      data = data.filter((u) => (u.role || u.type) === roleFilter);
    }
    if (query.trim().length >= 2) {
      const q = query.toLowerCase();
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      );
    }
    return data;
  }, [users, query, roleFilter]);

  const handleDelete = async (user: User) => {
    try {
      await adminUsersAPI.remove(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      onDeleted?.(user.id);
      setConfirm({ open: false });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleVerification = async (user: User) => {
    try {
      const next = !(user.isVerified ?? false);
      await adminUsersAPI.updateVerification(user.id, next);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isVerified: next } : u))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">Users</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-2 top-2.5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone..."
              className="pl-8 pr-3 py-2 border rounded-md text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="border rounded-md text-sm py-2 px-3"
          >
            <option value="ALL">All</option>
            <option value="PATIENT">Patients</option>
            <option value="DOCTOR">Doctors</option>
          </select>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md"
          >
            <Plus className="h-4 w-4" /> New User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        {user.specialty && (
                          <div className="text-xs text-gray-500">
                            {user.specialty}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      label={user.role || user.type || "UNKNOWN"}
                      color={
                        (user.role || user.type) === "DOCTOR"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email || user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {user.isOnline && (
                        <Badge
                          label="Online"
                          color="bg-green-100 text-green-800"
                        />
                      )}
                      {user.isVerified ? (
                        <button
                          onClick={() => toggleVerification(user)}
                          className="inline-flex items-center gap-1 text-xs text-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Verified
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleVerification(user)}
                          className="inline-flex items-center gap-1 text-xs text-gray-600"
                        >
                          <XCircle className="h-4 w-4" /> Not verified
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => setConfirm({ open: true, user })}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        title="Delete user"
        message={`Are you sure you want to delete ${confirm.user?.name}? This action cannot be undone.`}
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => confirm.user && handleDelete(confirm.user)}
      />
    </div>
  );
};

export default UserList;
