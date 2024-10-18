"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [formData, setFormData] = useState({
    tpc: "",
    session_key: "",
    password: "",
    role_type: "1", // Default to host
    user: "",
  });

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Redirect to another page and pass form data as props
    router.push(
      `/session?session_key=${formData.session_key}&tpc=${formData.tpc}&password=${formData.password}&role=${formData.role_type}&user=${formData.user}`
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="grid  items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="session_key" className="block mb-1">
            Topic Session Key
          </label>
          <input
            type="text"
            name="session_key"
            id="session_key"
            value={formData.session_key}
            onChange={handleChange}
            required
            className="border p-2 text-black"
          />
        </div>
        <div>
          <label htmlFor="tpc" className="block mb-1">
            Topic
          </label>
          <input
            type="text"
            name="tpc"
            id="tpc"
            value={formData.tpc}
            onChange={handleChange}
            required
            className="border p-2 text-black"
          />
        </div>
        <div>
          <label htmlFor="user" className="block mb-1">
            User Name
          </label>
          <input
            type="text"
            name="user"
            id="user"
            value={formData.user}
            onChange={handleChange}
            required
            className="border p-2 text-black"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 text-black"
          />
        </div>
        <div>
          <label htmlFor="role_type" className="block mb-1">
            Role Type
          </label>
          <select
            name="role_type"
            id="role_type"
            value={formData.role_type}
            onChange={handleChange}
            required
            className="border p-2 text-black"
          >
            <option value="1">Host</option>
            <option value="0">Participant</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2">
          Start Session
        </button>
      </form>
    </div>
  );
}
