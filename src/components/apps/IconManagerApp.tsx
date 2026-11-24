import React from 'react';
import { DesktopIconConfig } from '../../types/os';
import { renderDefaultSvg } from '../DesktopIconItem';

interface IconManagerAppProps {
  icons: DesktopIconConfig[];
  onSetCustomImage: (iconId: string, dataUrl: string | undefined) => void;
  onResetAll: () => void;
}

export const IconManagerApp: React.FC<IconManagerAppProps> = ({
  icons,
  onSetCustomImage,
  onResetAll,
}) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, iconId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSetCustomImage(iconId, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-5 flex-1 overflow-y-auto space-y-4">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-mono font-bold text-cyan-300">
            Personalizar Íconos del Escritorio
          </h3>
          <p className="text-xs text-slate-400">
            Sube imágenes PNG, JPG o GIF animados para cada aplicación
          </p>
        </div>
        <button
          onClick={onResetAll}
          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/35 text-rose-200 font-mono text-xs transition-colors"
        >
          Restaurar Todos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-slate-900 border border-white/15 flex items-center justify-center overflow-hidden shrink-0">
                {icon.customImage ? (
                  <img src={icon.customImage} alt={icon.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  renderDefaultSvg(icon.winId)
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-mono font-bold text-white leading-tight">{icon.name}</div>
                <div className="text-[11px] text-slate-400">
                  {icon.customImage ? 'Imagen personalizada' : 'Ícono vectorial'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <label className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/35 text-cyan-200 font-mono text-[11px] cursor-pointer transition-colors">
                Subir
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, icon.id)}
                  className="hidden"
                />
              </label>
              {icon.customImage && (
                <button
                  onClick={() => onSetCustomImage(icon.id, undefined)}
                  className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-mono text-[11px]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
