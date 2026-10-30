import { useLayoutEffect, useRef } from 'react'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource/space-grotesk/700.css'
import '@fontsource-variable/unbounded'
import './offora-home.css'
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK, EASE } from './gsap'
import { LabHero } from './LabHero'
import { Statement } from './Statement'
import { Services } from './Services'
import { Reel } from './Reel'
import { Work } from './Work'
import { Process } from './Process'
import { ClientWall } from './ClientWall'
import { Voices } from './Voices'
import { Contact } from './Contact'

/**
 * Offora Tech home page. Self-contained: every style is scoped under `.offora-home`.
 *
 * Story order: enter the lab (hero) → why one team → what we do → see it
 * (reel, work) → how we work → who trusts us → what they say → get in touch.
 */
export default function OfforaHome() {
  const root = useRef<HTMLDivElement>(null)

  // Always open at the top: the hero is a scroll-driven sequence, and a
  // browser-restored scroll position would drop visitors mid-flight.
  useLayoutEffect(() => {
    if (!('scrollRestoration' in history)) return
    const prev = history.scrollRestoration
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    return () => {
      history.scrollRestoration = prev
    }
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Headlines: masked lines, words rising in sequence. Re-splits on resize.
        const splits = gsap.utils.toArray<HTMLElement>('[data-split]').map((el) =>
          SplitText.create(el, {
            type: 'lines,words',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 110,
                duration: 1.2,
                ease: EASE,
                stagger: 0.035,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          }),
        )

        // Everything marked data-reveal fades up in batches.
        const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]')
        gsap.set(targets, { autoAlpha: 0, y: 32 })
        const batch = ScrollTrigger.batch(targets, {
          start: 'top 90%',
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.08, overwrite: true }),
        })

        // Section labels: brackets open outward, the number pops, the rule draws out.
        gsap.utils.toArray<HTMLElement>('.eyebrow').forEach((el) => {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true }, defaults: { ease: EASE } })
            .from(el.querySelector('.eyebrow__bracket--l'), { x: 14, autoAlpha: 0, duration: 0.9 }, 0.1)
            .from(el.querySelector('.eyebrow__bracket--r'), { x: -14, autoAlpha: 0, duration: 0.9 }, 0.1)
            .from(el.querySelector('.eyebrow__num'), { scale: 0.6, autoAlpha: 0, duration: 0.7 }, 0.25)
            .from(el.querySelectorAll('.eyebrow__rule'), { scaleX: 0, duration: 1.2 }, 0.35)
        })

        return () => {
          splits.forEach((s) => s.revert())
          batch.forEach((t) => t.kill())
        }
      })

      // Fonts and media shift layout after first paint; re-measure scroll positions.
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      const onLoad = () => ScrollTrigger.refresh()
      window.addEventListener('load', onLoad, { once: true })
      return () => {
        window.removeEventListener('load', onLoad)
        mm.revert()
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="offora-home">
      <LabHero />
      {/* The page rises over the lab's last frame on a rounded panel. */}
      <div className="home-panel">
        <Statement />
        <Services />
        <Reel />
        <Work />
        <Process />
        <ClientWall />
        <Voices />
        <Contact />
      </div>
    </div>
  )
}
