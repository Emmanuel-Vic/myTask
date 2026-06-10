import { useState } from "react"
import "./Forgot.css"

const index = () => {
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [msError, setMsError] = useState("");

  {/*Pegando email*/}
  const handleRecoverPassword = () => {
    const users = JSON.parse(localStorage.getItem("users_db")) || [];
    const user = users.find(u => u.email === email)

    if (!user) {
      setMsg("E-mail não encontrado.");
      return;
    }

    localStorage.setItem("reset_email", email);
    setMsg("");
    setOpen(true);
  }


  const [newPassword, setNewPassword] = useState("");
  {/*Resetando senha*/}
  const handleResetPassword = () => {
    if(!newPassword || newPassword.trim() === ""){
      setMsError("Digite uma senha válida");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users_db")) || [];

    const updated = users.map(u =>
      u.email === email
        ? { ...u, password: newPassword}
        : u
    );

    localStorage.setItem("users_db", JSON.stringify(updated))

    alert("Senha alterada com sucesso")

    setOpen(false);
    setEmail("");
    setNewPassword("");
  }


  return (
    <div>
      <div className="containerForgot">
        <h1>Digite seu e-mail para recuperar sua senha</h1>
        {msg && <p className="error">{msg}</p>}
        <div className="inputo-field">
          <input
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button onClick={handleRecoverPassword}>Verificar</button>
      </div>

      {open && (
        <div className="modal-overlay-forgot">
          <div className="modal-forgot">
            <h2>Digite sua nova senha</h2>
            <p>E-mail confirmado. crie uma nova senha.</p>
            <p className="error">{msError}</p>
            <input
              type="password"
              placeholder="Senha"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <div className="buttonFor">
              <button onClick={() => setOpen(false)}>Cancelar</button>
              <button onClick={handleResetPassword}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export default index