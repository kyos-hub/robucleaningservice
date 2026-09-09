import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { X, Film, Image as ImageIcon, Loader2, Play, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import imgGallery from "@/assets/photos/gallery.jpg";
const heroImg = imgGallery;

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery, Robu Cleaning Services at Work" },
      {
        name: "description",
        content:
          "Photos and videos from Robu Cleaning Services Ltd, our crews, equipment and completed jobs across Eldoret, Nairobi and the wider Rift, Western and Nyanza regions.",
      },
      { property: "og:title", content: "Gallery, Robu Cleaning Services at Work" },
      {
        property: "og:description",
        content: "A visual look at commercial cleaning, fumigation and facility maintenance jobs by Robu Cleaning Services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const GALLERY_BUCKET = "gallery";
const SIGNED_URL_TTL_SECONDS = 3600;

interface GalleryItemRow {
  id: string;
  title: string | null;
  category: string | null;
  image_url: string;
  sort_order: number;
}

interface DisplayItem extends GalleryItemRow {
  displayUrl: string;
}

const VIDEO_RX = /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i;
const isVideo = (url: string) => VIDEO_RX.test(url);

async function fetchPublicGallery(): Promise<DisplayItem[]> {
  try {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];

    const rows = data as GalleryItemRow[];

    const withSignedUrls = await Promise.all(
      rows.map(async (row): Promise<DisplayItem | null> => {
        try {
          const { data: signed, error: signError } = await supabase.storage
            .from(GALLERY_BUCKET)
            .createSignedUrl(row.image_url, SIGNED_URL_TTL_SECONDS);
          if (signError || !signed?.signedUrl) return null;
          return { ...row, displayUrl: signed.signedUrl };
        } catch {
          return null;
        }
      }),
    );

    return withSignedUrls.filter((item): item is DisplayItem => item !== null);
  } catch {
    return [];
  }
}

function GalleryPage() {
  const [filter, setFilter] = useState<string>("all");
  const [index, setIndex] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: fetchPublicGallery,
  });

  const items = data ?? [];
  const photoCount = items.filter((i) => !isVideo(i.image_url)).length;
  const videoCount = items.length - photoCount;

  const chips = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean))) as string[];
    return [
      { key: "all", label: `All (${items.length})` },
      ...(photoCount ? [{ key: "images", label: `Photos (${photoCount})` }] : []),
      ...(videoCount ? [{ key: "videos", label: `Videos (${videoCount})` }] : []),
      ...cats.map((c) => ({ key: `cat:${c}`, label: c })),
    ];
  }, [items, photoCount, videoCount]);

  const filtered = items.filter((i) => {
    if (filter === "all") return true;
    if (filter === "videos") return isVideo(i.image_url);
    if (filter === "images") return !isVideo(i.image_url);
    return i.category === filter.replace(/^cat:/, "");
  });

  const active = index === null ? null : filtered[index] ?? null;
  const step = (d: number) => setIndex((i) => (i === null ? null : (i + d + filtered.length) % filtered.length));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
        </div>
        <div className="container-page relative max-w-3xl py-16 text-white md:py-24">
          <span className="eyebrow text-white/80">Gallery</span>
          <h1 className="heading-hero mt-5 text-white">Trusted work, done right.</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/90">
            A look at our crews, equipment and completed jobs across cleaning, fumigation
            and facility maintenance projects for Robu Cleaning Services.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 backdrop-blur">
              <Camera className="h-3.5 w-3.5" /> {photoCount} photos
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 backdrop-blur">
              <Play className="h-3.5 w-3.5" /> {videoCount} videos
            </span>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="container-page flex flex-wrap gap-2 py-4">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => { setFilter(c.key); setIndex(null); }}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5",
                filter === c.key
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-20 text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground opacity-0" />
            <p className="font-display text-lg font-bold">Nothing here yet</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {items.length === 0 ? "Our team is uploading fresh media, check back soon." : "No media in this filter."}
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {filtered.map((it, i) => {
              const video = isVideo(it.image_url);
              return (
                <Reveal key={it.id} delay={(i % 3) * 90} className="break-inside-avoid">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card text-left lift-hover hover:border-primary/40"
                  >
                    <div className={cn("overflow-hidden bg-muted", i % 5 === 0 ? "aspect-[4/5]" : "aspect-[4/3]")}>
                      {video ? (
                        <video src={it.displayUrl} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                      ) : (
                        <img
                          src={it.displayUrl}
                          alt={it.title ?? ""}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                        />
                      )}
                    </div>
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                      {video ? <><Film className="h-3 w-3" /> Video</> : <><ImageIcon className="h-3 w-3" /> Photo</>}
                    </span>
                    {video && (
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/85 text-primary transition-transform duration-300 group-hover:scale-110">
                          <Play className="ml-0.5 h-5 w-5" />
                        </span>
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="truncate font-display text-sm font-bold text-white">{it.title ?? "Untitled"}</p>
                      {it.category && <p className="truncate text-[11px] text-white/70">{it.category}</p>}
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200"
          onClick={() => setIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={() => setIndex(null)}
          >
            <X className="h-5 w-5" />
          </button>
          {filtered.length > 1 && (
            <>
              <button
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); step(1); }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {isVideo(active.image_url) ? (
              <video src={active.displayUrl} controls autoPlay className="max-h-[78vh] w-full rounded-2xl" />
            ) : (
              <img
                src={active.displayUrl}
                alt={active.title ?? ""}
                className="max-h-[78vh] w-full rounded-2xl object-contain"
              />
            )}
            <div className="mt-4 text-center text-white">
              {active.title && <p className="font-display text-base font-bold">{active.title}</p>}
              {active.category && <p className="text-sm text-white/60">{active.category}</p>}
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-white/40">
                {(index ?? 0) + 1} / {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}