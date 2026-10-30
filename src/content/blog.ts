/**
 * BLOG : conseils. Pour ajouter un article, copiez un bloc ci-dessous
 * (même structure), changez le `slug` et les textes en français et en anglais.
 * Chaque section a un titre facultatif (`h`) et des paragraphes (`p`).
 */
export type Section = { h?: string; p: string[] };
export type PostText = { tag: string; title: string; excerpt: string; sections: Section[] };
export type Post = { slug: string; date: string; minutes: number; fr: PostText; en: PostText };

export const posts: Post[] = [
  {
    slug: 'premieres-automatisations',
    date: '2026-10-30',
    minutes: 3,
    fr: {
      tag: 'Automatisation',
      title: 'Les 5 tâches à automatiser en premier',
      excerpt: 'Par où commencer quand on veut gagner du temps sans tout changer.',
      sections: [
        {
          p: [
            'Tout automatiser d’un coup ne marche presque jamais. Le plus efficace, c’est de commencer par les tâches qui reviennent souvent, qui suivent toujours les mêmes étapes, et qui n’ont pas besoin d’un jugement humain.',
          ],
        },
        {
          h: 'Les 5 candidates',
          p: [
            'L’arrivée d’un nouveau client ou d’un nouveau collaborateur : documents, accès, message de bienvenue.',
            'Les relances : un devis sans réponse, une facture en retard.',
            'Le tri des demandes entrantes : formulaire, e-mail, première qualification.',
            'Le reporting : des chiffres compilés à la main chaque semaine.',
            'Le compte rendu de réunion : un résumé et des tâches créées toutes seules.',
          ],
        },
        {
          h: 'Comment choisir la première',
          p: [
            'Posez-vous trois questions. Combien de fois par semaine ? Combien de minutes à chaque fois ? Que se passe-t-il si on l’oublie ? La tâche qui coûte le plus de temps au total, et qui provoque le plus d’oublis, passe en premier.',
          ],
        },
        {
          h: 'Et ensuite',
          p: ['Mesurez le temps gagné pendant quelques semaines avant de passer à la suivante. Une automatisation qui marche vaut mieux que cinq à moitié finies.'],
        },
      ],
    },
    en: {
      tag: 'Automation',
      title: 'The 5 tasks to automate first',
      excerpt: 'Where to start when you want to save time without changing everything.',
      sections: [
        {
          p: [
            'Automating everything at once almost never works. The most effective way is to start with tasks that come back often, always follow the same steps, and need no human judgement.',
          ],
        },
        {
          h: 'The 5 candidates',
          p: [
            'A new client or a new team member arriving: documents, access, welcome message.',
            'Follow-ups: a quote with no answer, a late invoice.',
            'Sorting incoming requests: form, email, first qualification.',
            'Reporting: figures compiled by hand every week.',
            'Meeting notes: a summary and tasks created on their own.',
          ],
        },
        {
          h: 'How to choose the first one',
          p: [
            'Ask yourself three questions. How many times a week? How many minutes each time? What happens if it is forgotten? The task that costs the most time overall, and causes the most oversights, goes first.',
          ],
        },
        {
          h: 'What next',
          p: ['Measure the time saved for a few weeks before moving on to the next one. One automation that works beats five half-finished ones.'],
        },
      ],
    },
  },
  {
    slug: 'contenu-reseaux-regularite',
    date: '2026-10-30',
    minutes: 3,
    fr: {
      tag: 'Réseaux sociaux',
      title: 'Publier tous les jours ne suffit pas',
      excerpt: 'Ce qui fait vraiment avancer un compte : une ligne claire et un bilan chaque semaine.',
      sections: [
        {
          p: ['Beaucoup d’entrepreneurs publient beaucoup et voient peu de résultats. Le problème n’est presque jamais le volume. C’est le manque de ligne et de suivi.'],
        },
        {
          h: 'Une ligne éditoriale claire',
          p: ['Choisissez 3 thèmes au maximum, ceux sur lesquels vous voulez être reconnu. Tout ce que vous publiez doit se rattacher à l’un d’eux.'],
        },
        {
          h: 'Un rythme que vous pouvez tenir',
          p: ['Mieux vaut 3 bons contenus par semaine, tenus pendant des mois, que 7 contenus par semaine abandonnés au bout d’un mois.'],
        },
        {
          h: 'Un bilan chaque semaine',
          p: ['Regardez la portée, l’engagement et ce que chaque contenu a fait venir. Ce qui marche, refaites-le sous un autre angle. Ce qui ne marche pas, arrêtez.'],
        },
        {
          h: 'Un appel à l’action',
          p: ['Chaque contenu doit mener quelque part : un message, une inscription, une page. Sinon il reste un joli contenu sans suite.'],
        },
      ],
    },
    en: {
      tag: 'Social media',
      title: 'Posting every day is not enough',
      excerpt: 'What really moves an account forward: a clear line and a weekly review.',
      sections: [
        {
          p: ['Many entrepreneurs post a lot and see few results. The problem is almost never volume. It is the lack of a line and of follow-up.'],
        },
        {
          h: 'A clear editorial line',
          p: ['Choose 3 topics at most, the ones you want to be known for. Everything you publish should connect to one of them.'],
        },
        {
          h: 'A rhythm you can keep',
          p: ['It is better to have 3 good pieces of content a week, kept up for months, than 7 a week given up after a month.'],
        },
        {
          h: 'A weekly review',
          p: ['Look at reach, engagement and what each piece brought in. What works, do again from another angle. What does not, stop.'],
        },
        {
          h: 'A call to action',
          p: ['Every piece of content should lead somewhere: a message, a sign-up, a page. Otherwise it stays a nice piece of content with no follow-up.'],
        },
      ],
    },
  },
  {
    slug: 'webinaire-checklist',
    date: '2026-10-30',
    minutes: 3,
    fr: {
      tag: 'Webinaires',
      title: 'Réussir son webinaire : la checklist',
      excerpt: 'Avant, pendant, après : ce qu’il faut avoir en place.',
      sections: [
        {
          p: ['Un webinaire ne se joue pas le jour J. Il se joue dans tout ce qui l’entoure. Voici ce que je vérifie à chaque fois.'],
        },
        {
          h: 'Avant',
          p: [
            'Une page d’inscription claire : un seul message, un seul bouton.',
            'Des rappels automatiques par e-mail et par WhatsApp, pour que les inscrits n’oublient pas.',
            'Des slides simples, une idée par slide, et un temps prévu pour les questions.',
          ],
        },
        {
          h: 'Pendant',
          p: ['Annoncez le plan dès le début, tenez l’horaire, et proposez une action claire à la fin : un rendez-vous, un document, une offre.'],
        },
        {
          h: 'Après',
          p: ['Envoyez le replay et une relance le lendemain, avec une seule action à faire. C’est souvent là que se joue l’essentiel.'],
        },
        {
          h: 'Une précision honnête',
          p: ['Personne ne peut garantir un nombre de participants. Le but est de réunir tout ce qui augmente vos chances, et de les mettre en place avec soin.'],
        },
      ],
    },
    en: {
      tag: 'Webinars',
      title: 'Running a good webinar: the checklist',
      excerpt: 'Before, during, after: what needs to be in place.',
      sections: [
        {
          p: ['A webinar is not decided on the day. It is decided in everything around it. Here is what I check every time.'],
        },
        {
          h: 'Before',
          p: [
            'A clear sign-up page: one message, one button.',
            'Automatic reminders by email and WhatsApp, so that people who signed up do not forget.',
            'Simple slides, one idea per slide, and time set aside for questions.',
          ],
        },
        {
          h: 'During',
          p: ['Announce the plan at the start, keep to the schedule, and offer one clear action at the end: a call, a document, an offer.'],
        },
        {
          h: 'After',
          p: ['Send the replay and a follow-up the next day, with a single action to take. That is often where most of the result is decided.'],
        },
        {
          h: 'An honest note',
          p: ['No one can guarantee a number of attendees. The goal is to bring together everything that improves your chances, and to set it up with care.'],
        },
      ],
    },
  },
];
