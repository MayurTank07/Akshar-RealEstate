import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Building2, CheckCircle2, Clock, Edit3, FileText, Home, Send, ShieldCheck, Trash2, Upload, X, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import useAuth from "../contexts/useAuth";
import { ownerApi, publicApi } from "../services/api";
import { formatINR, formatINRForInput, parseINRAmount, stripINRFormatting } from "../utils/currency";

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
    constructionYear: "",
    expectedPrice: "",
    negotiable: false,
    maintenanceCharges: "",
    amenities: [],
    description: "",
    nearbyLandmarks: "",
    availability: "Available",
    notes: "",
  },
  media: { photos: [], videos: [], documents: [], ownerProofs: [] },
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
const ownerProofTypes = ["Ownership Proof", "Electricity Bill", "Tax Bill", "Index Copy", "Other"];

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
    ownerProofs: request?.media?.ownerProofs || [],
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
      constructionYear: form.propertyDetails.constructionYear ? Number(form.propertyDetails.constructionYear) : null,
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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [actionLoading, setActionLoading] = useState("");

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

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setDeleteReason("");
    setActionLoading("");
  };

  const handleDeletePending = async () => {
    if (!deleteTarget) return;
    setActionLoading("delete");
    setError("");
    try {
      await ownerApi.deletePending(deleteTarget._id);
      closeDeleteModal();
      await load();
    } catch (err) {
      setError(err.message || "Unable to delete this pending property.");
      setActionLoading("");
    }
  };

  const handleRequestDelete = async () => {
    if (!deleteTarget) return;
    if (deleteReason.trim().length < 5) {
      setError("Please add a short reason for the delete request.");
      return;
    }
    setActionLoading("request-delete");
    setError("");
    try {
      await ownerApi.requestDelete(deleteTarget._id, deleteReason.trim());
      closeDeleteModal();
      await load();
    } catch (err) {
      setError(err.message || "Unable to request property deletion.");
      setActionLoading("");
    }
  };

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
            key={editing?._id || "new-owner-property"}
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
                onDelete={() => setDeleteTarget({ ...request, deleteMode: "direct" })}
                onRequestDelete={() => setDeleteTarget({ ...request, deleteMode: "request" })}
              />
            ))}
          </div>
        </section>
      </main>
      {deleteTarget?.deleteMode === "direct" && (
        <ConfirmDeleteModal
          request={deleteTarget}
          loading={actionLoading === "delete"}
          onClose={closeDeleteModal}
          onConfirm={handleDeletePending}
        />
      )}
      {deleteTarget?.deleteMode === "request" && (
        <DeleteRequestModal
          request={deleteTarget}
          reason={deleteReason}
          loading={actionLoading === "request-delete"}
          onReasonChange={setDeleteReason}
          onClose={closeDeleteModal}
          onConfirm={handleRequestDelete}
        />
      )}
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
  const [proofType, setProofType] = useState("Ownership Proof");
  const [uploadingProof, setUploadingProof] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [brokeragePercent, setBrokeragePercent] = useState(2);

  useEffect(() => {
    publicApi.content().then((response) => {
      const item = (response.data || []).find((entry) => entry.key === "brokerageSettings");
      if (item?.value?.percentage) setBrokeragePercent(Number(item.value.percentage));
    }).catch(() => {});
  }, []);

  const updateOwner = (key, value) => setForm((current) => ({ ...current, ownerDetails: { ...current.ownerDetails, [key]: value } }));
  const updateProperty = (key, value) => setForm((current) => ({ ...current, propertyDetails: { ...current.propertyDetails, [key]: value } }));
  const toggleAmenity = (amenity) => setForm((current) => {
    const selected = new Set(current.propertyDetails.amenities || []);
    if (selected.has(amenity)) selected.delete(amenity);
    else selected.add(amenity);
    return { ...current, propertyDetails: { ...current.propertyDetails, amenities: [...selected] } };
  });
  const toggleDeclaration = (key) => setForm((current) => ({ ...current, declaration: { ...current.declaration, [key]: !current.declaration[key] } }));

  const safePhotos = form.media?.photos ?? [];
  const safeVideos = form.media?.videos ?? [];
  const safeDocuments = form.media?.documents ?? [];
  const safeOwnerProofs = form.media?.ownerProofs ?? [];

  const errors = useMemo(() => {
    const items = [];
    if (!(form.ownerDetails?.name ?? "").trim()) items.push("Owner name is required.");
    if (!/^\S+@\S+\.\S+$/.test(form.ownerDetails?.email ?? "")) items.push("Valid owner email is required.");
    if ((form.ownerDetails?.phone ?? "").replace(/\D/g, "").length < 10) items.push("Valid owner phone is required.");
    if (!(form.ownerDetails?.ownershipType ?? "").trim()) items.push("Ownership type is required.");
    if (!(form.propertyDetails?.title ?? "").trim()) items.push("Property title is required.");
    if (!(form.propertyDetails?.city ?? "").trim() || !(form.propertyDetails?.area ?? "").trim()) items.push("City and area are required.");
    if (!parseINRAmount(form.propertyDetails?.expectedPrice)) items.push("Expected price/rent must be numeric.");
    const constructionYear = Number(form.propertyDetails?.constructionYear);
    if (!Number.isInteger(constructionYear) || constructionYear < 1900 || constructionYear > new Date().getFullYear()) {
      items.push(`Construction year must be between 1900 and ${new Date().getFullYear()}.`);
    }
    if ((form.propertyDetails?.description ?? "").trim().length < 20) items.push("Property description must be at least 20 characters.");
    const photoCount = form.media?.photos?.length ?? 0;
    if (photoCount < 4) items.push(`At least 4 property photos are required (${photoCount} uploaded).`);
    if (photoCount > 10) items.push(`Maximum 10 property photos allowed (${photoCount} uploaded).`);
    if (!(form.media?.ownerProofs?.length ?? 0)) items.push("At least one owner proof document is required.");
    if (!Object.values(form.declaration ?? {}).every(Boolean)) items.push("All declaration checkboxes must be accepted.");
    if (!termsAccepted) items.push("Please accept the Terms & Conditions before submitting.");
    return items;
  }, [form, termsAccepted]);

  const removePhoto = (index) => {
    setForm((current) => ({
      ...current,
      media: { ...current.media, photos: (current.media?.photos ?? []).filter((_, i) => i !== index) },
    }));
  };

  const uploadFiles = async (files) => {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) return;
    const currentCount = form.media?.photos?.length ?? 0;
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    const otherFiles = selectedFiles.filter((file) => !file.type.startsWith("image/"));
    if (imageFiles.length && currentCount + imageFiles.length > 10) {
      setError(`Cannot upload ${imageFiles.length} more photos. Maximum is 10 (currently have ${currentCount}).`);
      return;
    }
    setUploading(true);
    setError("");
    try {
      const response = await ownerApi.upload([...imageFiles, ...otherFiles]);
      setForm((current) => ({
        ...current,
        media: {
          ...current.media,
          photos: [...(current.media?.photos ?? []), ...(response.data?.photos ?? [])],
          videos: [...(current.media?.videos ?? []), ...(response.data?.videos ?? [])],
          documents: [...(current.media?.documents ?? []), ...(response.data?.documents ?? [])],
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
    setForm((current) => ({ ...current, media: { ...current.media, [kind]: [...(current.media?.[kind] ?? []), url] } }));
  };

  const uploadProofs = async (files) => {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) return;
    setUploadingProof(true);
    setError("");
    try {
      const response = await ownerApi.uploadProof(selectedFiles, proofType);
      setForm((current) => ({
        ...current,
        media: {
          ...current.media,
          ownerProofs: [...(current.media?.ownerProofs ?? []), ...(response.data ?? [])],
        },
      }));
      setSuccess("Owner proof uploaded securely.");
    } catch (err) {
      setError(err.message || "Owner proof upload failed.");
    } finally {
      setUploadingProof(false);
    }
  };

  const removeProof = (index) => {
    setForm((current) => ({
      ...current,
      media: {
        ...current.media,
        ownerProofs: (current.media?.ownerProofs ?? []).filter((_, proofIndex) => proofIndex !== index),
      },
    }));
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
            <TextField label="Construction Year" type="number" min={1900} max={new Date().getFullYear()} value={form.propertyDetails.constructionYear} onChange={(value) => updateProperty("constructionYear", value)} required />
            <SelectField label="Area unit" value={form.propertyDetails.areaUnit} onChange={(value) => updateProperty("areaUnit", value)} options={["sqft", "sq-yard", "sq-meter", "vigha", "acre"]} />
            <PriceInputField label="Expected price/rent" value={form.propertyDetails.expectedPrice} onChange={(value) => updateProperty("expectedPrice", value)} required />
            <PriceInputField label="Maintenance charges" value={form.propertyDetails.maintenanceCharges} onChange={(value) => updateProperty("maintenanceCharges", value)} />
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
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="wf-label mb-0">Property Photos *</label>
                  <span className={`text-sm font-black ${safePhotos.length < 4 ? "text-rose-600" : safePhotos.length === 10 ? "text-amber-600" : "text-emerald-600"}`}>
                    {safePhotos.length} / 10 photos
                  </span>
                </div>
                {safePhotos.length < 4 && (
                  <p className="mt-1 text-xs font-semibold text-rose-600">Minimum 4 photos required · Maximum 10 allowed</p>
                )}
                {safePhotos.length >= 4 && safePhotos.length < 10 && (
                  <p className="mt-1 text-xs font-semibold text-emerald-700">✓ {10 - safePhotos.length} more photo{10 - safePhotos.length !== 1 ? "s" : ""} can be added</p>
                )}
                {safePhotos.length === 10 && (
                  <p className="mt-1 text-xs font-semibold text-amber-600">Maximum photos reached</p>
                )}
                {safePhotos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {safePhotos.map((photo, index) => (
                      <div key={`${photo}-${index}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <img src={photo} alt={`Photo ${index + 1}`} className="h-28 w-full object-cover" />
                        {index === 0 && safePhotos.length > 0 && <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-black text-white">Main</span>}
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-rose-600 shadow hover:bg-white"
                          aria-label={`Remove photo ${index + 1}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {safePhotos.length < 10 && (
                  <div className="mt-4">
                    <input type="file" multiple accept="image/*" onChange={(event) => { uploadFiles(event.target.files); event.target.value = ""; }} className="hidden" id="owner-photo-upload" />
                    <label htmlFor="owner-photo-upload" className="wf-btn wf-btn-secondary inline-flex cursor-pointer">
                      <Upload size={16} /> {uploading ? "Uploading..." : "Upload Photos"}
                    </label>
                  </div>
                )}
                <MediaUrlInput label="Or add photo URL" onAdd={(value) => {
                  if (safePhotos.length >= 10) { setError("Maximum 10 photos allowed."); return; }
                  addMediaUrl("photos", value);
                }} />
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                <label className="wf-label">Videos &amp; Documents (optional)</label>
                <input type="file" multiple accept="video/*,application/pdf" onChange={(event) => { uploadFiles(event.target.files); event.target.value = ""; }} className="hidden" id="owner-media-upload" />
                <label htmlFor="owner-media-upload" className="wf-btn wf-btn-secondary inline-flex cursor-pointer">
                  <Upload size={16} /> {uploading ? "Uploading..." : "Upload Videos / Documents"}
                </label>
                <MediaUrlInput label="Add video URL" onAdd={(value) => addMediaUrl("videos", value)} />
                <MediaUrlInput label="Add document URL" onAdd={(value) => addMediaUrl("documents", value)} />
                <p className="mt-3 text-xs font-semibold text-slate-500">{safeVideos.length} videos, {safeDocuments.length} documents attached</p>
              </div>
            </div>
            <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
              <label className="wf-label">Owner Proof Document *</label>
              <p className="mb-4 text-xs font-semibold leading-5 text-slate-500">Proofs are visible only to authorized admin and supervisor staff. They are never shown on the public website.</p>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <select value={proofType} onChange={(event) => setProofType(event.target.value)} className="wf-input min-h-12 rounded-2xl bg-white font-semibold">
                  {ownerProofTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <label className="wf-btn wf-btn-primary cursor-pointer">
                  <Upload size={16} /> {uploadingProof ? "Uploading..." : "Upload proof"}
                  <input type="file" multiple accept="image/*,application/pdf" className="hidden" disabled={uploadingProof} onChange={(event) => { uploadProofs(event.target.files); event.target.value = ""; }} />
                </label>
              </div>
              <div className="mt-4 space-y-2">
                {safeOwnerProofs.map((proof, index) => (
                  <div key={`${proof.url}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-blue-100">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-900">{proof.originalName}</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500">{proof.documentType} · {proof.status || "uploaded"}</p>
                    </div>
                    <button type="button" onClick={() => removeProof(index)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-rose-600 hover:bg-rose-50" aria-label={`Remove ${proof.originalName}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {!safeOwnerProofs.length && <p className="text-sm font-semibold text-blue-700">Upload at least one ownership-related proof.</p>}
              </div>
            </div>
          </FormGrid>
        )}

        {step === 4 && (
          <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">Self Declaration</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">Confirm before submitting</h3>
            {termsAccepted && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <ShieldCheck size={18} className="shrink-0 text-emerald-600" />
                <p className="text-sm font-bold text-emerald-700">Terms &amp; Conditions accepted — Brokerage: {brokeragePercent}%</p>
              </div>
            )}
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
          <button
            type="button"
            onClick={() => {
              if (step === 3 && !termsAccepted) {
                setShowTermsModal(true);
              } else {
                setStep(step + 1);
              }
            }}
            className="wf-btn wf-btn-primary"
          >
            Continue
          </button>
        ) : (
          <button type="submit" disabled={saving} className="wf-btn wf-btn-primary disabled:cursor-not-allowed disabled:opacity-70">{saving ? "Submitting..." : request ? "Resubmit Property" : "Submit for Review"}</button>
        )}
      </div>
      {showTermsModal && (
        <TermsModal
          brokeragePercent={brokeragePercent}
          onAccept={() => { setTermsAccepted(true); setShowTermsModal(false); setStep(4); }}
          onDecline={() => setShowTermsModal(false)}
        />
      )}
    </form>
  );
}

function OwnerRequestCard({ request, onEdit, onDelete, onRequestDelete }) {
  const Icon = statusIcons[request.status] || Clock;
  const linkedStatus = request.approvedPropertyId?.status;
  const isSold = linkedStatus === "sold";
  const isRemoved = request.deleteStatus === "approved" || request.approvedPropertyId?.visibility === "private";
  const deletePending = request.deleteStatus === "pending";
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
      {(deletePending || isSold || isRemoved || request.deleteStatus === "rejected") && (
        <div className={`mt-4 rounded-2xl p-3 text-sm font-bold ${isSold ? "bg-rose-50 text-rose-700" : deletePending ? "bg-amber-50 text-amber-700" : isRemoved ? "bg-slate-100 text-slate-600" : "bg-blue-50 text-blue-700"}`}>
          {isSold && "This property has already been sold and cannot be deleted."}
          {deletePending && "Delete request submitted. Waiting for admin approval."}
          {isRemoved && "This property has been removed from public listings."}
          {request.deleteStatus === "rejected" && !deletePending && !isRemoved && (request.deleteReviewRemarks || "Your delete request was rejected.")}
        </div>
      )}
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
        {request.approvedPropertyId?._id && !isRemoved && (
          <Link to={`/property/${request.approvedPropertyId._id}`} className="wf-btn wf-btn-secondary text-sm">
            <FileText size={15} /> View Listing
          </Link>
        )}
        {["rejected", "needs_changes", "pending"].includes(request.status) && !isSold && (
          <button type="button" onClick={onEdit} className="wf-btn wf-btn-primary text-sm">
            <Edit3 size={15} /> {request.status === "pending" ? "Edit" : "Edit & Resubmit"}
          </button>
        )}
        {request.status === "pending" && !request.approvedPropertyId && (
          <button type="button" onClick={onDelete} className="wf-btn bg-rose-600 text-sm text-white hover:bg-rose-700">
            <Trash2 size={15} /> Delete
          </button>
        )}
        {request.status === "approved" && request.approvedPropertyId && !isSold && !deletePending && !isRemoved && (
          <button type="button" onClick={onRequestDelete} className="wf-btn bg-amber-500 text-sm text-white hover:bg-amber-600">
            <Send size={15} /> Request Delete
          </button>
        )}
        {request.status === "approved" && isSold && (
          <button type="button" disabled className="wf-btn cursor-not-allowed bg-slate-100 text-sm text-slate-400">
            <AlertTriangle size={15} /> Cannot Delete
          </button>
        )}
      </div>
    </article>
  );
}

function ConfirmDeleteModal({ request, loading, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <Trash2 size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-950">Delete pending property?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will cancel your submission for <strong className="text-slate-800">{request.propertyDetails?.title}</strong>. It has not been approved yet, so it can be removed immediately.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="wf-btn wf-btn-secondary" disabled={loading}>Cancel</button>
          <button type="button" onClick={onConfirm} className="wf-btn bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-70" disabled={loading}>
            {loading ? "Deleting..." : "Delete Submission"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteRequestModal({ request, reason, loading, onReasonChange, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600">
            <Send size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-950">Request property deletion</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              <strong className="text-slate-800">{request.propertyDetails?.title}</strong> is live on the website. It will remain visible until admin approval.
            </p>
          </div>
        </div>
        <label className="mt-6 block">
          <span className="wf-label">Reason for delete request *</span>
          <textarea
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            rows={4}
            className="wf-input min-h-28 rounded-2xl"
            placeholder="Example: Property is no longer available, duplicate listing, owner wants to pause marketing..."
          />
        </label>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="wf-btn wf-btn-secondary" disabled={loading}>Cancel</button>
          <button type="button" onClick={onConfirm} className="wf-btn bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-70" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
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

function TextField({ label, value, onChange, type = "text", required = false, prefix = "", min, max }) {
  return (
    <label className="block">
      <span className="wf-label">{label}{required ? " *" : ""}</span>
      <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        {prefix && <span className="grid min-w-14 place-items-center border-r border-slate-200 bg-slate-50 text-sm font-black text-slate-500">{prefix}</span>}
        <input type={type} value={value ?? ""} min={min} max={max} onChange={(event) => onChange(event.target.value)} className="min-h-12 flex-1 border-0 px-4 text-sm font-semibold text-slate-900 outline-none" required={required} />
      </div>
    </label>
  );
}

function PriceInputField({ label, value, onChange, required = false }) {
  const displayValue = formatINRForInput(value);
  const handleChange = (raw) => {
    const digits = stripINRFormatting(raw);
    onChange(digits);
  };
  return (
    <label className="block">
      <span className="wf-label">{label}{required ? " *" : ""}</span>
      <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        <span className="grid min-w-14 place-items-center border-r border-slate-200 bg-slate-50 text-sm font-black text-slate-500">Rs.</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="e.g. 12,00,000"
          className="min-h-12 flex-1 border-0 px-4 text-sm font-semibold text-slate-900 outline-none"
          required={required}
        />
      </div>
      {value && Number(value) > 0 && (
        <span className="mt-1 block text-xs font-semibold text-slate-400">{formatINR(Number(value))}</span>
      )}
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

function TermsModal({ brokeragePercent, onAccept, onDecline }) {
  const [agreed, setAgreed] = useState(false);
  const year = new Date().getFullYear();
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Before you continue</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Terms &amp; Conditions</h2>
          </div>
          <button type="button" onClick={onDecline} className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 text-sm leading-7 text-slate-700">
          <p className="font-black text-slate-950">Akshar Estate — Seller / Owner Listing Agreement</p>
          <p className="mt-1 text-xs text-slate-500">Effective {year} · Please read carefully before submitting your property.</p>

          <div className="mt-5 space-y-5">
            <section>
              <h3 className="font-black text-slate-900">1. Brokerage &amp; Commission</h3>
              <p className="mt-1">By submitting your property on Akshar Estate, you agree to a brokerage commission of <strong className="text-blue-700">{brokeragePercent}%</strong> of the final transaction value (sale price or annual rent) upon successful closure of a deal facilitated by Akshar Estate. This rate is subject to change and the current rate at the time of listing will apply.</p>
            </section>

            <section>
              <h3 className="font-black text-slate-900">2. Service Charges</h3>
              <p className="mt-1">Property listing is free of charge. Service charges, if any, for premium marketing, photography, or legal assistance are additional and will be communicated separately before you opt-in.</p>
            </section>

            <section>
              <h3 className="font-black text-slate-900">3. Seller / Owner Responsibilities</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>All information submitted must be accurate, current, and complete.</li>
                <li>You must hold legal authority to list and transact this property.</li>
                <li>You are responsible for providing clear title, NOC, and required documents during due diligence.</li>
                <li>You must inform Akshar Estate immediately if the property is sold, rented, or withdrawn.</li>
                <li>You agree not to simultaneously list the property with another agent without prior notice.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-black text-slate-900">4. Property Listing Rules</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Photos must be original, clear, and belong to the property being listed.</li>
                <li>Minimum 4 and maximum 10 property photos must be submitted.</li>
                <li>Misleading, duplicate, or fraudulent listings will be removed without notice.</li>
                <li>Akshar Estate reserves the right to edit listing content for quality, clarity, and SEO purposes.</li>
                <li>Listings are subject to admin verification before going live on the website.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-black text-slate-900">5. Verification Disclaimer</h3>
              <p className="mt-1">Akshar Estate conducts reasonable verification of listings but does not guarantee the legal title, encumbrance-free status, or structural integrity of any property. Buyers are advised to conduct independent due diligence. Akshar Estate shall not be liable for any disputes arising from inaccurate information provided by the seller.</p>
            </section>

            <section>
              <h3 className="font-black text-slate-900">6. Privacy &amp; Data Usage</h3>
              <p className="mt-1">Your contact details will be used internally for verification and buyer communication. Owner proof documents are stored securely and are never displayed on the public website.</p>
            </section>

            <section>
              <h3 className="font-black text-slate-900">7. Governing Law</h3>
              <p className="mt-1">These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Ahmedabad, Gujarat.</p>
            </section>
          </div>
        </div>
        <div className="border-t border-slate-100 px-6 py-5">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600" />
            <span className="text-sm font-bold text-slate-800">
              I have read and agree to the Terms &amp; Conditions. I understand that a brokerage of <strong className="text-blue-700">{brokeragePercent}%</strong> applies on successful deal closure.
            </span>
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onDecline} className="wf-btn wf-btn-secondary">Go Back</button>
            <button type="button" onClick={onAccept} disabled={!agreed} className="wf-btn wf-btn-primary disabled:cursor-not-allowed disabled:opacity-60">
              <ShieldCheck size={17} /> Accept &amp; Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
