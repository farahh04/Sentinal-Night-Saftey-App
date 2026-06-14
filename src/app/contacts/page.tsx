"use client";

import { useState } from "react";
import { UserPlus, Heart, Shield, Star, MoreVertical, MessageCircle, Trash2, ShieldCheck, AtSign, Phone } from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/firestore/use-collection";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function CircleOfTrust() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relation: "" });

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "contacts"),
      orderBy("priority", "desc"),
      orderBy("createdAt", "desc")
    );
  }, [firestore, user]);

  const { data: contacts, loading } = useCollection(contactsQuery);

  const addContact = () => {
    if (!newContact.name || !firestore || !user) return;
    const contactsRef = collection(firestore, "users", user.uid, "contacts");
    const data = {
      name: newContact.name,
      relation: newContact.relation,
      priority: false,
      avatar: newContact.name.substring(0, 2).toUpperCase(),
      createdAt: serverTimestamp(),
    };
    addDoc(contactsRef, data).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: contactsRef.path,
        operation: 'create',
        requestResourceData: data,
      }));
    });
    setNewContact({ name: "", relation: "" });
    setIsAddOpen(false);
    toast({ title: "Authorized", description: `${newContact.name} is now in your circle.` });
  };

  const removeContact = (id: string, name: string) => {
    if (!firestore || !user) return;
    const contactRef = doc(firestore, "users", user.uid, "contacts", id);
    deleteDoc(contactRef).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: contactRef.path, operation: 'delete' }));
    });
    toast({ title: "Detached", description: `${name} has been removed from your network.` });
  };

  const togglePriority = (id: string, current: boolean) => {
    if (!firestore || !user) return;
    const contactRef = doc(firestore, "users", user.uid, "contacts", id);
    updateDoc(contactRef, { priority: !current }).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: contactRef.path, operation: 'update', requestResourceData: { priority: !current } }));
    });
  };

  return (
    <main className="pb-40 min-h-screen bg-[#070B14]">
      <header className="p-8 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-black tracking-tighter glow-violet">Circle of Trust</h1>
          <p className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.3em]">Guardian Network Status: Secure</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="glass rounded-full h-14 w-14 border-primary/20 text-primary hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6 glow-violet" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-elevated border-white/10 rounded-[40px] max-w-[90%] mx-auto">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl font-black tracking-tighter">Authorize Guardian</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Identity Name</label>
                <Input value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} className="bg-white/5 border-white/10 rounded-2xl h-14 px-5" placeholder="e.g. Sarah Miller" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Guardian Bond</label>
                <Input value={newContact.relation} onChange={e => setNewContact({...newContact, relation: e.target.value})} className="bg-white/5 border-white/10 rounded-2xl h-14 px-5" placeholder="e.g. Family / Partner" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addContact} className="w-full h-14 rounded-3xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                Grant Authorization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="px-8 space-y-8">
        <section className="glass rounded-[48px] p-2 border-white/5 relative overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-white/5 mx-4">
             <div className="flex items-center gap-3">
               <Shield className="w-5 h-5 text-primary glow-violet" />
               <h3 className="font-headline font-bold text-sm tracking-[0.1em] uppercase">Active Guardians</h3>
             </div>
             <Badge variant="secondary" className="bg-primary/20 text-primary rounded-full px-4 py-1 text-[10px] font-black tracking-widest uppercase border border-primary/20">
               {loading ? "SCANNING..." : `${contacts?.length || 0} SECURED`}
             </Badge>
          </div>
          
          <div className="p-2 space-y-2">
            {/* System Emergency Contact */}
            <div className="flex items-center gap-5 p-5 rounded-[36px] bg-white/5 border border-white/5">
              <div className="relative">
                <Avatar className="w-14 h-14 border-2 border-destructive/20 shadow-2xl">
                  <AvatarFallback className="bg-destructive/10 text-destructive font-black">911</AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 bg-destructive rounded-full p-1.5 border-2 border-[#070B14] shadow-xl">
                   <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-bold text-base tracking-tight">Emergency Services</p>
                  <Badge className="text-[8px] h-4 px-2 font-black uppercase bg-destructive/20 text-destructive border-none">System Priority</Badge>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Global Public Safety</p>
              </div>
            </div>

            {/* User Guardian Contacts */}
            {contacts?.map((contact: any) => (
              <div key={contact.id} className="flex items-center gap-5 p-5 rounded-[36px] hover:bg-white/[0.03] transition-all group relative border border-transparent hover:border-white/5">
                <div className="relative">
                  <Avatar className="w-14 h-14 border-2 border-primary/20 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <AvatarImage src={`https://picsum.photos/seed/${contact.id}/200`} className="grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <AvatarFallback className="bg-white/10 text-primary font-black">{contact.avatar}</AvatarFallback>
                  </Avatar>
                  {contact.priority && (
                    <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1.5 border-2 border-[#070B14] shadow-xl animate-pulse">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base tracking-tight">{contact.name}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5 opacity-60">{contact.relation}</p>
                </div>
                <div className="flex gap-2 relative z-10">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-primary/10 text-primary transition-all">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-white/5 text-muted-foreground">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-elevated border-white/10 rounded-2xl p-2 min-w-[180px]">
                      <DropdownMenuItem onClick={() => togglePriority(contact.id, contact.priority)} className="rounded-xl p-3 focus:bg-primary/10 focus:text-primary">
                        <Star className={cn("w-4 h-4 mr-3", contact.priority && "fill-primary")} />
                        {contact.priority ? "Remove Priority" : "Set Priority"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => removeContact(contact.id, contact.name)} className="text-destructive rounded-xl p-3 focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-3" />
                        Detached Guardian
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {!contacts?.length && !loading && (
              <div className="p-12 text-center space-y-4 opacity-40 animate-in fade-in duration-1000">
                <AtSign className="w-12 h-12 mx-auto text-primary/30" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Circle Empty</p>
                  <p className="text-[11px] italic font-medium">Add trusted guardians to establish your network.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="glass rounded-[48px] p-8 space-y-6 relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
           <div className="flex items-center gap-4 relative z-10">
             <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
               <Heart className="w-7 h-7 text-primary glow-violet" />
             </div>
             <div>
               <h3 className="font-headline font-black text-base tracking-tighter uppercase">Protocol Alpha-Level</h3>
               <p className="text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-60 mt-0.5">Critical Emergency Bypass</p>
             </div>
           </div>
           <p className="text-xs text-muted-foreground leading-relaxed italic relative z-10">
             "Sentinel is authorized to bypass all device restrictions and DND states for priority guardians during SOS triggers."
           </p>
           <Button variant="outline" className="w-full rounded-3xl border-white/10 text-primary h-14 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:border-primary/30 transition-all">
             Audit Permissions
           </Button>
        </section>
      </div>

      <AppNavigation />
    </main>
  );
}
