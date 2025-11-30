import React from "react";
import Input from "../../components/ui/Input";
import { User, Mail, Lock, Calendar } from "lucide-react";

type Props = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  onChange: (field: string, value: any) => void;
};

const PatientStep1Personal: React.FC<Props> = ({
  name,
  email,
  password,
  confirmPassword,
  gender,
  age,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="mx-auto w-12 h-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          Personal Information
        </h2>
        <p className="text-gray-600 mt-2">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter your full name"
          required
          icon={User}
        />

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="patient@example.com"
          required
          icon={Mail}
        />

        <div>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="••••••••"
            required
            icon={Lock}
          />
          {password && password.length < 6 && (
            <p className="text-red-500 text-xs mt-1">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        <div>
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            placeholder="••••••••"
            required
            icon={Lock}
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["MALE", "FEMALE", "OTHER"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange("gender", g)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  gender === g
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {g.charAt(0) + g.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={age}
              onChange={(e) => onChange("age", parseInt(e.target.value) || 18)}
              min="18"
              max="120"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your age"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientStep1Personal;
