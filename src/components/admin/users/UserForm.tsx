import React, { useEffect, useState } from "react";
import { adminUsersAPI } from "../../../services/admin";
import { User } from "../../../types";

type Props = {
  user?: User | null;
  onClose: () => void;
  onSaved: (user: User) => void;
};

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const UserForm: React.FC<Props> = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState<Partial<User>>({ role: "PATIENT" });
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(user?.id);

  useEffect(() => {
    if (user) {
      setForm({
        ...user,
        // Handle array to string conversion for input
        allergies: Array.isArray(user.allergies)
          ? (user.allergies as any).join(", ")
          : user.allergies,
      } as any);
    }
  }, [user]);

  const handleChange = (field: keyof User, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        specialty: form.role === "DOCTOR" ? form.specialty : undefined,
        hospital: form.role === "DOCTOR" ? form.hospital : undefined,
        age: form.role === "PATIENT" ? form.age : undefined,
        gender: form.gender,
        allergies:
          typeof form.allergies === "string"
            ? (form.allergies as string).split(",").map((s) => s.trim())
            : form.allergies,
      };

      let saved;
      if (isEdit && user) {
        saved = await adminUsersAPI.update(user.id, payload);
        onSaved(saved.user || saved);
      } else {
        saved = await adminUsersAPI.create(payload);
        onSaved(saved.user || saved);
      }
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? "Edit User" : "Create User"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            required
            value={form.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                handleChange("role", e.target.value as User["role"])
              }
              className="mt-1 block w-full border rounded-md px-3 py-2"
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              value={form.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={form.gender || ""}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {form.role === "DOCTOR" ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Specialty
              </label>
              <input
                value={form.specialty || ""}
                onChange={(e) => handleChange("specialty", e.target.value)}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hospital
              </label>
              <input
                value={form.hospital || ""}
                onChange={(e) => handleChange("hospital", e.target.value)}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                min={0}
                value={form.age || ""}
                onChange={(e) => handleChange("age", Number(e.target.value))}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Allergies
              </label>
              <input
                value={(form.allergies as any) || ""}
                onChange={(e) => handleChange("allergies", e.target.value)}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                placeholder="Comma separated"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            type="submit"
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserForm;
