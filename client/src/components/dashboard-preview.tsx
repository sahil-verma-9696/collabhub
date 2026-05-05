export function DashboardPreview() {
  return (
    <div className="w-[calc(100vw-32px)] md:w-290">
      <div className="bg-primary-light/50 rounded-2xl p-2 shadow-2xl">
        <img
          src="/dashboard-preview.png"
          alt="Dashboard preview"
          width={1160}
          height={700}
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}
