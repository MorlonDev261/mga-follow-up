'use client'

import Image from 'next/image'

export default function BeforeAfter() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      
      {/* Avant */}
      <div className="w-1/2 h-64 md:h-96 rounded-xl overflow-hidden relative shadow-md">
        <Image
          src="/assets/humour-before.png"
          alt="Avant - Mal géré son entreprise"
          fill
          className="object-contain"
        />
        <div className="absolute bottom-0 w-full bg-red-700 bg-opacity-80 text-white text-center p-2 text-sm md:text-base font-medium tracking-wide">
          Avant : <span className="italic line-through">Gestion difficile, stressée</span>
        </div>
      </div>

      {/* Après */}
      <div className="w-1/2 h-64 md:h-96 rounded-xl overflow-hidden relative shadow-md">
        <Image
          src="/assets/humour-after.png"
          alt="Après - Grâce à MGA Follow UP"
          fill
          className="object-contain"
        />
        <div className="absolute bottom-0 w-full bg-green-600 bg-opacity-80 text-white text-center p-2 text-sm md:text-base font-semibold tracking-wide">
          Après : <span className="italic">Grâce à <strong>MGA Follow UP</strong>, tout roule !</span>
        </div>
      </div>

    </div>
  )
}
