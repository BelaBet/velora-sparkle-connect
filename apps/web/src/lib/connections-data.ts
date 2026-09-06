import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase-client";

export type Match = {
  matchId: string;
  profileId: string;
  name: string;
  age: number;
  city: string;
  photoUrl: string | null;
  matchedAt: string;
};

type MatchRow = {
  match_id: string;
  profile_id: string;
  name: string;
  age: number;
  city: string;
  photo_url: string | null;
  matched_at: string;
};

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_my_matches");
      if (error) throw error;
      return (data as MatchRow[]).map((r): Match => ({
        matchId: r.match_id,
        profileId: r.profile_id,
        name: r.name,
        age: r.age,
        city: r.city,
        photoUrl: r.photo_url,
        matchedAt: r.matched_at,
      }));
    },
  });
}

export type Message = {
  id: string;
  matchId: string;
  senderProfileId: string;
  text: string;
  createdAt: string;
};

type MessageRow = {
  id: string;
  match_id: string;
  sender_profile_id: string;
  text: string;
  created_at: string;
};

export function useMatchMessages(matchId: string | null) {
  return useQuery({
    queryKey: ["matches", matchId, "messages"],
    enabled: matchId != null,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, match_id, sender_profile_id, text, created_at")
        .eq("match_id", matchId as string)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as MessageRow[]).map((r): Message => ({
        id: r.id,
        matchId: r.match_id,
        senderProfileId: r.sender_profile_id,
        text: r.text,
        createdAt: r.created_at,
      }));
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, text }: { matchId: string; text: string }) => {
      const { error } = await supabase.rpc("send_message", { p_match_id: matchId, p_text: text });
      if (error) throw error;
    },
    onSuccess: (_data, { matchId }) => {
      void queryClient.invalidateQueries({ queryKey: ["matches", matchId, "messages"] });
    },
  });
}

export function useBlockProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase.rpc("block_profile", { p_target_profile_id: profileId });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["matches"] });
      void queryClient.invalidateQueries({ queryKey: ["discover"] });
    },
  });
}

export function useReportProfile() {
  return useMutation({
    mutationFn: async ({
      profileId,
      reason,
      details,
    }: {
      profileId: string;
      reason: string;
      details?: string;
    }) => {
      const { error } = await supabase.rpc("submit_security_report", {
        p_reported_profile_id: profileId,
        p_reason: reason,
        p_details: details ?? "",
      });
      if (error) throw error;
    },
  });
}
