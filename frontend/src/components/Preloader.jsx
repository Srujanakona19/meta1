import { Loader2 } from 'lucide-react'

export function Preloader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-[var(--color-brand-blue)] bg-black z-50">
      <Loader2 className="w-12 h-12 animate-spin" />
      <div className="text-sm font-medium tracking-widest uppercase glow-effect">
        Initializing Intelligence
      </div>
    </div>
  )
}
