// app/login/page.tsx

'use client'; // Indique que ce composant est un Client Component

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './login.module.css';

// Schéma de validation avec Zod
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type SignupFormInputs = z.infer<typeof signupSchema>;

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs | SignupFormInputs>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    reset(); // Réinitialise le formulaire lors du basculement
  };

  const onSubmit: SubmitHandler<LoginFormInputs | SignupFormInputs> = async (data) => {
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Affiche un message de succès
      } else {
        alert(result.message); // Affiche un message d'erreur
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}>
        <Image
          src="/background.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.infoSection}>
          <h1>Welcome to Our Site</h1>
          <p>Join us and explore the world of possibilities.</p>
        </div>
        <div className={styles.formSection}>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  {...register('name')}
                />
                {errors.name && <span className={styles.error}>{errors.name.message}</span>}
              </div>
            )}
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                {...register('email')}
              />
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                {...register('password')}
              />
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <p>
            {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
            <button onClick={toggleForm} className={styles.toggleButton}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
