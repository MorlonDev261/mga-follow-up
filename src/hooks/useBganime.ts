import { useEffect, useRef } from 'react'

interface AnimationConfig {
  imagePaths: string[]
  minSize?: number
  maxSize?: number
  speed?: { min: number; max: number }
  maxActive?: number
  spawnInterval?: { min: number; max: number }
}

export function useBackgroundAnimation(
  containerClass: string,
  {
    imagePaths,
    minSize = 30,
    maxSize = 180,
    speed = { min: 50, max: 300 },
    maxActive = 80,
    spawnInterval = { min: 20, max: 150 }
  }: AnimationConfig
) {
  const poolRef = useRef<HTMLImageElement[]>([])
  const activeCountRef = useRef(0)
  const preloadedRef = useRef(false)

  useEffect(() => {
    const preloadImages = async () => {
      if (preloadedRef.current) return
      await Promise.all(imagePaths.map(src => 
        new Promise((resolve, reject) => {
          const img = new Image()
          img.src = src
          img.onload = resolve
          img.onerror = reject
        })
      ))
      preloadedRef.current = true
    }
    preloadImages()
  }, [imagePaths])

  useEffect(() => {
    const container = document.querySelector(`.${containerClass}`)
    if (!container) return

    let animationFrame: number

    const createParticle = () => {
      if (!container || activeCountRef.current >= maxActive) return

      const img = poolRef.current.pop() || new Image()
      img.className = 'absolute pointer-events-none will-change-transform'
      
      // Configuration aléatoire
      const size = Math.random() * (maxSize - minSize) + minSize
      const direction = Math.random() * Math.PI * 2
      const speedVal = Math.random() * (speed.max - speed.min) + speed.min
      const duration = Math.random() * 3000 + 2000

      // Position initiale
      const startX = Math.random() * container.clientWidth
      const startY = Math.random() * container.clientHeight

      // Animation
      img.style.width = `${size}px`
      img.style.opacity = '0.8'
      img.src = imagePaths[Math.floor(Math.random() * imagePaths.length)]

      const animation = img.animate([
        { transform: `translate(${startX}px, ${startY}px) scale(0.5)` },
        { 
          transform: `translate(${startX + Math.cos(direction) * speedVal * 2}px, 
                    ${startY + Math.sin(direction) * speedVal * 2}px) scale(2)`,
          opacity: '0'
        }
      ], { duration, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' })

      activeCountRef.current++
      container.appendChild(img)

      animation.onfinish = () => {
        img.remove()
        poolRef.current.push(img)
        activeCountRef.current--
      }
    }

    const spawnParticles = () => {
      const count = Math.floor(Math.random() * 5) + 3
      for (let i = 0; i < count; i++) {
        setTimeout(createParticle, Math.random() * spawnInterval.max)
      }
      animationFrame = requestAnimationFrame(spawnParticles)
    }

    spawnParticles()

    return () => {
      cancelAnimationFrame(animationFrame)
      container.childNodes.forEach(node => node.remove())
      poolRef.current = []
    }
  }, [containerClass, imagePaths, minSize, maxSize, speed, maxActive, spawnInterval])
}
