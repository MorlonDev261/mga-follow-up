'use client'

import Image from 'next/image'

export default function BeforeAfter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-md">
        <Image
          src="assets/humour-before-dark.png"
          alt="Avant - Mal géré son entreprise"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-center p-2 text-sm md:text-base">
          Avant : Gestion difficile, stressée
        </div>
      </div>
      <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-md">
        <Image
          src="assets/humour-after-dark.png"
          alt="Après - Grâce à MGA Follow UP"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 w-full bg-green-600 bg-opacity-80 text-white text-center p-2 text-sm md:text-base">
          Après : Grâce à MGA Follow UP, tout roule !
        </div>
      </div>
    </div>
  )
}
