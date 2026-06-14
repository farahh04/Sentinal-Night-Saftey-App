@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 165 20% 5%;
    --foreground: 210 40% 98%;
    --card: 153 32% 10%;
    --card-foreground: 210 40% 98%;
    --popover: 165 20% 5%;
    --popover-foreground: 210 40% 98%;
    
    --primary: 158 100% 33%;
    --primary-foreground: 0 0% 100%;
    
    --secondary: 157 61% 46%;
    --secondary-foreground: 165 20% 5%;
    
    --muted: 157 38% 15%;
    --muted-foreground: 157 20% 75%;
    
    --accent: 158 100% 33%;
    --accent-foreground: 0 0% 100%;
    
    --destructive: 356 100% 65%;
    --destructive-foreground: 210 40% 98%;
    
    --border: 157 38% 17%;
    --input: 157 38% 17%;
    --ring: 158 100% 33%;
    --radius: 24px;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-[#0A0F0D] text-white font-body antialiased selection:bg-primary/30;
    @apply overflow-x-hidden;
    background-image: 
      radial-gradient(circle at 50% -20%, hsla(158, 100%, 33%, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 0% 100%, hsla(157, 61%, 46%, 0.05) 0%, transparent 40%);
    background-attachment: fixed;
  }
}

.glass {
  @apply bg-[#12231B]/40 backdrop-blur-2xl border border-white/5 shadow-xl;
}

.glass-elevated {
  @apply bg-[#12231B]/80 backdrop-blur-3xl border border-white/10 shadow-2xl;
}

.glow-emerald {
  @apply drop-shadow-[0_0_12px_rgba(0,168,107,0.5)];
}

.emerald-gradient {
  background: linear-gradient(135deg, #00A86B 0%, #008F5A 100%);
}

.active-press:active {
  @apply scale-95 opacity-80;
  transition: transform 0.1s, opacity 0.1s;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

input, select, textarea {
  font-size: 16px !important;
}