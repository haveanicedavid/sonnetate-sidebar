import { LoadingSpinner } from './ui/loading-spinner'

export function LoadingScreen() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-4">
      <LoadingSpinner />
    </div>
  )
}
