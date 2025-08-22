export default function Topbar() {
  return (
    <div className="w-full bg-white shadow flex justify-between items-center p-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Admin</span>
        <img src="https://via.placeholder.com/40" alt="avatar" className="rounded-full w-10 h-10"/>
      </div>
    </div>
  );
}
