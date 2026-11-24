import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_GLOSSARY } from '../../constants/defaults';
import { GlossaryItem } from '../../types/os';

interface NoteDoc {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface EnhancedTodoItem {
  id: string;
  text: string;
  done: boolean;
  priority: 'alta' | 'media' | 'baja';
}

const NOTES_STORAGE_KEY = 'astro_notes_docs_v2';
const TODOS_STORAGE_KEY = 'astro_todos_v2';
const GLOSSARY_STORAGE_KEY = 'astro_glossary';

export const NotesApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'todo' | 'glossary'>('editor');

  const [docs, setDocs] = useState<NoteDoc[]>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'note-1',
        title: 'Bienvenido a Astro.Notes.md',
        content:
          '# Astro.Notes\n\nEscribe ideas, listas de verificación o apuntes rápidos.\n\n- Usa la barra superior para insertar formato Markdown\n- Cambia entre vista de Edición y Vista Previa\n- Crea múltiples notas desde el panel lateral',
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [activeDocId, setActiveDocId] = useState<string>(() => docs[0]?.id || 'note-1');
  const [previewMode, setPreviewMode] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(docs));
  }, [docs]);

  const updateActiveDoc = (patch: Partial<NoteDoc>) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDocs((prev) =>
      prev.map((d) => (d.id === activeDoc.id ? { ...d, ...patch, updatedAt: time } : d))
    );
  };

  const createNewDoc = () => {
    const id = `note-${Date.now()}`;
    const newDoc: NoteDoc = {
      id,
      title: `Nota ${docs.length + 1}.md`,
      content: '',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setDocs((prev) => [newDoc, ...prev]);
    setActiveDocId(id);
    setPreviewMode(false);
  };

  const deleteDoc = (id: string) => {
    if (docs.length <= 1) return;
    const remaining = docs.filter((d) => d.id !== id);
    setDocs(remaining);
    if (activeDocId === id) {
      setActiveDocId(remaining[0].id);
    }
  };

  const insertSnippet = (before: string, after = '') => {
    const el = textareaRef.current;
    if (!el || !activeDoc) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = activeDoc.content;
    const selected = text.slice(start, end);
    const next = text.slice(0, start) + before + selected + after + text.slice(end);
    updateActiveDoc({ content: next });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    });
  };

  const downloadNote = () => {
    if (!activeDoc) return;
    const blob = new Blob([activeDoc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeDoc.title.includes('.') ? activeDoc.title : `${activeDoc.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyNote = () => {
    if (!activeDoc) return;
    navigator.clipboard?.writeText(activeDoc.content).catch(() => {});
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 1600);
  };

  const wordCount = useMemo(() => {
    const words = (activeDoc?.content || '').trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [activeDoc?.content]);

  // Enhanced To-Do State
  const [todos, setTodos] = useState<EnhancedTodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(TODOS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      { id: 't-1', text: 'Probar las físicas SAT OBB en modo Gravedad', done: false, priority: 'alta' },
      { id: 't-2', text: 'Anclar un widget GIF en MediaFlow Studio', done: false, priority: 'media' },
    ];
  });
  const [todoInput, setTodoInput] = useState('');
  const [todoPriority, setTodoPriority] = useState<'alta' | 'media' | 'baja'>('media');
  const [todoFilter, setTodoFilter] = useState<'all' | 'pending' | 'done'>('all');

  useEffect(() => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!todoInput.trim()) return;
    setTodos((prev) => [
      { id: `t-${Date.now()}`, text: todoInput.trim(), done: false, priority: todoPriority },
      ...prev,
    ]);
    setTodoInput('');
  };

  const filteredTodos = useMemo(() => {
    if (todoFilter === 'pending') return todos.filter((t) => !t.done);
    if (todoFilter === 'done') return todos.filter((t) => t.done);
    return todos;
  }, [todos, todoFilter]);

  const doneCount = todos.filter((t) => t.done).length;

  // Glossary State
  const [glossary, setGlossary] = useState<GlossaryItem[]>(() => {
    try {
      const saved = localStorage.getItem(GLOSSARY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_GLOSSARY;
  });
  const [glossarySearch, setGlossarySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showAddGlossary, setShowAddGlossary] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newCategory, setNewCategory] = useState('Física 2D');
  const [newDef, setNewDef] = useState('');

  useEffect(() => {
    localStorage.setItem(GLOSSARY_STORAGE_KEY, JSON.stringify(glossary));
  }, [glossary]);

  const categories = useMemo(() => {
    const set = new Set(glossary.map((g) => g.category));
    return ['Todas', ...Array.from(set)];
  }, [glossary]);

  const filteredGlossary = useMemo(() => {
    return glossary.filter((g) => {
      const catOk = selectedCategory === 'Todas' || g.category === selectedCategory;
      const q = glossarySearch.trim().toLowerCase();
      const qOk =
        !q || g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [glossary, selectedCategory, glossarySearch]);

  const saveGlossaryTerm = () => {
    if (!newTerm.trim() || !newDef.trim()) return;
    setGlossary((prev) => [
      {
        id: `g-${Date.now()}`,
        term: newTerm.trim(),
        category: newCategory.trim() || 'General',
        definition: newDef.trim(),
      },
      ...prev,
    ]);
    setNewTerm('');
    setNewDef('');
    setShowAddGlossary(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top Tabs */}
      <div className="px-4 pt-2.5 bg-black/45 border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'editor', label: 'Notas' },
            { id: 'todo', label: `To-Do (${todos.length - doneCount})` },
            { id: 'glossary', label: 'Glosario' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-3.5 py-2 rounded-t-xl font-mono text-xs font-bold border-t border-x transition-colors ${
                activeTab === t.id
                  ? 'bg-indigo-500/25 border-indigo-400/50 text-indigo-200'
                  : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === 'editor' && (
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline tabular-nums">
            {wordCount} palabras
          </span>
        )}
      </div>

      {/* EDITOR TAB */}
      {activeTab === 'editor' && activeDoc && (
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          <aside className="w-full md:w-48 bg-black/35 border-b md:border-b-0 md:border-r border-white/10 p-2.5 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0">
            <button
              onClick={createNewDoc}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold whitespace-nowrap shrink-0"
            >
              + Nueva Nota
            </button>
            {docs.map((d) => (
              <div
                key={d.id}
                onClick={() => setActiveDocId(d.id)}
                className={`group px-2.5 py-2 rounded-xl border cursor-pointer flex items-center justify-between gap-2 shrink-0 transition-colors ${
                  d.id === activeDoc.id
                    ? 'bg-indigo-500/25 border-indigo-400/50 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-mono font-semibold truncate">{d.title}</div>
                  <div className="text-[10px] font-mono text-slate-400">{d.updatedAt}</div>
                </div>
                {docs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDoc(d.id);
                    }}
                    className="opacity-60 hover:opacity-100 text-[11px] font-mono text-rose-300 px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </aside>

          <div className="flex-1 flex flex-col p-3.5 gap-2.5 min-h-0">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={activeDoc.title}
                onChange={(e) => updateActiveDoc({ title: e.target.value })}
                className="flex-1 min-w-[140px] bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
              />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => insertSnippet('# ')}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-mono text-slate-200 border border-white/10"
                >
                  H1
                </button>
                <button
                  onClick={() => insertSnippet('**', '**')}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-mono text-slate-200 border border-white/10 font-bold"
                >
                  B
                </button>
                <button
                  onClick={() => insertSnippet('- ')}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-mono text-slate-200 border border-white/10"
                >
                  • Lista
                </button>
                <button
                  onClick={() => setPreviewMode((p) => !p)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                    previewMode
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  {previewMode ? 'Editar' : 'Vista Previa'}
                </button>
                <button
                  onClick={copyNote}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-mono text-slate-200"
                >
                  {copiedNotice ? 'Copiado' : 'Copiar'}
                </button>
                <button
                  onClick={downloadNote}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/35 text-[11px] font-mono text-emerald-200"
                >
                  .MD
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="flex-1 overflow-y-auto bg-black/35 border border-white/10 rounded-xl p-4 space-y-2 text-xs text-slate-200 leading-relaxed">
                {activeDoc.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return (
                      <h3 key={i} className="text-base font-display font-bold text-cyan-300 pt-1">
                        {line.slice(2)}
                      </h3>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={i} className="flex gap-2 pl-2">
                        <span className="text-pink-400">•</span>
                        <span>{line.slice(2)}</span>
                      </div>
                    );
                  }
                  return <p key={i}>{line || '\u00A0'}</p>;
                })}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={activeDoc.content}
                onChange={(e) => updateActiveDoc({ content: e.target.value })}
                placeholder="Empieza a escribir tus apuntes aquí..."
                className="flex-1 w-full bg-black/35 border border-white/15 rounded-xl p-3.5 text-xs font-mono text-slate-100 leading-relaxed resize-none focus:outline-none focus:border-indigo-400"
              />
            )}
          </div>
        </div>
      )}

      {/* TO-DO TAB */}
      {activeTab === 'todo' && (
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Nueva tarea o recordatorio..."
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            />
            <div className="flex gap-2">
              <select
                value={todoPriority}
                onChange={(e) => setTodoPriority(e.target.value as 'alta' | 'media' | 'baja')}
                className="bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              <button
                onClick={addTodo}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
              >
                + Agregar
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              {(
                [
                  { id: 'all', label: 'Todas' },
                  { id: 'pending', label: 'Pendientes' },
                  { id: 'done', label: 'Completadas' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTodoFilter(f.id)}
                  className={`px-3 py-1 rounded-lg font-mono text-xs ${
                    todoFilter === f.id
                      ? 'bg-indigo-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {doneCount > 0 && (
              <button
                onClick={() => setTodos((prev) => prev.filter((t) => !t.done))}
                className="text-xs font-mono text-rose-300 hover:underline"
              >
                Limpiar completadas
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filteredTodos.length === 0 ? (
              <p className="text-xs font-mono text-slate-500 text-center py-8">
                No hay tareas en esta vista.
              </p>
            ) : (
              filteredTodos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <button
                    onClick={() =>
                      setTodos((prev) =>
                        prev.map((t) => (t.id === item.id ? { ...t, done: !t.done } : t))
                      )
                    }
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                        item.done
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                          : 'border-white/30 bg-black/30'
                      }`}
                    >
                      {item.done ? '✓' : ''}
                    </span>
                    <span
                      className={`text-xs font-mono truncate ${
                        item.done ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                  <span
                    className={`text-[10px] font-mono shrink-0 ${
                      item.priority === 'alta'
                        ? 'text-rose-300'
                        : item.priority === 'media'
                        ? 'text-amber-300'
                        : 'text-cyan-300'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <button
                    onClick={() => setTodos((prev) => prev.filter((t) => t.id !== item.id))}
                    className="text-xs font-mono text-rose-400 hover:text-rose-300 px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* GLOSSARY TAB */}
      {activeTab === 'glossary' && (
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <input
              type="text"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Buscar término o definición..."
              className="bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 flex-1"
            />
            <button
              onClick={() => setShowAddGlossary((v) => !v)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              + Nuevo Término
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-mono text-xs whitespace-nowrap border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {showAddGlossary && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2.5">
              <input
                type="text"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                placeholder="Término / Palabra"
                className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-xs font-mono text-white"
              />
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Categoría (ej: Física 2D, Diseño)"
                className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-xs font-mono text-white"
              />
              <textarea
                value={newDef}
                onChange={(e) => setNewDef(e.target.value)}
                placeholder="Significado o definición..."
                className="w-full bg-black/40 border border-white/15 rounded-lg p-3 text-xs font-mono text-white h-20 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddGlossary(false)}
                  className="px-3 py-1 text-xs font-mono text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveGlossaryTerm}
                  className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-mono text-xs font-bold rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredGlossary.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-mono font-bold text-cyan-300">{item.term}</h4>
                  <button
                    onClick={() => setGlossary((prev) => prev.filter((x) => x.id !== item.id))}
                    className="text-[11px] font-mono text-slate-500 hover:text-rose-400"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] font-mono text-indigo-300">{item.category}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
