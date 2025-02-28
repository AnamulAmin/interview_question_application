import React from "react";

function UserProfileCard({ userData }) {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md flex items-center space-x-4 transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <img
        className="w-24 h-24 rounded-full object-cover"
        src={userData?.photourl || "https://via.placeholder.com/96"}
        alt="User Avatar"
      />
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-semibold text-gray-800">
          {userData?.full_name || "No Name Provided"}
        </h2>
        <p className="text-gray-500">
          <span className="font-medium">Member ID: </span>{userData?.member_id || "N/A"}
        </p>
        <p className="text-gray-500">
          <span className="font-medium">Contact: </span>{userData?.contact_no || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default UserProfileCard;
