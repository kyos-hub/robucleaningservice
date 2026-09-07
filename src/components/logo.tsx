import logoAsset from "@/assets/robu-logo.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={logoAsset}
        alt="Robu Cleaning Services Ltd logo"
        width={160}
        height={50}
        className="h-10 w-auto shrink-0 object-contain"
      />
      {!compact && (
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-bold tracking-tight text-foreground">
            Robu Cleaning Services
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Cleaning · Sanitation · Pest Control
          </span>
        </div>
      )}
    </div>
  );
}
