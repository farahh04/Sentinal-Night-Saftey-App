"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Home, 
  FileText, 
  ChevronRight, 
  AlertCircle, 
  ShieldAlert, 
  Heart, 
  Dog, 
  UserX,
  Shield,
  Loader2,
  Download,
  CheckCircle,
  Clock,
  MapPin,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { findNearestStation } from "@/lib/police-data";

export default function SafeConfirmation() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [report, setReport] = useState<string[]>([]);
  const [isEFirOpen, setIsEFirOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [firNumber, setFirNumber] = useState("");
  
  const [efirData, setEfirData] = useState({
    type: "harassment",
    details: "",
    suspectDescription: "",
    vehicleNumber: "",
    witnesses: "",
    cnic: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nearbyStation, setNearbyStation] = useState<any>(null);

  useEffect(() => {
    const station = findNearestStation(24.8607, 67.0670);
    setNearbyStation(station);
  }, []);

  const toggleReport = (id: string) => {
    setReport(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    router.push("/");
  };

  const handleFileEFir = async () => {
    if (!firestore || !user) return;
    if (!efirData.details) {
      toast({ title: "Narrative Required", description: "Please provide incident details.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const generatedFir = `SW-PK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setFirNumber(generatedFir);

    const efirPayload = {
      userId: user.uid,
      userName: user.displayName || "Sara Ahmed",
      cnic: efirData.cnic || "42101-XXXXXXXX-X",
      type: efirData.type,
      details: efirData.details,
      suspectDescription: efirData.suspectDescription,
      vehicleNumber: efirData.vehicleNumber,
      witnesses: efirData.witnesses,
      stationId: nearbyStation?.id || "khi-dha",
      stationName: nearbyStation?.name || "DHA Police Station",
      firNumber: generatedFir,
      status: "Submitted",
      createdAt: serverTimestamp(),
    };

    const efirRef = collection(firestore, "efirs");
    
    addDoc(efirRef, efirPayload)
      .then(() => {
        toast({ title: "OFFICIAL E-FIR TRANSMITTED", description: `Case Logged: ${generatedFir}` });
        setIsEFirOpen(false);
        setIsReceiptOpen(true);
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: efirRef.path,
          operation: 'create',
          requestResourceData: efirPayload,
        }));
      })
      .finally(() => setIsSubmitting(false));
  };

  const incidents = [
    { id: "false", label: "False Alarm", icon: ShieldCheck, color: "text-green-400" },
    { id: "following", label: "Being Followed", icon: UserX, color: "text-orange-400" },
    { id: "harassment", label: "Harassment", icon: Heart, color: "text-destructive" },
    { id: "animal", label: "Animal Attack", icon: Dog, color: "text-orange-400" },
    { id: "robbery", label: "Robbery Attempt", icon: ShieldAlert, color: "text-destructive" }
  ];

  return (
    <main className="min-h-screen bg-[#0A0F0D] text-white p-6 font-body max-w-md mx-auto flex flex-col animate-in fade-in duration-1000 relative overflow-x-hidden">
      <div className="absolute top-0 inset-x-0 h-40 bg-primary/5 blur-[80px] pointer-events-none" />

      <header className="py-10 text-center space-y-4 relative z-10">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-2 border-primary/20 shadow-[0_0_40px_rgba(0,168,107,0.15)]">
          <CheckCircle2 className="w-10 h-10 text-primary glow-emerald" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-headline font-black tracking-tight uppercase">STATUS: SECURE</h1>
          <p className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.4em] opacity-60">Overwatch Protocols Resolved Safely</p>
        </div>
      </header>

      <section className="flex-1 space-y-6 relative z-10">
        <div className="glass rounded-[40px] p-6 space-y-6 border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tactical Incident Audit</h3>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-white/90">Confirm the nature of the emergency:</p>
            <div className="grid gap-2">
              {incidents.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleReport(item.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-[28px] border transition-all active:scale-95",
                    report.includes(item.id) ? "bg-primary/10 border-primary" : "bg-white/5 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-4">
                     <item.icon className={cn("w-4 h-4", item.color)} />
                     <Label className="text-[11px] font-bold cursor-pointer uppercase tracking-tight">{item.label}</Label>
                  </div>
                  <Checkbox checked={report.includes(item.id)} onCheckedChange={() => {}} className="rounded-full border-primary/30 w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-[32px] p-5 space-y-4 border-white/5">
           <div className="flex items-center justify-between">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Institutional Flow</h3>
              <Badge variant="outline" className="border-primary/20 text-primary text-[7px] font-black">LEGALLY BINDING</Badge>
           </div>
           
           <Dialog open={isEFirOpen} onOpenChange={setIsEFirOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-16 rounded-[28px] border-white/10 justify-between px-6 bg-white/5 active:scale-95 transition-all">
                  <span className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
                    <FileText className="w-5 h-5 text-primary" /> 
                    File Official E-FIR
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-elevated border-white/10 rounded-[40px] max-w-[92%] mx-auto max-h-[85vh] overflow-y-auto scrollbar-hide p-8">
                <DialogHeader>
                  <DialogTitle className="font-headline text-lg font-black uppercase tracking-tighter">OFFICIAL E-FIR PORTAL</DialogTitle>
                  <DialogDescription className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">SUBMISSION CHANNEL: {nearbyStation?.name || "DHA Police Station"}</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                   <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 flex gap-3">
                      <Shield className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-[10px] text-muted-foreground italic leading-tight">
                        Evidence from the SOS mission is automatically attached. This report serves as official digital testimony to {nearbyStation?.city} Police authorities.
                      </p>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black text-muted-foreground tracking-widest ml-1">CNIC (Identity Verification)</label>
                      <Input 
                        placeholder="42101-XXXXXXX-X"
                        className="bg-white/5 border-white/10 rounded-2xl h-12 text-sm"
                        value={efirData.cnic}
                        onChange={(e) => setEfirData({...efirData, cnic: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black text-muted-foreground tracking-widest ml-1">Incident Category</label>
                      <Select value={efirData.type} onValueChange={(v) => setEfirData({...efirData, type: v})}>
                         <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12">
                           <SelectValue placeholder="Select Type" />
                         </SelectTrigger>
                         <SelectContent className="glass-elevated border-white/10">
                           <SelectItem value="harassment">Harassment</SelectItem>
                           <SelectItem value="robbery">Robbery</SelectItem>
                           <SelectItem value="theft">Theft</SelectItem>
                           <SelectItem value="animal_attack">Animal Attack</SelectItem>
                           <SelectItem value="other">Other</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black text-muted-foreground tracking-widest ml-1">Incident Narrative</label>
                      <Textarea 
                        placeholder="Detail the event sequence..."
                        className="bg-white/5 border-white/10 rounded-2xl min-h-[120px] text-sm"
                        value={efirData.details}
                        onChange={(e) => setEfirData({...efirData, details: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black text-muted-foreground tracking-widest ml-1">Suspect Profiling</label>
                      <Textarea 
                        placeholder="Description, build, clothing, vehicle info..."
                        className="bg-white/5 border-white/10 rounded-2xl text-sm"
                        value={efirData.suspectDescription}
                        onChange={(e) => setEfirData({...efirData, suspectDescription: e.target.value})}
                      />
                   </div>
                </div>

                <DialogFooter className="pt-2">
                   <Button 
                    onClick={handleFileEFir}
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-[32px] emerald-gradient text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                   >
                     {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "TRANSMIT OFFICIAL E-FIR"}
                   </Button>
                </DialogFooter>
              </DialogContent>
           </Dialog>
        </div>
      </section>

      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="glass-elevated border-white/10 rounded-[48px] max-w-[92%] mx-auto p-0 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <CheckCircle className="w-8 h-8 text-primary" />
               </div>
               <div>
                  <h2 className="text-xl font-headline font-black uppercase tracking-tighter">DIGITAL FIR RECEIPT</h2>
                  <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.4em]">Official Case Number Generated</p>
               </div>
            </div>

            <div className="space-y-4 border-y border-white/5 py-6">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">FIR Number</span>
                  <span className="text-sm font-black text-primary">{firNumber}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Precinct</span>
                  <span className="text-[11px] font-bold text-white">{nearbyStation?.name}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Audit Hash</span>
                  <span className="text-[9px] font-mono text-white/40 truncate ml-4">SHA256:7c8b...</span>
               </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl flex gap-3">
               <Shield className="w-4 h-4 text-primary shrink-0" />
               <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                 Evidence telemetry, audio, and video logs have been securely archived in the SafeWalk Institutional Vault.
               </p>
            </div>

            <div className="space-y-3">
               <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download PDF Receipt
               </Button>
               <Button onClick={() => { setIsReceiptOpen(false); router.push("/"); }} className="w-full h-14 rounded-2xl emerald-gradient text-white font-black uppercase tracking-widest">
                  Back to Dashboard
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="pt-6 pb-4 space-y-4 relative z-10">
        <Button onClick={handleFinish} className="w-full h-16 rounded-[32px] bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all">
          EXIT MISSION CONTROL
        </Button>
      </footer>
    </main>
  );
}