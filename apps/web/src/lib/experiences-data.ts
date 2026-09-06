import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase-client";

export type ExperienceRecord = {
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

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("id, title, venue, city, detail, image_url")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as ExperienceRow[]).map((r): ExperienceRecord => ({
        id: r.id,
        title: r.title,
        venue: r.venue,
        city: r.city,
        detail: r.detail,
        imageUrl: r.image_url,
      }));
    },
  });
}

export function useMyBookedExperienceIds() {
  return useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("experience_id");
      if (error) throw error;
      return new Set((data as { experience_id: string }[]).map((b) => b.experience_id));
    },
  });
}

export function useRequestBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (experienceId: string) => {
      const { data: userData } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("member_profiles")
        .select("id")
        .eq("user_id", userData.user?.id ?? "")
        .maybeSingle();
      if (!profile) throw new Error("Perfil não encontrado.");

      const { error } = await supabase
        .from("bookings")
        .insert({ experience_id: experienceId, profile_id: profile.id });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
  });
}
