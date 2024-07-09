import { useState } from 'react'

import { EmailForm } from '@/components/email-code-form'
import { MagicCodeForm } from '@/components/magic-code-form'

export function Auth(): JSX.Element {
  const [sentEmail, setSentEmail] = useState('')

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4">
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
