
"use client";

import { useState } from "react";
import { Shield, Bell, Lock, User, Eye, Smartphone, LogOut, ChevronRight } from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const { toast } = useToast();
  
  // State for toggles
  const [biometricLock, setBiometricLock] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [criticalNotifs, setCriticalNotifs] = useState(true);
  
  // State for select values
  const [safetyProtocol, setSafetyProtocol] = useState("Standard");
  const [stealthMode, setStealthMode] = useState("Calculator");
  
  // State for profile
  const [userName, setUserName] = useState("Sarah Miller");
  const [userEmail, setUserEmail] = useState("sarah.m@sentinel.io");

  const handleToggle = (setting: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    toast({
      title: "Setting Updated",
      description: `${setting} is now ${value ? "enabled" : "disabled"}.`,
    });
  };

  const handleSelect = (setting: string, value: string, setter: (v: string) => void) => {
    setter(value);
    toast({
      title: "Protocol Updated",
      description: `${setting} set to ${value}.`,
    });
  };

  const handleSignOut = () => {
    toast({
      title: "Signing Out",
      description: "Securing your session data...",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <main className="pb-32 min-h-screen">
      <header className="p-6">
        <h1 className="text-3xl font-headline font-bold emerald-glow">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your Sentinel experience</p>
      </header>

      <div className="px-6 space-y-6">
        <section className="glass rounded-[32px] overflow-hidden">
          <div className="px-6 py-4 border-b border-primary/5 bg-primary/5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Security & Privacy</h3>
          </div>
          <div className="divide-y divide-primary/5">
            <div className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Safety Protocols</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Response speed & depth</span>
                </div>
              </div>
              <Select value={safetyProtocol} onValueChange={(v) => handleSelect("Safety Protocol", v, setSafetyProtocol)}>
                <SelectTrigger className="w-24 h-8 bg-background/50 border-primary/10 rounded-full text-xs">
                  <SelectValue placeholder="Protocol" />
                </SelectTrigger>
                <SelectContent className="glass border-primary/20">
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Maximum">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Stealth Mode</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Disguise interface</span>
                </div>
              </div>
              <Select value={stealthMode} onValueChange={(v) => handleSelect("Stealth Mode", v, setStealthMode)}>
                <SelectTrigger className="w-24 h-8 bg-background/50 border-primary/10 rounded-full text-xs">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent className="glass border-primary/20">
                  <SelectItem value="Calculator">Calculator</SelectItem>
                  <SelectItem value="Notes">Notes App</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Biometric Lock</span>
              </div>
              <Switch 
                checked={biometricLock} 
                onCheckedChange={(v) => handleToggle("Biometric Lock", v, setBiometricLock)}
              />
            </div>
          </div>
        </section>

        <section className="glass rounded-[32px] overflow-hidden">
          <div className="px-6 py-4 border-b border-primary/5 bg-primary/5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Device & Alerts</h3>
          </div>
          <div className="divide-y divide-primary/5">
            <div className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Critical Notifications</span>
              </div>
              <Switch 
                checked={criticalNotifs} 
                onCheckedChange={(v) => handleToggle("Critical Notifications", v, setCriticalNotifs)}
              />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Haptic Feedback</span>
              </div>
              <Switch 
                checked={hapticFeedback} 
                onCheckedChange={(v) => handleToggle("Haptic Feedback", v, setHapticFeedback)}
              />
            </div>
          </div>
        </section>

        <section className="glass rounded-[32px] overflow-hidden">
          <div className="px-6 py-4 border-b border-primary/5 bg-primary/5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Account</h3>
          </div>
          <div className="p-1">
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors cursor-pointer group rounded-[28px]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Profile Information</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{userName}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </div>
              </DialogTrigger>
              <DialogContent className="glass border-primary/20 rounded-[32px] max-w-[90%] mx-auto">
                <DialogHeader>
                  <DialogTitle className="font-headline text-xl">Edit Profile</DialogTitle>
                  <DialogDescription>Update your emergency identity details.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Full Name</label>
                    <Input 
                      value={userName} 
                      onChange={e => setUserName(e.target.value)}
                      className="bg-background/50 border-primary/10 rounded-2xl h-12" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Email Address</label>
                    <Input 
                      value={userEmail} 
                      onChange={e => setUserEmail(e.target.value)}
                      className="bg-background/50 border-primary/10 rounded-2xl h-12" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full h-12 rounded-2xl bg-primary text-white font-bold" onClick={() => {
                    toast({ title: "Profile Saved", description: "Identity updated successfully." });
                  }}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <Button 
            variant="ghost" 
            className="w-full h-14 rounded-2xl text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center justify-center gap-2"
            onClick={handleSignOut}
        >
            <LogOut className="w-5 h-5" />
            Sign Out
        </Button>

        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] pb-4">
            Sentinel v1.0.4 — Encrypted
        </p>
      </div>

      <AppNavigation />
    </main>
  );
}
