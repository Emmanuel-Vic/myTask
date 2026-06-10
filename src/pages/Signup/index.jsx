import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import useAuth from "../../hooks/useAuth";
import "./Signup.css";

const Signup = () => {

  const [email, setEmail] = useState("");
  const [confEmail, setConfEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { signup } = useAuth();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!email | !confEmail | !senha) {
      setError("Preencha todos os campos");
      return;
    } else if (email !== confEmail) {
      setError("Os e-mails não são iguais");
      return;
    }

    const response = signup(email, senha);

    if (response) {
      setError(response);
      return;
    }

    alert("Usuario Cadastrado com sucesso!")
    navigate("/");
  };

  return (
    <div className='container'>
      <form onSubmit={handleSignup}>
        <h1>Cadastre-se</h1>

        {error && <span className="error">{error}</span>}

        <div className="input-field">
          <input
            type="email"
            placeholder="Insira seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-field">
          <input
            type="email"
            placeholder="Confirmação de e-mail"
            value={confEmail}
            onChange={(e) => setConfEmail(e.target.value)}
          />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <button type="submit" className="butia">Cadastrar</button>
      </form>
    </div>
  )
}

export default Signup