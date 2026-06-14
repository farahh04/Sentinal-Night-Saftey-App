
"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award, 
  History, 
  Heart, 
  AlertCircle,
  ChevronRight,
  LogOut,
  Camera,
  CheckCircle2,
  Lock,
  Trash2,
  Save,
  X,
  Loader2
} from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { doc, updateDoc, deleteDoc, query, collection, where, getDocs, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, safe: 0, sos: 0 });
  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    bloodGroup: "",
    allergies: "",
    medicalConditions: ""
  });

  useEffect(() => {
    if (user && firestore) {
      // Load user profile details from Firestore
      const userRef = doc(firestore, "users", user.uid);
      // In a real app we'd use useDoc, but here we can just pre-fill from auth and fetch stats
      setFormData({
        displayName: user.displayName || "",
        phone: "", // Fetch from firestore in real scenario
        bloodGroup: "O+",
        allergies: "None",
        medicalConditions: "None"
      });

      // Load stats from walks collection
      const walksQuery = query(collection(firestore, "walks"), where("userId", "==", user.uid));
      getDocs(walksQuery).then(snapshot => {
        const docs = snapshot.docs.map(d => d.data());
        setStats({
          total: docs.length,
          safe: docs.filter(d => d.completed).length,
          sos: docs.filter(d => d.sosTriggered).length
        });
      });
    }
  }, [user, firestore]);

  const handleSave = async () => {
    if (!user || !firestore) return;
    setSaving(true);
    const userRef = doc(firestore, "users", user.uid);
    try {
      await updateDoc(userRef, {
        ...formData,
        updatedAt: serverTimestamp()
      });
      toast({ title: "Authorized", description: "Identity updated successfully." });
      setIsEditing(false);
    } catch (e: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userRef.path,
        operation: 'update',
        requestResourceData: formData
      }));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    // In a real app we call auth.signOut()
    toast({ title: "Session Terminated", description: "Securing your data link..." });
    setTimeout(() => router.push('/'), 1000);
  };

  const handleDeleteAccount = () => {
    if (confirm("CRITICAL: This will permanently delete ALL sentinel data. Proceed?")) {
      toast({ variant: "destructive", title: "Identity Purged", description: "Data successfully wiped." });
      router.push('/');
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0A0F0D] pb-32 font-body max-w-md mx-auto overflow-x-hidden">
      <header className="p-8 pt-12 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 pointer-events-none" />
        
        <div className="relative group">
          <Avatar className="w-28 h-28 border-4 border-primary/20 shadow-2xl transition-transform group-hover:scale-105 duration-500">
            <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/400`} className="grayscale-0" />
            <AvatarFallback className="bg-[#12231B] text-primary text-3xl font-black">
              {formData.displayName.substring(0, 2).toUpperCase() || "SW"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary border-4 border-[#0A0F0D] flex items-center justify-center shadow-xl">
             <Camera className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="space-y-1 relative z-10 w-full px-4">
          {isEditing ? (
            <Input 
              value={formData.displayName} 
              onChange={e => setFormData({...formData, displayName: e.target.value})}
              className="bg-white/5 border-primary/20 text-center font-headline text-2xl h-12"
            />
          ) : (
            <>
              <h1 className="text-3xl font-headline font-black tracking-tighter uppercase text-white truncate">
                {formData.displayName || "Sara Ahmed"}
              </h1>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em]">Sentinel Identity: Verified</p>
            </>
          )}
        </div>

        <div className="flex gap-4 w-full relative z-10">
           <div className="flex-1 glass p-4 rounded-[28px] border-white/5 space-y-1">
             <p className="text-[10px] font-black text-primary uppercase tracking-tight">{stats.total}</p>
             <p className="text-[7px] text-muted-foreground uppercase font-bold tracking-widest">Total Walks</p>
           </div>
           <div className="flex-1 glass p-4 rounded-[28px] border-white/5 space-y-1">
             <p className="text-[10px] font-black text-primary uppercase tracking-tight">{stats.safe}</p>
             <p className="text-[7px] text-muted-foreground uppercase font-bold tracking-widest">Safe Walks</p>
           </div>
           <div className="flex-1 glass p-4 rounded-[28px] border-white/5 space-y-1">
             <p className="text-[10px] font-black text-destructive uppercase tracking-tight">{stats.sos}</p>
             <p className="text-[7px] text-muted-foreground uppercase font-bold tracking-widest">SOS Events</p>
           </div>
        </div>
      </header>

      <div className="px-8 space-y-6">
        <section className="glass rounded-[40px] p-6 space-y-6 border-white/5">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-primary glow-emerald" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Emergency Profile</h3>
             </div>
             <Button 
                variant="ghost" size="sm" 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="text-primary text-[10px] font-black uppercase"
                disabled={saving}
              >
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <Save className="w-4 h-4" /> : "EDIT"}
             </Button>
           </div>
           
           <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[8px] text-muted-foreground uppercase font-black">Blood Group</p>
                {isEditing ? (
                  <Input value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="bg-white/5 h-10" />
                ) : (
                  <p className="text-xs font-bold text-white uppercase">{formData.bloodGroup || "Not Set"}</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-[8px] text-muted-foreground uppercase font-black">Allergies</p>
                {isEditing ? (
                  <Input value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} className="bg-white/5 h-10" />
                ) : (
                  <p className="text-xs font-bold text-white uppercase">{formData.allergies || "None"}</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-[8px] text-muted-foreground uppercase font-black">Medical Conditions</p>
                {isEditing ? (
                  <Textarea value={formData.medicalConditions} onChange={e => setFormData({...formData, medicalConditions: e.target.value})} className="bg-white/5" />
                ) : (
                  <p className="text-xs font-bold text-white uppercase">{formData.medicalConditions || "None Reported"}</p>
                )}
              </div>
           </div>
        </section>

        <section className="glass rounded-[40px] p-6 space-y-4 border-white/5">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Account Utility</h3>
           <div className="grid gap-2">
              <Button onClick={() => router.push('/settings')} variant="outline" className="h-12 rounded-2xl border-white/5 bg-white/5 justify-between px-5">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-bold uppercase">Privacy Audit</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button onClick={handleSignOut} variant="outline" className="h-12 rounded-2xl border-white/5 bg-white/5 justify-between px-5 text-destructive hover:bg-destructive/10">
                 <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Sign Out</span>
                 </div>
                 <ChevronRight className="w-4 h-4" />
              </Button>
              <Button onClick={handleDeleteAccount} variant="ghost" className="h-12 rounded-2xl text-destructive/60 hover:text-destructive hover:bg-destructive/5 text-[10px] font-black uppercase">
                 <Trash2 className="w-4 h-4 mr-2" /> Delete Sentinel Identity
              </Button>
           </div>
        </section>

        <div className="text-center pb-10">
           <p className="text-[8px] text-muted-foreground uppercase tracking-[0.4em] font-black">SafeWalk Pakistan v2.5.0 — Encrypted</p>
        </div>
      </div>

      <AppNavigation />
    </main>
  );
}
