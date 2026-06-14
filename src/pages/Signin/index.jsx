import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { signin } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    const response = await signin(email, senha);

    if (response) {
      setError(response);
      return;
    }

    navigate("/");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        {error && <span className="error">{error}</span>}

        <div className="input-field">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <div className="recall-forget">
          <label></label>
          <Link to="/forgot">Esqueceu a senha?</Link>
        </div>

        <button type="submit">Entrar</button>

        <div className="signup-link">
          <p>
            Não tem uma conta? <Link to="/signup">Registrar</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signin;