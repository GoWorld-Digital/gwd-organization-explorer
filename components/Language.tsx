"use client";

import { Children, cloneElement, createContext, isValidElement, useContext, useEffect, useState, type ReactNode } from 'react';
import { translate, type Locale } from '../lib/translations';

type LanguageState = { locale: Locale; setLocale: (locale: Locale) => void; t: (text: string) => string; href: (path: string) => string };
const LanguageContext = createContext<LanguageState>({ locale: 'en', setLocale: () => {}, t: text => text, href: path => path });
const valid = (value: string | null): value is Locale => value === 'en' || value === 'pt' || value === 'fr';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, update] = useState<Locale>('en');
  useEffect(() => {
    const sync = () => {
      const query = new URL(location.href).searchParams.get('lang');
      let stored: string | null = null;
      try { stored = localStorage.getItem('gwd-language'); } catch { /* Private browsers may disable storage. */ }
      update(valid(query) ? query : valid(stored) ? stored : 'en');
    };
    sync();
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, []);
  useEffect(() => { document.documentElement.lang = locale === 'pt' ? 'pt-BR' : locale; }, [locale]);
  function setLocale(next: Locale) {
    update(next);
    try { localStorage.setItem('gwd-language', next); } catch { /* The URL remains shareable. */ }
    const url = new URL(location.href);
    url.searchParams.set('lang', next);
    history.replaceState(history.state, '', url);
  }
  const t = (text: string) => translate(text, locale);
  const href = (path: string) => {
    if (!path.startsWith('/') || path.startsWith('//')) return path;
    const [withoutHash, hash] = path.split('#');
    const [pathname, query] = withoutHash.split('?');
    const params = new URLSearchParams(query);
    params.set('lang', locale);
    return pathname + '?' + params + (hash ? '#' + hash : '');
  };
  return <LanguageContext.Provider value={{ locale, setLocale, t, href }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }

export function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage();
  return <label className="language-selector"><span className="sr-only">{t('Interface language')}</span><select aria-label={t('Interface language')} value={locale} onChange={event => setLocale(event.target.value as Locale)}><option value="pt" lang="pt-BR">PT · Português</option><option value="fr" lang="fr">FR · Français</option><option value="en" lang="en">EN · English</option></select></label>;
}

// Translate React text nodes, never the DOM or canonical model. IDs, numbers,
// formulas, event handlers, keys, refs and source records remain untouched.
// Components with their own render boundary use this wrapper themselves.
export function Localized({ children }: { children: ReactNode }) {
  const { t, href } = useLanguage();
  function visit(nodes: ReactNode): ReactNode {
    return Children.map(nodes, node => {
      if (typeof node === 'string') return t(node);
      if (!isValidElement<Record<string, unknown>>(node)) return node;
      const props: Record<string, unknown> = {};
      for (const key of ['title', 'aria-label', 'placeholder', 'alt']) {
        if (typeof node.props[key] === 'string') props[key] = t(node.props[key]);
      }
      if (typeof node.props.href === 'string') props.href = href(node.props.href);
      if (node.props.children !== undefined) props.children = visit(node.props.children as ReactNode);
      return cloneElement(node, props);
    });
  }
  return <>{visit(children)}</>;
}
