"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { PowEntry } from "@prisma/client";
import type { PowFormState } from "@/app/admin/(protected)/pow/actions";

const initialState: PowFormState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-50">
      {pending ? "Saving…" : label}
    </button>
  );
}

const inputClass =
  "w-full bg-black/40 border border-lemon-green/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#777] focus:outline-none focus:border-lemon-green transition-colors";
const labelClass = "block text-[0.8rem] font-display font-medium text-muted mb-1.5";
const fileInputClass =
  "w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-lemon-green file:text-black file:font-display file:font-semibold file:text-xs file:cursor-pointer";

export function PowForm({
  action,
  entry,
  submitLabel,
}: {
  action: (prevState: PowFormState, formData: FormData) => Promise<PowFormState>;
  entry?: PowEntry;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, initialState);
  const fieldErrors = state.fieldErrors ?? {};
  const eventDateValue = entry?.eventDate
    ? new Date(entry.eventDate).toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="mt-0">Basic Info</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="section">
              Section *
            </label>
            <select
              id="section"
              name="section"
              defaultValue={entry?.section ?? "ONGOING_JOB"}
              className={inputClass}
            >
              <option value="ONGOING_JOB">Ongoing Job</option>
              <option value="OTHER_GIG">Other Gig</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="status">
              Status *
            </label>
            <select
              id="status"
              name="status"
              defaultValue={entry?.status ?? "ACTIVE"}
              className={inputClass}
            >
              <option value="ACTIVE">Active / Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="WON">Won</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="category">
              Category *
            </label>
            <input
              id="category"
              name="category"
              defaultValue={entry?.category}
              placeholder="e.g. Community Management"
              required
              className={inputClass}
            />
            {fieldErrors.category && (
              <p className="text-red-400 text-xs mt-1 mb-0">{fieldErrors.category}</p>
            )}
          </div>
          <div>
            <label className={labelClass} htmlFor="role">
              Role *
            </label>
            <input
              id="role"
              name="role"
              defaultValue={entry?.role}
              placeholder="e.g. Community Manager"
              required
              className={inputClass}
            />
            {fieldErrors.role && (
              <p className="text-red-400 text-xs mt-1 mb-0">{fieldErrors.role}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="projectName">
            Project Name *
          </label>
          <input
            id="projectName"
            name="projectName"
            defaultValue={entry?.projectName}
            required
            className={inputClass}
          />
          {fieldErrors.projectName && (
            <p className="text-red-400 text-xs mt-1 mb-0">{fieldErrors.projectName}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="description">
            Short Description *
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={entry?.description}
            required
            rows={3}
            className={inputClass}
            placeholder="Shown on the POW card"
          />
          {fieldErrors.description && (
            <p className="text-red-400 text-xs mt-1 mb-0">{fieldErrors.description}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="fullDetails">
            Full Details (deliverables, timeline, notes)
          </label>
          <textarea
            id="fullDetails"
            name="fullDetails"
            defaultValue={entry?.fullDetails ?? ""}
            rows={6}
            className={inputClass}
            placeholder="Shown on the detail page. Line breaks are preserved."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="projectLink">
              Project Link
            </label>
            <input
              id="projectLink"
              name="projectLink"
              defaultValue={entry?.projectLink ?? ""}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="eventDate">
              Date
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              defaultValue={eventDateValue}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={entry?.featured}
              className="accent-lemon-green w-4 h-4"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="pinned"
              defaultChecked={entry?.pinned}
              className="accent-lemon-green w-4 h-4"
            />
            Pinned
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="hidden"
              defaultChecked={entry?.hidden}
              className="accent-lemon-green w-4 h-4"
            />
            Hidden from site
          </label>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="mt-0">Media</h3>
        <p className="text-muted text-sm -mt-2">
          {entry
            ? "Uploading a new logo or featured image will replace the current one. Other uploads are added to the existing gallery."
            : "All uploads are optional — you can add more later from the edit page."}
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="logoFile">
              Project Logo
            </label>
            <input id="logoFile" name="logoFile" type="file" accept="image/*" className={fileInputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="featuredImageFile">
              Featured Image
            </label>
            <input
              id="featuredImageFile"
              name="featuredImageFile"
              type="file"
              accept="image/*"
              className={fileInputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="screenshotFiles">
            Screenshots
          </label>
          <input
            id="screenshotFiles"
            name="screenshotFiles"
            type="file"
            accept="image/*"
            multiple
            className={fileInputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="proofImageFiles">
            Proof Images
          </label>
          <input
            id="proofImageFiles"
            name="proofImageFiles"
            type="file"
            accept="image/*"
            multiple
            className={fileInputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="winnerImageFiles">
            Winner Announcement Images
          </label>
          <input
            id="winnerImageFiles"
            name="winnerImageFiles"
            type="file"
            accept="image/*"
            multiple
            className={fileInputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="proofDocs">
            Proof PDFs
          </label>
          <input
            id="proofDocs"
            name="proofDocs"
            type="file"
            accept="application/pdf"
            multiple
            className={fileInputClass}
          />
        </div>
      </div>

      {state.error && <p className="text-red-400 text-sm">{state.error}</p>}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
