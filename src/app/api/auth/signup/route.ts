import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schéma de validation pour l'inscription
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body); // Valider les données

    // Simuler la création d'un utilisateur
    const user = {
      id: 1,
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password, // En production, hash le mot de passe
    };

    return NextResponse.json({ message: 'Signup successful', user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Retourner les erreurs de validation
      return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    // Gérer les autres erreurs
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
