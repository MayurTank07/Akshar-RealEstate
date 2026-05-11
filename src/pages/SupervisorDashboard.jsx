import { Link } from "react-router-dom";
import { CalendarCheck, Headphones, Home, MapPinned } from "lucide-react";
import Navbar from "../components/Navbar";

const tasks = [
  { title: "Site Visits Today", value: "12", icon: CalendarCheck },
  { title: "Follow-ups Pending", value: "18", icon: Headphones },
  { title: "Properties Assigned", value: "42", icon: Home },
  { title: "Gujarat Zones", value: "7", icon: MapPinned },
];

export default function SupervisorDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="wf-container pt-28 pb-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">Supervisor Dashboard</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">Field Operations</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Test supervisor workspace for visits, buyer follow-ups, and property verification tasks.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {tasks.map(({ title, value, icon: Icon }) => (
            <div key={title} className="wf-card p-6 shadow-sm">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Icon size={22} />
              </div>
              <p className="text-3xl font-extrabold text-slate-950">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{title}</p>
            </div>
          ))}
        </div>

        <Link to="/pricing" className="wf-btn wf-btn-primary mt-8">
          View Assigned Properties
        </Link>
      </main>
    </div>
  );
}
