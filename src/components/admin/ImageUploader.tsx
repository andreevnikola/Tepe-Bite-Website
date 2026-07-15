'use client'

import '@uploadthing/react/styles.css'
import Image from 'next/image'
import { UploadButton } from '@/lib/uploadthing/client'
import type { ImageDTO } from '@/lib/dashboard/dto'

type UploadResult = {
  key: string
  ufsUrl?: string
  url?: string
  serverData?: { url?: string; key?: string } | null
}

function extract(file: UploadResult): ImageDTO {
  return {
    url: file.serverData?.url ?? file.ufsUrl ?? file.url ?? '',
    key: file.serverData?.key ?? file.key,
  }
}

export default function ImageUploader({
  value,
  onChange,
  size = 160,
}: {
  value: ImageDTO | null
  onChange: (v: ImageDTO | null) => void
  size?: number
}) {
  if (value) {
    return (
      <div className="inline-flex flex-col items-start gap-2">
        <Image
          src={value.url}
          alt=""
          width={size}
          height={size}
          className="rounded-[var(--r-md)] border border-[var(--border)] object-cover"
          style={{ width: size, height: size }}
        />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-red-600 hover:underline"
        >
          Премахни изображението
        </button>
      </div>
    )
  }

  return (
    <UploadButton
      endpoint="imageUploader"
      config={{ mode: 'auto' }}
      onClientUploadComplete={(res) => {
        const file = res?.[0] as UploadResult | undefined
        if (file) onChange(extract(file))
      }}
      onUploadError={(e) => {
        alert(`Грешка при качване: ${e.message}`)
      }}
      appearance={{ button: 'ut-ready:bg-[var(--plum)] text-sm' }}
    />
  )
}
