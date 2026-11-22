import React, { useState } from 'react';
import { ASTRO_AVATAR_IMG } from '../../constants/defaults';

const SHOWCASE_CARDS = [
  {
    id: 'astro-os',
    handle: '@theastrobruh',
    title: 'the.astro.os',
    role: 'Cosmic Physics Desktop OS',
    bio: 'Sistema operativo simulado interactivo con motor de físicas 2D, widgets GIF arrastrables y estética XP + Cyberpunk.',
    accent: '#FF007A',
    url: 'https://github.com/theastrobruh/the.astro.os',
  },
  {
    id: 'cardgram',
    handle: '@cardgram.app',
    title: 'CardGram',
    role: 'Digital Cards & Web Identity',
    bio: 'Plataforma de tarjetas digitales con glassmorphism, perfiles interactivos y enlaces optimizados.',
    accent: '#00F0FF',
    url: 'https://theastrobruh.github.io/CardGram/#/home',
  },
  {
    id: 'inkra',
    handle: '@inkra.studio',
    title: 'Inkra',
    role: 'Creative Illustration Suite',
    bio: 'Herramienta de diseño digital e ilustración interactiva con lienzos rápidos, paletas y exportación directa.',
    accent: '#A855F7',
    url: 'https://theastrobruh.github.io/Inkra/inkra.html',
  },
];

export const CardGramApp: React.FC = () => {
  const [selectedId, setSelectedId] = useState(SHOWCASE_CARDS[0].id);
  const [customName, setCustomName] = useState('theAstroBruh');
  const [customRole, setCustomRole] = useState('Creative Developer');
  const [customBio, setCustomBio] = useState('Construyendo interfaces espaciales con física realista.');
  const [cardAccent, setCardAccent] = useState('#FF007A');

  const active = SHOWCASE_CARDS.find((c) => c.id === selectedId) || SHOWCASE_CARDS[0];

  return (
    <div className="p-5 flex-1 overflow-y-auto space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-display font-bold text-white">
            CardGram — Identidad Visual & Tarjetas
          </h3>
          <p className="text-xs text-slate-400">
            Colección oficial y creador interactivo de tarjetas glassmórficas
          </p>
        </div>
        <a
          href="https://theastrobruh.github.io/CardGram/#/home"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/35 border border-pink-400/40 text-pink-200 font-mono text-xs font-semibold transition-colors"
        >
          Abrir CardGram Web ↗
        </a>
      </div>

      {/* Project Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SHOWCASE_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelectedId(card.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedId === card.id
                ? 'bg-white/10 border-pink-400 shadow-lg'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-[11px] font-mono" style={{ color: card.accent }}>
              {card.handle}
            </div>
            <div className="text-sm font-display font-bold text-white mt-0.5">{card.title}</div>
            <div className="text-xs text-slate-400 mt-1 line-clamp-2">{card.role}</div>
          </button>
        ))}
      </div>

      {/* Interactive Card Preview + Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        <div
          style={{
            borderColor: `${cardAccent}66`,
            boxShadow: `0 20px 45px rgba(0,0,0,0.6), 0 0 30px ${cardAccent}28`,
          }}
          className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/95 border flex flex-col justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <img
              src={ASTRO_AVATAR_IMG}
              alt={customName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border border-white/20"
            />
            <div>
              <h4 className="text-base font-display font-bold text-white">{customName}</h4>
              <p className="text-xs font-mono" style={{ color: cardAccent }}>
                {customRole}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{customBio}</p>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Proyecto destacado: {active.title}</span>
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              Visitar ↗
            </a>
          </div>
        </div>

        {/* Live Card Customizer */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <h4 className="text-xs font-mono font-bold text-cyan-300">Personalizar Tarjeta</h4>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Nombre"
            className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white"
          />
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="Rol o título"
            className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white"
          />
          <textarea
            value={customBio}
            onChange={(e) => setCustomBio(e.target.value)}
            rows={2}
            className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs font-mono text-white resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300">Color de acento</span>
            <input
              type="color"
              value={cardAccent}
              onChange={(e) => setCardAccent(e.target.value)}
              className="w-8 h-8 bg-transparent border-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
