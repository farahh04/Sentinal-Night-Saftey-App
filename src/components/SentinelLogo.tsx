import { Shield } from "lucide-react";

export function SentinelLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
        <Shield className="w-9 h-9 text-primary relative z-10 drop-shadow-[0_0_12px_rgba(0,168,107,0.8)]" />
        <div className="absolute inset-0 rounded-full border border-primary/20 scale-150 opacity-20 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="font-headline font-black text-2xl tracking-tighter text-white leading-none glow-emerald">
          SENTINEL
        </span>
        <span className="text-[8px] uppercase tracking-[0.4em] font-black text-primary/80 mt-1 ml-0.5">
          PAKISTAN SECURE
        </span>
      </div>
    </div>
  );
}