import { animate, wait } from "./utils";

const MINIMAL_PRELOADER_VISIBILITY_TIME = 3500; 
const scriptRunTime = Date.now();

export const hidePreloader = async () => {
  const passedTime = Date.now() - scriptRunTime
  const remainingTime = MINIMAL_PRELOADER_VISIBILITY_TIME - passedTime

  await wait(remainingTime)

  const preloaderWrapperEl = document.querySelector('#preloader-wrapper');

  if(!preloaderWrapperEl) {
    return
  }

  const preloaderEl = (document.querySelector('#preloader') ?? document.createElement('p')) as HTMLElement;
  const preloaderTitle = (document.querySelector('#preloader-title') ?? document.createElement('p')) as HTMLElement

  const promises = [];
  
  promises.push(
    animate(preloaderTitle, 'fade-y', 'out')
  )

  await wait(150)

  promises.push(
    animate(preloaderEl, 'fade', 'out')
  )
  
  await Promise.all(promises)
  if(preloaderWrapperEl instanceof HTMLElement) {
    preloaderWrapperEl.style.display = 'none'
  }
}
