'use client';
import { Provider } from 'jotai';
import { createStore } from 'jotai/vanilla';
import { DEFAULT_LANG, langAtom, type Lang } from '@/store/lang';
import { useState } from 'react';

export default function Providers({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  // Create the store once per instance via a lazy initialiser (runs a single
  // time), so we never read a ref during render.
  const [store] = useState(() => {
    const s = createStore();
    s.set(langAtom, initialLang ?? DEFAULT_LANG);
    return s;
  });

  return (
    <Provider store={store}>{children}</Provider>
  );
}
