import React from "react";
import { FaShoppingCart, FaBookOpen, FaGift, FaList } from "react-icons/fa";
import useTranslate from "../../hooks/useTranslate";

const TransactionFilter = ({ filterType, onFilterChange }) => {
  const { t } = useTranslate(); // استدعاء hook

  const options = [
    { label: t("all", "All"), value: "", icon: <FaList /> },
    { label: t("sale", "Sale"), value: "toSale", icon: <FaShoppingCart /> },
    { label: t("borrow", "Borrow"), value: "toBorrow", icon: <FaBookOpen /> },
    { label: t("donate", "Donate"), value: "toDonate", icon: <FaGift /> },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <span className="text-gray-700 font-medium">
        {t("transactionType", "Transaction Type:")}
      </span>

      <div className="hidden sm:flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none ${
              filterType === option.value
                ? "bg-teal-600 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-teal-100"
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      <select
        value={filterType}
        onChange={(e) => onFilterChange(e.target.value)}
        className="sm:hidden px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TransactionFilter;
