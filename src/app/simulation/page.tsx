"use client";

import { useState, useEffect } from "react";
import { Phone, PhoneOff, MoreHorizontal, MicOff, Mic, VideoOff, Video, Clock, MessageSquare, User } from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CallSimulator() {
  const { toast } = useToast();
  const [isCalling, setIsCalling] = useState(false);
  const [duration, setDuration] = useState(0);
  const [callerName, setCallerName] = useState("Home (Mom)");
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isCalling) {
      interval = setInterval(() => setDuration(d => d + 1), 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const initiateFakeCall = (s: number) => {
    if (s === 0) {
      setIsCalling(true);
      return;
    }
    setCountdown(s);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          setIsCalling(true);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
    toast({ title: "Timer Set", description: `Incoming call in ${s} seconds.` });
  };

  if (isCalling) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0A0E17] flex flex-col font-sans animate-in zoom-in duration-300 max-w-md mx-auto">
        <div className="flex-1 flex flex-col items-center justify-start pt-24 space-y-8">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full" />
             <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-4 overflow-hidden border-2 border-white/10 relative z-10">
                <User className="w-16 h-16 text-white/20" />
                <img src={`https://picsum.photos/seed/${callerName}/400`} className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale" alt="Caller" />
             </div>
          </div>
          <div className="text-center space-y-2 relative z-10">
             <h1 className="text-4xl font-light text-white tracking-tight">{callerName}</h1>
             <p className="text-primary text-sm font-medium tracking-widest uppercase">
                {duration > 0 ? (
                  `${Math.floor(duration/60)}:${String(duration%60).padStart(2, '0')}`
                ) : (
                  "Calling..."
                )}
             </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-12 mb-32 px-12 relative z-10">
          {[
            { icon: MicOff, label: "Mute" },
            { icon: MoreHorizontal, label: "Keypad" },
            { icon: VideoOff, label: "FaceTime" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 active:bg-white/10">
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center pb-24 relative z-10">
          <button 
            onClick={() => setIsCalling(false)} 
            className="w-20 h-20 rounded-full bg-destructive flex items-center justify-center shadow-2xl shadow-destructive/20 active:scale-90 transition-transform"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="pb-32 min-h-screen bg-[#070B14] font-body max-w-md mx-auto overflow-x-hidden">
      <header className="p-8 pt-12 space-y-2">
        <h1 className="text-3xl font-headline font-black text-white tracking-tighter uppercase">FAKE CALL SIMULATOR</h1>
        <p className="text-muted-foreground text-[8px] uppercase font-black tracking-[0.4em]">De-escalation Protocol: V1.2</p>
      </header>

      <div className="px-8 space-y-6">
        <section className="glass rounded-[48px] p-8 space-y-8 border-white/5 bg-gradient-to-b from-[#182235] to-[#121C2E]">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-3">Caller Identity</label>
              <Input 
                value={callerName} 
                onChange={e => setCallerName(e.target.value)}
                className="bg-white/5 border-white/10 rounded-3xl h-16 px-6 text-white font-bold"
                placeholder="e.g. Home (Mom)"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="rounded-2xl h-16 border-white/10 text-[10px] font-black uppercase tracking-widest" onClick={() => initiateFakeCall(5)}>5 SEC DELAY</Button>
              <Button variant="outline" className="rounded-2xl h-16 border-white/10 text-[10px] font-black uppercase tracking-widest" onClick={() => initiateFakeCall(30)}>30 SEC DELAY</Button>
            </div>

            <Button 
              className="w-full h-20 rounded-[32px] bg-primary text-white font-black text-lg uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all" 
              onClick={() => initiateFakeCall(0)}
            >
              TRIGGER NOW
            </Button>
            
            {countdown !== null && (
              <div className="flex flex-col items-center gap-2 py-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest">Incoming in {countdown}s...</p>
              </div>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
             <p className="text-[11px] text-muted-foreground leading-relaxed italic text-center opacity-80">
               "Use this to simulate an active domestic conversation. Psychological analysis suggests this can deter harassment in 65% of night scenarios."
             </p>
          </div>
        </section>
      </div>
      <AppNavigation />
    </main>
  );
}
