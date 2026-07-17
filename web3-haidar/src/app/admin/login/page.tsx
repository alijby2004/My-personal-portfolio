"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-dark-bg bg-site-bg bg-cover bg-fixed">
      <div className="glass-card p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="font-display font-bold text-lg text-lemon-green tracking-wide">
            Web3 Haidar
          </span>
          <p className="text-muted text-sm mt-1 mb-0">Admin Dashboard</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[0.8rem] font-display font-medium text-muted mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full bg-black/40 border border-lemon-green/25 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lemon-green transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[0.8rem] font-display font-medium text-muted mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-black/40 border border-lemon-green/25 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lemon-green transition-colors"
            />
          </div>

          {state.error && (
            <p className="text-red-400 text-sm">{state.error}</p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
