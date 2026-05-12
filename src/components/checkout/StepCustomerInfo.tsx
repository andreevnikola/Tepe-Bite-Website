'use client'

import { useState } from 'react'

export type CustomerInfoFields = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type FieldErrors = Partial<Record<keyof CustomerInfoFields, string>>
type Touched = Partial<Record<keyof CustomerInfoFields, boolean>>

type Props = {
  lang: 'bg' | 'en'
  values: CustomerInfoFields
  onChange: (fields: Partial<CustomerInfoFields>) => void
  onNext: () => void
}

const T = {
  bg: {
    title: 'Вашите данни',
    firstName: 'Име',
    lastName: 'Фамилия',
    email: 'Имейл адрес',
    phone: 'Телефон за връзка',
    next: 'Продължи към доставка →',
    required: 'Задължително поле',
    emailInvalid: 'Невалиден имейл адрес',
    phoneInvalid: 'Невалиден телефонен номер (мин. 7 цифри)',
    firstNamePh: 'Иван',
    lastNamePh: 'Иванов',
    emailPh: 'ivan@example.com',
    phonePh: '0888 123 456',
    phoneHint: 'Ще бъде използван само при нужда от куриера.',
  },
  en: {
    title: 'Your details',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    phone: 'Phone number',
    next: 'Continue to delivery →',
    required: 'Required',
    emailInvalid: 'Invalid email address',
    phoneInvalid: 'Invalid phone number (min. 7 digits)',
    firstNamePh: 'John',
    lastNamePh: 'Smith',
    emailPh: 'john@example.com',
    phonePh: '+44 7700 900000',
    phoneHint: 'Used only if the courier needs to reach you.',
  },
}

function validatePhone(raw: string): boolean {
  const digits = raw.replace(/[\s\-\(\)\+]/g, '')
  return /^\d{7,15}$/.test(digits)
}

function validate(values: CustomerInfoFields, lang: 'bg' | 'en'): FieldErrors {
  const t = T[lang]
  const errors: FieldErrors = {}
  if (!values.firstName.trim()) errors.firstName = t.required
  if (!values.lastName.trim()) errors.lastName = t.required
  if (!values.email.trim()) {
    errors.email = t.required
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = t.emailInvalid
  }
  if (!values.phone.trim()) {
    errors.phone = t.required
  } else if (!validatePhone(values.phone.trim())) {
    errors.phone = t.phoneInvalid
  }
  return errors
}

export default function StepCustomerInfo({ lang, values, onChange, onNext }: Props) {
  const t = T[lang]
  const [touched, setTouched] = useState<Touched>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = validate(values, lang)
  const showError = (key: keyof CustomerInfoFields) =>
    (touched[key] || submitAttempted) && errors[key]

  function handleBlur(key: keyof CustomerInfoFields) {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitAttempted(true)
    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0] as keyof CustomerInfoFields
      document.getElementById(`field-${firstKey}`)?.focus()
      return
    }
    onNext()
  }

  const baseFieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--r-sm)',
    background: '#fff',
    fontSize: '1rem',
    color: 'var(--text)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  function fieldStyle(key: keyof CustomerInfoFields): React.CSSProperties {
    const hasError = showError(key)
    return {
      ...baseFieldStyle,
      border: hasError
        ? '1.5px solid oklch(55% 0.18 20)'
        : '1.5px solid var(--border)',
      boxShadow: hasError ? '0 0 0 3px oklch(55% 0.18 20 / 0.12)' : undefined,
    }
  }

  function field(
    key: keyof CustomerInfoFields,
    label: string,
    type: string,
    placeholder: string,
    autoComplete: string,
    hint?: string,
  ) {
    const err = showError(key)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label
          htmlFor={`field-${key}`}
          style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-mid)' }}
        >
          {label}
          <span style={{ color: 'oklch(55% 0.18 20)', marginLeft: 3 }}>*</span>
        </label>
        <input
          id={`field-${key}`}
          type={type}
          value={values[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          onBlur={() => handleBlur(key)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={fieldStyle(key)}
          aria-invalid={!!err}
          aria-describedby={err ? `err-${key}` : undefined}
        />
        {err && (
          <div
            id={`err-${key}`}
            role="alert"
            style={{ fontSize: '0.8rem', color: 'oklch(45% 0.18 20)', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <span aria-hidden>⚠</span> {err}
          </div>
        )}
        {!err && hint && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)' }}>{hint}</div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 4 }}>
        {t.title}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="name-grid">
        {field('firstName', t.firstName, 'text', t.firstNamePh, 'given-name')}
        {field('lastName', t.lastName, 'text', t.lastNamePh, 'family-name')}
      </div>

      {field('email', t.email, 'email', t.emailPh, 'email')}
      {field('phone', t.phone, 'tel', t.phonePh, 'tel', t.phoneHint)}

      <button
        type="submit"
        className="btn btn-primary"
        style={{ marginTop: 4, justifyContent: 'center' }}
      >
        {t.next}
      </button>

      <style>{`
        @media (max-width: 480px) {
          .name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  )
}
