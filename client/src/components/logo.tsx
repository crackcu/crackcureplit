import logoSvg from "@assets/Pasted--xml-version-1-0-encoding-UTF-8-svg-version-1-1-xmlns-h_1770577160558.txt";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
        CU
      </div>
      <span className="font-bold text-lg tracking-tight">
        <span className="text-primary">Crack</span>
        <span className="text-foreground">-CU</span>
      </span>
    </div>
  );
}

export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold"
    >
      <span style={{ fontSize: size * 0.35 }}>CU</span>
    </div>
  );
}
