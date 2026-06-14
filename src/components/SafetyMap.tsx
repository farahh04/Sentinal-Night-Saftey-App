
'use client';

import React from 'react';
import { Shield, MapPin, Target, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SafetyMapProps {
  center?: { lat: number; lng: number };
  path?: { lat: number; lng: number }[];
  dangerZones?: { lat: number; lng: number; name: string; risk: string; reason?: string }[];
  zoom?: number;
  className?: string;
}

/**
 * Sentinel Tactical Intel View
 * Replaces Google Maps with a textual and visual telemetry display for maximum reliability.
 */
export function SafetyMap({ center, path, dangerZones, className }: SafetyMapProps) {
  return (
    <div className={cn("w-full h-full bg-[#0B1220] flex flex-col items-center justify-center p-6 relative overflow-hidden rounded-[32px] border border-white/5", className)}>
      {/* Tactical Background Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4F8CFF 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-[280px]">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(79,140,255,0.2)]">
          <Shield className="w-8 h-8 text-primary animate-pulse" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-headline font-black uppercase tracking-tighter text-white">Tactical Intel HUD</h3>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Sector Monitoring: Pakistan</p>
        </div>

        <div className="w-full space-y-2 mt-4">
          <div className="glass p-3 rounded-2xl border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <MapPin className="w-3 h-3 text-primary" />
               <span className="text-[9px] font-bold text-white/80 uppercase">Origin</span>
             </div>
             <span className="text-[9px] font-mono text-muted-foreground">{center?.lat.toFixed(4)}, {center?.lng.toFixed(4)}</span>
          </div>

          <div className="glass p-3 rounded-2xl border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Target className="w-3 h-3 text-green-400" />
               <span className="text-[9px] font-bold text-white/80 uppercase">Safe Path</span>
             </div>
             <Badge variant="outline" className="text-[7px] h-4 border-green-500/20 text-green-400 font-black">ACTIVE</Badge>
          </div>
        </div>

        {dangerZones && dangerZones.length > 0 && (
          <div className="pt-4 space-y-2 w-full">
            <div className="flex items-center gap-2 px-1">
              <AlertTriangle className="w-3 h-3 text-destructive" />
              <span className="text-[8px] font-black uppercase text-destructive tracking-widest">Hazards in Sector</span>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {dangerZones.slice(0, 3).map((dz, i) => (
                <Badge key={i} variant="destructive" className="bg-destructive/10 text-destructive text-[7px] font-black border-destructive/20">
                  {dz.name.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4">
        <Badge variant="outline" className="text-[7px] font-black border-primary/20 text-primary uppercase bg-primary/5">Sentinel v2.5</Badge>
      </div>
      
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
         <span className="text-[7px] font-black uppercase text-muted-foreground tracking-widest">System Online</span>
      </div>
    </div>
  );
}
