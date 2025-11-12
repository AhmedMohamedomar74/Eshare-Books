import React from 'react';
import { Link } from 'react-router-dom';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';

const ProfileHeader = ({ user }) => {
  return (
    <div className="flex p-4 bg-white rounded-xl shadow-sm border border-[#dfe2e2] mb-6 relative">
      {/* Flag Icon */}
      <Link
        to="/myreports"
        className="absolute top-3 right-3 text-[#6f7b7b] hover:text-[#e91e63] transition-colors duration-200"
        title="My Reports"
      >
        <OutlinedFlagIcon sx={{ fontSize: 22 }} />
      </Link>
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex gap-4">
          <div
            className="rounded-full min-h-24 w-24 sm:min-h-32 sm:w-32 bg-cover bg-center"
            style={{
              backgroundImage: `url("${user.profilePic}")`,
            }}
          />
          <div className="flex flex-col justify-center">
            <p className="text-xl sm:text-2xl font-bold">{user.fullName}</p>
            <p className="text-[#6f7b7b] text-sm sm:text-base">{user.email}</p>
            <p className="text-[#6f7b7b] text-sm sm:text-base">{user.address}</p>
            <div className="flex gap-4 mt-2">
              <span className="text-[#6f7b7b] text-sm">Friends: {user.friends?.length || 0}</span>
              <span className="text-[#6f7b7b] text-sm">
                Member since: {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <button className="h-10 px-4 bg-[#f6f7f7] border border-[#dfe2e2] rounded-lg text-sm font-bold hover:bg-[#4c7b7b]/10 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
