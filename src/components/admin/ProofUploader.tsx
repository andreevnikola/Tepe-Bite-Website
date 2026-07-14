'use client'

import '@uploadthing/react/styles.css'
import Image from 'next/image'
import { UploadButton } from '@/lib/uploadthing/client'
import { compressToBW } from '@/lib/image/compress'
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

/**
 * Uploader for a required expense proof. Reuses the `imageUploader` route but
 * downscales every file to a grayscale ≤720×480 JPEG first (see compressToBW)
 * to stay light on the UploadThing free plan. Renders a small B&W preview.
 */
export default function ProofUploader({
  value,
  onChange,
  size = 120,
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
          style={{ width: size, height: size, filter: 'grayscale(100%)' }}
        />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-red-600 hover:underline"
        >
          Премахни доказателството
        </button>
      </div>
    )
  }

  return (
    <UploadButton
      endpoint="imageUploader"
      config={{ mode: 'auto' }}
      onBeforeUploadBegin={async (files) => {
        // Compress every selected image to grayscale low-res before upload.
        return Promise.all(files.map((f) => compressToBW(f)))
      }}
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
