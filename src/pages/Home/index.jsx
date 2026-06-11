import "./Home.css"
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { FaRegClipboard } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { useEffect, useState, useContext } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { supabase } from "../../lib/supabase";
import { AuthContext } from "../../contexts/auth";

const CardAnotacao = ({ id, titulo, subti, data, done, note, onDelete, onEdit, onToggleDone }) => {
  return (
    <div className={`card ${done ? "done" : ""}`}>
      <div className="inCard">
        <h2 style={{ textDecoration: done ? "line-through" : "none", opacity: done ? 0.5 : 1 }}>
          {titulo}
        </h2>
        {subti && (
          <div className="carDescription">
            <p>{subti}</p>
          </div>
        )}
      </div>

      <div className="dataCreated">
        <p>{data}</p>
      </div>

      <div className="functionIcons">
        <div className="iconBtn check" onClick={() => onToggleDone(id, done)} title={done ? "Marcar como pendente" : "Marcar como concluída"}>
          {done ? <FaCheckSquare /> : <FaRegSquare />}
        </div>
        <div className="iconBtn edit" onClick={() => onEdit(note)} title="Editar">
          <FaPencilAlt />
        </div>
        <div className="iconBtn delete" onClick={() => onDelete(id)} title="Excluir">
          <MdDelete />
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { user } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [filter, setFilter] = useState("");
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState("");

  // ── Buscar notas do usuário ao montar ──────────────────────────────────────
  useEffect(() => {
    const fetchNotes = async () => {
      setLoadingNotes(true);

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar notas:", error.message);
      } else {
        setNotes(data ?? []);
      }

      setLoadingNotes(false);
    };

    fetchNotes();
  }, []);

  // ── Abrir modal de edição ──────────────────────────────────────────────────
  const handleEditingNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setSubtitle(note.subtitle ?? "");
    setOpen(true);
  };

  // ── Criar ou editar nota ───────────────────────────────────────────────────
  const handleSaveNote = async () => {
    if (!title.trim()) return;

    setError("");

    if (editingNote) {
      // Editar nota existente
      const { data, error } = await supabase
        .from("notes")
        .update({ title: title.trim(), subtitle: subtitle.trim() })
        .eq("id", editingNote.id)
        .select()
        .single();

      if (error) {
        setError("Erro ao salvar alterações.");
        console.error(error.message);
        return;
      }

      setNotes(prev =>
        prev.map(note => note.id === editingNote.id ? data : note)
      );

    } else {
      // Criar nova nota
      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          title: title.trim(),
          subtitle: subtitle.trim(),
          done: false,
        })
        .select()
        .single();

      if (error) {
        setError("Erro ao criar tarefa.");
        console.error(error.message);
        return;
      }

      setNotes(prev => [data, ...prev]);
    }

    closeModal();
  };

  // ── Fechar modal ───────────────────────────────────────────────────────────
  const closeModal = () => {
    setOpen(false);
    setEditingNote(null);
    setTitle("");
    setSubtitle("");
    setError("");
  };

  // ── Deletar nota ───────────────────────────────────────────────────────────
  const deleteNote = async (id) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar:", error.message);
      return;
    }

    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // ── Alternar done ──────────────────────────────────────────────────────────
  const toggleDone = async (id, currentDone) => {
    const { data, error } = await supabase
      .from("notes")
      .update({ done: !currentDone })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar status:", error.message);
      return;
    }

    setNotes(prev =>
      prev.map(note => note.id === id ? data : note)
    );
  };

  // ── Filtro local (sem nova query) ──────────────────────────────────────────
  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(filter.toLowerCase()) ||
    (n.subtitle && n.subtitle.toLowerCase().includes(filter.toLowerCase()))
  );

  // ── Formatar data vinda do Supabase ────────────────────────────────────────
  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "short", year: "numeric"
    });

  return (
    <div className="principal">

      {/* Top bar */}
      <div className="topBar">
        <div className="search">
          <BsSearch className="searchIcon" />
          <input
            placeholder="Filtrar tarefas…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <button className="btnAdd" onClick={() => setOpen(true)}>
          <IoIosAddCircle />
          Nova tarefa
        </button>
      </div>

      {/* Loading */}
      {loadingNotes && (
        <div className="emptyState">
          <p>Carregando tarefas…</p>
        </div>
      )}

      {/* Empty state */}
      {!loadingNotes && filteredNotes.length === 0 && (
        <div className="emptyState">
          <FaRegClipboard />
          <p>{filter ? "Nenhuma tarefa encontrada." : "Nenhuma tarefa ainda. Crie sua primeira!"}</p>
        </div>
      )}

      {/* Cards */}
      {!loadingNotes && (
        <section className="displayCard">
          {filteredNotes.map(note => (
            <CardAnotacao
              key={note.id}
              note={note}
              id={note.id}
              titulo={note.title}
              subti={note.subtitle}
              done={note.done}
              onDelete={deleteNote}
              onEdit={handleEditingNote}
              onToggleDone={toggleDone}
              data={formatDate(note.created_at)}
            />
          ))}
        </section>
      )}

      {/* Modal */}
      {open && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <h2>{editingNote ? "Editar tarefa" : "Nova tarefa"}</h2>
            {error && <p className="error" style={{ marginBottom: 12 }}>{error}</p>}
            <input
              placeholder="Título"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
            />
            <div className="actions">
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={handleSaveNote}>
                {editingNote ? "Salvar alterações" : "Criar tarefa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;