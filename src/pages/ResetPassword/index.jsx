import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "../Forgot/Forgot.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase envia o token como hash fragment na URL
    // onAuthStateChange captura o evento PASSWORD_RECOVERY automaticamente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          setReady(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!password || password.length < 6) {
      setMsg("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (password !== confirm) {
      setMsg("As senhas não coincidem");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMsg(error.message);
      return;
    }

    alert("Senha alterada com sucesso!");
    navigate("/");
  };

  if (!ready) {
    return (
      <div className="containerForgot">
        <h1>Aguardando verificação…</h1>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", marginTop: 16 }}>
          Verifique se você acessou pelo link enviado ao seu e-mail.
        </p>
      </div>
    );
  }

  return (
    <div className="containerForgot">
      <h1>Nova senha</h1>
      {msg && <p className="error">{msg}</p>}
      <div className="inputo-field">
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="inputo-field">
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Salvar senha</button>
    </div>
  );
};

export default ResetPassword;