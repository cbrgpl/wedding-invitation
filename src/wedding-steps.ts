import weddingStepsSvg from './assets/svgs/wedding-steps.svg?raw';

const selectors = {
  weddingSteps: '.wedding-steps',
  weddingStepsObjects: '#OBJECTS',
  weddingStepsSvgText: 'svg text',
} as const;

const classes = {
  weddingStepsStep: 'wedding-steps-step',
  weddingStepsStepVisible: 'wedding-steps-step-visible',
} as const;

const STEP_REVEAL_DELAY = 260;
const STEP_REVEAL_DURATION = 520;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type WeddingStepsStep = SVGGraphicsElement[];

const getWeddingSteps = (container: Element): WeddingStepsStep[] => {
  const texts = Array.from(container.querySelectorAll<SVGTextElement>(selectors.weddingStepsSvgText));
  const title = texts[0];
  const programTexts = texts.slice(1);
  const objects = container.querySelector<SVGGElement>(selectors.weddingStepsObjects);
  const objectGroups = objects ? Array.from(objects.children).filter((child): child is SVGGElement => child instanceof SVGGElement) : [];
  const iconGroups = objectGroups[1] ? Array.from(objectGroups[1].children).filter((child): child is SVGGElement => child instanceof SVGGElement) : [];
  const steps: WeddingStepsStep[] = title ? [[title]] : [];

  programTexts.forEach((text, index) => {
    steps.push([text, iconGroups[index]].filter((step): step is SVGGraphicsElement => step instanceof SVGGraphicsElement));
  });

  return steps;
};

const renderWeddingSteps = (container: Element) => {
  container.innerHTML = weddingStepsSvg;

  const svg = container.querySelector('svg');

  if(!svg) {
    return [];
  }

  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-hidden', 'true');
  const steps = getWeddingSteps(container);

  steps.flat().forEach((step) => {
    step.classList.add(classes.weddingStepsStep);
  });

  return steps;
};

const revealWeddingSteps = async (steps: WeddingStepsStep[]) => {
  for(const step of steps) {
    if(prefersReducedMotion()) {
      step.forEach((part) => part.classList.add(classes.weddingStepsStepVisible));
    } else {
      step.forEach((part) => {
        part.animate([
          { opacity: 0 },
          { opacity: 1 },
        ], {
          duration: STEP_REVEAL_DURATION,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        });
      });
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, STEP_REVEAL_DELAY);
    });
  }
};

export const setupWeddingSteps = () => {
  const container = document.querySelector(selectors.weddingSteps);

  if(!container) {
    return;
  }

  const steps = renderWeddingSteps(container);

  if(!steps.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if(!entries.some((entry) => entry.isIntersecting)) {
      return;
    }

    observer.disconnect();
    void revealWeddingSteps(steps);
  }, { threshold: 0.35 });

  observer.observe(container);
};
