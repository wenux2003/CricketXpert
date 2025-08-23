export default function Topbar() {
  return (
    <header className="w-full flex justify-between items-center bg-[#20273e] px-8 py-4 rounded-2xl mb-6 shadow">
      <h2 className="text-2xl text-white font-semibold tracking-wider">Dashboard</h2>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 rounded-xl bg-[#232b3e] text-gray-300 placeholder-gray-500 border-0"
        />
        <span className="text-gray-300">Coach Manager</span>
        <img src="https://randomuser.me/api/portraits/women/44.jpg"
             alt="avatar"
             className="rounded-full w-10 h-10 border-2 border-[#2d3559]"/>
      </div>
    </header>
  );
}
