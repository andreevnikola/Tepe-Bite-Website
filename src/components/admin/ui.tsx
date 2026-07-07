'use client'

import React from 'react'

const inputCls =
  'w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--plum)]'

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-[var(--text-mid)]">{label}</span>
      {children}
      {hint && <span className="text-xs text-[var(--text-soft)]">{hint}</span>}
    </label>
  )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} min-h-24 ${props.className ?? ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ''}`} />
}

export function Card({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] p-5 ${className ?? ''}`}
    >
      {title && <h2 className="mb-4 text-base font-semibold text-[var(--plum)]">{title}</h2>}
      {children}
    </section>
  )
}
