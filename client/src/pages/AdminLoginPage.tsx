import React from "react";
import { Link } from "wouter";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import PublicLayout from "@/components/PublicLayout";
import { canAccessAdmin } from "@shared/accessControl";

export default function AdminLoginPage() {
  const { user, loading } = useAuth();

  return (
    <PublicLayout>
      <section className="auth-page" aria-labelledby="admin-login-heading">
        <div className="container auth-page__grid">
          <div className="auth-page__intro">
            <p className="site-eyebrow">Acesso restrito</p>
            <h1 id="admin-login-heading">Painel administrativo.</h1>
            <p>Entre com uma conta que já possua papel de administrador para gerenciar projetos, aparência, contato e usuários.</p>
            <p className="auth-page__note"><ShieldCheck size={17} aria-hidden="true" /> O cadastro inicial cria uma conta de usuário. O papel administrativo é concedido com segurança por outro administrador.</p>
          </div>
          <div className="auth-card">
            <LockKeyhole size={28} aria-hidden="true" className="auth-card__icon" />
            <h2>Login de administrador</h2>
            {user ? canAccessAdmin(user.role) ? <><p>Você já está autenticado como administrador.</p><Link href="/admin" className="editorial-button w-full">Acessar painel administrativo</Link></> : <p>Você está autenticado como usuário comum. Solicite a promoção de acesso a um administrador responsável.</p> : <><p>Use sua conta de administrador para entrar no painel de gestão.</p><button className="editorial-button w-full" onClick={() => startLogin("/admin")} disabled={loading}><LockKeyhole size={16} aria-hidden="true" /> {loading ? "Verificando acesso..." : "Entrar no painel"}</button></>}
            <p className="auth-card__footer">Ainda não possui conta? <Link href="/cadastro">Criar cadastro de usuário</Link></p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
