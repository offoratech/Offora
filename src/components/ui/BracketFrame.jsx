import { cn } from '../../utils/cn.js'

// Corners spread outward with `translate` (compositor-only), not top/left.
const corner = 'absolute h-6 w-6 border-brand transition-[translate] duration-500 ease-out'

export default function BracketFrame({ children, className, spread = false }) {
  return (
    <div className={cn('group relative', className)}>
      <span
        className={cn(
          corner,
          '-top-2 -left-2 border-l-2 border-t-2',
          spread && 'group-hover:-translate-x-1.5 group-hover:-translate-y-1.5',
        )}
      />
      <span
        className={cn(
          corner,
          '-top-2 -right-2 border-r-2 border-t-2',
          spread && 'group-hover:translate-x-1.5 group-hover:-translate-y-1.5',
        )}
      />
      <span
        className={cn(
          corner,
          '-bottom-2 -left-2 border-b-2 border-l-2',
          spread && 'group-hover:-translate-x-1.5 group-hover:translate-y-1.5',
        )}
      />
      <span
        className={cn(
          corner,
          '-bottom-2 -right-2 border-b-2 border-r-2',
          spread && 'group-hover:translate-x-1.5 group-hover:translate-y-1.5',
        )}
      />
      {children}
    </div>
  )
}
