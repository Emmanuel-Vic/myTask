import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // evita flash de tela

  // Recupera sessão ao carregar e escuta mudanças
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message === "Invalid login credentials")
        return "E-mail ou senha incorretos";
      return error.message;
    }
    return null;
  };

  const signup = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      if (error.message.includes("already registered"))
        return "E-mail já cadastrado";
      return error.message;
    }
    return null; // Supabase envia e-mail de confirmação automaticamente
  };

  const signout = async () => {
    await supabase.auth.signOut();
  };

  // Envia e-mail de recuperação de senha (link mágico da Supabase)
  const sendPasswordReset = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return error.message;
    return null;
  };

  // Chamada na página /reset-password após o usuário clicar no link
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return error.message;
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, loading, signin, signup, signout, sendPasswordReset, updatePassword }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};