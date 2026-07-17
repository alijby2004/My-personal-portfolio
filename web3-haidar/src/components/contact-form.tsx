"use client";

import { useState, useRef } from "react";
import { SERVICE_TYPES } from "@/lib/validation/contact";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
          setErrorMsg("Please fix the errors below.");
        } else {
          setErrorMsg(data.message ?? "Something went wrong. Please try again.");
        }
        setState("error");
        return;
      }

      setState("success");
      formRef.current?.reset();
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-3xl mb-3">✅</div>
        <h3>Message sent!</h3>
        <p className="mb-0 text-muted">
          Thanks for reaching out — I&apos;ll get back to you as soon as
          possible.
        </p>
        <button
          onClick={() => setState("idle")}
          className="btn-outline mt-5"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full bg-black/40 border border-lemon-green/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#777] focus:outline-none focus:border-lemon-green transition-colors";
  const labelClass =
    "block text-[0.8rem] font-display font-medium text-muted mb-1.5";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      {/* Honeypot — hidden from real users via CSS, bots often fill every field */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="fullName">
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className={inputClass}
            placeholder="Jane Doe"
          />
          {fieldErrors.fullName && (
            <p className="text-red-400 text-xs mt-1 mb-0">{fieldErrors.fullName}</p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="jane@project.xyz"
          />
          {fieldErrors.email && (
            <p className="text-red-400 text-xs mt-1 mb-0">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="telegramHandle">
            Telegram Username
          </label>
          <input
            id="telegramHandle"
            name="telegramHandle"
            className={inputClass}
            placeholder="@yourhandle"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="serviceType">
            Type of Service *
          </label>
          <select
            id="serviceType"
            name="serviceType"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICE_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.serviceType && (
            <p className="text-red-400 text-xs mt-1 mb-0">
              {fieldErrors.serviceType}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="projectName">
            Project Name *
          </label>
          <input
            id="projectName"
            name="projectName"
            required
            className={inputClass}
            placeholder="Your project"
          />
          {fieldErrors.projectName && (
            <p className="text-red-400 text-xs mt-1 mb-0">
              {fieldErrors.projectName}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="projectWebsite">
            Project Website
          </label>
          <input
            id="projectWebsite"
            name="projectWebsite"
            className={inputClass}
            placeholder="https://yourproject.xyz"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="budget">
            Budget
          </label>
          <input
            id="budget"
            name="budget"
            className={inputClass}
            placeholder="e.g. $200–500"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="deadline">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            className={inputClass}
            placeholder="e.g. Within 2 weeks"
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description / Deliverables *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className={inputClass}
          placeholder="Tell me about the project and what you need..."
        />
        {fieldErrors.description && (
          <p className="text-red-400 text-xs mt-1 mb-0">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass} htmlFor="attachment">
          Attachment (optional)
        </label>
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.docx"
          className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-lemon-green file:text-black file:font-display file:font-semibold file:text-xs file:cursor-pointer"
        />
      </div>

      {errorMsg && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-primary w-full sm:w-auto disabled:opacity-50"
      >
        {state === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
