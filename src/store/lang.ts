'use client';
import { atom } from 'jotai';

export type Lang = 'bg' | 'en';
export const langAtom = atom<Lang>('bg');
