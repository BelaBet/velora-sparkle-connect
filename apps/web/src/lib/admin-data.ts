import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase-client";

export type ProfileStatus = "ativo" | "suspenso" | "pendente";

export type AdminProfile = {
  id: string;
  name: string;
  age: number;
  email: string;
  city: string;
  status: ProfileStatus;
  verified: boolean;
  joinedAt: string;
  reportsCount: number;
};

type ProfileRow = {
  id: string;
  name: string;
  age: number;
  email: string;
  city: string;
  status: ProfileStatus;
  verified: boolean;
  joined_at: string;
  reports_count: number;
};

function mapProfile(row: ProfileRow): AdminProfile {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    email: row.email,
    city: row.city,
    status: row.status,
    verified: row.verified,
    joinedAt: row.joined_at,
    reportsCount: row.reports_count,
  };
}

export function useAdminProfiles() {
  return useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_profiles")
        .select("id, name, age, email, city, status, verified, joined_at, reports_count")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as ProfileRow[]).map(mapProfile);
    },
  });
}

export function useSetProfileStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProfileStatus }) => {
      const { error } = await supabase.from("member_profiles").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "profiles"] });
    },
  });
}

export type VerificationType = "identidade" | "liveness";
export type VerificationStatus = "pendente" | "aprovada" | "rejeitada";

export type VerificationRequest = {
  id: string;
  profileName: string;
  type: VerificationType;
  submittedAt: string;
  status: VerificationStatus;
};

type VerificationRow = {
  id: string;
  profile_name: string;
  type: VerificationType;
  submitted_at: string;
  status: VerificationStatus;
};

function mapVerification(row: VerificationRow): VerificationRequest {
  return {
    id: row.id,
    profileName: row.profile_name,
    type: row.type,
    submittedAt: row.submitted_at,
    status: row.status,
  };
}

export function useVerificationRequests() {
  return useQuery({
    queryKey: ["admin", "verifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verification_requests")
        .select("id, profile_name, type, submitted_at, status")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return (data as VerificationRow[]).map(mapVerification);
    },
  });
}

export function useResolveVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: VerificationStatus }) => {
      const { error } = await supabase
        .from("verification_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "verifications"] });
    },
  });
}

export type ReportSeverity = "baixa" | "média" | "alta";
export type ReportStatus = "aberto" | "em análise" | "resolvido";

export type SecurityReport = {
  id: string;
  reporterName: string;
  reportedName: string;
  reason: string;
  details: string;
  submittedAt: string;
  severity: ReportSeverity;
  status: ReportStatus;
};

type ReportRow = {
  id: string;
  reporter_name: string;
  reported_name: string;
  reason: string;
  details: string;
  submitted_at: string;
  severity: ReportSeverity;
  status: ReportStatus;
};

function mapReport(row: ReportRow): SecurityReport {
  return {
    id: row.id,
    reporterName: row.reporter_name,
    reportedName: row.reported_name,
    reason: row.reason,
    details: row.details,
    submittedAt: row.submitted_at,
    severity: row.severity,
    status: row.status,
  };
}

export function useSecurityReports() {
  return useQuery({
    queryKey: ["admin", "reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("security_reports")
        .select("id, reporter_name, reported_name, reason, details, submitted_at, severity, status")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return (data as ReportRow[]).map(mapReport);
    },
  });
}

export function useAdvanceReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReportStatus }) => {
      const { error } = await supabase.from("security_reports").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}

export type AdminExperience = {
  id: string;
  title: string;
  venue: string;
  city: string;
  detail: string;
  imageUrl: string | null;
};

type ExperienceRow = {
  id: string;
  title: string;
  venue: string;
  city: string;
  detail: string;
  image_url: string | null;
};

function mapExperience(row: ExperienceRow): AdminExperience {
  return {
    id: row.id,
    title: row.title,
    venue: row.venue,
    city: row.city,
    detail: row.detail,
    imageUrl: row.image_url,
  };
}

export function useAdminExperiences() {
  return useQuery({
    queryKey: ["admin", "experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("id, title, venue, city, detail, image_url")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as ExperienceRow[]).map(mapExperience);
    },
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; venue: string; city: string; detail: string }) => {
      const { error } = await supabase.from("experiences").insert(input);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "experiences"] });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...changes
    }: {
      id: string;
      title?: string;
      venue?: string;
      city?: string;
      detail?: string;
    }) => {
      const { error } = await supabase.from("experiences").update(changes).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "experiences"] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "experiences"] });
    },
  });
}

/** Envia a foto pro Storage e grava a URL pública na experiência. */
export async function uploadExperiencePhoto(
  experienceId: string,
  file: File,
): Promise<string | null> {
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${experienceId}/photo.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("experience-photos")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) return uploadError.message;

  const {
    data: { publicUrl },
  } = supabase.storage.from("experience-photos").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("experiences")
    .update({ image_url: `${publicUrl}?v=${Date.now()}` })
    .eq("id", experienceId);
  if (updateError) return updateError.message;
  return null;
}
