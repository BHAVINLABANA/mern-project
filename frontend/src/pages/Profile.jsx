import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Save,
  ShieldCheck,
  User,
  UserRound,
} from "lucide-react";

import api from "../services/api";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  /* =========================================================
     FETCH PROFILE
  ========================================================= */

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/profile");

      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setRole(data.user.role || "");

      if (data.user.avatar?.url) {
        setAvatar(data.user.avatar.url);
      } else {
        setAvatar(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.user.name || "User"
          )}&background=6366f1&color=fff&size=256`
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     IMAGE
  ========================================================= */

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB.");
      return;
    }

    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  /* =========================================================
     UPDATE PROFILE
  ========================================================= */

  const updateProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (!email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("email", email.trim());

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const { data } = await api.put(
        "/profile",
        formData
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      toast.success(
        "Profile updated successfully."
      );

      setAvatarFile(null);

      await fetchProfile();

      window.dispatchEvent(
        new Event("storage")
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CHANGE PASSWORD
  ========================================================= */

  const changePassword = async () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirmation do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await api.put(
        "/profile/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      toast.success(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  /* =========================================================
     PASSWORD INPUT
  ========================================================= */

  const PasswordInput = ({
    label,
    value,
    onChange,
    placeholder,
    visible,
    setVisible,
  }) => {
    return (
      <div>

        <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>

        <div className="relative">

          <KeyRound
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
          />

          <button
            type="button"
            onClick={() =>
              setVisible(!visible)
            }
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {visible ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>

        </div>

      </div>
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">

        <div className="mx-auto max-w-5xl animate-pulse">

          <div className="h-10 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-5 w-80 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />

            <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 lg:col-span-2" />

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <UserRound size={17} />
            Account
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your personal information and
            account security.
          </p>

        </div>

        {/* =================================================
            PROFILE GRID
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            {/* Cover */}

            <div className="h-28 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />

            <div className="relative px-6 pb-6">

              {/* Avatar */}

              <div className="-mt-14 flex justify-center">

                <div className="relative">

                  <img
                    src={
                      avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        name || "User"
                      )}&background=6366f1&color=fff&size=256`
                    }
                    alt="Profile"
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl dark:border-slate-900"
                  />

                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-700 dark:border-slate-900"
                  >
                    <Camera size={16} />

                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />
                  </label>

                </div>

              </div>

              <div className="mt-5 text-center">

                <h2 className="text-xl font-black">
                  {name || "User"}
                </h2>

                <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                  {email}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold capitalize text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <ShieldCheck size={14} />
                  {role}
                </span>

              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-950">

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Profile picture
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  JPG, PNG or WEBP · Max 5MB
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <User size={20} />
              </div>

              <div>

                <h2 className="text-xl font-black">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Update your account details.
                </p>

              </div>

            </div>

            <div className="space-y-5">

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                  />

                </div>

              </div>

              {/* Role */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Account Role
                </label>

                <input
                  type="text"
                  value={role}
                  disabled
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold capitalize text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                />

              </div>

              {/* Save */}

              <button
                type="button"
                onClick={updateProfile}
                disabled={saving}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-indigo-950"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>

            </div>

          </section>

        </div>

        {/* =================================================
            PASSWORD SECTION
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="mb-7 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <KeyRound size={20} />
            </div>

            <div>

              <h2 className="text-xl font-black">
                Change Password
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Keep your account secure with a strong
                password.
              </p>

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              placeholder="Current password"
              visible={showCurrentPassword}
              setVisible={
                setShowCurrentPassword
              }
            />

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              placeholder="New password"
              visible={showNewPassword}
              setVisible={setShowNewPassword}
            />

            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm password"
              visible={showConfirmPassword}
              setVisible={
                setShowConfirmPassword
              }
            />

          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-950">

            <div className="flex items-start gap-3">

              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-500"
              />

              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                Use at least 6 characters. Avoid using
                passwords that are easy to guess.
              </p>

            </div>

            <button
              type="button"
              onClick={changePassword}
              disabled={changingPassword}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changingPassword ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Updating...
                </>
              ) : (
                <>
                  <KeyRound size={17} />
                  Change Password
                </>
              )}
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;