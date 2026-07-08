import { hidePreloader } from "./preloader";
import { animate, wait } from "./utils";

const TEXT_BLOCK_ID_QUERY = 'whoami'
const MOCK_QUERY = 'mock'
const NO_LETTER_ORNAMENT_QUERY = 'nmor'
const LETTER_ORNAMENT_ACTIVATION_DELAY = 1250;

const selectors = {
  initialStylesheet: 'link[rel="stylesheet"][href$="initial.css"]',
  letter: '.letter',
  letterBody: '.letter-body',
  letterOrnament: '.letter-ornament-bottom',
  page: '.page',
  titleAdj: '.letter-title-adj',
  titleNoun: '.letter-title-noun',
  insertLeadsAnchor: '.letter-lead-anchor',
  preloaderWrapper: '#preloader-wrapper',
} as const;

const classes = {
  lead: 'letter-lead',
  letterOrnamentActive: 'letter-ornament-bottom-active',
  pageVisible: 'page-visible',
} as const;

enum TextBlockId {
  RELATES = 'rlts',
  WIFE_FAMILY = 'wfm',
  FRIENDS = 'wfrs',
  HUSBAND_FAMILY = 'hfm',
  HUSBAND_SISTER = 'hsus',
  KIRILL = 'krl',
  MIWA = 'mw',
  PAKINYA = 'pk',
  AKIM = 'akm',
  DEFAULT = 'dfl'
}

const isTextBlockId = ( v: string ): v is TextBlockId => v === TextBlockId.RELATES ||
v === TextBlockId.WIFE_FAMILY ||
v === TextBlockId.FRIENDS ||
v === TextBlockId.HUSBAND_FAMILY || 
v === TextBlockId.HUSBAND_SISTER ||
v === TextBlockId.KIRILL || 
v === TextBlockId.MIWA || 
v === TextBlockId.PAKINYA || 
v === TextBlockId.AKIM;

type TextBlock = { title: string; description: string[] };

