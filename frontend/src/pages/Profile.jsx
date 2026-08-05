import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/profile");

      setName(data.user.name);
      setEmail(data.user.email);
      setRole(data.user.role);

      if (data.user.avatar?.url) {
        setAvatar(data.user.avatar.url);
      }
    } catch (error) {
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const updateProfile = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const { data } = await api.put("/profile", formData);

        localStorage.setItem(
        "user",
        JSON.stringify(data.user)
        );

        toast.success("Profile updated successfully.");

        await fetchProfile();
        window.dispatchEvent(new Event("storage"));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    try {
      await api.put("/profile/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">

      <div className="bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold mb-8">
          My Profile
        </h1>

        <div className="flex flex-col items-center">

          <img
            src={
              avatar ||
              "https://ui-avatars.com/api/?name=User"
            }
            alt="Avatar"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="mt-5"
          />

        </div>

        <div className="mt-8 space-y-5">

          <div>

            <label className="block font-semibold mb-2">
              Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Role
            </label>

            <input
              value={role}
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100"
            />

          </div>

          <button
            onClick={updateProfile}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

        </div>

        <hr className="my-10" />

        <h2 className="text-2xl font-bold mb-6">
          Change Password
        </h2>

        <div className="space-y-5">

          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={changePassword}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Change Password
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;