import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, EASE } from './gsap'
import { contactEmail } from './content'
import { Eyebrow } from './Eyebrow'
import { RollText } from './RollText'
import { Arrow } from './Arrow'

/** Closing contact block: one oversized rolling link to email the founders. */
export function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('.contact__big .roll__char', {
          yPercent: 110,
          duration: 1.2,
          ease: EASE,
          stagger: 0.02,
          scrollTrigger: { trigger: '.contact__big', start: 'top 85%', once: true },
        })
        gsap.from('.contact__arrow', {
          scale: 0,
          rotate: -90,
          duration: 1,
          ease: EASE,
          delay: 0.4,
          scrollTrigger: { trigger: '.contact__big', start: 'top 85%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section contact" id="oh-contact" aria-labelledby="oh-contact-title">
      <div className="wrap">
        <div className="contact__top">
          <Eyebrow index={7} align="center">Contact</Eyebrow>
          <p id="oh-contact-title" className="contact__kicker" data-reveal>
            Got a business that deserves to be found?
          </p>
          <a className="contact__big roll-host" href={`mailto:${contactEmail}`}>
            <RollText text="Let’s build it together" />
            <span className="contact__arrow" aria-hidden="true">
              <Arrow direction="up-right" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
