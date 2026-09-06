import { useQuery } from "@tanstack/react-query";
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
};

export function useDiscoverProfiles() {
  return useQuery({
    queryKey: ["discover", "profiles"],
    queryFn: async () => {
      const ownProfile = await getOwnProfile();
      const { data, error } = await supabase.rpc("list_discoverable_profiles");
      if (error) throw error;
      const profiles = (data ?? []) as DiscoverableProfile[];
      return ownProfile ? profiles.filter((p) => p.id !== ownProfile.id) : profiles;
    },
  });
}
