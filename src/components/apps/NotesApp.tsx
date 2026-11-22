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

  // Multi-Note Documents
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
    const legacyTitle = localStorage.getItem('astro_note_title') || 'Bienvenido a Astro.Notes.md';
    const legacyContent =
      localStorage.getItem('astro_note_content') ||
      '# Astro.Notes\n\nEscribe ideas, listas de verificación o apuntes rápidos.\n\n- Usa la barra superior para insertar formato Markdown\n- Cambia entre vista de Edición y Vista Previa\n- Crea múltiples notas desde el panel lateral';
    return [
      {
        id: 'note-1',
        title: legacyTitle,
        content: legacyContent,
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
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: 't-1', text: 'Probar modo Gravedad Terrestre en el escritorio', done: false, priority: 'alta' },
      { id: 't-2', text: 'Lanzar un widget GIF contra los íconos', done: false, priority: 'media' },
      { id: 't-3', text: 'Dibujar en el lienzo blanco de Pintura Studio', done: false, priority: 'baja' },
    ];
  });
  const [todoInput, setTodoInput] = useState('');
  const [todoPriority, setTodoPriority] = useState<EnhancedTodoItem['priority']>('media');
  const [todoFilter, setTodoFilter] = useState<'all' | 'pending' | 'done'>('all');

  useEffect(() => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const trimmed = todoInput.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      { id: `t-${Date.now()}`, text: trimmed, done: false, priority: todoPriority },
      ...prev,
    ]);
    setTodoInput('');
  };

  const filteredTodos = todos.filter((t) => {
    if (todoFilter === 'pending') return !t.done;
    if (todoFilter === 'done') return t.done;
    return true;
  });

  const doneCount = todos.filter((t) => t.done).length;
  const todoProgress = todos.length > 0 ? Math.round((doneCount / todos.length) * 100) : 0;

  // Glossary State
  const [glossary, setGlossary] = useState<GlossaryItem[]>(() => {
    try {
      const saved = localStorage.getItem(GLOSSARY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_GLOSSARY;
    } catch {
      return DEFAULT_GLOSSARY;
    }
  });
  const [glossarySearch, setGlossarySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showAddGlossary, setShowAddGlossary] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDef, setNewDef] = useState('');

  useEffect(() => {
    localStorage.setItem(GLOSSARY_STORAGE_KEY, JSON.stringify(glossary));
  }, [glossary]);

  const categories = useMemo(() => {
    const set = new Set<string>(['Todas']);
    glossary.forEach((g) => set.add(g.category));
    return Array.from(set);
  }, [glossary]);

  const filteredGlossary = glossary.filter((item) => {
    const matchesCat = selectedCategory === 'Todas' || item.category === selectedCategory;
    const q = glossarySearch.toLowerCase();
    const matchesText =
      item.term.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q);
    return matchesCat && matchesText;
  });

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
    setNewCategory('');
    setNewDef('');
    setShowAddGlossary(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* App Tabs */}
      <div className="bg-black/45 border-b border-white/10 px-4 pt-2 flex items-center gap-2 overflow-x-auto shrink-0">
        {[
          { id: 'editor', label: `Editor (${docs.length})` },
          { id: 'todo', label: `To-Do (${todos.filter((t) => !t.done).length})` },
          { id: 'glossary', label: 'Glosario' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl border-t border-x transition-colors whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-indigo-600 text-white border-white/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* EDITOR TAB */}
      {activeTab === 'editor' && activeDoc && (
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Note List Sidebar (horizontal strip on mobile, sidebar on tablet/desktop) */}
          <aside className="md:w-52 bg-black/35 border-b md:border-b-0 md:border-r border-white/10 p-2.5 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0">
            <button
              onClick={createNewDoc}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold whitespace-nowrap shrink-0 transition-colors"
            >
              + Nueva Nota
            </button>
            <div className="flex md:flex-col gap-1.5">
              {docs.map((doc) => {
                const isActive = doc.id === activeDoc.id;
                return (
                  <div
                    key={doc.id}
                    className={`group flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl border transition-colors shrink-0 min-w-[140px] md:min-w-0 ${
                      isActive
                        ? 'bg-indigo-500/25 border-indigo-400/50 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <button
                      onClick={() => setActiveDocId(doc.id)}
                      className="text-left min-w-0 flex-1"
                    >
                      <div className="text-xs font-mono font-semibold truncate">{doc.title}</div>
                      <div className="text-[10px] text-slate-400">{doc.updatedAt}</div>
                    </button>
                    {docs.length > 1 && (
                      <button
                        onClick={() => deleteDoc(doc.id)}
                        title="Eliminar nota"
                        className="text-[11px] text-slate-400 hover:text-rose-400 px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main Note Workspace */}
          <div className="flex-1 flex flex-col p-4 gap-3 min-h-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <input
                type="text"
                value={activeDoc.title}
                onChange={(e) => updateActiveDoc({ title: e.target.value })}
                className="bg-transparent border-b border-white/20 outline-none text-sm font-mono font-bold text-indigo-300 px-1 py-1 focus:border-indigo-400 flex-1 min-w-[160px]"
              />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewMode((v) => !v)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition-colors ${
                    previewMode
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                      : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {previewMode ? 'Editar' : 'Vista Previa'}
                </button>
                <button
                  onClick={copyNote}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 font-mono text-xs transition-colors"
                >
                  {copiedNotice ? 'Copiado ✓' : 'Copiar'}
                </button>
                <button
                  onClick={downloadNote}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/25 hover:bg-indigo-500/40 border border-indigo-400/35 text-indigo-200 font-mono text-xs transition-colors"
                >
                  Exportar
                </button>
              </div>
            </div>

            {/* Formatting Toolbar */}
            {!previewMode && (
              <div className="flex flex-wrap items-center gap-1 bg-white/5 p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => insertSnippet('# ')}
                  className="px-2.5 py-1 rounded-lg hover:bg-white/10 font-mono text-xs text-slate-200"
                >
                  H1
                </button>
                <button
                  onClick={() => insertSnippet('**', '**')}
                  className="px-2.5 py-1 rounded-lg hover:bg-white/10 font-mono text-xs font-bold text-slate-200"
                >
                  B
                </button>
                <button
                  onClick={() => insertSnippet('*', '*')}
                  className="px-2.5 py-1 rounded-lg hover:bg-white/10 font-mono text-xs italic text-slate-200"
                >
                  I
                </button>
                <button
                  onClick={() => insertSnippet('- ')}
                  className="px-2.5 py-1 rounded-lg hover:bg-white/10 font-mono text-xs text-slate-200"
                >
                  • Lista
                </button>
                <button
                  onClick={() => insertSnippet('- [ ] ')}
                  className="px-2.5 py-1 rounded-lg hover:bg-white/10 font-mono text-xs text-slate-200"
                >
                  ☐ Check
                </button>
                <button
                  onClick={() => insertSnippet('`', '`')}
                  className="px-2.5 py-1 rounded-lg hover:bg-white/10 font-mono text-xs text-slate-200"
                >
                  {'</>'}
                </button>
                <button
                  onClick={() =>
                    insertSnippet(`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] `)
                  }
                  className="px-2.5 py-1 rounded-lg hover:bg-white/10 font-mono text-xs text-cyan-300 ml-auto"
                >
                  + Hora
                </button>
              </div>
            )}

            {previewMode ? (
              <div className="flex-1 overflow-y-auto bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 text-sm text-slate-200 leading-relaxed">
                {activeDoc.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return (
                      <h2 key={i} className="text-lg font-display font-bold text-indigo-300 pt-1">
                        {line.slice(2)}
                      </h2>
                    );
                  }
                  if (line.startsWith('## ')) {
                    return (
                      <h3 key={i} className="text-base font-display font-bold text-cyan-300 pt-1">
                        {line.slice(3)}
                      </h3>
                    );
                  }
                  if (line.startsWith('- [ ] ')) {
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <span>☐</span>
                        <span>{line.slice(6)}</span>
                      </div>
                    );
                  }
                  if (line.startsWith('- [x] ')) {
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono text-emerald-300 line-through">
                        <span>☑</span>
                        <span>{line.slice(6)}</span>
                      </div>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200 pl-2">
                        <span className="text-pink-400">•</span>
                        <span>{line.slice(2)}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="text-xs text-slate-300 min-h-[1em]">
                      {line}
                    </p>
                  );
                })}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={activeDoc.content}
                onChange={(e) => updateActiveDoc({ content: e.target.value })}
                placeholder="Escribe aquí tus notas, ideas, apuntes o borradores..."
                className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs sm:text-sm font-mono text-slate-100 focus:outline-none focus:border-indigo-500/60 resize-none leading-relaxed"
              />
            )}

            {/* Footer Metrics */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>
                {wordCount} palabras · {activeDoc.content.length} caracteres
              </span>
              <span>Guardado automático ({activeDoc.updatedAt})</span>
            </div>
          </div>
        </div>
      )}

      {/* TO-DO TAB */}
      {activeTab === 'todo' && (
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Progress Bar */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Progreso de tareas</span>
              <span className="text-emerald-300 font-bold">
                {doneCount}/{todos.length} ({todoProgress}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${todoProgress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Añadir nueva tarea..."
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            />
            <div className="flex items-center gap-2">
              <select
                value={todoPriority}
                onChange={(e) => setTodoPriority(e.target.value as EnhancedTodoItem['priority'])}
                className="bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200"
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
