import React from "react";
import { useSelector } from 'react-redux';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  // Get translations from Redux
  const { content } = useSelector((state) => state.lang);
  
  const tabs = [
    { 
      id: "my-books", 
      label: content.myBooks || "My Books" 
    },
    { 
      id: "requested-books", 
      label: content.requestedBooks || "Requests to My Books" 
    },
    { 
      id: "received-requests", 
      label: content.receivedRequests || "Books I Requested" 
    },
  ];

  return (
    <div className="pb-3 sticky top-0 bg-[#f6f7f7] z-10">
      <div className="flex border-b border-[#dfe2e2] px-4 gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 text-sm font-bold whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-[#4c7b7b] text-[#4c7b7b]"
                : "border-b-transparent text-[#6f7b7b] hover:text-[#4c7b7b]"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;