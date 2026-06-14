
"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  MapPin, 
  Video, 
  Mic, 
  Building2, 
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  X,
  Phone,
  Radio,
  Clock,
  Zap,
  Activity,
  Users,
  Navigation,
  PhoneCall
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getAreaSafetyProfile } from "@/lib/police-data";
import { cn } from "@/lib/utils";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { generatePoliceEmergencyCall } from "@/ai/flows/police-call-tts";

export default function SOSMissionControl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [status, setStatus] = useState("Initializing Protocols");
  const [progress, setProgress] = useState(0);
  const [safetyProfile, setSafetyProfile] = useState<any>(null);
  const [isEscalated, setIsEscalated] = useState(false);

  const incidentType = searchParams.get("type") || "General Emergency";

  useEffect(() => {
    if (!firestore || !user) return;

    // Simulated Karachi coordinates for the event
    const lat = 24.8607;
    const lng = 67.0670;
    const profile = getAreaSafetyProfile(lat, lng);
    setSafetyProfile(profile);

    const incidentData = {
      userId: user.uid,
      userName: user.displayName || "Anonymous User",
      type: incidentType,
      status: "active",
      lat,
      lng,
      timestamp: serverTimestamp(),
      policeNotified: true,
      severity: "High",
      dispatchInfo: {
        officer: "Constable Ahmed",
        vehicle: "Patrol Unit #234",
        eta: `${profile.policeETA}m`
      }
    };

    const incidentsRef = collection(firestore, "incidents");
    addDoc(incidentsRef, incidentData).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: incidentsRef.path,
        operation: 'create',
        requestResourceData: incidentData
      }));
    });

    // Generate simulated emergency call audio
    generatePoliceEmergencyCall({
      userName: user.displayName || "User",
      incidentType,
      locationName: profile.station.sector,
      coordinates: `${lat}, ${lng}`
    }).then(res => {
      const audio = new Audio(res.audioDataUri);
      audio.play().catch(e => console.log("Auto-call playback muted by browser"));
    });

  }, [firestore, user, incidentType]);

  useEffect(() => {
    const steps = [
      { p: 20, s: "Evidence Encryption Active" },
      { p: 40, s: "Broadcasting to Circle" },
      { p: 60, s: "Official Dispatch Initialized" },
      { p: 85, s: "Private Security Linked" },
      { p: 100, s: "Institutional Overwatch Active" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatus(steps[currentStep].s);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEscalate = () => {
    setIsEscalated(true);
    toast({ title: "ESCALATED", description: "Priority alert sent to DIG Office." });
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-white p-6 font-body flex flex-col max-w-md mx-auto relative overflow-hidden">
      
      <div className="absolute top-0 inset-x-0 h-64 bg-destructive/20 blur-[100px] pointer-events-none animate-pulse" />

      <header className="flex items-center justify-between mb-8 relative z-10">
        <button onClick={() => router.back()} className="w-12 h-12 rounded-full glass flex items-center justify-center active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <Badge variant="destructive" className="bg-[#FF4D5A]/20 text-[#FF4D5A] border-[#FF4D5A]/30 px-4 py-1.5 animate-pulse uppercase font-black tracking-widest text-[10px]">
            ACTIVE SOS MISSION
          </Badge>
          <span className="text-[6px] text-muted-foreground uppercase tracking-[0.4em] mt-1 font-black">Encrypted Evidence Link Active</span>
        </div>
        <div className="w-12 h-12" />
      </header>

      <section className="space-y-6 relative z-10 flex-1 overflow-y-auto scrollbar-hide">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-headline font-black tracking-tighter uppercase glow-red">{incidentType}</h1>
          <div className="flex items-center justify-center gap-2">
            <Radio className="w-3 h-3 text-destructive animate-pulse" />
            <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">{status}</p>
          </div>
        </div>

        <div className="space-y-3 px-2">
          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            <span>Transmitting Evidence Logs</span>
            <span>{progress}% SECURED</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-white/5 rounded-full overflow-hidden" />
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 flex items-center gap-2">
            <Navigation className="w-3 h-3" />
            LIVE DISPATCH TRACKING
          </h3>

          <div className="grid gap-3">
            {/* Private Security */}
            {safetyProfile?.securityETA && (
              <div className="glass p-5 rounded-[32px] border-primary/20 flex items-center justify-between relative overflow-hidden group">
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Zap className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-tight">{safetyProfile.station.securityCompany || "Private Security"}</p>
                     <p className="text-[8px] text-primary font-black uppercase tracking-widest">Rapid Response Active</p>
                   </div>
                </div>
                <div className="text-right relative z-10">
                   <p className="text-sm font-black text-white">ETA: {safetyProfile.securityETA}m</p>
                   <p className="text-[8px] text-green-400 font-bold uppercase animate-pulse">EN ROUTE</p>
                </div>
              </div>
            )}

            {/* Police Dispatch */}
            <div className="glass p-5 rounded-[32px] border-white/5 flex items-center justify-between relative overflow-hidden group">
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-tight">{safetyProfile?.station.name}</p>
                     <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Constable Ahmed (#234)</p>
                   </div>
                </div>
                <div className="text-right relative z-10">
                   <p className="text-sm font-black text-white">ETA: {safetyProfile?.policeETA}m</p>
                   <p className="text-[8px] text-orange-400 font-bold uppercase">DISPATCHED</p>
                </div>
            </div>

            {/* Volunteer Network */}
            <div className="glass p-5 rounded-[32px] border-white/5 flex items-center justify-between relative overflow-hidden group">
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-10 h-10 rounded-2xl bg-orange-400/10 flex items-center justify-center border border-orange-400/20">
                      <Users className="w-5 h-5 text-orange-400" />
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-tight">SafeWalk Volunteers</p>
                     <p className="text-[8px] text-orange-400 font-black uppercase tracking-widest">3 Responding Locally</p>
                   </div>
                </div>
                <div className="text-right relative z-10">
                   <p className="text-sm font-black text-white">200m</p>
                   <p className="text-[8px] text-orange-400 font-bold uppercase">CLOSE BY</p>
                </div>
            </div>
          </div>
        </div>

        <section className="glass rounded-[32px] p-6 border-white/5 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Emergency Communication</h3>
              <Activity className="w-3 h-3 text-primary animate-pulse" />
           </div>
           <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 flex flex-col gap-1 items-center justify-center">
                 <PhoneCall className="w-4 h-4 text-primary" />
                 <span className="text-[8px] font-black uppercase">Call Station</span>
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 flex flex-col gap-1 items-center justify-center">
                 <Users className="w-4 h-4 text-primary" />
                 <span className="text-[8px] font-black uppercase">Call Officer</span>
              </Button>
           </div>
        </section>

        {!isEscalated && progress >= 80 && (
          <Button onClick={handleEscalate} variant="outline" className="w-full h-14 rounded-[28px] border-destructive/30 text-destructive text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 transition-all">
             HELP NOT ARRIVED? ESCALATE TO SSP OFFICE
          </Button>
        )}
      </section>

      <div className="pt-6 pb-4 space-y-4 relative z-10">
         <Button 
           onClick={() => router.push("/sos/safe")}
           className="w-full h-18 rounded-[32px] bg-green-500 hover:bg-green-600 text-black font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-green-500/30 active:scale-95 transition-all"
         >
           I AM SAFE NOW
         </Button>
      </div>
    </main>
  );
}
