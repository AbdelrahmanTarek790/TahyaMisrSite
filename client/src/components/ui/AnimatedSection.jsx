import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const AnimatedSection = ({ 
  children, 
  className = '', 
  animationType = 'fade-in',
  delay = 0,
  ...props 
}) => {
  const [ref, hasAnimated] = useScrollAnimation()

  const getAnimationClass = () => {
    const baseClass = hasAnimated ? 'in-view' : ''
    
    switch (animationType) {
      case 'fade-in':
        return `scroll-fade-in ${baseClass}`
      case 'scale-in':
        return `scroll-scale-in ${baseClass}`
      case 'slide-up':
        return `animate-fade-in-up ${baseClass}`
      case 'slide-down':
        return `animate-fade-in-down ${baseClass}`
      case 'slide-left':
        return `animate-fade-in-left ${baseClass}`
      case 'slide-right':
        return `animate-fade-in-right ${baseClass}`
      default:
        return `scroll-fade-in ${baseClass}`
    }
  }

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  )
}

export default AnimatedSection