/**
 * TEXTS, ENGLISH.
 * Tip: a word between *asterisks* is shown in violet (accent).
 * Prices and hours are NOT here: see src/config/site.ts.
 * Same keys as fr.ts.
 */
import type { Content } from './fr';

export const en: Content = {
  lang: 'en',
  htmlLang: 'en',
  locale: 'en_GB',

  meta: {
    title: 'Binta Kande, automation, AI agents and digital marketing',
    description:
      'I design automations and AI agents for businesses, and set up their digital marketing: ads, webinars, social media.',
  },

  nav: {
    home: 'Home',
    marketing: 'Marketing & content',
    automations: 'Automation & AI',
    products: 'Digital products',
    offers: 'Pricing',
    journey: 'Journey',
    faq: 'FAQ',
    sub: {
      content: 'Social media content',
      webinars: 'Webinars',
      agents: 'AI agents',
      systems: 'Systems and internal tools',
      diagnostic: 'AI diagnosis',
      prompt: 'Master prompt',
    },
    more: 'See details',
    back: 'Back',
    menu: 'Menu',
    close: 'Close',
    skip: 'Skip to content',
  },

  cta: {
    book: 'Book an audit',
    message: 'Send a message',
  },

  switchLang: { label: 'FR', title: 'Lire en français' },

  home: {
    hero: {
      eyebrow: 'Automation, AI agents and digital marketing',
      title: 'Automation and marketing that *actually* run.',
      sub: 'I build AI agents and automations for businesses, and set up their digital marketing: ads, webinars, social media. Systems in production, not demos.',
      credential: 'MSc in AI & Data',
      videoLabel: 'Motion design video',
      videoPending: 'My video goes here',
      soundOn: 'Sound on',
      soundOff: 'Turn sound on',
    },
    skills: [
      'AI agents',
      'Process automation',
      'Digital marketing',
      'Social media management',
      'Meta ads',
      'Webinars',
      'WhatsApp automations',
      'Landing pages',
      'AI assistants on your documents',
      'Internal platforms',
      'Data reporting',
      'Chief of Staff',
    ],
    toolsTitle: 'What I use every day',

    beforeAfter: {
      kicker: 'What changes',
      title: 'The same Monday morning, *before* and after.',
      beforeLabel: 'Before',
      afterLabel: 'After',
      before: [
        'A request lands in an inbox',
        'It gets copied into 3 tools',
        'Chasing, forgetting, finding again',
        'The report goes out Thursday, by hand',
      ],
      after: [
        'A request lands',
        'Automation routes and classifies it',
        'The AI agent reads, drafts, decides',
        'Notion, HubSpot and Calendar updated, report is automatic',
      ],
      caption: 'Less copy-paste, more time for what actually needs a person.',
    },

    platform: {
      kicker: 'Proof, in production',
      title: 'I built *my own* platform. It runs every day.',
      text: "Projects, messaging, a to-do synced with Notion, OKRs, onboarding and offboarding, Google Calendar, and an AI assistant that knows the company's documents. Designed and built solo, encrypted, bilingual.",
      modules: ['Projects', 'Messaging', 'To-do · Notion', 'OKR', 'Onboarding & exits', 'Calendar', 'AI assistant'],
      chat: {
        title: 'AI assistant',
        q: 'What is the procedure when someone leaves the company?',
        a: '3 steps: remove access on the last day, collect equipment, then run the exit interview. I can create the tasks in the to-do right now.',
        src: 'Sources: Offboarding procedure v3 · IT policy',
        lock: 'Encrypted AES-256-GCM',
      },
    },

    paths: {
      kicker: 'What are you looking for?',
      title: '3 ways to *work* together.',
      from: 'from',
      items: [
        {
          slug: 'marketing',
          name: 'Marketing & content',
          line: 'Content for your social media, created and published for you. Webinars too.',
          price: 'marketing',
        },
        {
          slug: 'automations',
          name: 'Automation & AI',
          line: 'Fewer repetitive tasks, AI agents that know your business.',
          price: 'agent',
        },
        {
          slug: 'products',
          name: 'Digital products',
          line: 'An AI diagnosis of your business and a tailored master prompt, to buy online.',
          price: 'diagnostic',
        },
      ],
    },

    how: {
      kicker: 'How it works',
      title: 'Simple, from the first click to delivery.',
      steps: [
        { t: 'You choose', d: 'A product to buy, or a 30-minute conversation.' },
        { t: 'I frame it with you', d: 'A form or a call, to really understand your need.' },
        { t: 'I deliver', d: 'You get the result, and we decide what comes next if you want to.' },
      ],
    },

    who: {
      kicker: 'Who I am',
      title: 'Binta Kande, *Chief of Staff* and freelancer.',
      text: 'I run operations at Proplyd Productions and WLFG Consulting. Before that, I was a social media manager and a digital marketing manager. My MSc in AI did the rest: I build the tools I sell myself.',
      link: 'Read my journey',
      photoAlt: 'Smiling portrait of Binta Kande',
    },

    offersTitle: 'A simple ladder, from first step to full system',
    offersLink: 'See the services in detail',

    lab: {
      kicker: 'In the lab',
      title: '3 projects *in progress*.',
      sub: "I'm building them in parallel. Leave your email and I'll let you know at launch. No newsletter, just the announcement.",
      items: [
        { name: 'An automation SaaS', state: 'Building', progress: 62 },
        { name: 'Ready-to-install automations', state: 'Packaging', progress: 40 },
        { name: 'Content creation', state: 'Producing', progress: 25 },
      ],
      inProgress: 'In progress',
      placeholder: 'you@email.com',
      submit: 'Notify me',
      label: 'Your email',
      ok: "Noted. A confirmation email is on its way.",
      err: "Couldn't save your email right now. Please try again shortly.",
      invalid: 'That email address looks wrong.',
      sending: 'Sending…',
    },

    finalTitle: 'Tell me what you are *looking for*.',
    finalText: '30 minutes to map out your need: content, an automation or an AI agent.',
  },

  automations: {
    hero: {
      kicker: 'Automation & AI',
      title: 'I take the *repetitive* work off your team.',
      sub: 'Custom automations, AI agents plugged into your tools and documents, custom internal tools. This is my core craft.',
    },
    overview: {
      kicker: 'Two services',
      title: 'An agent, or a complete *system*.',
      items: [
        {
          name: 'AI agents',
          line: 'An assistant that knows your documents, or an agent that does one precise task for you.',
          slug: 'automations/agents',
        },
        {
          name: 'Systems and internal tools',
          line: 'A custom platform that talks to your tools, to go from manual to automatic.',
          slug: 'automations/systems',
        },
      ],
    },
    flow: {
      kicker: 'A concrete example',
      title: 'A lead comes in. Nobody touched anything.',
      steps: [
        { t: 'Form', d: 'The contact arrives' },
        { t: 'AI qualification', d: 'Gemini reads and scores' },
        { t: 'CRM', d: 'HubSpot record created' },
        { t: 'Reply', d: 'Email + slot suggested' },
      ],
      note: 'Every step logs what it does. If something fails, you get an alert, not a surprise.',
    },
    agent: {
      kicker: 'AI agent on your data',
      title: 'An assistant that *knows* your documents and cites its sources.',
      text: 'Hybrid search (semantic and keyword) across your procedures, contracts and notes. It answers, shows where the answer comes from, and stays inside the scope you give it.',
      q: 'What is our standard payment term for large accounts?',
      a: '45 days end of month, unless agreed otherwise in writing. 2 clients have a 60-day clause.',
      src: 'General terms v4 · Atlas contract §6',
    },
    tool: {
      kicker: 'Internal tool',
      title: 'When a spreadsheet is no longer enough, we build *yours*.',
      text: 'A platform in your colours, encrypted, talking to your tools (Notion, Google, HubSpot). It is what I built for WLFG, and it is used every day.',
    },
    process: {
      kicker: 'How it works',
      title: 'We move step by step, you stay in control.',
      steps: [
        { t: 'Audit', d: 'We map it out and size the gain.' },
        { t: 'Sprint', d: 'First automations in production.' },
        { t: 'Agent / tool', d: 'We go bigger if it is worth it.' },
        { t: 'Run', d: 'I monitor and evolve it monthly.' },
      ],
    },
    stackTitle: 'The tools behind it',
    finalTitle: "Let's start with *the audit*.",
    finalText: '30 minutes, one process, a first sized lead.',
  },

  marketing: {
    hero: {
      kicker: 'Marketing & content',
      title: 'Content for your social media, *created and published* for you.',
      sub: 'Instagram, TikTok, LinkedIn: I define your line, I produce the visuals, videos and copy, and I send you a report every week.',
    },
    intro: {
      title: 'Marketing that *looks like you*, from strategy to publishing.',
      sub: 'Social media or webinars: I take care of everything, and you stay in control of what is published.',
    },
    overview: {
      kicker: 'Two services',
      title: 'Choose *your* way in.',
      items: [
        {
          name: 'Social media content',
          line: 'Strategy, creation, publishing and a weekly report on Instagram, TikTok and LinkedIn.',
          slug: 'marketing/content',
        },
        {
          name: 'Webinars',
          line: 'Ads, landing page, WhatsApp, emails and slides: everything is set up for your webinar.',
          slug: 'marketing/webinars',
        },
      ],
    },
    content: {
      kicker: 'What I do for your social media',
      title: 'From the editorial plan to the *weekly report*.',
      steps: [
        { t: 'Strategy', d: 'Your editorial line, after watching your competitors' },
        { t: 'Creation', d: 'Visuals, videos and copy that look like you' },
        { t: 'Publishing', d: 'On Instagram, TikTok and LinkedIn' },
        { t: 'Report', d: 'Reach, engagement and conversions, every week' },
      ],
      note: 'You stay in control: you approve, I publish, and you see the numbers.',
    },
    monthly: {
      kicker: 'The formula',
      name: 'Monthly content',
      text: 'A regular publishing rhythm, content produced for you and a report every week. Social media content is the heart of this offer.',
      from: 'from',
      perMonth: 'per month',
    },
    also: {
      kicker: 'And also',
      items: [
        { t: 'Email and CRM', d: 'Campaigns and automations to retain and follow up (Brevo, Klaviyo, HubSpot).' },
        { t: 'Websites that convert', d: 'Shopify or Framer sites designed to turn visits into inquiries.' },
        { t: 'Meta ads', d: 'Campaigns created and tracked to reach the right people.' },
      ],
    },
    proof: {
      kicker: 'Where this experience comes from',
      title: 'From social media to *full* marketing.',
      items: [
        { who: 'MNGRS.AI', role: 'Social media manager', text: 'Strategy across 3 platforms, visual and video content, a report every week.' },
        { who: 'WeTalk Podcast', role: 'Entrepreneurship podcast', text: 'Editorial design, distribution on all platforms and branding.' },
        { who: 'La Squadra Paris', role: 'Digital marketing manager', text: 'E-commerce, ads, CRM, social media and analytics: 7 functions in a single role.' },
        { who: 'Freelance', role: 'Since 2024', text: 'Shopify and Framer sites, digital strategy and networking workshops.' },
      ],
    },
    webinars: {
      kicker: 'Also: webinars',
      title: 'A *structured* webinar, from the ad to the follow-up.',
      sub: 'I set up everything your webinar needs to run well: Meta ads, WhatsApp, emails, landing page and slides.',
      steps: [
        { t: 'Meta ad', d: 'It brings in the right people' },
        { t: 'Landing page', d: 'One page, one sign-up' },
        { t: 'Reminders', d: 'Automatic WhatsApp and emails' },
        { t: 'Webinar', d: 'Structured slides, a follow-up after' },
      ],
      setup: {
        tag: 'Without ads',
        name: 'Foundation',
        text: 'I build the whole system: landing page, emails to attendees, WhatsApp automations. I also guide you in preparing your slides.',
        who: 'For people who already have an audience.',
      },
      plus: {
        tag: 'With ads',
        name: 'Boost',
        text: 'Everything above, plus the advertising: I create and run your Meta campaigns to get your webinar noticed.',
        who: 'To start from zero or move faster.',
      },
      quote: 'On quote',
      quoteNote: 'The price depends on your webinar. I give it to you after we talk.',
      promiseTitle: 'What I promise, and what I do not.',
      yes: 'I set up everything so that your webinar works, with the utmost care.',
      no: 'I do not guarantee a number of attendees or a number of sales. No one can honestly do that.',
      finalTitle: 'Shall we structure *your webinar* together?',
      finalText: '30 minutes to define the goal, the audience and the formula.',
      promiseYes: 'I promise',
      promiseNo: 'I do not promise',
    },
    finalTitle: 'Shall we talk about *your social media*?',
    finalText: '30 minutes to define your goal, your platforms and the right rhythm.',
  },

  products: {
    hero: {
      kicker: 'Digital products',
      title: 'Your AI diagnosis, *ready to apply*.',
      sub: 'You answer a few questions about you and your business. AI agents I designed analyse your answers, and you receive your result by email.',
    },
    how: {
      kicker: 'How it works',
      title: '3 steps, no appointment.',
      steps: [
        { t: 'You pay', d: 'Secure payment on Stripe. I never see your card.' },
        { t: 'You answer', d: 'A form: who you are, your site, your LinkedIn, your problem, your goals.' },
        { t: 'You receive', d: 'Your personalised result, straight to your inbox.' },
      ],
    },
    items: [
      {
        key: 'diagnostic',
        slug: 'products/diagnostic',
        name: 'Business diagnosis',
        line: 'Where your business stands, what holds you back, and what AI and marketing can change for you.',
        gets: [
          { t: 'An analysis of your business', d: 'Your activity, your friction points.' },
          { t: '3 concrete leads', d: 'Where to save time or money.' },
          { t: 'An action plan', d: 'Actions ready to apply as soon as you receive it.' },
        ],
        cta: 'Buy the diagnosis',
      },
      {
        key: 'prompt',
        slug: 'products/prompt',
        name: 'Tailored master prompt',
        line: 'A long, precise prompt written for you: your business, your customers, the way you speak.',
        gets: [
          { t: 'A master prompt', d: 'Fitted to your business, not a generic template.' },
          { t: 'Ready to paste', d: 'Into the AI tool you already use.' },
        ],
        cta: 'Buy the master prompt',
      },
    ],
    soon: 'Coming soon',
    trust: [
      { t: 'No generic template', d: 'Every result starts from your answers.' },
      { t: 'Made by AI agents', d: 'That I designed, and I tell you so plainly.' },
      { t: 'Secure payment', d: 'Stripe handles the payment, I do not see your card.' },
    ],
    trustKicker: 'What you can expect',
    next: {
      kicker: 'What next?',
      title: 'Want to go further? *Let us talk.*',
      text: 'If your result makes you want to act, we can discuss it in 30 minutes, or I build the agent or the system for you.',
      linkCall: 'Book a call',
      linkOffers: 'See pricing',
    },
    formations: {
      kicker: 'Courses',
      title: 'Courses are coming.',
      text: 'I am preparing courses. Leave your email in the "In the lab" section on the home page and I will let you know when they launch.',
      link: 'Notify me',
    },
    finalTitle: 'Not sure which product? *Write to me.*',
    finalText: 'Tell me your situation and I will tell you what fits.',
  },

  offers: {
    hero: {
      kicker: 'Pricing',
      title: 'A clear ladder. *You* choose the rung.',
      sub: 'From a 19 € product to a complete system. Each rung is useful on its own, and prepares the next.',
    },
    ladderLabel: 'Ladder',
    ladder: [
      {
        key: 'diagnostic',
        name: 'AI diagnosis',
        line: 'Your business analysed by AI agents, by filling in a form.',
        out: 'An analysis, 3 leads and an action plan, by email.',
        href: 'products',
      },
      {
        key: 'prompt',
        name: 'Master prompt',
        line: 'A long, precise prompt written for you and your business.',
        out: 'Ready to paste into your AI tool.',
        href: 'products',
      },
      {
        key: 'clarity',
        name: 'Clarity Session',
        line: 'A 30-minute call to decide: diagnosis, leads, roadmap.',
        out: 'What you do yourself, what we automate, what I do for you.',
        href: 'book',
      },
      {
        key: 'agent',
        name: 'AI agent',
        line: 'One precise need, one agent delivered. A building block, not a full system.',
        out: 'Content, customer replies, internal organisation or an assistant on your data.',
        href: 'automations',
      },
      {
        key: 'system',
        name: 'Complete system',
        line: 'We audit, connect and automate. The business goes from manual to semi-automatic.',
        out: 'Global analysis, a stack of connected agents, optimised workflows.',
        href: 'automations',
      },
    ],
    from: 'from',
    range: 'from',
    rangeTo: 'to',
    flat: 'fixed price',
    perMonth: '/ month',
    quote: 'Prices for custom offers are ranges. The exact quote follows our conversation.',
    runKicker: 'Then, to make it last',
    runTitle: 'A monthly subscription, *Run*.',
    runText: 'An automation nobody watches ends up breaking. I take care of it.',
    runPlans: [
      { key: 'run', name: 'Run', line: 'Monitoring, fixes and small adjustments.' },
      { key: 'runPlus', name: 'Run+', line: 'Everything in Run, plus monthly improvements and data reporting.' },
    ],
    otherKicker: 'And also',
    other: [
      {
        key: 'marketing',
        name: 'Marketing & content',
        line: 'Content for your social media, created, published and tracked every week.',
        href: 'marketing',
      },
      {
        key: null,
        name: 'Webinars',
        line: 'Complete setup, with or without ads (Foundation and Boost formulas).',
        custom: 'On quote',
        href: 'marketing',
      },
      {
        key: 'cos',
        name: 'Outsourced Chief of Staff',
        line: 'Steering, OKRs, priorities and reporting for your leadership, on a part-time basis.',
      },
      {
        key: null,
        name: 'Data reporting',
        line: 'Dashboards and automated reports, connected to your sources.',
        custom: 'On quote',
      },
    ],
    finalTitle: 'Not sure which rung? *Start* small.',
    finalText: 'A 19 € diagnosis, or 30 minutes of conversation. You choose.',
  },

  book: {
    hero: {
      kicker: 'Book an audit',
      title: '30 minutes to *map out* your need.',
      sub: 'Tell me who you are and what you are looking for. Then pick a video slot, or simply send your request by email.',
    },
    steps: ['Your request', 'Day and time', 'Confirmation'],
    mode: {
      label: 'What would you like?',
      meet: 'Book a video call',
      meetNote: '30 minutes, with a Google Meet link',
      mail: 'Just send me my request',
      mailNote: 'I reply by email',
    },
    sendMail: 'Send my request',
    cal: {
      prev: 'Previous month',
      next: 'Next month',
      noDays: 'No day available this month.',
    },
    mailTitle: 'Request received.',
    mailText: 'A confirmation email is waiting for you. I will reply soon.',
    errorPhone: 'Please enter a valid phone number.',
    fields: {
      firstName: 'First name',
      lastName: 'Last name',
      phone: 'Phone number',
      name: 'Name',
      email: 'Email address',
      company: 'Company',
      need: 'Your need',
      budget: 'Budget in mind',
      message: 'In a few words',
      messagePlaceholder: 'Which process would you like to lighten, or what project do you have in mind?',
      optional: 'optional',
    },
    needs: [
      { v: 'automation', t: 'Automate a process' },
      { v: 'agent', t: 'An AI agent on my data' },
      { v: 'tool', t: 'An internal tool or platform' },
      { v: 'content', t: 'Content for my social media' },
      { v: 'webinar', t: 'A webinar' },
      { v: 'cos', t: 'Outsourced Chief of Staff' },
      { v: 'other', t: "I don't know yet" },
    ],
    budgets: [
      { v: '200-800', t: '€200 to €800' },
      { v: '800-2000', t: '€800 to €2,000' },
      { v: 'gt2000', t: 'Over €2,000' },
      { v: 'unknown', t: 'To be defined together' },
    ],
    next: 'Choose a slot',
    back: 'Back',
    pickDay: 'Pick a day',
    pickTime: 'Then a time',
    noSlotsDay: 'No slots that day.',
    noSlotsAll: 'No availability in the coming weeks. Write to me and we will sort it out.',
    loading: 'Loading availability…',
    tz: 'Times shown in your timezone:',
    preview:
      "Preview mode: these slots are examples. Nothing will be booked until Google Calendar is connected.",
    recap: 'Summary',
    confirm: 'Confirm the appointment',
    sending: 'Booking…',
    successTitle: "You're booked.",
    successText: 'A confirmation email with the Google Meet link is on its way.',
    successPreview: 'Preview mode: no real appointment was created.',
    error: 'Booking failed. The slot may have just been taken, please pick another.',
    errorFields: 'Please fill in first name, last name, phone, email and need.',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    privacy: 'Your answers are only used to prepare our conversation.',
  },

  contact: {
    hero: {
      kicker: 'Send a message',
      title: 'A question, an idea? *Write to me.*',
      sub: 'I usually reply within 2 working days. You get an acknowledgement right away.',
    },
    fields: {
      firstName: 'First name',
      lastName: 'Last name',
      phone: 'Phone number',
      name: 'Name',
      email: 'Email address',
      subject: 'Subject',
      message: 'Message',
      messagePlaceholder: 'Tell me what you need.',
    },
    send: 'Send the message',
    sending: 'Sending…',
    okTitle: 'Message received.',
    okText: 'An acknowledgement has just been sent to your address. I will get back to you soon.',
    err: 'Sending failed. Please try again or book a call directly.',
    invalid: 'Please enter first name, last name, a valid email and a message.',
    or: 'Prefer to talk it through live?',
  },

  journey: {
    hero: {
      kicker: 'Journey',
      title: 'Where I come from, and *what I have built*.',
      sub: 'From social media to running a company, then AI: a path that connects the message and the machinery.',
    },
    photoAlt: 'Portrait of Binta Kande',
    photoNote: '',
    todo: 'To complete',
    items: [
      {
        when: 'Nov. 2025 to today',
        title: 'Chief of Staff, Proplyd Productions and WLFG Consulting',
        text: 'Right hand to the CEO: strategic and operational priorities, quarterly OKRs, investor materials, business development. I designed and deployed automations and an internal platform there.',
        todo: false,
      },
      {
        when: 'Jul. 2024 to today',
        title: 'Freelance',
        text: 'Shopify and Framer sites built to convert, digital strategy, automations and AI agents. I also created WeTalk Podcast, an entrepreneurship podcast, and organised networking workshops.',
        todo: false,
      },
      {
        when: 'Jul. to Dec. 2025',
        title: 'Social media manager, MNGRS.AI',
        text: 'Strategy and visual and video content on Instagram, TikTok and LinkedIn, with a weekly report: engagement, reach, conversions.',
        todo: false,
      },
      {
        when: '2025',
        title: 'Digital marketing manager, La Squadra Paris',
        text: 'E-commerce, ads, CRM, social media, analytics: 7 functions in one role. Email marketing and automations for retention.',
        todo: false,
      },
      {
        when: '2025 to 2026',
        title: 'MSc in AI Applied to Business, Eugenia School',
        text: 'Business analytics, data visualisation, Python, SQL, PowerBI, HubSpot, Dataiku, GA4.',
        todo: false,
      },
      {
        when: '2024 to 2025',
        title: 'Bachelor in Digital Project Management, Digital School of Paris',
        text: 'SEO, Adobe Suite, team management, Scrum.',
        todo: false,
      },
      {
        when: '2023 to 2024',
        title: 'Bachelor in International Trade, CNAM',
        text: 'Digital marketing, management, macroeconomics, accounting.',
        todo: false,
      },
    ],
    languages: 'French, native. English, bilingual.',
    stackTitle: 'The toolbox',
  },

  faq: {
    hero: {
      kicker: 'FAQ',
      title: 'The *questions* I get asked most.',
    },
    items: [
      {
        q: 'How do the 19 € and 39 € products work?',
        a: 'You pay online, fill in a form about you and your business, and receive your result by email. The result is produced by AI agents I designed, from your answers.',
      },
      {
        q: 'Is my data safe?',
        a: 'Yes. Payment goes through Stripe, I never see your card. Your answers are only used to produce your result. For custom projects, security is part of the brief, and I work under a confidentiality agreement if you wish.',
      },
      {
        q: 'How does billing work for custom offers?',
        a: 'AI agent and complete system: a quote with a deposit at the start and the balance on delivery. Run, Run+ and monthly content: a monthly subscription. Displayed prices are ranges or starting prices, the exact quote follows our conversation.',
      },
      {
        q: 'What do you promise for webinars and marketing?',
        a: 'I set up everything needed for it to work. I do not guarantee a number of attendees or a number of sales.',
      },
      {
        q: 'Do you work in English?',
        a: 'Yes. The site, the exchanges and the documents I deliver exist in French and English.',
      },
      {
        q: 'What if an automation breaks?',
        a: 'Each automation logs what it does and alerts you on failure. With Run, I monitor it and fix it before you notice.',
      },
    ],
    finalTitle: 'Another question? *Ask it.*',
  },

  chat: {
    open: 'A question?',
    title: 'Binta’s assistant',
    hello: 'Hello! I answer your questions about the offers, the prices and how we can work together.',
    placeholder: 'Type your question',
    send: 'Send',
    close: 'Close',
    chips: ['What are your prices?', 'Content for my social media', 'How does the 19 € diagnosis work?'],
    note: 'AI assistant, it can be wrong. For a quote, book a call.',
    preview: 'Preview mode',
    error: 'I could not answer. Write to me directly and I will reply quickly.',
    thinking: 'Thinking…',
  },

  footer: {
    tagline: 'Marketing, automation and AI agents.',
    rights: 'All rights reserved.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    sitemap: 'Sitemap',
  },

  notFound: {
    title: "This page doesn't exist.",
    text: 'It may have been moved.',
    back: 'Back to home',
  },
};
