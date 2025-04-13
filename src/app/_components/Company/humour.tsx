'use client'

import Image from 'next/image'

export default function BeforeAfter() {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-1/2 h-64 md:h-96 rounded-xl overflow-hidden">
        <Image
          src="assets/humour-before.png"
          alt="Avant - Mal géré son entreprise"
          fill
          className="object-contain w-full h-full"
        />
        <div className="w-full text-center p-2 text-sm md:text-base">
          Avant : Gestion difficile, stressée
        </div>
      </div>
      <div className="w-1/2 h-64 md:h-96 rounded-xl overflow-hidden">
        <Image
          src="assets/humour-after.png"
          alt="Après - Grâce à MGA Follow UP"
          fill
          className="object-contain w-full h-full"
        />
        <div className="w-full text-center p-2 text-sm md:text-base">
          Après : Grâce à MGA Follow UP, tout roule !
        </div>
      </div>
    </div>
  )
}
