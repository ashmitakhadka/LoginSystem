import { useState } from 'react';

export const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  function handleClick() {
    setIsEditing(true);
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <i className="fa-solid fa-user text-xl text-blue-600"></i>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>

          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Name */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Name</span>

          {isEditing ? (
            <input
              type="text"
              className="w-52 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              value={editName}
              onChange={(event) => {
                setEditName(event.target.value);
              }}
            />
          ) : (
            <span className="text-sm font-medium text-gray-800">
              {user.name}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Email</span>
          {isEditing ? (
            <input
              type="text"
              className="w-52 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              value={editEmail}
              onChange={(event) => {
                setEditEmail(event.target.value);
              }}
            />
          ) : (
            <span className="ml-4 max-w-[220px] truncate text-right text-sm font-medium text-gray-800">
              {user.email}
            </span>
          )}
        </div>

        {/* Role */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Role</span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              user.role === 'admin'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {user.role.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="pt-5">
        <button
          type="button"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          onClick={handleClick}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>
    </div>
  );
};
