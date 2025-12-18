import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  ShieldCheck,
  Crown,
  Copy,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../../Context/UseAuth";
import { apiRequest } from "../../Services/Api";
import {
  GET_PROFILE,
  UPDATE_PROFILE,
  UPLOAD_PROFILE_PICTURE,
  DELETE_PROFILE_PICTURE,
} from "../../Api/Api_variables";
import ShimmerLoader from "../../Component/ui/ShimmerLoader";

const Profile = () => {
  const { token, refreshUser, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
      .min(10, "Phone number must be at least 10 digits"),
    date_of_birth: Yup.date(),
    address: Yup.string().max(200, "Address must be less than 200 characters"),
    city: Yup.string().max(100, "City must be less than 100 characters"),
    state: Yup.string().max(100, "State must be less than 100 characters"),
    country: Yup.string().max(100, "Country must be less than 100 characters"),
    postal_code: Yup.string().max(
      20,
      "Postal code must be less than 20 characters"
    ),
  });

  // Fetch profile data
  const fetchProfileData = () => {
    if (!token) return;

    setIsLoading(true);
    try {
      apiRequest({
        endpoint: GET_PROFILE,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          // console.log("Profile Data Response:", response);
          setIsLoading(false);
          const profile = response.data?.profile || response.data;
          setProfileData(response.data);

          // reflect the new profile picture immediately.
          if (typeof refreshUser === "function") {
            const pic =
              profile?.profile_picture || profile?.profile_picture_url || null;
            const updatedUser = {
              ...(user || {}),
              // Prefer API's profile_picture, fall back to existing key names or null
              // Append a timestamp query param to bust browser cache after updates
              profile_picture_url: pic
                ? `${pic}${pic.includes("?") ? "&" : "?"}t=${Date.now()}`
                : null,
              // keep name/email in sync if available
              name: profile?.name || user?.name,
              email: profile?.email || user?.email,
            };
            try {
              refreshUser(updatedUser);
            } catch (err) {
              console.error("Failed to refresh user in context:", err);
            }
          }

          // Set form values
          formik.setValues({
            name: profile?.name || "",
            email: profile?.email || "",
            phone: profile?.phone || "",
            date_of_birth: profile?.date_of_birth || "",
            address: profile?.address || "",
            city: profile?.city || "",
            state: profile?.state || "",
            country: profile?.country || "",
            postal_code: profile?.postal_code || "",
          });

          // Set profile image
          if (profile?.profile_picture) {
            setProfileImage(profile.profile_picture);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Failed to fetch profile data:", error);
          enqueueSnackbar("Failed to fetch profile data: " + error.message, {
            variant: "error",
          });
        });
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch profile data:", error);
      enqueueSnackbar("Failed to fetch profile data. Please try again.", {
        variant: "error",
      });
    }
  };

  // Form handling with Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdateProfile(values);
    },
  });

  // Update profile
  const handleUpdateProfile = (values) => {
    if (!token) return;

    setIsSaving(true);

    // Prepare JSON body data - only include fields with actual values
    const profileData = {
      name: values.name || "",
    };

    // Only add optional fields if they have values
    if (values.phone && values.phone.trim() !== "") {
      profileData.phone = values.phone;
    }
    if (values.date_of_birth && values.date_of_birth.trim() !== "") {
      profileData.date_of_birth = values.date_of_birth;
    }
    if (values.address && values.address.trim() !== "") {
      profileData.address = values.address;
    }
    if (values.city && values.city.trim() !== "") {
      profileData.city = values.city;
    }
    if (values.state && values.state.trim() !== "") {
      profileData.state = values.state;
    }
    if (values.country && values.country.trim() !== "") {
      profileData.country = values.country;
    }
    if (values.postal_code && values.postal_code.trim() !== "") {
      profileData.postal_code = values.postal_code;
    }

    // console.log("Profile requested body:", profileData);

    try {
      apiRequest({
        endpoint: UPDATE_PROFILE,
        method: "POST",
        data: profileData,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          // console.log("Update Profile Response:", response);
          setIsSaving(false);
          enqueueSnackbar(
            response?.message || "Profile updated successfully!",
            {
              variant: "success",
            }
          );
          fetchProfileData();
        })
        .catch((error) => {
          setIsSaving(false);
          console.error("Failed to update profile:", error);
          const errorMessage =
            error.response?.data?.message || error.message || "Unknown error";
          enqueueSnackbar("Failed to update profile: " + errorMessage, {
            variant: "error",
          });
        });
    } catch (error) {
      setIsSaving(false);
      console.error("Failed to update profile:", error);
      enqueueSnackbar("Failed to update profile. Please try again.", {
        variant: "error",
      });
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview image locally
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result);
      };
      reader.readAsDataURL(file);

      // Upload image to server
      handleUploadProfilePicture(file);
    }
  };

  // Upload profile picture
  const handleUploadProfilePicture = (file) => {
    if (!token || !file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      apiRequest({
        endpoint: UPLOAD_PROFILE_PICTURE,
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          // console.log("Upload Profile Picture Response:", response);
          setIsUploadingImage(false);
          enqueueSnackbar(
            response?.message || "Profile picture uploaded successfully!",
            {
              variant: "success",
            }
          );
          fetchProfileData();
        })
        .catch((error) => {
          setIsUploadingImage(false);
          console.error("Failed to upload profile picture:", error);
          const errorMessage =
            error.response?.data?.message || error.message || "Unknown error";
          enqueueSnackbar("Failed to upload profile picture: " + errorMessage, {
            variant: "error",
          });
        });
    } catch (error) {
      setIsUploadingImage(false);
      console.error("Failed to upload profile picture:", error);
      enqueueSnackbar("Failed to upload profile picture. Please try again.", {
        variant: "error",
      });
    }
  };

  // Delete profile picture
  const handleDeleteProfilePicture = () => {
    if (!token) return;

    setIsUploadingImage(true);
    try {
      apiRequest({
        endpoint: DELETE_PROFILE_PICTURE,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          // console.log("Delete Profile Picture Response:", response);
          setIsUploadingImage(false);
          setProfileImage(null);
          enqueueSnackbar(
            response?.message || "Profile picture deleted successfully!",
            {
              variant: "success",
            }
          );
          fetchProfileData();
        })
        .catch((error) => {
          setIsUploadingImage(false);
          console.error("Failed to delete profile picture:", error);
          const errorMessage =
            error.response?.data?.message || error.message || "Unknown error";
          enqueueSnackbar("Failed to delete profile picture: " + errorMessage, {
            variant: "error",
          });
        });
    } catch (error) {
      setIsUploadingImage(false);
      console.error("Failed to delete profile picture:", error);
      enqueueSnackbar("Failed to delete profile picture. Please try again.", {
        variant: "error",
      });
    }
  };

  // Copy referral code
  const handleCopyReferral = () => {
    const referralCode = profileData?.profile?.referral_code;
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopiedReferral(true);
      enqueueSnackbar("Referral code copied!", { variant: "success" });
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Show shimmer loader while loading
  if (isLoading && !profileData) {
    return (
      <div className="min-h-screen bg-(--bg-primary)">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-(--accent-primary)">
              Profile Settings
            </h1>
            <p className="text-(--text-secondary) mt-2">
              Manage your account information and settings
            </p>
          </div>
          <ShimmerLoader variant="dashboard" />
        </div>
      </div>
    );
  }

  const profile = profileData?.profile;
  const accountStatus = profileData?.account_status;

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--accent-primary)">
            Profile Settings
          </h1>
          <p className="text-(--text-secondary) mt-2">
            Manage your account information and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card & Account Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture Card */}
            <div className="bg-(--bg-card) border border-(--border-primary) rounded-xl p-6 shadow-lg">
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative mb-4 group">
                  <div className="w-32 h-32 rounded-full bg-(--bg-tertiary) flex items-center justify-center overflow-hidden border-4 border-(--border-secondary)">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-(--text-muted)" />
                    )}
                  </div>
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-(--accent-primary) text-(--text-primary) p-2 rounded-full cursor-pointer hover:bg-(--accent-hover) transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-5 h-5" />
                  </label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                  {profileImage && (
                    <button
                      onClick={handleDeleteProfilePicture}
                      disabled={isUploadingImage}
                      className="absolute top-0 right-0 bg-(--status-error) hover:opacity-95 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all duration-200 transform group-hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete profile picture"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isUploadingImage && (
                  <p className="text-sm text-(--accent-primary) mb-2">
                    Uploading...
                  </p>
                )}

                {/* User Info */}
                <h3 className="text-xl font-bold text-(--text-primary) text-center mb-1">
                  {profile?.name || "User"}
                </h3>
                <p className="text-(--text-secondary) text-sm mb-4">
                  {profile?.email}
                </p>

                {/* Referral Code */}
                <div className="w-full bg-(--bg-tertiary) border border-(--border-secondary) rounded-lg p-3">
                  <p className="text-(--text-secondary) text-xs mb-1">
                    Referral Code
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-(--accent-primary) font-bold text-lg font-mono">
                      {profile?.referral_code || "N/A"}
                    </span>
                    <button
                      onClick={handleCopyReferral}
                      className="text-(--accent-primary) hover:text-(--accent-hover) transition-colors"
                    >
                      {copiedReferral ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-(--bg-card) border border-(--border-primary) rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-(--text-primary) mb-4">
                Account Status
              </h3>
              <div className="space-y-3">
                {/* Account Verified */}
                <div className="flex items-start gap-3 p-3 bg-(--bg-tertiary) rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      accountStatus?.account_verified?.status
                        ? "bg-green-500/20"
                        : "bg-gray-500/20"
                    }`}
                  >
                    <ShieldCheck
                      className={`w-5 h-5 ${
                        accountStatus?.account_verified?.status
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-(--text-primary) font-semibold text-sm">
                      {accountStatus?.account_verified?.label ||
                        "Account Status"}
                    </p>
                    <p className="text-(--text-muted) text-xs">
                      {accountStatus?.account_verified?.description}
                    </p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-start gap-3 p-3 bg-(--bg-tertiary) rounded-lg">
                  <div className="p-2 rounded-full bg-blue-500/20">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-(--text-primary) font-semibold text-sm">
                      {accountStatus?.member_since?.label || "Member Since"}
                    </p>
                    <p className="text-(--text-secondary) text-xs">
                      {accountStatus?.member_since?.description}
                    </p>
                  </div>
                </div>

                {/* Premium User */}
                <div className="flex items-start gap-3 p-3 bg-(--bg-tertiary) rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      accountStatus?.premium_user?.status
                        ? "bg-yellow-500/20"
                        : "bg-gray-500/20"
                    }`}
                  >
                    <Crown
                      className={`w-5 h-5 ${
                        accountStatus?.premium_user?.status
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-(--text-primary) font-semibold text-sm">
                      {accountStatus?.premium_user?.label || "Account Type"}
                    </p>
                    <p className="text-(--text-secondary) text-xs">
                      {accountStatus?.premium_user?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-(--bg-card) border border-(--border-primary) rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-(--text-primary) mb-6">
                Personal Information
              </h3>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-(--text-secondary) text-sm font-medium mb-2">
                    Full Name <span className="text-(--status-error)">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-(--text-muted)" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-10 pr-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-(--status-error) text-xs mt-1">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-(--text-secondary) text-sm font-medium mb-2">
                      Email Address{" "}
                      <span className="text-(--status-error)">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-(--text-muted)" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-10 pr-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-(--status-error) text-xs mt-1">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-(--text-secondary) text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-(--text-muted)" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-10 pr-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-(--status-error) text-xs mt-1">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-(--text-secondary) text-sm font-medium mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-(--text-muted)" />
                    </div>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formik.values.date_of_birth}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-10 pr-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent"
                    />
                  </div>
                  {formik.touched.date_of_birth &&
                    formik.errors.date_of_birth && (
                      <p className="text-(--status-error) text-xs mt-1">
                        {formik.errors.date_of_birth}
                      </p>
                    )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-(--text-secondary) text-sm font-medium mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                      <MapPin className="w-5 h-5 text-(--text-muted)" />
                    </div>
                    <textarea
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent resize-none"
                      placeholder="Enter your address"
                    />
                  </div>
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-(--status-error) text-xs mt-1">
                      {formik.errors.address}
                    </p>
                  )}
                </div>

                {/* City, State, Country */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-(--text-secondary) text-sm font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent"
                      placeholder="City"
                    />
                    {formik.touched.city && formik.errors.city && (
                      <p className="text-(--status-error) text-xs mt-1">
                        {formik.errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-(--text-secondary) text-sm font-medium mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent"
                      placeholder="State"
                    />
                    {formik.touched.state && formik.errors.state && (
                      <p className="text-(--status-error) text-xs mt-1">
                        {formik.errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-(--text-secondary) text-sm font-medium mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent"
                      placeholder="Country"
                    />
                    {formik.touched.country && formik.errors.country && (
                      <p className="text-(--status-error) text-xs mt-1">
                        {formik.errors.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-(--text-secondary) text-sm font-medium mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formik.values.postal_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent"
                    placeholder="Enter postal code"
                  />
                  {formik.touched.postal_code && formik.errors.postal_code && (
                    <p className="text-(--status-error) text-xs mt-1">
                      {formik.errors.postal_code}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving || !formik.isValid}
                    className="px-6 py-3 bg-(--accent-primary) hover:bg-(--accent-hover) text-(--text-primary) rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-(--text-primary)"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
