import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./Forgot.css";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const { sendPasswordReset } = useAuth();

  const handleSubmit = async () => {
    if (!email) { setMsg("Informe seu e-mail"); return; }
    const error = await sendPasswordReset(email);
    if (error) { setMsg(error); return; }
    setSent(true);
  };

  if (sent) return (
    <div className="containerForgot">
      <h1>Verifique sua caixa de entrada</h1>
      <p style={{ color: "var(--text-secondary)", textAlign: "center", marginTop: 16 }}>
        Enviamos um link para <strong>{email}</strong>.<br />
        Clique nele para criar uma nova senha.
      </p>
    </div>
  );

  return (
    <div className="containerForgot">
      <h1>Recuperar senha</h1>
      {msg && <p className="error">{msg}</p>}
      <div className="inputo-field">
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Enviar link</button>
    </div>
  );
};

export default Forgot;