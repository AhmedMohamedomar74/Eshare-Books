import React from "react";
import { useSelector } from 'react-redux';

const PublicProfileHeader = ({ user, onReportUser }) => {
  // Get translations from Redux
  const { content } = useSelector((state) => state.lang);
  
  const fullName = `${user?.firstName || ''} ${user?.secondName || ''}`.trim();
  const defaultImage = 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png';

  return (
    <div className="flex p-4 bg-white rounded-xl shadow-sm border border-[#dfe2e2] mb-6">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex gap-4">
          {/* Profile Image - Read-only, no edit functionality for public profile */}
          <div
            className="rounded-full min-h-24 w-24 sm:min-h-32 sm:w-32 bg-cover bg-center"
            style={{
              backgroundImage: `url("${user?.profilePic || defaultImage}")`,
            }}
          />
          <div className="flex flex-col justify-center">
            <p className="text-xl sm:text-2xl font-bold">{fullName}</p>
            <p className="text-[#6f7b7b] text-sm sm:text-base">
              {user?.email}
            </p>
            <p className="text-[#6f7b7b] text-sm sm:text-base">
              {user?.address}
            </p>
            <div className="flex gap-4 mt-2">
              <span className="text-[#6f7b7b] text-sm">
                {content.friends}: {user?.friendCount || 0}
              </span>
              <span className="text-[#6f7b7b] text-sm">
                {content.memberSince} {user?.memberSince ? new Date(user.memberSince).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onReportUser}
          className="h-10 px-4 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
        >
          {content.reportUser}
        </button>
      </div>
    </div>
  );
};

export default PublicProfileHeader;