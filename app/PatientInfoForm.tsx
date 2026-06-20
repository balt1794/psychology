"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

type PatientInfo = {
  name: string;
  age: string;
  reason: string;
  lastSession: string;
  notes: string;
};

const emptyPatientInfo: PatientInfo = {
  name: "",
  age: "",
  reason: "",
  lastSession: "",
  notes: "",
};

export function PatientInfoForm() {
  const [form, setForm] = useState<PatientInfo>(emptyPatientInfo);
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field: keyof PatientInfo, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      await addDoc(collection(db, "users"), {
        name: form.name,
        age: form.age ? Number(form.age) : null,
        reason: form.reason,
        lastSession: form.lastSession,
        notes: form.notes,
        createdAt: serverTimestamp(),
      });

      setPatient(form);
      setMessage("Patient saved to Firestore.");
    } catch (error) {
      console.error("Error saving patient:", error);
      setMessage("Could not save patient. Check your Firestore rules.");
    } finally {
      setIsSaving(false);
    }
  }

  const preview = patient ?? form;

  return (
    <div className="mt-12 grid w-full gap-6 text-left text-black lg:grid-cols-2">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 text-black shadow-sm"
      >
        <h2 className="text-2xl font-bold text-black">Patient Information</h2>
        <p className="mt-2 text-sm text-black">
          Add basic details to start building a clinical history record.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-black">Full name</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Maria Rodriguez"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-black">Age</span>
            <input
              value={form.age}
              onChange={(event) => updateField("age", event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="34"
              type="number"
              min="0"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-black">Reason for visit</span>
            <input
              value={form.reason}
              onChange={(event) => updateField("reason", event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Anxiety, follow-up, assessment..."
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-black">Last session date</span>
            <input
              value={form.lastSession}
              onChange={(event) => updateField("lastSession", event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              type="date"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-black">Clinical notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              className="mt-2 min-h-32 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Short summary, symptoms, progress, next steps..."
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isSaving ? "Saving..." : "Save Patient Draft"}
        </button>

        {message ? <p className="mt-3 text-sm font-semibold text-black">{message}</p> : null}
      </form>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 text-black shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
          Patient Preview
        </p>
        <h2 className="mt-3 text-3xl font-bold text-black">
          {preview.name || "No patient selected"}
        </h2>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Age</p>
            <p className="mt-1 text-black">{preview.age || "Not added yet"}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Reason for visit
            </p>
            <p className="mt-1 text-black">{preview.reason || "Not added yet"}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Last session
            </p>
            <p className="mt-1 text-black">{preview.lastSession || "Not added yet"}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Clinical notes
            </p>
            <p className="mt-1 whitespace-pre-wrap text-black">
              {preview.notes || "Notes will appear here as you type or after submitting."}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
