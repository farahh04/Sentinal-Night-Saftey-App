"use client";

import { useState } from "react";
import { 
  Shield, 
  MapPin, 
  Activity, 
  Radio, 
  AlertTriangle, 
  Search, 
  Users, 
  Video,
  ChevronRight,
  MoreVertical,
  Building2,
  Clock,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppNavigation } from "@/components/AppNavigation";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/firestore/use-collection";
import { PAKISTAN_POLICE_STATIONS } from "@/lib/police-data";

export default function AgencyDashboard() {
  const firestore = useFirestore();
  const [view, setView] = useState<'incidents' | 'reports' | 'stations'>('incidents');

  const incidentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "incidents"), orderBy("timestamp", "desc"), limit(10));
  }, [firestore]);

  const reportsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "efirs"), orderBy("createdAt", "desc"), limit(10));
  }, [firestore]);

  const { data: incidents, loading: loadingIncidents } = useCollection(incidentsQuery);
  const { data: reports, loading: loadingReports } = useCollection(reportsQuery);

  return (
    <main className="min-h-screen bg-[#0A0F0D] text-white pb-32 font-body max-w-md mx-auto overflow-x-hidden">
      <header className="p-6 pt-10 flex flex-col gap-4 relative z-50 bg-[#0A0F0D]/80 backdrop-blur-xl border-b border-primary/10 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
               <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-headline font-black uppercase tracking-tighter">AGENCY HUD</h1>
              <p className="text-[7px] text-muted-foreground font-black uppercase tracking-[0.4em]">Sector Command Level</p>
            </div>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black uppercase py-1 px-3">
            {incidents?.filter(i => i.status === "active").length || 0} LIVE SOS
          </Badge>
        </div>

        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
          {(['incidents', 'reports', 'stations'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all",
                view === v ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6 space-y-8">
        {view === 'incidents' && (
          <section className="space-y-4">
             <div className="flex items-center justify-between px-2">
               <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                 <Radio className="w-3 h-3 text-destructive animate-pulse" />
                 Active Dispatch Feed
               </h2>
               <Activity className="w-3 h-3 text-primary" />
             </div>

             <div className="space-y-3">
                {loadingIncidents ? (
                  <div className="text-center p-12 opacity-40 uppercase font-black text-[10px] tracking-widest animate-pulse">Scanning Network...</div>
                ) : incidents?.map(incident => (
                  <div key={incident.id} className="glass p-5 rounded-[32px] border-primary/10 space-y-4 active-press animate-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-start justify-between">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                             <Badge className={cn(
                               "text-[7px] font-black uppercase px-2 py-0.5",
                               incident.severity === "High" ? "bg-destructive/20 text-destructive" : "bg-orange-400/20 text-orange-400"
                             )}>{incident.severity || "Critical"}</Badge>
                             <span className="text-[8px] text-muted-foreground font-black tracking-widest uppercase">{incident.id.substring(0,8)}</span>
                           </div>
                           <h3 className="text-sm font-bold">{incident.type} ALERT</h3>
                        </div>
                        <span className="text-[8px] text-muted-foreground font-black uppercase">{new Date(incident.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                           <MapPin className="w-3 h-3 text-primary" />
                           <span className="text-[9px] font-medium truncate">Sector DHA, Karachi</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                           <Users className="w-3 h-3 text-primary" />
                           <span className="text-[9px] font-medium truncate">{incident.userName}</span>
                        </div>
                     </div>

                     <div className="flex gap-2">
                        <Button className="flex-1 h-10 rounded-xl emerald-gradient text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                           ACCEPT DISPATCH
                        </Button>
                        <Button variant="outline" className="h-10 w-10 rounded-xl border-primary/20 bg-primary/5 flex items-center justify-center">
                          <Video className="w-4 h-4 text-primary" />
                        </Button>
                     </div>
                  </div>
                ))}

                {!incidents?.length && !loadingIncidents && (
                  <div className="text-center p-12 opacity-30 text-[10px] font-black uppercase italic">No active SOS alerts in jurisdiction</div>
                )}
             </div>
          </section>
        )}

        {view === 'reports' && (
          <section className="space-y-4">
             <div className="flex items-center justify-between px-2">
               <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                 <FileText className="w-3 h-3 text-primary" />
                 Official E-FIR Logs
               </h2>
               <Badge className="bg-white/10 text-white text-[8px]">{reports?.length || 0} TOTAL</Badge>
             </div>

             <div className="space-y-3">
                {reports?.map(report => (
                  <div key={report.id} className="glass p-5 rounded-[28px] border-white/5 space-y-3 active-press">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-primary">{report.firNumber}</span>
                      <Badge variant="outline" className="text-[6px] border-primary/20 text-primary uppercase">{report.status}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white uppercase tracking-tight">{report.type} Case</p>
                      <p className="text-[9px] text-muted-foreground truncate">{report.stationName}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-white/5">
                      <span className="text-[8px] text-muted-foreground uppercase">{new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                      <Button variant="ghost" className="h-6 text-[8px] font-black uppercase text-primary p-0">Review Report</Button>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        )}

        {view === 'stations' && (
          <section className="space-y-4">
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Pakistan Station Network</h2>
            <div className="grid gap-3">
              {PAKISTAN_POLICE_STATIONS.slice(0, 15).map(station => (
                <div key={station.id} className="glass p-4 rounded-[28px] border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase">{station.name}</p>
                      <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{station.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={cn(
                      "text-[7px] font-black uppercase px-2 py-0.5",
                      station.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-orange-400/20 text-orange-400'
                    )}>
                      {station.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <AppNavigation />
    </main>
  );
}