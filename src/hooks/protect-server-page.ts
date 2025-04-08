import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function protectPage(redirectTo = '/login') {
  const session = await auth()

  if (!session) {
    redirect(redirectTo)
  }
}
