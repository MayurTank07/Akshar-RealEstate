import { useMemo, useState } from "react";
import { ArrowRight, Check, Copy, ExternalLink, Star } from "lucide-react";
import { BUSINESS_INFO } from "../config/businessInfo";

const GOOGLE_REVIEW_URL = "https://g.page/r/CX46S5KtMPeGEBM/review";
const QUESTIONS = [
  { key: "overall", label: "Overall experience", hint: "Your complete experience with us" },
  { key: "guidance", label: "Property guidance", hint: "How helpful was our property advice?" },
  { key: "communication", label: "Communication", hint: "Updates, answers and availability" },
  { key: "professionalism", label: "Professionalism", hint: "How our team worked with you" },
  { key: "transparency", label: "Transparency", hint: "Clarity about property details and process" },
];

function RatingQuestion({ question, value, onChange }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <legend className="sr-only">{question.label}</legend>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-slate-900">{question.label}</p>
          <p className="mt-1 text-sm text-slate-500">{question.hint}</p>
        </div>
        <div className="flex gap-1" role="radiogroup" aria-label={question.label}>
          {[1, 2, 3, 4, 5].map((score) => (
            <label key={score} className="relative cursor-pointer rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-sky-500">
              <input
                type="radio"
                name={question.key}
                value={score}
                checked={value === score}
                onChange={() => onChange(question.key, score)}
                className="sr-only"
                aria-label={`${score} out of 5`}
              />
              <Star
                aria-hidden="true"
                className={`h-8 w-8 transition-colors sm:h-9 sm:w-9 ${score <= value ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-400"}`}
              />
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  );
}

export default function ReviewExperience() {
  const [ratings, setRatings] = useState({});
  const [experience, setExperience] = useState("");
  const [step, setStep] = useState("questions");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const draft = useMemo(() => {
    const details = QUESTIONS.filter((question) => question.key !== "overall" && ratings[question.key])
      .map((question) => `${question.label}: ${ratings[question.key]}/5`);
    return [experience.trim(), details.length ? `My ratings — ${details.join("; ")}.` : ""]
      .filter(Boolean)
      .join("\n\n");
  }, [experience, ratings]);

  function updateRating(key, score) {
    setRatings((current) => ({ ...current, [key]: score }));
    setError("");
  }

  function continueToGoogle(event) {
    event.preventDefault();
    if (!ratings.overall) {
      setError("Please select your overall rating to continue.");
      return;
    }
    setError("");
    setCopied(false);
    setStep("google");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
    } catch {
      setCopied(false);
      setError("Copy didn't work. Select the review text below and copy it manually.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f6f9] pb-20 text-slate-900">
      <div className="bg-[#11151d] px-5 pb-16 pt-10 text-white sm:pb-20">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <img src="/akshar-logo-512.jpeg" alt="Akshar Estate logo" className="h-14 w-14 rounded-full object-cover ring-1 ring-white/30" />
            <div>
              <p className="text-lg font-extrabold">Akshar Estate</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">The Property Hub</p>
            </div>
          </div>
          <p className="mt-11 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Share your experience</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Your feedback matters.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Tell us about your property journey. Your honest review helps others make an informed choice.
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-2xl px-4 sm:px-6">
        {step === "questions" ? (
          <form onSubmit={continueToGoogle} className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-bold text-sky-700">STEP 1 OF 2</p>
              <h2 className="mt-1 text-2xl font-extrabold">Rate your experience</h2>
              <p className="mt-2 text-sm text-slate-600">Choose what feels right to you. All ratings can continue to Google.</p>
            </div>
            {QUESTIONS.map((question) => (
              <RatingQuestion key={question.key} question={question} value={ratings[question.key] || 0} onChange={updateRating} />
            ))}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <label htmlFor="review-experience" className="font-bold">Your experience, in your own words <span className="font-normal text-slate-500">(optional)</span></label>
              <p className="mt-1 text-sm text-slate-500">What went well, or what could we improve?</p>
              <textarea
                id="review-experience"
                value={experience}
                onChange={(event) => { setExperience(event.target.value); setError(""); }}
                rows={5}
                maxLength={2000}
                placeholder="Write your honest experience here..."
                className="mt-4 w-full resize-y rounded-xl border border-slate-300 p-3 text-base focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-4 font-bold text-white shadow-lg shadow-sky-900/15 hover:bg-sky-700">
              Continue to Google <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="text-center text-xs leading-5 text-slate-500">Nothing is posted yet. You will review and submit it yourself on Google.</p>
          </form>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
            <p className="text-sm font-bold text-sky-700">STEP 2 OF 2</p>
            <h2 className="mt-1 text-2xl font-extrabold">Post your review on Google</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Google asks you to choose the overall stars and submit the review from your own account.</p>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold">Your overall rating: {ratings.overall}/5</p>
              <p className="mt-2 text-xs text-slate-500">Select this same rating on Google if it still reflects your opinion.</p>
            </div>
            {draft ? <>
              <label htmlFor="review-draft" className="mt-6 block text-sm font-bold">Your review text</label>
              <textarea id="review-draft" readOnly value={draft} rows={Math.min(10, Math.max(5, draft.split("\n").length + 3))} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm leading-6" />
            </> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">You can post only your overall star rating on Google if you prefer.</p>}
            {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
            {draft && <button type="button" onClick={copyReview} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-bold hover:bg-slate-50">
              {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
              {copied ? "Copied" : "Copy review text"}
            </button>}
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-4 font-bold text-white hover:bg-sky-700">
              Open Google review form <ExternalLink className="h-5 w-5" aria-hidden="true" />
            </a>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">Choose your stars, paste your text if you have any, and tap Post on Google. You may change anything before posting.</p>
            <button type="button" onClick={() => { setStep("questions"); setError(""); }} className="mt-5 w-full text-sm font-bold text-slate-600 underline underline-offset-4">Edit my answers</button>
          </section>
        )}
        <p className="mt-8 text-center text-xs text-slate-500">{BUSINESS_INFO.name} · Gandhinagar, Gujarat</p>
      </div>
    </main>
  );
}
