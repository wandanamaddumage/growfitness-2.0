import CoachDashboard from "../components/coach-dashboard/CoachDashboard";

export default function CoachDashboardPage() {
    return (
        <div className="min-h-screen bg-[var(--gf-cream)] gf-scope">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* ---------- LEFT ---------- */}
                    <div className="text-center md:text-left">
                        <h1 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>
                            Hi Coach 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">
                            Ready to inspire young athletes today?
                        </p>
                    </div>
                </div>
            </div>
            <CoachDashboard />
        </div>
    );
}