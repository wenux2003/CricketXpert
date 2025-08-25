export default function Topbar() {
  return (
    <header className="w-full flex justify-between items-center bg-white px-8 py-4 rounded-2xl mb-6 shadow border border-gray-200">
      {/* Page Title */}
      <h2 className="text-2xl text-gray-800 font-semibold tracking-wider">
        Dashboard
      </h2>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* User Role */}
        <span className="text-gray-600 font-medium">Coach Manager</span>

        {/* Avatar */}
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="avatar"
          className="rounded-full w-10 h-10 border-2 border-indigo-200 shadow-sm"
        />
      </div>
    </header>
  );
}
