import React from "react";
import { Link } from "wouter";
import { LogIn, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import PublicLayout from "@/components/PublicLayout";
import { postLoginDestination } from "@shared/accessControl";

export default function UserLoginPage() {
  const { user, loading } = useAuth();

  return (
    <PublicLayout>
      <section className="auth-page" aria-labelledby="login-heading">
        <div className="container auth-page__grid">
          <div className="auth-page__intro">
            <p className="site-eyebrow">Sua conta</p>
            <h1 id="login-heading">Entre para continuar.</h1>
            <p>Use sua conta segura para acompanhar o portfólio e acessar recursos reservados a você.</p>
            <p className="auth-page__note"><ShieldCheck size={17} aria-hidden="true" /> O acesso é protegido e seu perfil é criado automaticamente no primeiro login.</p>
          </div>
          <div className="auth-card">
            <UserRound size={28} aria-hidden="true" className="auth-card__icon" />
            <h2>Login de usuário</h2>
            {user ? <><p>Você já está conectado como <strong>{user.role === "admin" ? "administrador" : "usuário"}</strong>.</p><Link href={postLoginDestination(user.role)} className="editorial-button w-full">Continuar para minha área</Link></> : <><p>Já tem uma conta? Entre para ver seu perfil.</p><button className="editorial-button w-full" onClick={() => startLogin("/conta")} disabled={loading}><LogIn size={16} aria-hidden="true" /> {loading ? "Verificando acesso..." : "Entrar na minha conta"}</button><p className="auth-card__footer">Ainda não possui conta? <Link href="/cadastro">Criar cadastro</Link></p></>}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
