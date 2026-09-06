import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase-client";
import { getOwnProfile } from "./member-auth";

export type DiscoverableProfile = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string | null;
  interests: string[];
  verified: boolean;
  photoUrl: string | null;
};

type DiscoverableProfileRow = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string | null;
  interests: string[];
  verified: boolean;
  photo_url: string | null;
};

export function useDiscoverProfiles() {
  return useQuery({
    queryKey: ["discover", "profiles"],
    queryFn: async () => {
      const ownProfile = await getOwnProfile();
      const { data, error } = await supabase.rpc("list_discoverable_profiles");
      if (error) throw error;
      const rows = (data ?? []) as DiscoverableProfileRow[];
      const profiles: DiscoverableProfile[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        age: r.age,
        city: r.city,
        bio: r.bio,
        interests: r.interests,
        verified: r.verified,
        photoUrl: r.photo_url,
      }));
      return ownProfile ? profiles.filter((p) => p.id !== ownProfile.id) : profiles;
    },
  });
}

export type ExpressInterestResult = { matched: boolean; matchId: string | null };

export function useExpressInterest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (toProfileId: string): Promise<ExpressInterestResult> => {
      const { data, error } = await supabase.rpc("express_interest", {
        p_to_profile_id: toProfileId,
      });
      if (error) throw error;
      const result = data as { matched: boolean; match_id: string | null };
      return { matched: result.matched, matchId: result.match_id };
    },
    onSuccess: (result) => {
      if (result.matched) {
        void queryClient.invalidateQueries({ queryKey: ["matches"] });
      }
    },
  });
}