const textBlocks: Record<TextBlockId, TextBlock> = {
  [TextBlockId.RELATES]: {
    title: 'Дорогие родные!',
    description: [
      'Говорят, что семья — это самое большое богатство. Именно поэтому в один из самых важных дней нашей жизни мы бы хотели видеть рядом вас.',
      'Пусть этот день станет ещё одним счастливым воспоминанием, которое мы создадим вместе.',
      'С любовью ждём встречи!'
    ]
  },
  [TextBlockId.WIFE_FAMILY]: {
    title: 'Любимые родители!',
    description: [
      'Нет людей ближе и роднее для нас, чем вы. Именно вы научили нас любить, заботиться друг о друге и ценить семью.',
      'В день нашей свадьбы мы особенно хотим получить ваше благословение — как символ любви, доверия и доброго напутствия на нашем совместном пути.',
      'Спасибо за всё, что вы сделали для нас. Мы будем счастливы разделить этот день вместе с вами и начать новую главу нашей жизни с вашего благословения и родительской любви. ❤️'
    ]
  },
  [TextBlockId.HUSBAND_FAMILY]: {
    title: 'Дорогая Мамуля',
    description: [
      'C большой радостью приглашаем тебя на нашу свадьбу. В этот особенный день нам очень важно видеть рядом самых близких людей, и твоё присутствие будет для нас особенно дорогим.',
      'Спасибо тебе за любовь, заботу и поддержку, которые всегда были рядом с нами. Мы будем счастливы разделить с тобой этот важный момент и начать новую семейную главу нашей жизни с твоего благословении. ❤️'
    ]
  },
  [TextBlockId.HUSBAND_SISTER]: {
    title: 'Дорогая Сестра',
    description: [
      'Хочу пригласить тебя на нашу свадьбу.',
      'Мне очень жаль, что ты не сможешь приехать лично, но мы обязательно постараемся сделать всё возможное, чтобы ты тоже почувствовала себя частью этого важного для нас дня.',
      'Ты очень дорога мне, и даже на расстоянии твоё присутствие, поддержка и тёплые слова будут для нас особенно важны.',
      'Будем очень рады разделить с тобой этот момент хотя бы онлайн и почувствовать, что ты рядом с нами.'
    ]
  },
  [TextBlockId.KIRILL]: {
    title: 'Увожаемый кирил',
    description: [
      'кирил, мы рады пригласить тебя на наш свадебный день. Хотим пригласить тебя, кирил, на это торжество.',
      'Будешь челом со стороны жениха, кирил. И будешь счастлив, если ты приедешь, а если нет, то не будешь, кирил!'
    ]
  },
  [TextBlockId.MIWA]: {
    title: 'Увожаемый МишаГй',
    description: [
      'Рады пригласить тебя на наш свадебный день. И хотим пригласить тебя на это торжество.',
      'Будем счастливы, если ты разделишь этот момент с нами. После этого сможем сыграть каточку в карты.'
    ]
  },
  [TextBlockId.PAKINYA]: {
    title: 'Увожаемая Пакиня',
    description: [
      "Мы готовы пригласить тебя на наш свадебный день. Мы хотим пригласить тебя на это торжество! (Шаурмы не будет)",
      "Будем счастливы, если ТЫ! разделишь с нами радость, улыбки, волнение и начало новой главы нашей жизни.",
      '(Аким тоже будет) (ты не чел жениха, чел кирилл)'
    ]
  },
  [TextBlockId.FRIENDS]: {
    title: 'Штош друзья',
    description: [
      "Кажется, всё зашло слишком далеко… 😄",
      "Мы женимся!",
      "Очень хотим провести этот день вместе с вами — смеяться, танцевать, обниматься и создавать воспоминания, которые ещё много лет будем вспоминать с улыбкой.",
      "Берите хорошее настроение — остальное мы уже подготовили. ❤️",
      "Встречаемся 22 августа около 16:00 по адресу Новосибирская область, ​с. Ленинское, Улица Мичурина, 60а"
    ]
  },
  [TextBlockId.AKIM]: {
    title: "Дорогой Акым",
    description: [
      "С огромной радостью приглашаем тебя присоединиться к нашему торжеству(Миша будет), чтобы провести этот торжественный момент вместе.",
      "Будем счастливы, если ты, MrАкимАбдулаев, разделишь с нами радость, улыбки, волнение и начало новой главы нашей жизни. (Колды не будет).",
    ]
  },
  [TextBlockId.DEFAULT]: {
    title: "Дорогие гости",
    description: [
      "С огромной радостью приглашаем вас на наш свадебный день. Нам очень хочется провести этот особенный момент рядом с самыми близкими людьми.",
      "Будем счастливы, если вы разделите с нами радость, улыбки, волнение и начало новой главы нашей жизни.",
    ]
  },
  
}

const parseTextBlockId = () => {
  const params = new URLSearchParams(window.location.search);
  const textBlockId = params.get(TEXT_BLOCK_ID_QUERY) ?? ''

  const safeTextBlockId = isTextBlockId(textBlockId) ? textBlockId : TextBlockId.DEFAULT
  return safeTextBlockId
}

const isMockMode = () => {
  const params = new URLSearchParams(window.location.search);

  return params.has(MOCK_QUERY)
}

const isLetterOrnamentDisabled = () => {
  const params = new URLSearchParams(window.location.search);

  return params.has(NO_LETTER_ORNAMENT_QUERY)
}

const getTitle = ( textBlock: TextBlock ) => {
  const [ titleAdj, ...titleNounArr ] = textBlock.title.split(' ')
  const titleNoun = titleNounArr.map(noun => noun[0].toUpperCase() + noun.slice(1)).join('')

  return { titleAdj, titleNoun }
}

const createLeadParagraph = ( text: string ) => {
  const paragraphEl = document.createElement('p')
  
  paragraphEl.textContent = text
  paragraphEl.classList.add(classes.lead)
  
  return paragraphEl
}

const prepareLetterForWhois = () => {
  const textBlockId = parseTextBlockId()
  console.log(textBlockId)
  const textBlock = textBlocks[textBlockId];

  const { titleAdj, titleNoun } = getTitle(textBlock)

  const titleAdjEl = document.querySelector(selectors.titleAdj)
  const titleNounEl = document.querySelector(selectors.titleNoun)
  
  const leadFragment = document.createDocumentFragment();
  leadFragment.append(
    ...textBlock.description.map(createLeadParagraph)
  );

  const insertLeadsAnchorEl = document.querySelector(selectors.insertLeadsAnchor);

  if(titleAdjEl) {
    titleAdjEl.textContent = titleAdj
  }

  if(titleNounEl) {
    titleNounEl.textContent = titleNoun
  }

  if(insertLeadsAnchorEl) {
    insertLeadsAnchorEl.before(leadFragment)
  }
}

