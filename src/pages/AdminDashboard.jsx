import { Link } from "react-router-dom";
import { BarChart3, Building2, ClipboardCheck, Users } from "lucide-react";
import Navbar from "../components/Navbar";

const metrics = [
  { label: "Active Listings", value: "128", icon: Building2 },
  { label: "Open Enquiries", value: "34", icon: ClipboardCheck },
  { label: "Registered Users", value: "2.4k", icon: Users },
  { label: "Monthly Visits", value: "18.7k", icon: BarChart3 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="wf-container pt-28 pb-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">Admin Dashboard</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">Akshar Estate The Property HUB Admin Control</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Test admin workspace for listing oversight, enquiries, users, and property operations.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon }) => (
            <div key={label} className="wf-card p-6 shadow-sm">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <Icon size={22} />
              </div>
              <p className="text-3xl font-extrabold text-slate-950">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <Link to="/pricing" className="wf-btn wf-btn-primary mt-8">
          Review Properties
        </Link>
      </main>
    </div>
  );
}
