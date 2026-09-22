export const UserProfile = ({ user }) => {
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
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Name</span>

          <span className="text-sm font-medium text-gray-800">{user.name}</span>
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Email</span>

          <span className="ml-4 max-w-[220px] truncate text-right text-sm font-medium text-gray-800">
            {user.email}
          </span>
        </div>

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
    </div>
  );
};
