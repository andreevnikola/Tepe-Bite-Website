'use client';
import { Provider } from 'jotai';
import { createStore } from 'jotai/vanilla';
import { DEFAULT_LANG, langAtom, type Lang } from '@/store/lang';
import { useRef } from 'react';

export default function Providers({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const storeRef = useRef<ReturnType<typeof createStore> | null>(null);
  if (storeRef.current === null) {
    const store = createStore();
    store.set(langAtom, initialLang ?? DEFAULT_LANG);
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>{children}</Provider>
  );
}
