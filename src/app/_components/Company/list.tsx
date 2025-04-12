'use client'

import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import clsx from "clsx"

const companies = [
  {
    name: "TechMada Solutions",
    nif: "123456789",
    stat: "987654321",
    description: "Entreprise spécialisée dans le développement web et les solutions mobiles à Madagascar.",
    logo: "/aztek.jpg"
  },
  {
    name: "AgroMada SARL",
    nif: "321654987",
    stat: "456789123",
    description: "Producteur et exportateur de produits agricoles certifiés bio.",
    logo: "/shopcell.jpg"
  },
  // Ajoute d'autres ici
]

export default function Entreprises() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const width = container.offsetWidth
      const index = Math.round(scrollLeft / width)
      setCurrent(index)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="mb-10">
      <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">
        Entreprises inscrites
      </h2>

      <div
        ref={containerRef}
        className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-2 md:overflow-visible scroll-smooth snap-x md:snap-none snap-mandatory scrollbar-hide"
      >
        {companies.map((company, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-start md:snap-none flex h-36 items-center justify-between rounded-xl shadow-md border border-gray-200 overflow-hidden w-[90vw] sm:w-[80vw] md:w-full max-w-md"
          >
            <div className="mr-2 w-24 h-full rounded-md flex items-center justify-center">
              <Image
                src={company.logo}
                alt={`Logo de ${company.name}`}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="max-w-[70%] p-1 overflow-hidden">
              <h3 className="text-md font-bold text-gray-800 dark:text-white truncate">
                {company.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 truncate">NIF : {company.nif}</p>
              <p className="text-sm text-gray-600 truncate">STAT : {company.stat}</p>
              <p className="mt-2 text-gray-700 text-sm line-clamp-2">
                {company.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 md:hidden">
        {companies.map((_, index) => (
          <span
            key={index}
            className={clsx(
              "h-2 w-2 rounded-full mx-1",
              current === index ? "bg-green-600" : "bg-gray-400"
            )}
          />
        ))}
      </div>
    </section>
  )
}
