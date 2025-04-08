import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function useProtectPage(redirectTo = '/login') {
  const session = await auth()

  if (!session) {
    redirect(redirectTo)
  }
}
