
"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  ShieldAlert, 
  EyeOff, 
  Compass, 
  Zap, 
  ShieldCheck, 
  PhoneCall, 
  AlertTriangle,
  Dog,
  Heart,
  MapPin,
  TrendingUp,
  Battery,
  Users,
  ChevronRight,
  Loader2,
  Building2,
  Clock,
  Wifi
} from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { SentinelLogo } from "@/components/SentinelLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SafetyMap } from "@/components/SafetyMap";
import { useToast } from "@/hooks/use-toast";
import { findNearbySafeHavens } from "@/lib/police-data";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/firestore/use-collection";

const SAFETY_TIPS = [
  "Stay on well-lit main roads in DHA and Clifton.",
  "Share your live location with at least one Trusted Contact.",
  "Avoid taking shortcuts through dark residential sectors after 10 PM.",
  "Keep your phone in your hand but not clearly visible in high-traffic areas.",
  "Trust your instincts—if a street feels wrong, double back to the main road."
];

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const isWalkActive = searchParams.get("walk") === "active";
  const destination = searchParams.get("dest") || "";
  
  const [isStealth, setIsStealth] = useState(false);
  const [safetyScore, setSafetyScore] = useState(94);
  const [isAnomalous, setIsAnomalous] = useState(false);
  const [safeHavens, setSafeHavens] = useState<any[]>([]);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  // Firestore Data
  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "users", user.uid, "contacts"), limit(5));
  }, [firestore, user]);

  const recentWalksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "walks"), 
      where("userId", "==", user.uid), 
      orderBy("date", "desc"), 
      limit(3)
    );
  }, [firestore, user]);

  const { data: contacts } = useCollection(contactsQuery);
  const { data: recentWalks } = useCollection(recentWalksQuery);

  // Device Telemetry Logic
  useEffect(() => {
    // Battery
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.floor(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.floor(battery.level * 100));
        });
      });
    }

    // GPS Status
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(() => setGpsEnabled(true), () => setGpsEnabled(false));
    }

    // Safety Score Calculation
    const hour = new Date().getHours();
    let score = 95;
    if (hour >= 22 || hour <= 5) score -= 15;
    else if (hour >= 19) score -= 5;
    setSafetyScore(score);

    // Karachi center
    const havens = findNearbySafeHavens(24.8607, 67.0670);
    setSafeHavens(havens);
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleSOS = (type: string) => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate([200, 100, 200]);
    }
    router.push(`/sos?type=${type}`);
  };

  return (
    <main className="pb-32 min-h-screen relative bg-[#070B14] overflow-x-hidden font-body max-w-md mx-auto">
      
      {isStealth && (
        <div 
          className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-700"
          onDoubleClick={() => setIsStealth(false)}
        >
          <div className="w-full aspect-[9/16] bg-[#0A0A0A] rounded-[48px] p-6 flex flex-col font-mono text-neutral-600 border border-neutral-800 shadow-2xl relative">
            <div className="text-right text-5xl mb-12 text-neutral-300 font-light">0</div>
            <div className="grid grid-cols-4 gap-3 flex-1">
              {[7, 8, 9, '÷', 4, 5, 6, '×', 1, 2, 3, '-', 0, '.', '=', '+'].map((n, i) => (
                <div key={i} className="flex items-center justify-center bg-neutral-900/40 rounded-full h-12 text-lg border border-white/5">{n}</div>
              ))}
            </div>
          </div>
          <p className="text-center text-[8px] text-neutral-700 mt-8 uppercase tracking-[0.6em] font-black animate-pulse">Double tap to resume SafeWalk</p>
        </div>
      )}

      <header className="p-6 pt-10 flex items-center justify-between relative z-10">
        <SentinelLogo />
        <Button 
            variant="ghost" size="icon" 
            className="glass rounded-full text-primary w-12 h-12 active-press"
            onClick={() => setIsStealth(true)}
        >
            <EyeOff className="w-5 h-5" />
        </Button>
      </header>

      <div className="px-6 space-y-8 relative z-10">
        
        <section className="space-y-4">
           <div className="space-y-1">
             <p className="text-[10px] uppercase font-black tracking-[0.3em] text-primary">{getTimeGreeting()}</p>
             <h2 className="text-3xl font-headline font-black text-white">{user?.displayName?.split(' ')[0] || "Walker"}</h2>
           </div>

           <div className="glass rounded-[40px] p-6 space-y-4 border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sector Safety Index</p>
                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase font-black">{safetyScore}% SECURE</Badge>
              </div>
              <Progress value={safetyScore} className="h-1.5 bg-white/5 rounded-full" />
              <p className="text-[9px] text-muted-foreground italic leading-relaxed">
                Sentinel is monitoring regional telemetry. Night protocols are currently {safetyScore < 90 ? "ACTIVE" : "STANDBY"}.
              </p>
           </div>
        </section>

        <section className="relative flex flex-col items-center py-2">
          {isWalkActive ? (
            <div className="w-full h-80 glass rounded-[40px] overflow-hidden relative border border-primary/20 shadow-2xl">
               <SafetyMap zoom={15} />
               <div className="absolute top-4 inset-x-4 flex justify-between">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black uppercase py-1 px-3 backdrop-blur-md">Active Walk: {destination}</Badge>
               </div>
               <div className="absolute bottom-4 inset-x-4 glass-elevated p-4 rounded-3xl border-white/10 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-[7px] text-muted-foreground uppercase font-black tracking-widest">Live Monitoring</p>
                     <p className="text-xl font-headline font-black text-green-400">{safetyScore}%</p>
                  </div>
                  <Button onClick={() => router.push("/sos/safe")} className="h-10 rounded-xl bg-green-500 text-black text-[9px] font-black uppercase">I AM SAFE</Button>
               </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full animate-pulse" />
              <button 
                onClick={() => router.push("/routes")}
                className="w-52 h-52 rounded-full glass-elevated flex flex-col items-center justify-center shadow-[0_0_60px_rgba(124,92,255,0.15)] active-press transition-all duration-700 relative z-10 border-white/10 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Compass className="w-10 h-10 text-primary mb-3 group-hover:rotate-45 transition-transform duration-700" />
                <span className="text-white font-headline font-black text-xl tracking-tighter uppercase leading-none">START WALK</span>
                <span className="text-[7px] text-primary font-black tracking-[0.3em] mt-2 uppercase">Region: Pakistan</span>
              </button>
            </div>
          )}
        </section>

        <section className="grid grid-cols-2 gap-3">
           <Dialog>
              <DialogTrigger asChild>
                <button className="h-28 glass rounded-[36px] flex flex-col items-center justify-center gap-2 border-destructive/20 active-press transition-all group">
                   <ShieldAlert className="w-7 h-7 text-destructive group-hover:scale-110 transition-transform" />
                   <div className="text-center">
                     <span className="text-[8px] font-black uppercase tracking-widest block">SOS Dispatch</span>
                     <span className="text-[6px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Instant Responder</span>
                   </div>
                </button>
              </DialogTrigger>
              <DialogContent className="glass-elevated border-white/10 rounded-[40px] max-w-[90%] mx-auto p-6">
                <DialogHeader>
                  <DialogTitle className="font-headline text-lg font-black uppercase tracking-tighter text-center">Crisis Response Selection</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-4">
                   {[
                     { id: 'harassment', icon: Heart, label: 'Harassment', color: 'text-destructive' },
                     { id: 'robbery', icon: ShieldAlert, label: 'Robbery', color: 'text-destructive' },
                     { id: 'animal_attack', icon: Dog, label: 'Animal Attack', color: 'text-orange-400' },
                     { id: 'medical', icon: Activity, label: 'Medical 1122', color: 'text-primary' }
                   ].map(type => (
                     <Button key={type.id} onClick={() => handleSOS(type.id)} className="h-20 rounded-2xl flex flex-col gap-1.5 bg-white/5 border border-white/5 active-press">
                        <type.icon className={cn("w-5 h-5", type.color)} />
                        <span className="text-[8px] font-black uppercase">{type.label}</span>
                     </Button>
                   ))}
                </div>
              </DialogContent>
           </Dialog>

           <button 
            onClick={() => router.push("/simulation")}
            className="h-28 glass rounded-[36px] flex flex-col items-center justify-center gap-2 border-primary/20 active-press transition-all group"
           >
              <PhoneCall className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <span className="text-[8px] font-black uppercase tracking-widest block">Fake Conversation</span>
                <span className="text-[6px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Tactical Exit</span>
              </div>
           </button>
        </section>

        <section className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h4 className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Circle of Trust</h4>
              <button onClick={() => router.push('/contacts')} className="text-[8px] text-primary font-black uppercase">Manage →</button>
           </div>
           <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-6 px-6">
              {contacts?.map((contact: any) => (
                <div key={contact.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                   <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-0.5">
                      <img src={`https://picsum.photos/seed/${contact.id}/100`} className="w-full h-full rounded-full object-cover grayscale" alt={contact.name} />
                   </div>
                   <span className="text-[8px] font-bold text-white uppercase truncate w-full text-center">{contact.name}</span>
                </div>
              ))}
              <button 
                onClick={() => router.push('/contacts')}
                className="w-14 h-14 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center shrink-0"
              >
                <span className="text-white/20 text-xl">+</span>
              </button>
           </div>
        </section>

        <section className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h4 className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Tactical Tip</h4>
              <button onClick={() => setTipIndex((prev) => (prev + 1) % SAFETY_TIPS.length)} className="text-[8px] text-primary font-black uppercase">Next →</button>
           </div>
           <div className="glass rounded-[32px] p-6 border-white/5 bg-primary/5">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                 </div>
                 <p className="text-[11px] text-white/80 leading-relaxed font-medium italic">
                    "{SAFETY_TIPS[tipIndex]}"
                 </p>
              </div>
           </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
           <div className="glass p-5 rounded-[32px] border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                 <Battery className="w-3 h-3 text-muted-foreground" />
                 <span className="text-[8px] font-black uppercase text-white">{batteryLevel}%</span>
              </div>
              <Progress value={batteryLevel} className="h-1 bg-white/5" />
              <p className="text-[7px] text-muted-foreground uppercase font-black">Battery Level</p>
           </div>
           <div className="glass p-5 rounded-[32px] border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                 <Wifi className={cn("w-3 h-3", gpsEnabled ? "text-primary" : "text-destructive")} />
                 <span className={cn("text-[8px] font-black uppercase", gpsEnabled ? "text-primary" : "text-destructive")}>
                   {gpsEnabled ? "CONNECTED" : "OFFLINE"}
                 </span>
              </div>
              <div className={cn("h-1 rounded-full", gpsEnabled ? "bg-primary/20" : "bg-destructive/20")} />
              <p className="text-[7px] text-muted-foreground uppercase font-black">GPS Telemetry</p>
           </div>
        </section>

        <section className="space-y-4 pb-6">
           <div className="flex items-center justify-between px-2">
             <h4 className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Nearby Safe Havens</h4>
             <TrendingUp className="w-3 h-3 text-primary" />
           </div>
           <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
              {safeHavens.map((site: any) => (
                <div key={site.id} className="min-w-[160px] glass p-4 rounded-2xl space-y-2 border-white/5 active-press">
                   <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3 text-primary" />
                      <p className="text-[9px] font-bold text-white truncate">{site.name}</p>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[7px] text-muted-foreground uppercase font-black">{site.type}</span>
                      <div className="flex items-center gap-1">
                         <Clock className="w-2 h-2 text-green-400" />
                         <span className="text-[6px] text-green-400 font-bold uppercase">{site.is247 ? "24/7" : "Active"}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      <AppNavigation />
    </main>
  );
}
