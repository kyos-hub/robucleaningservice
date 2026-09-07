import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ContentMap = Record<string, Record<string, string>>;

export function useSiteContent(): {
  content: ContentMap;
  text: (key: string, field: string, fallback?: string) => string;
  image: (key: string, field: string, fallback?: string) => string | undefined;
} {
  const { data } = useQuery({
    queryKey: ["website-content-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("website_content").select("key, value");
      if (error) throw error;
      const map: ContentMap = {};
      for (const row of data ?? []) {
        map[row.key as string] = (row.value ?? {}) as Record<string, string>;
      }
      return map;
    },
    staleTime: 60_000,
  });

  const content = data ?? {};
  const text = (key: string, field: string, fallback = "") => {
    const v = content[key]?.[field];
    return v && v.length > 0 ? v : fallback;
  };
  const image = (key: string, field: string, fallback?: string) => {
    const v = content[key]?.[field];
    return v && v.length > 0 ? v : fallback;
  };
  return { content, text, image };
}
