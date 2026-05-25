import type { CSSProperties } from "react";

type ThemeColorInput = {
  brandPrimary: string;
  brandSecondary: string;
  brandAccent: string;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

const defaultTheme = {
  primary: "#0f766e",
  secondary: "#f59e0b",
  accent: "#0f172a",
};

function expandShortHex(value: string) {
  const clean = value.replace("#", "");
  return clean.length === 3
    ? clean
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : clean;
}

function parseHexToRgb(value: string): Rgb | null {
  const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  if (!hexPattern.test(value)) {
    return null;
  }

  const expanded = expandShortHex(value);

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function normalizeHexColor(value: string, fallback: string) {
  const parsed = parseHexToRgb(value);
  if (!parsed) {
    return fallback;
  }

  return `#${expandShortHex(value).toLowerCase()}`;
}

function toRgbString(value: string) {
  const parsed = parseHexToRgb(value);
  if (!parsed) {
    return null;
  }

  return `${parsed.r} ${parsed.g} ${parsed.b}`;
}

type PublicThemeStyle = CSSProperties & {
  "--sf-brand-primary"?: string;
  "--sf-brand-secondary"?: string;
  "--sf-brand-accent"?: string;
  "--sf-brand-primary-rgb"?: string;
  "--sf-brand-secondary-rgb"?: string;
  "--sf-brand-accent-rgb"?: string;
};

export function getPublicThemeStyle(colors: ThemeColorInput): CSSProperties {
  const brandPrimary = normalizeHexColor(colors.brandPrimary, defaultTheme.primary);
  const brandSecondary = normalizeHexColor(
    colors.brandSecondary,
    defaultTheme.secondary,
  );
  const brandAccent = normalizeHexColor(colors.brandAccent, defaultTheme.accent);

  const style: PublicThemeStyle = {
    "--sf-brand-primary": brandPrimary,
    "--sf-brand-secondary": brandSecondary,
    "--sf-brand-accent": brandAccent,
    "--sf-brand-primary-rgb": toRgbString(brandPrimary) ?? "15 118 110",
    "--sf-brand-secondary-rgb": toRgbString(brandSecondary) ?? "245 158 11",
    "--sf-brand-accent-rgb": toRgbString(brandAccent) ?? "15 23 42",
  };

  return style;
}
