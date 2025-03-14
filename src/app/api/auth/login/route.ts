import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schéma de validation pour la connexion
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body); // Valider les données

    // Simuler une vérification de connexion
    if (validatedData.email === 'test@example.com' && validatedData.password === 'password123') {
      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Retourner les erreurs de validation
      return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    // Gérer les autres erreurs
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
