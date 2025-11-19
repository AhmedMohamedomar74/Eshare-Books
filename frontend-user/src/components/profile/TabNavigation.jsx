import React from "react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "my-books", label: "My Books" },
  ];

  return (
    <div className="pb-3 sticky top-0 bg-[#f6f7f7] z-10">
      <div className="flex border-b border-[#dfe2e2] px-4 gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 text-sm font-bold ${
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