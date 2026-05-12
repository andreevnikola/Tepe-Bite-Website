'use client'

export type CustomerInfoFields = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type FieldErrors = Partial<Record<keyof CustomerInfoFields, string>>

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
    phone: 'Телефон',
    next: 'Продължи към доставка',
    required: 'Задължително поле',
    emailInvalid: 'Невалиден имейл адрес',
    phoneInvalid: 'Невалиден телефонен номер',
    firstNamePh: 'Иван',
    lastNamePh: 'Иванов',
    emailPh: 'ivan@example.com',
    phonePh: '0888 123 456',
  },
  en: {
    title: 'Your details',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    phone: 'Phone',
    next: 'Continue to delivery',
    required: 'Required',
    emailInvalid: 'Invalid email address',
    phoneInvalid: 'Invalid phone number',
    firstNamePh: 'John',
    lastNamePh: 'Smith',
    emailPh: 'john@example.com',
    phonePh: '+44 7700 900000',
  },
}

function validate(values: CustomerInfoFields, lang: 'bg' | 'en'): FieldErrors {
  const t = T[lang]
  const errors: FieldErrors = {}
  if (!values.firstName.trim()) errors.firstName = t.required
  if (!values.lastName.trim()) errors.lastName = t.required
  if (!values.email.trim()) {
    errors.email = t.required
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = t.emailInvalid
  }
  if (!values.phone.trim()) {
    errors.phone = t.required
  } else if (values.phone.trim().replace(/\s/g, '').length < 5) {
    errors.phone = t.phoneInvalid
  }
  return errors
}

export default function StepCustomerInfo({ lang, values, onChange, onNext }: Props) {
  const t = T[lang]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(values, lang)
    if (Object.keys(errs).length > 0) {
      // Trigger browser validation on first error
      const first = Object.keys(errs)[0] as keyof CustomerInfoFields
      const el = document.getElementById(`field-${first}`)
      if (el) (el as HTMLInputElement).focus()
      return
    }
    onNext()
  }

  const errs = validate(values, lang)
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--r-sm)',
    border: '1.5px solid var(--border)',
    background: '#fff',
    fontSize: '1rem',
    color: 'var(--text)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 0.15s',
  }

  function field(
    key: keyof CustomerInfoFields,
    label: string,
    type: string,
    placeholder: string,
    autoComplete: string,
  ) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label
          htmlFor={`field-${key}`}
          style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-mid)' }}
        >
          {label}
        </label>
        <input
          id={`field-${key}`}
          type={type}
          value={values[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={fieldStyle}
          required
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 4 }}
      >
        {t.title}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {field('firstName', t.firstName, 'text', t.firstNamePh, 'given-name')}
        {field('lastName', t.lastName, 'text', t.lastNamePh, 'family-name')}
      </div>

      {field('email', t.email, 'email', t.emailPh, 'email')}
      {field('phone', t.phone, 'tel', t.phonePh, 'tel')}

      <button
        type="submit"
        className="btn btn-primary"
        style={{ marginTop: 8, justifyContent: 'center' }}
        disabled={Object.keys(errs).length > 0 && false}
      >
        {t.next}
      </button>
    </form>
  )
}
