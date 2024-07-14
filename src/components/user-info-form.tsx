import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters long')
    .max(30, 'Handle must be at most 30 characters long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Handle can only contain letters, numbers, and underscores'
    ),
  apiKey: z
    .string()
    .min(1, 'API Key is required')
    .regex(/^sk-*/, 'Invalid Anthropic API Key format'),
})

export type UserInfoFormValues = z.infer<typeof formSchema>

type UserInfoFormProps = {
  onSubmit: (values: UserInfoFormValues) => void
  initialValues?: Partial<UserInfoFormValues>
  submitButtonText?: string
}

export function UserInfoForm({
  onSubmit,
  initialValues,
  submitButtonText = 'Save Info',
}: UserInfoFormProps) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm<UserInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: initialValues?.handle || '',
      apiKey: initialValues?.apiKey || '',
    },
  })

  const handleSubmit = (values: UserInfoFormValues) => {
    setError(null)
    try {
      onSubmit(values)
    } catch (err) {
      setError((err as Error).message || 'An error occurred. Please try again.')
    }
  }

  // Custom validation to check if values have changed
  useEffect(() => {
    const subscription = form.watch((value, { type }) => {
      if (type === 'change') {
        const hasChanged = Object.keys(value).some(
          (key) =>
            value[key as keyof UserInfoFormValues] !==
            initialValues?.[key as keyof UserInfoFormValues]
        )

        if (!hasChanged) {
          form.setError('root.serverError', {
            type: 'manual',
            message: 'No changes detected',
          })
        } else {
          form.clearErrors('root.serverError')
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, initialValues])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Handle</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your handle"
                  {...field}
                  className="text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Anthropic API Key</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="sk-..."
                  {...field}
                  className="text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
        {form.formState.errors.root?.serverError && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-xs">
              {form.formState.errors.root.serverError.message}
            </AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          className="w-full text-sm"
          disabled={
            !form.formState.isDirty || !!form.formState.errors.root?.serverError
          }
        >
          {submitButtonText}
        </Button>
      </form>
    </Form>
  )
}
