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
  email: z.string().email('Please enter a valid email address'),
})

type FormValues = z.infer<typeof formSchema>

type EmailFormProps = {
  setSentEmail: (email: string) => void
}

export function EmailForm({ setSentEmail }: EmailFormProps): JSX.Element {
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      await db.auth.sendMagicCode({ email: values.email })
      setSentEmail(values.email)
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
      <h2 className="text-2xl font-bold text-center mb-6">Let's log you in!</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
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
          <Button type="submit" className="w-full text-sm mt-6">
            Send Code
          </Button>
        </form>
      </Form>
    </>
  )
}
