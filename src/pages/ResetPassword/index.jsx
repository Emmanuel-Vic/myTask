import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../Forgot/Forgot.css"; // reusa o mesmo CSS

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!password || password.length < 6) {
      setMsg("A senha deve ter pelo menos 6 caracteres"); return;
    }
    if (password !== confirm) {
      setMsg("As senhas não coincidem"); return;
    }
    const error = await updatePassword(password);
    if (error) { setMsg(error); return; }
    alert("Senha alterada com sucesso!");
    navigate("/");
  };

  return (
    <div className="containerForgot">
      <h1>Nova senha</h1>
      {msg && <p className="error">{msg}</p>}
      <div className="inputo-field">
        <input type="password" placeholder="Nova senha"
          value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div className="inputo-field">
        <input type="password" placeholder="Confirmar senha"
          value={confirm} onChange={e => setConfirm(e.target.value)} />
      </div>
      <button onClick={handleSave}>Salvar senha</button>
    </div>
  );
};

export default ResetPassword;