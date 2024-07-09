import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
import { createUser } from '@/db/actions'

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

type FormValues = z.infer<typeof formSchema>

export function UserInfo({ authId }: { authId: string }) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: '',
      apiKey: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      const { apiKey, handle } = values
      createUser({ handle, apiKey, id: authId })
    } catch (err) {
      setError((err as Error).message || 'An error occurred. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 text-center">
          Finish setting up your account
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full text-sm">
              Save Info
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
