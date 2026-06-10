import "./Home.css"
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { FaRegClipboard } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";

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
        <div className="iconBtn check" onClick={() => onToggleDone(id)} title={done ? "Marcar como pendente" : "Marcar como concluída"}>
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
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [filter, setFilter] = useState("");

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleEditingNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setSubtitle(note.subtitle);
    setOpen(true);
  };

  const handleSaveNote = () => {
    if (!title.trim()) return;

    if (editingNote) {
      setNotes(prev =>
        prev.map(note =>
          note.id === editingNote.id
            ? { ...note, title, subtitle }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        title,
        subtitle,
        done: false,
        createdAt: new Date().toLocaleDateString("pt-BR", {
          day: "2-digit", month: "short", year: "numeric"
        })
      };
      setNotes(prev => [...prev, newNote]);
    }

    closeModal();
  };

  const closeModal = () => {
    setOpen(false);
    setEditingNote(null);
    setTitle("");
    setSubtitle("");
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const toggleDone = (id) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, done: !note.done } : note
      )
    );
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(filter.toLowerCase()) ||
    (n.subtitle && n.subtitle.toLowerCase().includes(filter.toLowerCase()))
  );

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

      {/* Empty state */}
      {filteredNotes.length === 0 && (
        <div className="emptyState">
          <FaRegClipboard />
          <p>{filter ? "Nenhuma tarefa encontrada." : "Nenhuma tarefa ainda. Crie sua primeira!"}</p>
        </div>
      )}

      {/* Cards */}
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
            data={note.createdAt}
          />
        ))}
      </section>

      {/* Modal */}
      {open && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <h2>{editingNote ? "Editar tarefa" : "Nova tarefa"}</h2>
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