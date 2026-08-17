import React from "react";
import { Link } from "wouter";
import { BadgeCheck, UserPlus } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import PublicLayout from "@/components/PublicLayout";
import { postLoginDestination } from "@shared/accessControl";

export default function RegisterPage() {
  const { user, loading } = useAuth();

  return (
    <PublicLayout>
      <section className="auth-page" aria-labelledby="register-heading">
        <div className="container auth-page__grid">
          <div className="auth-page__intro">
            <p className="site-eyebrow">Novo por aqui?</p>
            <h1 id="register-heading">Crie sua conta.</h1>
            <p>Faça seu cadastro para ter uma conta de usuário. Depois do primeiro acesso, seu perfil será criado automaticamente e você poderá entrar sempre que precisar.</p>
            <p className="auth-page__note"><BadgeCheck size={17} aria-hidden="true" /> Administradores são definidos com segurança por outro administrador, nunca por autoelevação.</p>
          </div>
          <div className="auth-card">
            <UserPlus size={28} aria-hidden="true" className="auth-card__icon" />
            <h2>Cadastro de usuário</h2>
            {user ? <><p>Você já está conectado. Não é necessário criar outro cadastro.</p><Link href={postLoginDestination(user.role)} className="editorial-button w-full">Continuar para minha área</Link></> : <><p>Comece com uma conta comum. O papel administrativo só é concedido pelo painel de usuários.</p><button className="editorial-button w-full" onClick={() => startLogin("/conta")} disabled={loading}><UserPlus size={16} aria-hidden="true" /> {loading ? "Verificando acesso..." : "Criar minha conta"}</button><p className="auth-card__footer">Já possui conta? <Link href="/entrar">Fazer login</Link></p></>}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
