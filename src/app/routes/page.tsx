
"use client";

import { useState } from "react";
import { 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Target,
  Loader2,
  ChevronRight,
  Shield,
  Zap,
  Info
} from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SafetyMap } from "@/components/SafetyMap";
import { safeRouteSuggestion, type SafeRouteSuggestionOutput } from "@/ai/flows/safe-route-suggestion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

export default function RoutePlanner() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("DHA Phase 6, Karachi");
  const [destination, setDestination] = useState("Clifton Block 4, Karachi");
  const [suggestion, setSuggestion] = useState<SafeRouteSuggestionOutput | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const [preferences, setPreferences] = useState({
    avoidDarkAlleys: true,
    preferMainRoads: true,
    avoidDangerZones: true
  });

  const calculateSafePath = async () => {
    if (!origin || !destination) {
      toast({ title: "Inputs Required", description: "Define your start and end point.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await safeRouteSuggestion({
        origin,
        destination,
        preferences,
        timeOfDay: "night"
      });
      setSuggestion(res);
      toast({ title: "Analysis Complete", description: "Safe paths identified in Pakistan sector." });
    } catch (e) {
      toast({ title: "Sync Error", description: "Could not establish AI connection.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const activeRoute = suggestion?.options[selectedRouteIndex];

  return (
    <main className="pb-32 min-h-screen bg-[#070B14] font-body max-w-md mx-auto overflow-x-hidden relative">
      <header className="p-8 pt-10 space-y-1">
        <h1 className="text-3xl font-headline font-black tracking-tighter text-white uppercase">Route Intel</h1>
        <p className="text-muted-foreground text-[8px] uppercase font-black tracking-[0.4em]">Sentinel Pakistan Protocol: V2.5</p>
      </header>

      <div className="px-6 space-y-8">
        <section className="glass rounded-[36px] p-6 space-y-6 border-white/5 bg-[#121C2E]">
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input 
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                placeholder="Origin" 
                className="pl-12 bg-white/5 border-white/5 rounded-2xl h-12 text-white text-[13px] focus-visible:ring-primary"
              />
            </div>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
              <Input 
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="Destination" 
                className="pl-12 bg-white/5 border-white/5 rounded-2xl h-12 text-white text-[13px] focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase text-white tracking-widest">Tactical Routing</p>
                <p className="text-[8px] text-muted-foreground uppercase">Prioritize well-lit boulevards</p>
              </div>
              <Switch checked={preferences.avoidDangerZones} onCheckedChange={(v) => setPreferences({...preferences, avoidDangerZones: v})} />
            </div>
          </div>

          <Button 
            onClick={calculateSafePath}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ANALYZE SAFETY"}
          </Button>
        </section>

        {suggestion && (
          <section className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="h-64 rounded-[36px] overflow-hidden border border-white/5 shadow-2xl relative bg-[#070B14]">
                <SafetyMap 
                  center={activeRoute?.waypoints[0]} 
                  path={activeRoute?.waypoints} 
                  dangerZones={activeRoute?.dangerZones} 
                />
                <div className="absolute top-4 right-4 glass-elevated p-3 rounded-2xl text-center border-white/10 backdrop-blur-md">
                   <p className="text-[7px] uppercase font-black text-muted-foreground">Safe Index</p>
                   <p className="text-lg font-headline font-black text-green-400">{activeRoute?.safetyScore}%</p>
                </div>
             </div>

             <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
               {suggestion.options.map((opt, i) => (
                 <button 
                  key={opt.id}
                  onClick={() => setSelectedRouteIndex(i)}
                  className={cn(
                    "min-w-[150px] p-5 rounded-[28px] border transition-all text-left relative overflow-hidden",
                    selectedRouteIndex === i 
                      ? "bg-primary/10 border-primary text-white" 
                      : "bg-[#182235] border-white/5 text-muted-foreground"
                  )}
                 >
                    <p className="text-[9px] font-black uppercase mb-1 truncate">{opt.name}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-bold">{opt.duration}</span>
                    </div>
                    {selectedRouteIndex === i && <Zap className="absolute -bottom-2 -right-2 w-10 h-10 text-primary/10" />}
                 </button>
               ))}
             </div>

             <div className="glass rounded-[40px] p-6 space-y-6 border-white/10 bg-gradient-to-b from-[#182235] to-[#121C2E]">
                <div className="flex items-center justify-between">
                   <h4 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    Safest Textual Pathfinding
                  </h4>
                  <Badge variant="outline" className="border-primary/20 text-primary text-[7px] font-black uppercase">{activeRoute?.distance}</Badge>
                </div>
                
                <div className="space-y-4">
                   <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10">
                      <div className="flex gap-3">
                         <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-white">Turn-by-Turn Safety Guidance</p>
                            <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                               Sentinel has mapped the safest streets. Stick strictly to these boulevards for maximum security.
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      {activeRoute?.factors.map((f, fi) => (
                        <div key={fi} className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 active:bg-white/[0.08] transition-colors">
                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                              <span className="text-[10px] font-black text-primary">{fi + 1}</span>
                           </div>
                           <p className="text-[12px] text-white/90 font-medium leading-tight pt-1.5">{f}</p>
                        </div>
                      ))}
                   </div>
                </div>
                
                {activeRoute?.dangerZones.length! > 0 && (
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <h4 className="text-[9px] font-black uppercase text-destructive tracking-widest flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Sector Hazards Detected
                    </h4>
                    {activeRoute?.dangerZones.map((dz, di) => (
                      <div key={di} className="bg-destructive/5 border border-destructive/20 p-4 rounded-3xl space-y-1">
                         <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black text-white">{dz.name}</p>
                            <Badge variant="destructive" className="text-[6px] h-4 font-black">{dz.risk} RISK</Badge>
                         </div>
                         <p className="text-[9px] text-muted-foreground leading-tight">{dz.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button 
                  onClick={() => router.push(`/?walk=active&dest=${destination}&score=${activeRoute?.safetyScore}`)}
                  className="w-full h-16 rounded-[28px] bg-green-500 hover:bg-green-600 text-black font-black uppercase tracking-[0.2em] text-xs mt-4 active:scale-95 transition-transform shadow-lg shadow-green-500/20"
                >
                  ACTIVATE SECURE OVERWATCH
                </Button>
             </div>
          </section>
        )}
      </div>

      <AppNavigation />
    </main>
  );
}