const waitForInitialStylesheet = () => {
  const initialStylesheet = document.querySelector<HTMLLinkElement>(selectors.initialStylesheet)

  if(!initialStylesheet || initialStylesheet.sheet) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    initialStylesheet.addEventListener('load', () => resolve(), { once: true })
    initialStylesheet.addEventListener('error', () => resolve(), { once: true })
  })
}

const waitForFonts = () => document.fonts.ready.then(() => undefined)

const waitForInitialAssets = () => Promise.all([
  waitForInitialStylesheet(),
  waitForFonts(),
]).then(() => undefined)

const showPage = async () => {
  const page = document.querySelector(selectors.page) as HTMLElement | null

  if(!page) {
    return
  }

  page.classList.add(classes.pageVisible)
  await animate(page, 'fade', 'in')
}

const showPageInstantly = () => {
  const page = document.querySelector(selectors.page) as HTMLElement | null

  if(!page) {
    return
  }

  page.classList.add(classes.pageVisible)
  page.style.opacity = '1'
}


let letterOrnamentActivated = false
const handleLetterOrnamentClick = (event: MouseEvent) => {
  const target = event.currentTarget

  if(!(target instanceof SVGElement)) {
    return
  }
  
  if(letterOrnamentActivated) { return }

  letterOrnamentActivated = true
  target.classList.add(classes.letterOrnamentActive)

  setTimeout( async () => {
    const letterBody = (document.querySelector(selectors.letterBody) ?? document.createElement('p')) as HTMLElement
    const bodyElDisappearanceDelay = 150
    
    const animationPromises: Promise<void>[] = []
    for(const el of letterBody.children) {
      const animation = animate(el as HTMLElement, 'fade', 'out')
      animationPromises.push(animation)
      
      await wait(bodyElDisappearanceDelay)
    }
   
    await Promise.all(animationPromises)
    await wait( 100 )

    const letter = (document.querySelector(selectors.letter) ?? document.createElement('p')) as HTMLElement
    await animate(letter, 'fade-y', 'out')
    const app = document.querySelector('#app')
    if(app) {
      app.classList.remove('letter-stage')
    }
    letter.style.display = 'none'
    window.scrollTo(0, 0)
    await showPage()
  }, LETTER_ORNAMENT_ACTIVATION_DELAY);
}

const addLetterOrnamentHandler = () => {
  const letterOrnament = document.querySelector(selectors.letterOrnament) as HTMLElement
  if(letterOrnament && !isLetterOrnamentDisabled()) {
    letterOrnament.addEventListener('click', handleLetterOrnamentClick)
  }
}

const showLetter = async () => {
  const letter = (document.querySelector(selectors.letter) ?? document.createElement('p')) as HTMLElement 
  animate(letter, 'fade-x', 'in')
}

const closePreloaderInstantly = () => {
  const preloaderWrapper = document.querySelector(selectors.preloaderWrapper) as HTMLElement | null

  if(!preloaderWrapper) {
    return
  }

  preloaderWrapper.style.display = 'none'
}

const closeLetterInstantly = () => {
  const letter = document.querySelector(selectors.letter) as HTMLElement | null

  if(!letter) {
    return
  }

  letter.style.display = 'none'
}


const main = async () => {
  prepareLetterForWhois()
  addLetterOrnamentHandler()
  await waitForInitialAssets()
  await hidePreloader()
  showLetter()
}

const mockMain = () => {
  prepareLetterForWhois()
  closePreloaderInstantly()
  closeLetterInstantly()
  window.scrollTo(0, 0)
  const app = document.querySelector('#app')
  if(app) {
    app.classList.remove('letter-stage')
  }
  showPageInstantly()
}

if(isMockMode()) {
  mockMain()
} else {
  main()
}
