import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
})

type FormValues = z.infer<typeof formSchema>

export function UserHandle() {
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      // Simulate handle creation
      // Replace this with actual database logic later
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Assume redirect happens automatically after successful creation
      console.log('Handle created:', values.handle)
      // Redirect logic would go here
    } catch (err) {
      setError((err as Error).message || 'An error occurred. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-sm p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Your Handle
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
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full text-sm mt-6">
              Create Handle
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}
