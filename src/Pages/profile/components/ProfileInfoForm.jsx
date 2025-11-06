import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Camera, User } from "lucide-react";
import Input from "../../../Component/ui/Input";
import Button from "../../../Component/ui/Button";
import Card from "../../../Component/ui/Card";

const ProfileInfoForm = ({ profileData, isLoading, onSubmit }) => {
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const validationSchema = Yup.object({
    first_name: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .required("First name is required"),
    last_name: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .required("Last name is required"),
    middle_name: Yup.string().max(
      50,
      "Middle name must be less than 50 characters"
    ),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits"),
    isd_code: Yup.number()
      .min(1, "ISD code is required")
      .required("ISD code is required"),
    address: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
    zip_code: Yup.string(),
    referral_code: Yup.string().max(
      20,
      "Referral code must be less than 20 characters"
    ),
  });

  const form = useFormik({
    initialValues: {
      first_name:
        profileData?.name?.split(" ")[0] || profileData?.first_name || "",
      last_name:
        profileData?.name?.split(" ").slice(1).join(" ") ||
        profileData?.last_name ||
        "",
      middle_name: profileData?.middle_name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      isd_code: profileData?.isd_code || 0,
      address: profileData?.address || "",
      city: profileData?.city || "",
      state: profileData?.state || "",
      country: profileData?.country || "",
      zip_code: profileData?.postal_code || profileData?.zip_code || "",
      referral_code: profileData?.referral_code || "",
      profile_picture: profileData?.profile_picture || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values, imageFile);
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result || "");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card title="Profile Information" subtitle="Update your personal details">
      <form onSubmit={form.handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600">
              {profileImage || profileData?.profile_picture ? (
                <img
                  src={profileImage || profileData?.profile_picture || ""}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="profileImage"
              className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">
              {profileData?.name ||
                `${profileData?.first_name || ""} ${
                  profileData?.last_name || ""
                }`.trim()}
            </h3>
            <p className="text-sm text-gray-400">{profileData?.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Click the camera icon to change your profile picture
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            name="first_name"
            type="text"
            value={form.values.first_name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.first_name ? form.errors.first_name : undefined}
            required
          />
          <Input
            label="Last Name"
            name="last_name"
            type="text"
            value={form.values.last_name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.last_name ? form.errors.last_name : undefined}
            required
          />
          <Input
            label="Middle Name"
            name="middle_name"
            type="text"
            value={form.values.middle_name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.middle_name ? form.errors.middle_name : undefined
            }
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.email ? form.errors.email : undefined}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.values.phone}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.phone ? form.errors.phone : undefined}
          />
          <Input
            label="ISD Code"
            name="isd_code"
            type="number"
            value={form.values.isd_code}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.isd_code ? form.errors.isd_code : undefined}
            required
          />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">
            Address Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Address"
              name="address"
              type="text"
              value={form.values.address}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.address ? form.errors.address : undefined}
            />
            <Input
              label="City"
              name="city"
              type="text"
              value={form.values.city}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.city ? form.errors.city : undefined}
            />
            <Input
              label="State"
              name="state"
              type="text"
              value={form.values.state}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.state ? form.errors.state : undefined}
            />
            <Input
              label="Country"
              name="country"
              type="text"
              value={form.values.country}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.country ? form.errors.country : undefined}
            />
            <Input
              label="ZIP Code"
              name="zip_code"
              type="text"
              value={form.values.zip_code}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.zip_code ? form.errors.zip_code : undefined}
            />
            <Input
              label="Referral Code"
              name="referral_code"
              type="text"
              value={form.values.referral_code}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={
                form.touched.referral_code
                  ? form.errors.referral_code
                  : undefined
              }
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || !form.isValid}
            loading={isLoading}
          >
            {isLoading ? "Updating Profile..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileInfoForm;
