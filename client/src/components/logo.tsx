import logoSrc from "@/assets/logo.svg";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`} data-testid="logo">
      <img
        src={logoSrc}
        alt="Crack-CU"
        className="h-8 w-auto"
      />
      <span className="font-bold text-lg tracking-tight">
        <span className="text-primary">Crack</span>
        <span className="text-foreground">-CU</span>
      </span>
    </div>
  );
}

export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <img
      src={logoSrc}
      alt="Crack-CU"
      style={{ width: size, height: size }}
      className="object-contain"
    />
  );
}
