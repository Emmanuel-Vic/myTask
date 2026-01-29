import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔁 Roda ao carregar / recarregar a página
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const users = JSON.parse(localStorage.getItem("users_db"));

    if (token && users) {
      const { email } = JSON.parse(token);
      const hasUser = users.find((u) => u.email === email);

      if (hasUser) setUser(hasUser);
    }
  }, []);

  const signin = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users_db")) || [];

    const hasUser = users.find((u) => u.email === email);

    if (!hasUser) return "Usuário não cadastrado";
    if (hasUser.password !== password) return "Senha incorreta";

    const token = Math.random().toString(36).substring(2);
    localStorage.setItem("user_token", JSON.stringify({ email, token }));

    setUser(hasUser);
    return null;
  };

  const signup = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users_db")) || [];

    if (users.some((u) => u.email === email)) {
      return "E-mail já cadastrado";
    }

    users.push({ email, password });
    localStorage.setItem("users_db", JSON.stringify(users));
    return null;
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user_token");
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
