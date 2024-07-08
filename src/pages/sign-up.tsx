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
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

const formSchema = z
  .object({
    handle: z.string().min(1, 'Handle is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof formSchema>

export function SignUpPage(): JSX.Element {
  const [error, setError] = useState<string | null>(null)
  const [handleError, setHandleError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    setHandleError(null)

    const isTaken = await checkIfHandleIsTaken(values.handle)

    if (isTaken) {
      setHandleError('This handle is already taken')
      return
    }

    try {
      await createAccount(values)
      console.log('Sign-up successful', values)
    } catch (err) {
      setError('An error occurred during sign-up. Please try again.')
    }
  }

  const checkIfHandleIsTaken = async (handle: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return handle.toLowerCase() === 'takenhandle'
  }

  const createAccount = async (values: FormValues): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
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
                      placeholder="Choose a handle"
                      {...field}
                      className="text-sm"
                    />
                  </FormControl>
                  {handleError && (
                    <p className="text-xs text-red-500 mt-1">{handleError}</p>
                  )}
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Choose a password"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
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
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  )
}
