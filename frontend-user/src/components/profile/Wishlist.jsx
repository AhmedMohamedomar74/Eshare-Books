import React from "react";

const Wishlist = () => {
  // This would typically come from props or context
  const wishlistItems = []; // Empty for now

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-[#dfe2e2]">
      <h3 className="text-lg font-bold mb-4">My Wishlist</h3>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#6f7b7b] mb-4">Your wishlist is empty</p>
          <p className="text-sm text-[#6f7b7b]">
            Books you add to your wishlist will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
          {/* Wishlist items would be rendered here */}
        </div>
      )}
    </div>
  );
};

export default Wishlist;