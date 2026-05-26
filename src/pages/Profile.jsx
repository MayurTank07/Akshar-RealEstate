import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle2, Clock, Edit3, FileText, Home, Upload, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import useAuth from "../contexts/useAuth";
import { ownerApi } from "../services/api";
import { formatINR, parseINRAmount } from "../utils/currency";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  needs_changes: "bg-blue-50 text-blue-700 ring-blue-200",
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
  needs_changes: Edit3,
};

const initialForm = {
  ownerDetails: {
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    ownershipType: "Owner",
  },
  propertyDetails: {
    title: "",
    type: "Apartment",
    purpose: "sale",
    city: "",
    area: "",
    address: "",
    bhk: "",
    rooms: "",
    carpetArea: "",
    builtUpArea: "",
    areaUnit: "sqft",
    floorNumber: "",
    totalFloors: "",
    furnishing: "",
    parking: "",
    facing: "",
    ageOfProperty: "",
    expectedPrice: "",
    negotiable: false,
    maintenanceCharges: "",
    amenities: [],
    description: "",
    nearbyLandmarks: "",
    availability: "Available",
    notes: "",
  },
  media: { photos: [], videos: [], documents: [] },
  declaration: {
    ownerOrAuthorized: false,
    accurateDetails: false,
    mediaBelongsToProperty: false,
    understandsRemoval: false,
    agreesContact: false,
  },
};

