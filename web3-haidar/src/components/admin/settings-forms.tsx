"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { SiteSettings } from "@/lib/settings";
import {
  updateSiteLinks,
  changeAdminPassword,
  type SettingsFormState,
} from "@/app/admin/(protected)/settings/actions";

const initialState: SettingsFormState = { error: null };

const inputClass =
  "w-full bg-black/40 border border-lemon-green/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#777] focus:outline-none focus:border-lemon-green transition-colors";
const labelClass = "block text-[0.8rem] font-display font-medium text-muted mb-1.5";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-50">
      {pending ? "Saving…" : label}
    </button>
  );
}

export function SettingsForms({ settings }: { settings: SiteSettings }) {
  const [linksState, linksAction] = useFormState(updateSiteLinks, initialState);
  const [passwordState, passwordAction] = useFormState(
    changeAdminPassword,
    initialState
  );

  return (
    <div className="space-y-6">
      <form action={linksAction} className="glass-card p-6 space-y-4">
        <h3 className="mt-0">Contact Links</h3>
        <p className="text-muted text-sm -mt-2">
          These power the links shown in your footer and Contact page.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="twitterUrl">
              Twitter / X URL
            </label>
            <input
              id="twitterUrl"
              name="twitterUrl"
              defaultValue={settings.twitterUrl}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="twitterHandle">
              Twitter / X Handle
            </label>
            <input
              id="twitterHandle"
              name="twitterHandle"
              defaultValue={settings.twitterHandle}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="telegramUrl">
              Telegram URL
            </label>
            <input
              id="telegramUrl"
              name="telegramUrl"
              defaultValue={settings.telegramUrl}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="telegramHandle">
              Telegram Handle
            </label>
            <input
              id="telegramHandle"
              name="telegramHandle"
              defaultValue={settings.telegramHandle}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="contactEmail">
            Contact Email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={settings.contactEmail}
            className={inputClass}
          />
        </div>

        {linksState.error && <p className="text-red-400 text-sm">{linksState.error}</p>}
        {linksState.success && (
          <p className="text-lemon-green text-sm">Saved.</p>
        )}

        <SaveButton label="Save Links" />
      </form>

      <form action={passwordAction} className="glass-card p-6 space-y-4">
        <h3 className="mt-0">Change Password</h3>
        <p className="text-muted text-sm -mt-2">
          Changing your password signs you out of all other devices.
        </p>

        <div>
          <label className={labelClass} htmlFor="currentPassword">
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              className={inputClass}
            />
          </div>
        </div>

        {passwordState.error && (
          <p className="text-red-400 text-sm">{passwordState.error}</p>
        )}
        {passwordState.success && (
          <p className="text-lemon-green text-sm">Password updated.</p>
        )}

        <SaveButton label="Change Password" />
      </form>
    </div>
  );
}
