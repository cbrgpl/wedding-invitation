type AnimationVariant = 'fade' | 'fade-x' | 'fade-y';
type AnimationMode = 'in' | 'out';
type AnimationKeyframes = [Keyframe, Keyframe];

const ANIMATION_DURATION = 500;
const ANIMATION_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const ANIMATION_OFFSET = 24;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getOpacityKeyframes = (mode: AnimationMode): AnimationKeyframes => {
  const isIn = mode === 'in';

  return [
    { opacity: isIn ? 0 : 1 },
    { opacity: isIn ? 1 : 0 },
  ];
};

const fade = (mode: AnimationMode): AnimationKeyframes => getOpacityKeyframes(mode);

const fadeX = (mode: AnimationMode): AnimationKeyframes => {
  const isIn = mode === 'in';
  const [from, to] = getOpacityKeyframes(mode);

  return [
    {
      ...from,
      transform: isIn ? `translateX(${ANIMATION_OFFSET}px)` : 'translateX(0)',
    },
    {
      ...to,
      transform: isIn ? 'translateX(0)' : `translateX(${ANIMATION_OFFSET}px)`,
    },
  ];
};

const fadeY = (mode: AnimationMode): AnimationKeyframes => {
  const isIn = mode === 'in';
  const [from, to] = getOpacityKeyframes(mode);

  return [
    {
      ...from,
      transform: isIn ? `translateY(${ANIMATION_OFFSET}px)` : 'translateY(0)',
    },
    {
      ...to,
      transform: isIn ? 'translateY(0)' : `translateY(${ANIMATION_OFFSET}px)`,
    },
  ];
};

const getKeyframes = (animation: AnimationVariant, mode: AnimationMode): AnimationKeyframes => {
  switch (animation) {
    case 'fade':
      return fade(mode);
    case 'fade-x':
      return fadeX(mode);
    case 'fade-y':
      return fadeY(mode);
  }
};

export const animate = (el: HTMLElement, animation: AnimationVariant, mode: AnimationMode): Promise<void> => {
  if (prefersReducedMotion()) {
    el.style.opacity = mode === 'in' ? '1' : '0';
    el.style.transform = '';

    return Promise.resolve();
  }

  const currentAnimation = el.animate(getKeyframes(animation, mode), {
    duration: ANIMATION_DURATION,
    easing: ANIMATION_EASING,
    fill: 'both',
  });

  return currentAnimation.finished.then(() => undefined);
};

export const wait = ( time: number ) => {
  return new Promise<void>( resolve => {
    setTimeout(() => {
      resolve()
    }, time);
  } )
}
