import React from "react";
import { Link } from "wouter";
import { LogIn, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import PublicLayout from "@/components/PublicLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();

  async function handleLogout() {
    await logout();
    window.location.href = "/";
  }

  if (loading) {
    return <PublicLayout><section className="auth-page"><div className="container max-w-xl"><Skeleton className="h-72 w-full" /></div></section></PublicLayout>;
  }

  if (!user) {
    return (
      <PublicLayout>
        <section className="auth-page"><div className="container max-w-xl text-center"><p className="site-eyebrow">Conta</p><h1>Entre para acessar sua conta.</h1><p className="mt-4" style={{ color: "var(--color-text-secondary)" }}>Você precisa estar autenticado para visualizar este espaço.</p><div className="mt-8 flex justify-center gap-3 flex-wrap"><button className="editorial-button" onClick={() => startLogin("/conta")}><LogIn size={16} aria-hidden="true" /> Entrar</button><Link href="/cadastro" className="editorial-button editorial-button--outline">Criar cadastro</Link></div></div></section>
      </PublicLayout>
    );
  }

  const isAdmin = user.role === "admin";
  return (
    <PublicLayout>
      <section className="auth-page" aria-labelledby="account-heading">
        <div className="container auth-page__grid">
          <div className="auth-page__intro">
            <p className="site-eyebrow">Conta autenticada</p>
            <h1 id="account-heading">Olá, {user.name || "pessoa criativa"}.</h1>
            <p>Seu perfil está ativo. Aqui você encontra as informações do seu acesso e pode navegar para os recursos disponíveis para seu papel.</p>
          </div>
          <div className="account-card">
            <div className="account-card__avatar" aria-hidden="true">{(user.name || "U").slice(0, 1).toUpperCase()}</div>
            <div><p className="site-eyebrow">Perfil</p><h2>{user.name || "Usuário"}</h2><p>{user.email || "E-mail não informado"}</p></div>
            <div className="account-card__role"><ShieldCheck size={16} aria-hidden="true" /> {isAdmin ? "Administrador" : "Usuário"}</div>
            {isAdmin ? <Link href="/admin" className="editorial-button w-full">Acessar painel administrativo</Link> : <p className="account-card__message">Sua conta de usuário está pronta. Um administrador poderá conceder permissões adicionais quando necessário.</p>}
            <button className="editorial-button editorial-button--outline w-full" onClick={handleLogout}><LogOut size={16} aria-hidden="true" /> Sair da conta</button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
