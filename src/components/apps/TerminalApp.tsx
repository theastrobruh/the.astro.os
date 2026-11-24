import React, { useEffect, useRef, useState } from 'react';
import { PhysicsMode, UserRole, WindowId } from '../../types/os';

interface TerminalAppProps {
  userRole: UserRole;
  physicsMode: PhysicsMode;
  onOpenWindow: (id: WindowId) => void;
  onToggleDesktopDraw: () => void;
  onChangePhysicsMode: (mode: PhysicsMode) => void;
  onImpulseBurst: () => void;
  onApplyThemePreset: (presetId: string) => void;
}

interface LogLine {
  id: number;
  kind: 'cmd' | 'out' | 'accent';
  text: string;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({
  userRole,
  physicsMode,
  onOpenWindow,
  onToggleDesktopDraw,
  onChangePhysicsMode,
  onImpulseBurst,
  onApplyThemePreset,
}) => {
  const [logs, setLogs] = useState<LogLine[]>([
    { id: 1, kind: 'accent', text: 'the.astro.os — Astro Console bash v2.5 (SAT Rigid-Body Kernel Ready)' },
    { id: 2, kind: 'out', text: "Escribe 'help' para ver los comandos disponibles." },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const append = (kind: LogLine['kind'], text: string) => {
    setLogs((prev) => [...prev, { id: Date.now() + Math.random(), kind, text }]);
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setHistory((prev) => [trimmed, ...prev.slice(0, 30)]);
    setHistIdx(-1);
    append('cmd', `astro@os:~$ ${trimmed}`);

    const parts = trimmed.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const arg = parts[1];

    if (cmd === 'help') {
      append('accent', 'Comandos disponibles:');
      append('out', '  help                 Muestra esta ayuda');
      append('out', '  neofetch             Info del sistema y motor de físicas');
      append('out', '  physics <modo>       tactile | earth | zero-g | static');
      append('out', '  impulse              Dispara un impulso cósmico a los widgets');
      append('out', '  theme <preset>       cyber | sunset | matrix | synth');
      append('out', '  paint | music | notes | mediaflow | cardgram | pressmark | youtube | admin');
      append('out', '  draw                 Activa/desactiva dibujo en el escritorio');
      append('out', '  bio                  Abre Astro.Verse (theAstroBruh)');
      append('out', '  whoami | date | clear');
    } else if (cmd === 'clear') {
      setLogs([]);
    } else if (cmd === 'whoami') {
      append('out', userRole === 'admin' ? 'admin (theAstroBruh · Full Privileges)' : 'guest (Explorer)');
    } else if (cmd === 'date') {
      append('out', new Date().toString());
    } else if (cmd === 'neofetch') {
      append('accent', '       the.astro.os v0.5.0');
      append('out', '  ---------------------------');
      append('out', `  Usuario:  ${userRole || 'guest'}`);
      append('out', `  Física:   ${physicsMode} (60fps SAT OBB + Momento de Inercia + Coulomb)`);
      append('out', '  Gráficos: Starfield Parallax + Impact Sparks + Glassmorphism');
      append('out', '  Autor:    github.com/theastrobruh/the.astro.os');
    } else if (cmd === 'physics') {
      if (arg === 'tactile' || arg === 'earth' || arg === 'zero-g' || arg === 'static') {
        onChangePhysicsMode(arg);
        append('accent', `Motor de físicas cambiado a: ${arg}`);
      } else {
        append('out', `Modo actual: ${physicsMode}. Uso: physics <tactile|earth|zero-g|static>`);
      }
    } else if (cmd === 'impulse') {
      onImpulseBurst();
      append('accent', 'Impulso cósmico aplicado a todos los íconos y widgets.');
    } else if (cmd === 'theme') {
      if (arg && ['cyber', 'sunset', 'matrix', 'synth'].includes(arg)) {
        onApplyThemePreset(arg);
        append('accent', `Tema aplicado: ${arg}`);
      } else {
        onOpenWindow('win-themes');
        append('out', 'Abriendo Theme Studio... (o usa: theme cyber|sunset|matrix|synth)');
      }
    } else if (cmd === 'draw') {
      onToggleDesktopDraw();
      append('out', 'Alternando modo dibujo sobre el escritorio...');
    } else if (cmd === 'paint') {
      onOpenWindow('win-draw');
      append('out', 'Abriendo Studio Paint...');
    } else if (cmd === 'music') {
      onOpenWindow('win-music');
      append('out', 'Abriendo Astro.Radio...');
    } else if (cmd === 'notes') {
      onOpenWindow('win-notes');
      append('out', 'Abriendo Cuaderno & Glosario...');
    } else if (cmd === 'mediaflow') {
      onOpenWindow('win-mediaflow');
      append('out', 'Abriendo MediaFlow Studio...');
    } else if (cmd === 'cardgram') {
      onOpenWindow('win-cardgram');
      append('out', 'Abriendo CardGram...');
    } else if (cmd === 'pressmark') {
      onOpenWindow('win-pressmark');
      append('out', 'Abriendo Pressmark...');
    } else if (cmd === 'youtube') {
      onOpenWindow('win-youtube');
      append('out', 'Abriendo YouTube Player...');
    } else if (cmd === 'bio') {
      onOpenWindow('win-astroverse');
      append('out', 'Abriendo Astro.Verse...');
    } else if (cmd === 'admin') {
      onOpenWindow('win-admin');
      append('out', 'Abriendo Panel de Control Admin...');
    } else {
      append('out', `Comando no reconocido: '${cmd}'. Escribe 'help'.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(history.length - 1, histIdx + 1);
      if (history[nextIdx]) {
        setHistIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = histIdx - 1;
      if (nextIdx < 0) {
        setHistIdx(-1);
        setInput('');
      } else if (history[nextIdx]) {
        setHistIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/90 p-4 font-mono text-xs min-h-0">
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {logs.map((l) => (
          <pre
            key={l.id}
            className={`whitespace-pre-wrap break-words font-mono ${
              l.kind === 'cmd'
                ? 'text-white font-semibold'
                : l.kind === 'accent'
                ? 'text-emerald-400'
                : 'text-slate-300'
            }`}
          >
            {l.text}
          </pre>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2">
        <span className="text-emerald-400 font-bold shrink-0">astro@os:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Escribe un comando (ej: help, physics earth, impulse)..."
          className="flex-1 bg-transparent outline-none text-white placeholder-slate-600"
        />
      </div>
    </div>
  );
};
