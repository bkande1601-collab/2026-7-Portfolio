/**
 * TEXTS — ENGLISH.
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
    automations: 'Automation & AI',
    marketing: 'Marketing',
    offers: 'Services & pricing',
    journey: 'Journey',
    faq: 'FAQ',
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
      videoLabel: 'Motion design video',
      videoPending: 'My video goes here',
    },
    skills: [
      'AI agents',
      'Process automation',
      'Digital marketing',
      'Social media management',
      'Meta ads',
      'Turnkey webinars',
      'WhatsApp automations',
      'Landing pages',
      'AI assistants on your documents',
      'Internal platforms',
      'Data reporting',
      'Chief of Staff',
    ],
    services: {
      kicker: 'Two ways to work together',
      title: 'Systems that *run*, and marketing that fills them.',
      auto: {
        name: 'Automation & AI',
        text: 'I take repetitive work off your team with automations, AI agents connected to your tools and documents, and custom internal tools.',
        link: 'See automation',
      },
      marketing: {
        name: 'Digital marketing',
        text: 'Meta ads, turnkey webinars, WhatsApp and email automations, social media. You can come just for the marketing.',
        link: 'See marketing',
      },
    },
    toolsTitle: 'What I use every day',

    beforeAfter: {
      kicker: 'What changes',
      title: 'The same Monday morning, *before* and after.',
      beforeLabel: 'Before',
      afterLabel: 'After',
      before: [
        'A request lands in an inbox',
        'It gets copied into three tools',
        'Chasing, forgetting, finding again',
        'The report goes out Thursday, by hand',
      ],
      after: [
        'A request lands',
        'Automation routes and classifies it',
        'The AI agent reads, drafts, decides',
        'Notion, HubSpot, Calendar updated — report is automatic',
      ],
      caption: 'Less copy-paste, more time for what actually needs a person.',
    },

    platform: {
      kicker: 'Proof, in production',
      title: 'I built *my own* platform. It runs every day.',
      text: "Projects, messaging, a to-do synced with Notion, OKRs, onboarding and offboarding, Google Calendar, and an AI assistant that knows the company's documents. Designed and built solo, encrypted, bilingual.",
      stack: 'Gemini · Hetzner via Coolify',
      modules: ['Projects', 'Messaging', 'To-do · Notion', 'OKR', 'Onboarding & exits', 'Calendar', 'AI assistant'],
      chat: {
        title: 'AI assistant',
        q: 'What is the procedure when someone leaves the company?',
        a: 'Three steps: remove access on the last day, collect equipment, then run the exit interview. I can create the tasks in the to-do right now.',
        src: 'Sources: Offboarding procedure v3 · IT policy',
        lock: 'Encrypted AES-256-GCM',
      },
    },

    role: {
      kicker: 'Who is speaking',
      title: 'Chief of Staff by day, *builder* the rest of the time.',
      text: "I run operations for the WLFG group (WLFG Consulting and Proplyd Productions): priorities, OKRs, reporting, coordination. My MSc in AI & Data and years of building tools mean I don't just specify them — I ship them. As a freelancer, I bring the same rigour to companies that want to automate seriously.",
      link: 'Read my journey',
    },

    offersTitle: 'A simple ladder, from first step to full system',
    offersLink: 'See the services in detail',

    lab: {
      kicker: 'In the lab',
      title: 'Three projects *in progress*.',
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

    finalTitle: 'A process that costs you *too much* time?',
    finalText: "Thirty minutes to map it out. You leave with a first lead, even if we don't end up working together.",
  },

  automations: {
    hero: {
      kicker: 'Automation & AI',
      title: 'I take the *repetitive* work off your team.',
      sub: 'Custom automations, AI agents plugged into your tools and documents, custom internal tools. This is my core craft.',
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
      a: '45 days end of month, unless agreed otherwise in writing. Two clients have a 60-day clause.',
      src: 'General terms v4 · Atlas contract §6',
    },
    tool: {
      kicker: 'Internal tool',
      title: 'When a spreadsheet is no longer enough, we build *yours*.',
      text: 'A platform in your colours, encrypted, talking to your tools (Notion, Google, HubSpot). It is what I did for WLFG — and it is used daily.',
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
    finalText: 'Half an hour, one process, a first sized lead.',
  },

  marketing: {
    hero: {
      kicker: 'Digital marketing',
      title: 'A *structured* webinar, from the ad to the follow-up.',
      sub: 'I set up everything your webinar needs to fill up and run well: Meta ads, WhatsApp automations, emails, landing page and slides. Turnkey.',
    },
    flow: {
      kicker: 'An attendee’s journey',
      title: 'From the ad to the replay, everything is *connected*.',
      steps: [
        { t: 'Meta ad', d: 'It brings in the right people' },
        { t: 'Landing page', d: 'One page, one sign-up' },
        { t: 'Reminders', d: 'Automatic WhatsApp and emails' },
        { t: 'Webinar', d: 'Structured slides, a follow-up after' },
      ],
      note: 'Everything is automated. Each person who signs up gets the right message at the right time, with nothing sent by hand.',
    },
    formulas: {
      kicker: 'Two formulas',
      title: 'You choose *how far* I go.',
      setup: {
        tag: 'Formula 1a',
        name: 'Setup',
        text: 'I build the whole system: landing page, emails to attendees, WhatsApp automations. I also guide you in preparing your slides.',
        who: 'For people who already have an audience.',
      },
      plus: {
        tag: 'Formula 1b',
        name: 'Setup and marketing',
        text: 'Everything above, plus the advertising: I create and run your Meta campaigns to fill your webinar.',
        who: 'To start from zero or move faster.',
      },
      quote: 'On quote',
      quoteNote: 'The price depends on your webinar. I give it to you at the end of the audit.',
      monthly: 'Monthly digital marketing: ads, content and follow-up, on an ongoing basis.',
    },
    promise: {
      title: 'What I promise, and what I don’t.',
      yes: 'I set up everything so that your webinar works, with the utmost care.',
      no: 'I do not guarantee a number of attendees or a number of sales. No one can honestly do that.',
    },
    background: {
      kicker: 'Why me',
      title: 'I was a social media manager before I built *systems*.',
      text: 'I connect the two: the message that makes people want it, and the machinery that delivers it with no manual effort.',
    },
    finalTitle: 'Shall we structure *your webinar* together?',
    finalText: 'Half an hour to define the goal, the audience and the formula.',
  },

  offers: {
    hero: {
      kicker: 'Services & pricing',
      title: 'A clear ladder. *You* pick the rung.',
      sub: 'From diagnosis to a full system. Each rung is useful on its own, and sets up the next.',
    },
    ladderLabel: 'Ladder',
    ladder: [
      {
        key: 'audit',
        name: 'Audit',
        line: 'I find where your time goes and what can be automated.',
        out: 'Process map and 3 leads ranked by gain.',
      },
      {
        key: 'sprint',
        name: 'Automation sprint',
        line: 'The first automations run in production.',
        out: 'One to three automations delivered, tested, documented.',
      },
      {
        key: 'agent',
        name: 'AI agent on your data',
        line: 'An assistant that knows your documents and cites its sources.',
        out: 'Agent deployed, plugged into your tools, with scope and guardrails.',
      },
      {
        key: 'tool',
        name: 'Internal tool or platform',
        line: 'Your own encrypted platform, like the one at WLFG.',
        out: 'Custom platform, hosted and maintainable.',
      },
    ],
    from: 'from',
    flat: 'flat fee',
    perMonth: '/ month',
    quote: 'Starting prices: an exact quote follows the audit.',
    runKicker: 'Then, to make it last',
    runTitle: 'A monthly subscription, *Run*.',
    runText: 'An unmonitored automation eventually breaks. I take care of it.',
    runPlans: [
      { key: 'run', name: 'Run', line: 'Monitoring, fixes and small adjustments.' },
      { key: 'runPlus', name: 'Run+', line: 'Everything in Run, plus monthly improvements and data reporting.' },
    ],
    otherKicker: 'Also available',
    other: [
      {
        key: 'marketing',
        name: 'Digital marketing',
        line: 'Strategy, content and acquisition, with the same reflex: automate what repeats.',
      },
      {
        key: 'cos',
        name: 'Outsourced Chief of Staff',
        line: 'Steering, OKRs, priorities and reporting for your leadership, part-time.',
      },
      {
        key: null,
        name: 'Data reporting',
        line: 'Automated dashboards and reports, plugged into your sources.',
        custom: 'On quote',
      },
    ],
    finalTitle: 'Not sure which rung? *Start* with the audit.',
    finalText: 'It is the entry point, and it is credited against a sprint if we continue together.',
  },

  book: {
    hero: {
      kicker: 'Book an audit',
      title: 'Thirty minutes to *map out* your need.',
      sub: 'Three short steps. You receive the invite with the Google Meet link by email.',
    },
    steps: ['Your need', 'Day and time', 'Confirmation'],
    fields: {
      name: 'Name',
      email: 'Email',
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
      { v: 'tool', t: 'An internal tool / platform' },
      { v: 'marketing', t: 'Digital marketing' },
      { v: 'cos', t: 'Outsourced Chief of Staff' },
      { v: 'other', t: "I don't know yet" },
    ],
    budgets: [
      { v: 'lt1500', t: 'Under €1,500' },
      { v: '1500-4500', t: '€1,500 – 4,500' },
      { v: '4500-9000', t: '€4,500 – 9,000' },
      { v: 'gt9000', t: 'Over €9,000' },
      { v: 'unknown', t: 'To define together' },
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
    error: 'Booking failed. The slot may have just been taken — please pick another.',
    errorFields: 'Please fill in name, email and need.',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    privacy: 'Your answers are only used to prepare our conversation.',
  },

  contact: {
    hero: {
      kicker: 'Send a message',
      title: 'A question, an idea? *Write to me.*',
      sub: 'I usually reply within two working days. You get an acknowledgement right away.',
    },
    fields: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      messagePlaceholder: 'Tell me what you need.',
    },
    send: 'Send the message',
    sending: 'Sending…',
    okTitle: 'Message received.',
    okText: 'An acknowledgement has just been sent to your address. I will get back to you soon.',
    err: 'Sending failed. Please try again or book a call directly.',
    invalid: 'Please provide a name, a valid email and a message.',
    or: 'Prefer to talk it through live?',
  },

  journey: {
    hero: {
      kicker: 'Journey',
      title: 'Where I come from, and *what I built*.',
      sub: 'Dates and schools are coming. The essentials are already here.',
    },
    photoAlt: 'Portrait of Binta Kande',
    photoNote: 'Photo to add: drop public/binta.jpg',
    todo: 'To complete',
    items: [
      {
        when: 'Today',
        title: 'Freelance — automation & AI agents',
        text: 'I support companies: audits, sprints, AI agents, internal tools, Run subscriptions.',
        todo: false,
      },
      {
        when: 'Ongoing',
        title: 'Chief of Staff — WLFG group',
        text: 'WLFG Consulting and Proplyd Productions. Steering, OKRs, reporting, and the internal platform I designed and built.',
        todo: false,
      },
      {
        when: '[year]',
        title: 'MSc in AI & Data',
        text: 'Institution: [to complete].',
        todo: true,
      },
      {
        when: '[year]',
        title: 'Education and first experiences',
        text: '[School, degree, company — to complete].',
        todo: true,
      },
    ],
    stackTitle: 'The toolbox',
  },

  faq: {
    hero: {
      kicker: 'FAQ',
      title: 'The *questions* I get asked most.',
    },
    items: [
      {
        q: 'What are the timelines?',
        a: 'An audit can be scheduled within a few days. An automation sprint is measured in weeks; an AI agent or internal tool takes a few weeks to a few months depending on scope. The exact schedule is set in the quote.',
      },
      {
        q: 'Is my data safe?',
        a: 'Security is part of the brief, not an option. I apply the same level as on my own platform: AES-256-GCM encryption, access limited to what is strictly needed, European hosting (Hetzner). I work under an NDA if you wish.',
      },
      {
        q: 'How does billing work?',
        a: 'Audit: flat fee. Sprint, agent and tool: a quote with a deposit at kick-off and the balance on delivery. Run and Run+: a monthly subscription with no long commitment. Listed prices are starting prices; the exact quote follows the audit.',
      },
      {
        q: 'Do you work in English?',
        a: 'Yes. The site, the conversations, the documentation and the tools I deliver exist in both French and English.',
      },
      {
        q: 'What if an automation breaks?',
        a: 'Every automation logs what it does and alerts you on failure. With Run, I monitor it and fix it before you notice.',
      },
    ],
    finalTitle: 'Another question? *Ask it.*',
  },

  footer: {
    tagline: 'Automation & AI agents that run in production.',
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
