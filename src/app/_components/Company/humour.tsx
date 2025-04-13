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
          className="object-contain"
        />
        <div className="w-full text-center p-4 text-red-700 bg-red-100 rounded-xl shadow-md text-sm md:text-base font-medium tracking-wide">
          Avant : <span className="italic line-through">Gestion difficile, stressée</span>
        </div>
      </div>
      <div className="w-1/2 h-64 md:h-96 rounded-xl overflow-hidden">
        <Image
          src="assets/humour-after.png"
          alt="Après - Grâce à MGA Follow UP"
          fill
          className="object-contain"
        />
        <div className="w-full text-center p-4 text-white bg-orange-600 rounded-xl shadow-lg text-sm md:text-base font-semibold tracking-wide">
          Après : <span className="italic underline">Grâce à <strong>MGA Follow UP</strong>, tout roule !</span>
        </div>
      </div>
    </div>
  )
}
