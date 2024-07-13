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
import { db } from '@/db'

const formSchema = z.object({
  code: z.string().min(1, 'Please enter the code'),
})

type FormValues = z.infer<typeof formSchema>

type MagicCodeFormProps = {
  sentEmail: string
}

export function MagicCodeForm({ sentEmail }: MagicCodeFormProps): JSX.Element {
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code: values.code })
      // Handle successful sign-in here (e.g., redirect to dashboard)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.'
      setError(msg)
    }
  }

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-bold">
        Enter the Magic Code
      </h2>
      <p className="mb-4 text-center text-sm text-gray-600">
        We sent a code to {sentEmail}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Magic Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456..."
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
          <Button type="submit" className="mt-6 w-full text-sm">
            Verify
          </Button>
        </form>
      </Form>
    </>
  )
}
