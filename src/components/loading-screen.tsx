import { LoadingSpinner } from './ui/loading-spinner'

export function LoadingScreen() {
  return (
    <div className="h-full w-full flex justify-center items-center bg-background p-4">
      <LoadingSpinner />
    </div>
  )
}
