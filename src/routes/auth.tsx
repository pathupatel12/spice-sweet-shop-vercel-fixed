import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Login or Register — Grevora" }] }),
  component: AuthPage,
});

type Mode = "login" | "register" | "phone";

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        nav({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handlePhone(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!otpSent) {
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
        setOtpSent(true);
        toast.success("OTP sent");
      } else {
        const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
        if (error) throw error;
        toast.success("Logged in!");
        nav({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "OTP failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-md px-4 py-14">
        <h1 className="text-center font-display text-3xl font-semibold">
          {mode === "register" ? "Create your account" : mode === "phone" ? "Login with Phone" : "Welcome back"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "register" ? "Join the Grevora family" : "Sign in to continue shopping"}
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex rounded-full bg-secondary p-1 text-xs font-semibold">
            {(["login", "register", "phone"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setOtpSent(false); }}
                className={`flex-1 rounded-full py-2 transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {m === "login" ? "Login" : m === "register" ? "Register" : "Phone OTP"}
              </button>
            ))}
          </div>

          {mode === "phone" ? (
            <form onSubmit={handlePhone} className="mt-6 space-y-3">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                disabled={otpSent}
              />
              {otpSent && (
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm tracking-widest"
                />
              )}
              <button disabled={loading} className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {loading ? "..." : otpSent ? "Verify OTP" : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmail} className="mt-6 space-y-3">
              {mode === "register" && (
                <input
                  required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                />
              )}
              <input
                required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
              <input
                required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
              <button disabled={loading} className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {loading ? "..." : mode === "register" ? "Create Account" : "Sign In"}
              </button>
            </form>
          )}

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>
          <button onClick={handleGoogle} className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-secondary">
            Continue with Google
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}