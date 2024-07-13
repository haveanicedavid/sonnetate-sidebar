import { useState } from 'react'

import { EmailForm } from '@/components/email-code-form'
import { MagicCodeForm } from '@/components/magic-code-form'

export function AuthPage() {
  const [sentEmail, setSentEmail] = useState('')

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        {!sentEmail ? (
          <EmailForm setSentEmail={setSentEmail} />
        ) : (
          <MagicCodeForm sentEmail={sentEmail} />
        )}
      </div>
    </div>
  )
}
