import { useNavigate } from 'react-router-dom'

import { useToast } from '@/components/ui/use-toast'
import type { UserInfoFormValues } from '@/components/user-info-form'
import { UserInfoForm } from '@/components/user-info-form'
import { createOrUpdateUser } from '@/db/actions/user'
import { useUser } from '@/db/ui-store'

export function SettingsPage() {
  const [user] = useUser()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = (values: UserInfoFormValues) => {
    if (!user) return
    try {
      createOrUpdateUser({ ...values, id: user.id })
      toast({ title: 'User info updated!', description: 'Redirecting...' })

      setTimeout(() => {
        navigate(-1)
      }, 3000)
    } catch (error) {
      toast({
        title: 'Error updating user info',
        description:
          error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }

  if (!user) return null

  return (
    <div className="container mx-auto max-w-md p-4">
      <h2 className="mb-6 text-center text-xl font-bold">User Settings</h2>
      <UserInfoForm
        onSubmit={handleSubmit}
        initialValues={{ handle: user.handle, apiKey: user.apiKey }}
        submitButtonText="Update Info"
      />
    </div>
  )
}
