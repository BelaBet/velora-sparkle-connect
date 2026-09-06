import { useEffect, useState } from "react";
import { supabase } from "./supabase-client";

export async function signUpMember(
  email: string,
  password: string,
): Promise<{ error: string | null; sessionCreated: boolean }> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { error: error?.message ?? null, sessionCreated: data.session != null };
}

export async function signInMember(email: string, password: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return error.message;
  return null;
}

export async function signOutMember() {
  await supabase.auth.signOut();
}

export async function completeSignupProfile(
  name: string,
  age: number,
  city: string,
): Promise<string | null> {
  const { error } = await supabase.rpc("complete_signup_profile", {
    p_name: name,
    p_age: age,
    p_city: city,
  });
  if (error) return error.message;
  return null;
}

export type MemberVerificationStatus = "pendente" | "aprovada" | "rejeitada";

export async function requestIdentityVerification(): Promise<string | null> {
  const { error } = await supabase.rpc("request_identity_verification", { p_type: "identidade" });
  if (error) return error.message;
  return null;
}

export async function hasOwnProfile(): Promise<boolean> {
  const { data } = await supabase.from("member_profiles").select("id").maybeSingle();
  return data != null;
}

export async function getOwnVerificationStatus(): Promise<MemberVerificationStatus | null> {
  const { data } = await supabase
    .from("verification_requests")
    .select("status")
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.status as MemberVerificationStatus | undefined) ?? null;
}

/** Remove tentativas de cadastro de MFA abandonadas antes de começar uma nova. */
export async function cleanupUnverifiedTotpFactors() {
  const { data } = await supabase.auth.mfa.listFactors();
  const unverified = (data?.totp ?? []).filter((f) => f.status !== "verified");
  for (const factor of unverified) {
    await supabase.auth.mfa.unenroll({ factorId: factor.id });
  }
}

export async function enrollTotp() {
  return supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Velora" });
}

export async function challengeAndVerifyTotp(factorId: string, code: string) {
  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId,
  });
  if (challengeError) return challengeError.message;

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  });
  if (verifyError) return verifyError.message;
  return null;
}

export async function getVerifiedTotpFactorId(): Promise<string | null> {
  const { data } = await supabase.auth.mfa.listFactors();
  const factor = data?.totp?.find((f) => f.status === "verified");
  return factor?.id ?? null;
}

export type MemberAuthStatus =
  "checking" | "guest" | "needs-profile" | "needs-mfa-enroll" | "needs-mfa-challenge" | "authed";

/**
 * Sessão do membro: exige login, perfil completo e fator TOTP cadastrado e
 * verificado na sessão atual (MFA é checada a cada sessão, não só uma vez).
 */
export function useMemberSession(): MemberAuthStatus {
  const [status, setStatus] = useState<MemberAuthStatus>("checking");

  useEffect(() => {
    let active = true;

    const evaluate = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        if (active) setStatus("guest");
        return;
      }

      const profileExists = await hasOwnProfile();
      if (!profileExists) {
        if (active) setStatus("needs-profile");
        return;
      }

      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      const hasVerifiedFactor = (factorsData?.totp ?? []).some((f) => f.status === "verified");
      if (!hasVerifiedFactor) {
        if (active) setStatus("needs-mfa-enroll");
        return;
      }

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal && aal.currentLevel !== "aal2") {
        if (active) setStatus("needs-mfa-challenge");
        return;
      }

      if (active) setStatus("authed");
    };

    void evaluate();

    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      void evaluate();
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return status;
}
