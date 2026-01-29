import "./Home.css"
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";

const CardAnotacao = (props) => {
  return <div className="card" key={props.id}>
    <div className="inCard">
      <h2>{props.titulo}</h2>
    </div>
    <div className="carDescription">
      <p>{props.subti}</p>
    </div>
    <div className="dataCreated">
      <p>{props.data}</p>
    </div>
    <div className="functionIcons">
      <div className="checkSqua">
        <FaCheckSquare />
      </div>
      <div onClick={() => props.onDelete(props.id)} className="delete">
        <MdDelete />
      </div>
      <div onClick={() => props.onEdit(props.note)} className="edit">
        <FaPencilAlt />
      </div>
    </div>
  </div>
}

const Home = () => {

  const [open, setOpen] = useState(false);

  {/*Criando/Editando*/ }
  const [editingNote, setEditingNote] = useState(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const handleEditingNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setSubtitle(note.subtitle);
    setOpen(true)
  }

  const handleSaveNote = () => {

    if (!title.trim()) return;

    if (editingNote) {
      setNotes(prev =>
        prev.map(note =>
          note.id === editingNote.id
            ? { ...note, title, subtitle }
            : note
        )
      )
    }

    else {
      const newNote = {
        id: Date.now(),
        title,
        subtitle,
        createdAt: new Date().toLocaleString()
      };
      setNotes(prev => [...prev, newNote]);
    }

    setTitle("");
    setSubtitle("");
    setEditingNote(null)
    setOpen(false);
  };

  {/**/ }

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);


  function deleteNote(id) {
    setNotes(prev => prev.filter(note => note.id !== id));
  }

  return (
    <div className="principal">
      <div className="conta">
        <div className="containerAdd">
          <button className="add" onClick={() => setOpen(true)}><IoIosAddCircle /></button>
        </div>
        <div className="search">
          <input className="filterSear" placeholder="Filter" />
        </div>
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingNote ? "Editar Tarefa" : "Criar Tarefa"}</h2>

            <input
              placeholder="Título"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <input
              placeholder="Descrição"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
            />

            <div className="actions">
              <button onClick={() => { setOpen(false); setEditingNote(null); setTitle(""); setSubtitle("") }}>Cancelar</button>
              <button onClick={handleSaveNote}>{editingNote ? "Salvar Alterações" : "Criar"}</button>
            </div>
          </div>
        </div>
      )
      }


      <section className="displayCard">

        {notes.map(note => (
          <CardAnotacao
            key={note.id}
            note={note}
            id={note.id}
            titulo={note.title}
            subti={note.subtitle}
            onDelete={deleteNote}
            onEdit={handleEditingNote}
            data={note.createdAt}
          />
        ))}

      </section>

    </div >
  )
}

export default Home