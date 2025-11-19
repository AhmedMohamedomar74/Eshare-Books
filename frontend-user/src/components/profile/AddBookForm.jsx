import React, { useState } from "react";

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    status: "For Share",
    image: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Book data:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-[#dfe2e2]">
      <h3 className="text-lg font-bold mb-4">Add New Book</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-[#6f7b7b] mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-[#dfe2e2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c7b7b]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6f7b7b] mb-1">
            Author
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 border border-[#dfe2e2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c7b7b]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6f7b7b] mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-[#dfe2e2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c7b7b]"
          >
            <option value="For Share">For Share</option>
            <option value="For Sale">For Sale</option>
            <option value="For Donation">For Donation</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6f7b7b] mb-1">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border border-[#dfe2e2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c7b7b]"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-4 bg-[#4c7b7b] text-white rounded-lg text-sm font-bold hover:bg-[#3a5f5f] transition-colors"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;