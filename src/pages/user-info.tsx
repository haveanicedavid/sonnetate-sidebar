import { UserInfoForm, UserInfoFormValues } from '@/components/user-info-form'
import { createOrUpdateUser } from '@/db/actions/user'

export function UserInfoPage({ authId }: { authId: string }) {
  const handleSubmit = (values: UserInfoFormValues) => {
    const { apiKey, handle } = values
    createOrUpdateUser({ handle, apiKey, id: authId })
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h2 className="mb-6 text-center text-xl font-bold">
          Finish setting up your account
        </h2>
        <UserInfoForm onSubmit={handleSubmit} submitButtonText="Save Info" />
      </div>
    </div>
  )
}
