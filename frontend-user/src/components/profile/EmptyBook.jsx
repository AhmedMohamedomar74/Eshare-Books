import React from "react";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../hooks/useTranslate";

const EmptyBooksMessage = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-md">
      <p className="text-gray-700 text-lg mb-4">
        {t("emptyLibrary", "Your library is empty 📚")}
      </p>
      <p className="text-gray-500 text-sm mb-6">
        {t(
          "emptyLibraryHint",
          "Start by adding your first book to share with others."
        )}
      </p>
      <button
        onClick={() => navigate("/add-book")}
        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
        {t("addNewBook", "Add New Book")}
      </button>
    </div>
  );
};

export default EmptyBooksMessage;
