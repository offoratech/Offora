// Copy and data for the Offora Tech home page.
// Client logos are re-exported from the project's existing data source
// (src/data/clients.js) rather than duplicated here, so this page and
// TrustedBy/Testimonials elsewhere on the site can never drift apart.
import { clients } from '../data/clients.js'
import offoraReel from '../assets/reels/DZ96-7xzaEK_reel.mp4'
import offoraPoster from '../assets/reels/thumbnails/Offora.jpg'
import beetzoReel from '../assets/reels/Beetzo.mp4'
import beetzoPoster from '../assets/reels/thumbnails/Beetzo.jpg'
import beetzoPromo from '../assets/reels/Beetzo-2.mp4'
import beetzoPromoPoster from '../assets/reels/thumbnails/Beetzo-2.jpg'
import narpaviReel from '../assets/reels/Narpavi.mp4'
import narpaviPoster from '../assets/reels/thumbnails/Narpavi.jpg'
import lifeOfServer from '../assets/reels/Life-of-Server-Aasife.mp4'
import lifeOfServerPoster from '../assets/reels/thumbnails/Life-of-Server-Aasife.jpg'
import aasifeVeg from '../assets/reels/Aasife-Veg.mp4'
import aasifeVegPoster from '../assets/reels/thumbnails/Aasife-Veg.jpg'
import aasifeTestimonial from '../assets/reels/Aasife-Testimonials.mp4'
import aasifeTestimonialPoster from '../assets/reels/thumbnails/Aasife-Testimonials.jpg'
import podcastPromo from '../assets/reels/Podcast-Promo.mp4'
import podcastPromoPoster from '../assets/reels/thumbnails/Podcast-Promo.jpg'

export { clients }

export const contactEmail = 'ceo@offoratech.com'

/** The three vertical clips inside the showreel card. Same files as the Gallery page. */
export const reels = [
  { title: 'Aasife Biriyani - Life of a Server', video: lifeOfServer, poster: lifeOfServerPoster },
  { title: 'Offora Tech - Reel', video: offoraReel, poster: offoraPoster },
  { title: 'Beetzo - Reel', video: beetzoReel, poster: beetzoPoster },
]

/** Selected work cards. Titles and categories mirror the Gallery page's own labels. */
export const work = [
  { title: 'Life of a Server', client: 'Aasife Biriyani', tags: 'Video shoot • Edit • Reels', video: lifeOfServer, poster: lifeOfServerPoster },
  { title: 'Campaign Promotion', client: 'Beetzo', tags: 'Content • Video edit • Social', video: beetzoPromo, poster: beetzoPromoPoster },
  { title: 'Brand Reel', client: 'Narpavi', tags: 'Branding • Reels', video: narpaviReel, poster: narpaviPoster },
  { title: 'Customer Testimonial', client: 'Aasife Biriyani', tags: 'Video shoot • Testimonial', video: aasifeTestimonial, poster: aasifeTestimonialPoster },
  { title: 'Veg Special', client: 'Aasife Biriyani', tags: 'Content • Reels', video: aasifeVeg, poster: aasifeVegPoster },
  { title: 'Promo Edit', client: 'Podcast', tags: 'Video edit', video: podcastPromo, poster: podcastPromoPoster },
]

export const testimonials = [
  {
    quote: 'Offora handled the build and the marketing together, so we never had to explain the same thing twice to two different teams.',
    org: 'Beetzo',
    role: 'Founder & CEO',
  },
  {
    quote: 'They actually took the time to understand how our business runs before touching anything. That showed in the final result.',
    org: 'Aasife Biriyani',
    role: 'Managing Director',
  },
  {
    quote: 'Straightforward to work with, no hand-offs, no lost context. Questions got answered by someone who actually knew the project.',
    org: 'Global Mission Hospital',
    role: 'Executive Director',
  },
  {
    quote: 'Fast turnaround and the site still looks and works the way we wanted six months later, not just on launch day.',
    org: 'Hidude',
    role: 'Founder & CEO',
  },
  {
    quote: 'One team for the website and the outreach meant fewer meetings and things actually got done on time.',
    org: 'St. Michael College of Engineering and Technology',
    role: 'Principal',
  },
]