const amenities = ["Parking", "Lift", "Security", "Garden", "Power Backup", "Gym", "CCTV", "Club House", "Balcony", "Water Supply"];
const propertyAgeOptions = ["", "Under Construction", "New / 0-1 Years", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"];

function cloneForm(form) {
  return JSON.parse(JSON.stringify(form));
}

function requestToForm(request, user) {
  const form = cloneForm(initialForm);
  form.ownerDetails = {
    name: request?.name || user?.name || "",
    email: request?.email || user?.email || "",
    phone: request?.phone || user?.phone || "",
    alternatePhone: request?.alternatePhone || "",
    ownershipType: request?.ownershipType || "Owner",
  };
  form.propertyDetails = { ...form.propertyDetails, ...(request?.propertyDetails || {}) };
  form.propertyDetails.expectedPrice = request?.propertyDetails?.expectedPrice || "";
  form.propertyDetails.maintenanceCharges = request?.propertyDetails?.maintenanceCharges || "";
  form.propertyDetails.carpetArea = request?.propertyDetails?.carpetArea || "";
  form.propertyDetails.builtUpArea = request?.propertyDetails?.builtUpArea || "";
  form.media = {
    photos: request?.media?.photos || [],
    videos: request?.media?.videos || [],
    documents: request?.media?.documents || [],
  };
  form.declaration = { ...initialForm.declaration };
  return form;
}

function buildPayload(form) {
  return {
    ...form,
    propertyDetails: {
      ...form.propertyDetails,
      expectedPrice: parseINRAmount(form.propertyDetails.expectedPrice),
      maintenanceCharges: parseINRAmount(form.propertyDetails.maintenanceCharges),
      carpetArea: Number(form.propertyDetails.carpetArea || 0),
      builtUpArea: Number(form.propertyDetails.builtUpArea || 0),
    },
  };
}

export default function Profile() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(location.state?.action === "add");

  const load = async () => {
    setLoading(true);
    try {
      setError("");
      const response = await ownerApi.list();
      setRequests(response.data || []);
    } catch (err) {
      setError(err.message || "Unable to load your submitted properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let active = true;
    ownerApi.list()
      .then((response) => {
        if (!active) return;
        setRequests(response.data || []);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load your submitted properties.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ redirectTo: "/profile", redirectState: { action: "add" }, message: "Please login or register to submit your owner property." }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6">
        <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900">
          <ArrowLeft size={16} /> Back
        </button>

        <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.10)] sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">Owner Dashboard</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">My Properties</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Submit your property for verification. Approved listings become visible on Akshar Estate The Property HUB.
              </p>
            </div>
            <button type="button" onClick={() => { setEditing(null); setShowForm(true); }} className="wf-btn wf-btn-primary">
              <Building2 size={18} /> Add Property
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Total submitted" value={requests.length} />
            <Metric label="Pending review" value={requests.filter((item) => item.status === "pending").length} />
            <Metric label="Approved" value={requests.filter((item) => item.status === "approved").length} />
            <Metric label="Needs action" value={requests.filter((item) => ["rejected", "needs_changes"].includes(item.status)).length} />
          </div>
        </section>

        <InlineAlert message={error} />

        {showForm && (
          <OwnerPropertyForm
            user={user}
            request={editing}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            onSaved={() => { setShowForm(false); setEditing(null); load(); }}
          />
        )}

        <section className="mt-8">
          {loading && <div className="rounded-3xl bg-white p-10 text-center text-sm font-bold text-slate-500 shadow-sm">Loading submitted properties...</div>}
          {!loading && requests.length === 0 && !showForm && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <Home className="mx-auto h-10 w-10 text-blue-500" />
              <h2 className="mt-4 text-xl font-black text-slate-950">No owner properties submitted yet</h2>
              <p className="mt-2 text-sm text-slate-500">Add your first property and our team will verify it before publishing.</p>
            </div>
          )}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {requests.map((request) => (
              <OwnerRequestCard
                key={request._id}
                request={request}
                onEdit={() => {
                  setEditing(request);
                  setShowForm(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function OwnerPropertyForm({ user, request, onCancel, onSaved }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => requestToForm(request, user));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const updateOwner = (key, value) => setForm((current) => ({ ...current, ownerDetails: { ...current.ownerDetails, [key]: value } }));
  const updateProperty = (key, value) => setForm((current) => ({ ...current, propertyDetails: { ...current.propertyDetails, [key]: value } }));
  const toggleAmenity = (amenity) => setForm((current) => {
    const selected = new Set(current.propertyDetails.amenities || []);
    if (selected.has(amenity)) selected.delete(amenity);
    else selected.add(amenity);
    return { ...current, propertyDetails: { ...current.propertyDetails, amenities: [...selected] } };
  });
  const toggleDeclaration = (key) => setForm((current) => ({ ...current, declaration: { ...current.declaration, [key]: !current.declaration[key] } }));

  const errors = useMemo(() => {
    const items = [];
    if (!form.ownerDetails.name.trim()) items.push("Owner name is required.");
    if (!/^\S+@\S+\.\S+$/.test(form.ownerDetails.email)) items.push("Valid owner email is required.");
    if (form.ownerDetails.phone.replace(/\D/g, "").length < 10) items.push("Valid owner phone is required.");
    if (!form.ownerDetails.ownershipType.trim()) items.push("Ownership type is required.");
    if (!form.propertyDetails.title.trim()) items.push("Property title is required.");
    if (!form.propertyDetails.city.trim() || !form.propertyDetails.area.trim()) items.push("City and area are required.");
    if (!parseINRAmount(form.propertyDetails.expectedPrice)) items.push("Expected price/rent must be numeric.");
    if ((form.propertyDetails.description || "").trim().length < 20) items.push("Property description must be at least 20 characters.");
    if (!form.media.photos.length) items.push("At least one property photo is required.");
    if (!Object.values(form.declaration).every(Boolean)) items.push("All declaration checkboxes must be accepted.");
    return items;
  }, [form]);

  const uploadFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const response = await ownerApi.upload([...files]);
      setForm((current) => ({
        ...current,
        media: {
          photos: [...current.media.photos, ...(response.data.photos || [])],
          videos: [...current.media.videos, ...(response.data.videos || [])],
          documents: [...current.media.documents, ...(response.data.documents || [])],
        },
      }));
      setSuccess("Files uploaded successfully.");
    } catch (err) {
      setError(err.message || "Upload failed. You can add media URLs manually for now.");
    } finally {
      setUploading(false);
    }
  };

  const addMediaUrl = (kind, value) => {
    const url = value.trim();
    if (!url) return;
    setForm((current) => ({ ...current, media: { ...current.media, [kind]: [...current.media[kind], url] } }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (errors.length) {
      setError(errors[0]);
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload(form);
      if (request?._id) await ownerApi.update(request._id, payload);
      else await ownerApi.create(payload);
      setSuccess(request ? "Property resubmitted for review." : "Property submitted for review.");
      setTimeout(onSaved, 600);
    } catch (err) {
      setError(err.message || "Unable to submit property.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
      <div className="sticky top-24 z-10 flex flex-col gap-4 border-b border-slate-100 bg-white/95 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">{request ? "Edit & Resubmit Property" : "Submit Owner Property"}</h2>
          <p className="mt-1 text-sm text-slate-500">Step {step} of 4</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((item) => (
            <button key={item} type="button" onClick={() => setStep(item)} className={`h-2.5 w-10 rounded-full ${step === item ? "bg-blue-600" : "bg-slate-200"}`} aria-label={`Go to step ${item}`} />
          ))}
        </div>
      </div>

      <div className="space-y-6 p-5 pb-28 sm:p-7 sm:pb-28">
        <InlineAlert message={error} tone="error" />
        <InlineAlert message={success} tone="success" />

        {step === 1 && (
          <FormGrid title="Owner Details" subtitle="These details help our team verify the listing owner.">
            <TextField label="Owner full name" value={form.ownerDetails.name} onChange={(value) => updateOwner("name", value)} required />
            <TextField label="Owner phone" value={form.ownerDetails.phone} onChange={(value) => updateOwner("phone", value)} required />
            <TextField label="Owner email" type="email" value={form.ownerDetails.email} onChange={(value) => updateOwner("email", value)} required />
            <TextField label="Alternate phone" value={form.ownerDetails.alternatePhone} onChange={(value) => updateOwner("alternatePhone", value)} />
            <SelectField label="Ownership type" value={form.ownerDetails.ownershipType} onChange={(value) => updateOwner("ownershipType", value)} options={["Owner", "Authorized Person", "Family Member", "Power of Attorney Holder"]} />
          </FormGrid>
        )}

        {step === 2 && (
          <FormGrid title="Property Details" subtitle="Core listing information shown after approval.">
            <TextField label="Property title" value={form.propertyDetails.title} onChange={(value) => updateProperty("title", value)} required />
            <SelectField label="Property type" value={form.propertyDetails.type} onChange={(value) => updateProperty("type", value)} options={["Apartment", "Villa", "Bungalow", "Plot", "Office", "Shop", "Showroom", "Warehouse", "Land"]} />
            <SelectField label="Sale/Rent purpose" value={form.propertyDetails.purpose} onChange={(value) => updateProperty("purpose", value)} options={["sale", "rent", "pre-leased", "other"]} />
            <TextField label="City" value={form.propertyDetails.city} onChange={(value) => updateProperty("city", value)} required />
            <TextField label="Area/location" value={form.propertyDetails.area} onChange={(value) => updateProperty("area", value)} required />
            <TextField label="Full address" value={form.propertyDetails.address} onChange={(value) => updateProperty("address", value)} />
            <TextField label="BHK / rooms" value={form.propertyDetails.bhk} onChange={(value) => updateProperty("bhk", value)} />
            <TextField label="Built-up area" type="number" value={form.propertyDetails.builtUpArea} onChange={(value) => updateProperty("builtUpArea", value)} />
            <SelectField label="Area unit" value={form.propertyDetails.areaUnit} onChange={(value) => updateProperty("areaUnit", value)} options={["sqft", "sq-yard", "sq-meter", "vigha", "acre"]} />
            <TextField label="Expected price/rent" type="number" prefix="Rs." value={form.propertyDetails.expectedPrice} onChange={(value) => updateProperty("expectedPrice", value)} required />
            <TextField label="Maintenance charges" type="number" prefix="Rs." value={form.propertyDetails.maintenanceCharges} onChange={(value) => updateProperty("maintenanceCharges", value)} />
            <SelectField label="Availability" value={form.propertyDetails.availability} onChange={(value) => updateProperty("availability", value)} options={["Available", "Immediate", "Within 30 days", "Under Construction", "Occupied"]} />
          </FormGrid>
        )}

        {step === 3 && (
          <FormGrid title="More Details & Media" subtitle="Add the details that make this listing useful.">
            <SelectField label="Furnishing" value={form.propertyDetails.furnishing} onChange={(value) => updateProperty("furnishing", value)} options={["", "Unfurnished", "Semi Furnished", "Fully Furnished"]} />
            <TextField label="Floor number" value={form.propertyDetails.floorNumber} onChange={(value) => updateProperty("floorNumber", value)} />
            <TextField label="Total floors" value={form.propertyDetails.totalFloors} onChange={(value) => updateProperty("totalFloors", value)} />
            <SelectField label="Parking" value={form.propertyDetails.parking} onChange={(value) => updateProperty("parking", value)} options={["", "No Parking", "1 Car", "2 Cars", "Open Parking", "Reserved Parking"]} />
            <SelectField label="Facing" value={form.propertyDetails.facing} onChange={(value) => updateProperty("facing", value)} options={["", "East", "West", "North", "South", "North-East", "Road Facing", "Garden Facing"]} />
            <SelectField label="Property age" value={form.propertyDetails.ageOfProperty} onChange={(value) => updateProperty("ageOfProperty", value)} options={propertyAgeOptions} helper="Property age means how old the property/building is since construction completion." />
            <TextArea label="Property description" value={form.propertyDetails.description} onChange={(value) => updateProperty("description", value)} required />
            <TextArea label="Nearby landmarks" value={form.propertyDetails.nearbyLandmarks} onChange={(value) => updateProperty("nearbyLandmarks", value)} />
            <div className="lg:col-span-2">
              <label className="wf-label">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={`rounded-full px-3 py-2 text-xs font-bold ring-1 transition ${form.propertyDetails.amenities.includes(amenity) ? "bg-blue-600 text-white ring-blue-600" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}>
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
              <label className="wf-label">Photos, videos, documents</label>
              <input type="file" multiple accept="image/*,video/*,application/pdf" onChange={(event) => uploadFiles(event.target.files)} className="hidden" id="owner-media-upload" />
              <label htmlFor="owner-media-upload" className="wf-btn wf-btn-secondary inline-flex cursor-pointer">
                <Upload size={16} /> {uploading ? "Uploading..." : "Upload files"}
              </label>
              <MediaUrlInput label="Add photo URL" onAdd={(value) => addMediaUrl("photos", value)} />
              <MediaUrlInput label="Add video URL" onAdd={(value) => addMediaUrl("videos", value)} />
              <MediaUrlInput label="Add document URL" onAdd={(value) => addMediaUrl("documents", value)} />
              <p className="mt-3 text-xs font-semibold text-slate-500">{form.media.photos.length} photos, {form.media.videos.length} videos, {form.media.documents.length} documents attached</p>
            </div>
          </FormGrid>
        )}

        {step === 4 && (
          <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">Self Declaration</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">Confirm before submitting</h3>
            <div className="mt-5 space-y-3">
              {[
                ["ownerOrAuthorized", "I confirm I am the owner or authorized person for this property."],
                ["accurateDetails", "I confirm all details provided are true and accurate."],
                ["mediaBelongsToProperty", "I confirm uploaded photos/videos belong to this property."],
                ["understandsRemoval", "I understand false information may lead to rejection/removal."],
                ["agreesContact", "I agree to be contacted by Akshar Estate The Property team for verification."],
              ].map(([key, label]) => (
                <label key={key} className="flex gap-3 rounded-2xl bg-white p-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                  <input type="checkbox" checked={form.declaration[key]} onChange={() => toggleDeclaration(key)} className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-200">
              <p className="font-black text-slate-950">Submission preview</p>
              <p className="mt-2">{form.propertyDetails.title || "Untitled property"} in {form.propertyDetails.area || "area"}, {form.propertyDetails.city || "city"} for {formatINR(parseINRAmount(form.propertyDetails.expectedPrice))}</p>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-20 flex flex-col gap-3 border-t border-slate-100 bg-white/95 p-4 backdrop-blur sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="wf-btn wf-btn-secondary">Cancel</button>
        {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="wf-btn wf-btn-secondary">Back</button>}
        {step < 4 ? (
          <button type="button" onClick={() => setStep(step + 1)} className="wf-btn wf-btn-primary">Continue</button>
        ) : (
          <button type="submit" disabled={saving} className="wf-btn wf-btn-primary disabled:cursor-not-allowed disabled:opacity-70">{saving ? "Submitting..." : request ? "Resubmit Property" : "Submit for Review"}</button>
        )}
      </div>
    </form>
  );
}

function OwnerRequestCard({ request, onEdit }) {
  const Icon = statusIcons[request.status] || Clock;
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_14px_45px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-slate-950">{request.propertyDetails?.title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">{request.propertyDetails?.area}, {request.propertyDetails?.city}</p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-black capitalize ring-1 ${statusStyles[request.status] || statusStyles.pending}`}>
          <Icon size={14} /> {request.status?.replace("_", " ")}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Mini label="Expected" value={formatINR(request.propertyDetails?.expectedPrice || 0)} />
        <Mini label="Type" value={request.propertyDetails?.type || "-"} />
        <Mini label="Submitted" value={request.createdAt?.slice(0, 10) || "-"} />
        <Mini label="Purpose" value={request.propertyDetails?.purpose || "-"} />
      </div>
      {request.reviewRemarks && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-600">
          {request.reviewRemarks}
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {request.approvedPropertyId?._id && (
          <Link to={`/property/${request.approvedPropertyId._id}`} className="wf-btn wf-btn-secondary text-sm">
            <FileText size={15} /> View Listing
          </Link>
        )}
        {["rejected", "needs_changes", "pending"].includes(request.status) && (
          <button type="button" onClick={onEdit} className="wf-btn wf-btn-primary text-sm">
            <Edit3 size={15} /> {request.status === "pending" ? "Edit" : "Edit & Resubmit"}
          </button>
        )}
      </div>
    </article>
  );
}

function Metric({ label, value }) {
  return <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>;
}

function Mini({ label, value }) {
  return <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-400">{label}</p><p className="mt-1 truncate font-black text-slate-900">{value}</p></div>;
}

function InlineAlert({ message, tone = "error" }) {
  if (!message) return null;
  const cls = tone === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-rose-100 bg-rose-50 text-rose-700";
  return <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${cls}`}>{message}</div>;
}

function FormGrid({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-slate-100 p-5 sm:p-6">
      <h3 className="text-xl font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, type = "text", required = false, prefix = "" }) {
  return (
    <label className="block">
      <span className="wf-label">{label}{required ? " *" : ""}</span>
      <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        {prefix && <span className="grid min-w-14 place-items-center border-r border-slate-200 bg-slate-50 text-sm font-black text-slate-500">{prefix}</span>}
        <input type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="min-h-12 flex-1 border-0 px-4 text-sm font-semibold text-slate-900 outline-none" required={required} />
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options, helper = "" }) {
  return (
    <label className="block">
      <span className="wf-label">{label}</span>
      <select value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="wf-input min-h-12 rounded-2xl bg-white font-semibold">
        {options.map((option) => <option key={option} value={option}>{option || "Select"}</option>)}
      </select>
      {helper && <span className="mt-2 block text-xs font-semibold leading-5 text-slate-500">{helper}</span>}
    </label>
  );
}

function TextArea({ label, value, onChange, required = false }) {
  return (
    <label className="block lg:col-span-2">
      <span className="wf-label">{label}{required ? " *" : ""}</span>
      <textarea value={value ?? ""} onChange={(event) => onChange(event.target.value)} rows={4} className="wf-input min-h-28 rounded-2xl bg-white font-semibold" required={required} />
    </label>
  );
}

function MediaUrlInput({ label, onAdd }) {
  const [value, setValue] = useState("");
  return (
    <div className="mt-3 flex gap-2">
      <input value={value} onChange={(event) => setValue(event.target.value)} placeholder={label} className="wf-input min-h-11 flex-1 rounded-xl bg-white text-sm" />
      <button type="button" onClick={() => { onAdd(value); setValue(""); }} className="wf-btn wf-btn-secondary text-sm">Add</button>
    </div>
  );
}
