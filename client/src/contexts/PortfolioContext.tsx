import React, { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import type { ThemeConfig } from "../../../drizzle/schema";

// The owner user ID is injected via the public settings query.
// We use a fixed owner ID strategy: the first admin's settings are public.
// In practice, the owner is always userId=1 (the first user to log in becomes admin).
// We expose a context so all public pages share the same settings query.

interface PortfolioContextValue {
  ownerId: number;
  settings: {
    portfolioName: string;
    tagline: string;
    aboutTitle: string;
    aboutText: string;
    shortBio: string;
    profileImageUrl: string;
    whatsapp: string;
    emailPublic: string;
    location: string;
    socialLinks: Array<{ label: string; url: string }>;
    contactIntro: string;
    themeConfig: ThemeConfig;
    faviconUrl: string;
    ctaViewProject: string;
    ctaSendMessage: string;
  } | null;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextValue>({
  ownerId: 1,
  settings: null,
  isLoading: true,
});

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const ownerId = 1; // first registered admin
  const { data, isLoading } = trpc.settings.getPublic.useQuery({ userId: ownerId });

  // Apply theme tokens from DB to CSS custom properties
  useEffect(() => {
    if (!data?.themeConfig) return;
    const cfg = data.themeConfig as ThemeConfig;
    const root = document.documentElement;
    const map: Record<string, string | undefined> = {
      "--color-background": cfg.colorBackground,
      "--color-surface": cfg.colorSurface,
      "--color-text-primary": cfg.colorTextPrimary,
      "--color-text-secondary": cfg.colorTextSecondary,
      "--color-primary": cfg.colorPrimary,
      "--color-secondary": cfg.colorSecondary,
      "--color-accent": cfg.colorAccent,
      "--color-border": cfg.colorBorder,
      "--color-focus": cfg.colorFocus,
      "--font-size-base": cfg.fontSizeBase,
      "--line-height-base": cfg.lineHeightBase,
      "--letter-spacing-heading": cfg.letterSpacingHeading,
      "--radius-none": cfg.radiusNone,
      "--radius-sm": cfg.radiusSm,
      "--radius-md": cfg.radiusMd,
      "--radius-lg": cfg.radiusLg,
      "--radius-full": cfg.radiusFull,
      "--shadow-sm": cfg.shadowSm,
      "--shadow-md": cfg.shadowMd,
      "--shadow-lg": cfg.shadowLg,
      "--max-width": cfg.maxWidth,
      "--gap-base": cfg.gapBase,
      "--motion-fast": cfg.motionFast,
      "--motion-normal": cfg.motionNormal,
      "--motion-slow": cfg.motionSlow,
      "--motion-easing": cfg.motionEasing,
    };
    for (const [prop, val] of Object.entries(map)) {
      if (val) root.style.setProperty(prop, val);
    }
    // Font families via @theme inline can't be overridden at runtime easily,
    // so we use a direct font-family override on body
    if (cfg.fontBody) document.body.style.fontFamily = `${cfg.fontBody}, var(--font-sans)`;
    // Favicon
    if (data.faviconUrl) {
      const link = document.getElementById("dynamic-favicon") as HTMLLinkElement | null;
      if (link) link.href = data.faviconUrl;
    }
  }, [data]);

  const settings = data
    ? {
        portfolioName: data.portfolioName ?? "Portfólio",
        tagline: data.tagline ?? "",
        aboutTitle: data.aboutTitle ?? "Sobre",
        aboutText: data.aboutText ?? "",
        shortBio: data.shortBio ?? "",
        profileImageUrl: data.profileImageUrl ?? "",
        whatsapp: data.whatsapp ?? "",
        emailPublic: data.emailPublic ?? "",
        location: data.location ?? "",
        socialLinks: (data.socialLinks as Array<{ label: string; url: string }>) ?? [],
        contactIntro: data.contactIntro ?? "",
        themeConfig: (data.themeConfig as ThemeConfig) ?? {},
        faviconUrl: data.faviconUrl ?? "",
        ctaViewProject: (data.themeConfig as ThemeConfig)?.ctaViewProject ?? "Ver projeto",
        ctaSendMessage: (data.themeConfig as ThemeConfig)?.ctaSendMessage ?? "Enviar pelo WhatsApp",
      }
    : null;

  return (
    <PortfolioContext.Provider value={{ ownerId, settings, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
