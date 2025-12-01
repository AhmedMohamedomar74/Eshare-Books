import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeImage, uploadImage } from "../../services/auth/auth.service.js";

const ProfileHeader = ({ user }) => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(user.profilePic);
  const navigate = useNavigate();

  // Get translations from Redux
  const { content } = useSelector((state) => state.lang);

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setProfileImage(tempUrl);

    try {
      const response = await uploadImage(file, user.id);
      if (response.data && response.data.imageUrl) {
        setProfileImage(response.data.imageUrl);
      }
    } catch (error) {
      setProfileImage(user.profilePic || defaultImage);
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    setProfileImage(defaultImage);
    await removeImage(user.profilePic, user.id);
  };

  const handleFlagClick = () => {
    navigate("/myreports");
  };

  return (
    <div className="flex p-4 bg-white rounded-xl shadow-sm border border-[#dfe2e2] mb-6">
      {/* ✅ نخلي الهيدر كله flex بين الصورة و My reports */}
      <div className="flex w-full justify-between items-start">
        {/* Profile Image + معلومات */}
        <div className="flex gap-4">
          {/* Profile Image */}
          <div
            className="relative rounded-full min-h-24 w-24 sm:min-h-32 sm:w-32 bg-cover bg-center cursor-pointer group"
            onClick={handleImageClick}
            title={content.clickToChangeProfilePicture}
          >
            <div
              className="rounded-full w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url("${profileImage || defaultImage}")`,
              }}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex flex-col items-center gap-2">
                <EditIcon className="text-white" sx={{ fontSize: 32 }} />
                {profileImage && profileImage !== defaultImage && (
                  <div
                    className="text-white text-xs flex items-center gap-1 hover:text-red-300 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    title={content.removeProfilePicture}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                    {content.remove}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* User Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xl sm:text-2xl font-bold">{user.fullName}</p>
            <p className="text-[#6f7b7b] text-sm sm:text-base">{user.email}</p>
            <p className="text-[#6f7b7b] text-sm sm:text-base">
              {user.address}
            </p>
            <div className="flex gap-4 mt-2">
              <span className="text-[#6f7b7b] text-sm">
                {content.memberSince}{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

            {profileImage && profileImage !== defaultImage && (
              <button
                onClick={handleRemoveImage}
                className="mt-2 text-red-500 hover:text-red-700 text-sm flex items-center gap-1 w-fit"
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
                {content.removeProfilePicture}
              </button>
            )}
          </div>
        </div>

        {/* ✅ My Reports على اليمين */}
        <div
          onClick={handleFlagClick}
          className="text-[#6f7b7b] hover:text-[#e91e63] transition-colors duration-200 cursor-pointer flex items-center gap-1"
          title={content.myReports}
        >
          <OutlinedFlagIcon sx={{ fontSize: 22 }} />
          {content.myReports}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
