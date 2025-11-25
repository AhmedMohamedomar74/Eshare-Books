import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import EditIcon from '@mui/icons-material/Edit';
import { uploadImage } from '../../services/auth/auth.service.js';

const ProfileHeader = ({ user }) => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(user.profilePic);
  const navigate = useNavigate();

  const handleImageClick = () => {
    console.log('Profile image clicked! Opening file browser...');
    console.log({ user });
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name);

    // Create temporary URL for immediate preview
    const tempUrl = URL.createObjectURL(file);
    setProfileImage(tempUrl);

    try {
      console.log('Starting image upload...');
      const response = await uploadImage(file, user.id);
      console.log('Image upload successful:', response);

      // If the API returns the new image URL, use it instead of the temporary one
      if (response.data && response.data.imageUrl) {
        setProfileImage(response.data.imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Revert to original image if upload fails
      setProfileImage(user.profilePic);
    } finally {
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleFlagClick = () => {
    navigate('/myreports');
  };

  return (
    <div className="flex p-4 bg-white rounded-xl shadow-sm border border-[#dfe2e2] mb-6 relative">
      {/* Flag Icon */}
      <div
        onClick={handleFlagClick}
        className="absolute top-3 right-3 text-[#6f7b7b] hover:text-[#e91e63] transition-colors duration-200 cursor-pointer"
        title="My Reports"
      >
        <OutlinedFlagIcon sx={{ fontSize: 22 }} />
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex gap-4">
          {/* Profile Image with click handler and edit icon on hover */}
          <div
            className="relative rounded-full min-h-24 w-24 sm:min-h-32 sm:w-32 bg-cover bg-center cursor-pointer group"
            onClick={handleImageClick}
            title="Click to change profile picture"
          >
            <div
              className="rounded-full w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url("${
                  profileImage || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'
                }")`,
              }}
            />

            {/* Hover overlay with edit icon */}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <EditIcon className="text-white" sx={{ fontSize: 32 }} />
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

          <div className="flex flex-col justify-center">
            <p className="text-xl sm:text-2xl font-bold">{user.fullName}</p>
            <p className="text-[#6f7b7b] text-sm sm:text-base">{user.email}</p>
            <p className="text-[#6f7b7b] text-sm sm:text-base">{user.address}</p>
            <div className="flex gap-4 mt-2">
              <span className="text-[#6f7b7b] text-sm">
                Member since: {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
