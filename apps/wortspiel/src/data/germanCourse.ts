import type { CefrLevel, RevisionCollection } from '../types'

export interface GermanLevelConfig {
  level: CefrLevel
  label: string
  summary: string
  sentencePlaceholder: string
  dailyTip: string
  revision: RevisionCollection
}

export const germanCourse: Record<'A1' | 'A2' | 'B1', GermanLevelConfig> = {
  A1: {
    level: 'A1',
    label: 'A1',
    summary: 'Build the base: personal details, simple routines, travel, food, and everyday verbs.',
    sentencePlaceholder: 'Zum Beispiel: Ich lerne heute Deutsch und trinke Kaffee.',
    dailyTip: 'Best flow: flashcards first, then one sentence, then a short quiz.',
    revision: {
      sourceLabel: 'Goethe-Zertifikat A1 Wortliste',
      sourceHref: 'https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf',
      note: 'A1 focuses on survival German you can use immediately.',
      wordBankLabel: 'Goethe-based A1 cards',
      themes: [
        {
          id: 'a1-self',
          title: 'About yourself',
          summary: 'Introduce yourself, your family, and simple personal details.',
          bullets: ['Name, age, country', 'Family and friends', 'Simple likes and dislikes'],
          example: 'Ich heiße Aditi und ich komme aus Indien.',
        },
        {
          id: 'a1-home',
          title: 'Home and daily routine',
          summary: 'Talk about where you live and what you do every day.',
          bullets: ['Wohnung, Zimmer, Möbel', 'Morning and evening routines', 'Simple household verbs'],
          example: 'Ich wohne in einer kleinen Wohnung und koche am Abend.',
        },
        {
          id: 'a1-food',
          title: 'Food and shopping',
          summary: 'Order food, buy basics, and handle simple shopping talk.',
          bullets: ['Meals and drinks', 'Prices and quantities', 'Simple requests with bitte'],
          example: 'Ich möchte ein Brot und einen Kaffee, bitte.',
        },
        {
          id: 'a1-travel',
          title: 'Travel and directions',
          summary: 'Move around stations, streets, buses, and short journeys.',
          bullets: ['Bahnhof, Zug, Bus', 'Ask where something is', 'Understand simple schedules'],
          example: 'Wo ist der Bahnhof und wann fährt der Zug ab?',
        },
      ],
      grammar: [
        {
          id: 'a1-articles',
          title: 'Articles and gender',
          summary: 'Learn each noun together with der, die, or das from the start.',
          bullets: ['Memorize article + noun', 'Notice plural clues', 'Say nouns aloud with article'],
          example: 'der Tisch, die Lampe, das Buch',
        },
        {
          id: 'a1-present',
          title: 'Present tense',
          summary: 'A1 lives mostly in the present, especially with sein and haben.',
          bullets: ['ich bin, du bist, er ist', 'ich habe, du hast, er hat', 'Use short daily sentences'],
          example: 'Ich habe heute einen Kurs. Du bist sehr müde.',
        },
        {
          id: 'a1-questions',
          title: 'Questions',
          summary: 'Use W-questions and yes/no questions to keep conversation moving.',
          bullets: ['Wer, wie, wo, wann', 'Verb first in yes/no questions', 'Reuse simple question frames'],
          example: 'Wo wohnst du? Kommst du morgen?',
        },
        {
          id: 'a1-negation',
          title: 'Nicht and kein',
          summary: 'Negation is essential for everyday speaking.',
          bullets: ['kein with nouns', 'nicht for verbs and adjectives', 'Notice what exactly you negate'],
          example: 'Ich habe kein Auto. Ich bin heute nicht zu Hause.',
        },
      ],
    },
  },
  A2: {
    level: 'A2',
    label: 'A2',
    summary: 'Stretch your everyday German: appointments, problems, feelings, forms, and longer routines.',
    sentencePlaceholder: 'Zum Beispiel: Heute musste ich früher aufstehen, weil ich einen Termin hatte.',
    dailyTip: 'Use A2 for longer everyday situations: plans, errands, problems, and opinions.',
    revision: {
      sourceLabel: 'Goethe-Zertifikat A2 Wortliste',
      sourceHref: 'https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_A2_Wortliste.pdf',
      note: 'The A2 official list covers roughly 1300 lexical items for everyday private and public life.',
      wordBankLabel: 'Goethe-based A2 cards',
      themes: [
        {
          id: 'a2-services',
          title: 'Appointments and services',
          summary: 'Handle registrations, offices, forms, schedules, and short service conversations.',
          bullets: ['Anmeldung and Termine', 'Public offices and forms', 'Phone and email basics'],
          example: 'Ich muss einen Termin beim Amt vereinbaren.',
        },
        {
          id: 'a2-work',
          title: 'Work and study life',
          summary: 'Talk about colleagues, tasks, school, and practical responsibilities.',
          bullets: ['Jobs and departments', 'Courses and homework', 'Simple goals and changes'],
          example: 'Bei der Arbeit muss ich oft E-Mails schreiben.',
        },
        {
          id: 'a2-health',
          title: 'Health and everyday problems',
          summary: 'Describe what hurts, what happened, and what you need.',
          bullets: ['Doctor and pharmacy words', 'Minor accidents and problems', 'Ask for help or advice'],
          example: 'Ich habe Kopfschmerzen und brauche einen Termin beim Arzt.',
        },
        {
          id: 'a2-social',
          title: 'Plans, opinions, and invitations',
          summary: 'Move beyond facts and talk about preferences, reactions, and simple opinions.',
          bullets: ['Invite and decline', 'Say what you think', 'Plan weekends and trips'],
          example: 'Ich würde gern mitkommen, aber ich habe leider keine Zeit.',
        },
      ],
      grammar: [
        {
          id: 'a2-perfect',
          title: 'Perfekt',
          summary: 'A2 needs the recent past for daily storytelling.',
          bullets: ['haben or sein', 'Past participle at the end', 'Use it for yesterday and last week'],
          example: 'Ich habe gestern lange gearbeitet. Wir sind spät angekommen.',
        },
        {
          id: 'a2-modals',
          title: 'Modal verbs in real situations',
          summary: 'Use können, müssen, dürfen, sollen, and wollen more naturally.',
          bullets: ['Main verb goes to the end', 'Use for duties and plans', 'Listen for spoken shortcuts'],
          example: 'Ich muss heute länger bleiben. Darf ich hier warten?',
        },
        {
          id: 'a2-connectors',
          title: 'Sentence connectors',
          summary: 'Link short ideas into more natural speech.',
          bullets: ['aber, denn, deshalb, trotzdem', 'Explain reasons and contrasts', 'Keep sentences clear'],
          example: 'Ich war müde, aber ich musste trotzdem lernen.',
        },
        {
          id: 'a2-dative',
          title: 'Dative basics',
          summary: 'Many everyday expressions need the dative case.',
          bullets: ['mit, bei, nach, von, zu', 'Say common chunks often', 'Notice article changes'],
          example: 'Ich fahre mit dem Bus zu meiner Freundin.',
        },
      ],
    },
  },
  B1: {
    level: 'B1',
    label: 'B1',
    summary: 'Work toward independent German: opinions, everyday news, work situations, and connected speech.',
    sentencePlaceholder: 'Zum Beispiel: Ich glaube, dass regelmäßiges Lernen besser ist als lange Pausen.',
    dailyTip: 'At B1, practice complete thoughts, not just isolated words.',
    revision: {
      sourceLabel: 'Goethe-Zertifikat B1 Wortliste',
      sourceHref: 'https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf',
      note: 'B1 extends everyday German into explanation, comparison, and opinion-based communication.',
      wordBankLabel: 'Goethe-based B1 cards',
      themes: [
        {
          id: 'b1-opinions',
          title: 'Opinions and arguments',
          summary: 'Say what you think, compare options, and explain reasons more clearly.',
          bullets: ['Give your opinion', 'Compare advantages and disadvantages', 'React politely in discussion'],
          example: 'Meiner Meinung nach ist der Zug in dieser Situation die bessere Alternative.',
        },
        {
          id: 'b1-work',
          title: 'Work, responsibility, and change',
          summary: 'Talk about tasks, qualifications, applications, and workplace situations.',
          bullets: ['Responsibilities and departments', 'Applications and training', 'Problems and solutions'],
          example: 'Meine Ausbildung wurde hier noch nicht anerkannt.',
        },
        {
          id: 'b1-society',
          title: 'Society and everyday issues',
          summary: 'Read and discuss ordinary social topics with more confidence.',
          bullets: ['Environment and public life', 'Rules and services', 'Simple social commentary'],
          example: 'Umweltschutz ist ein aktuelles Thema in vielen Städten.',
        },
        {
          id: 'b1-plans',
          title: 'Plans, choices, and consequences',
          summary: 'Express alternatives, intentions, and what depends on what.',
          bullets: ['Alternatives and conditions', 'Plan with reasons', 'Describe outcomes'],
          example: 'Wir können morgen fahren, allerdings erst nach dem Mittagessen.',
        },
      ],
      grammar: [
        {
          id: 'b1-subclauses',
          title: 'Subordinate clauses',
          summary: 'B1 needs weil, dass, wenn, obwohl, and other clause builders.',
          bullets: ['Verb at the end', 'Use for reasons and conditions', 'Keep the clause complete'],
          example: 'Ich glaube, dass regelmäßiges Lernen wirklich hilft.',
        },
        {
          id: 'b1-reasoning',
          title: 'Explaining and comparing',
          summary: 'Use language that lets you support an opinion instead of just stating one.',
          bullets: ['deshalb, trotzdem, einerseits', 'als and wie comparisons', 'Order ideas clearly'],
          example: 'Der Zug ist langsamer, aber andererseits ist er günstiger.',
        },
        {
          id: 'b1-reflexive',
          title: 'Reflexive and fixed verb patterns',
          summary: 'Many B1 verbs travel with reflexive forms or set prepositions.',
          bullets: ['sich interessieren für', 'abhängen von', 'sich erinnern an', 'Learn them as chunks'],
          example: 'Es hängt vom Wetter ab, ob wir fahren.',
        },
        {
          id: 'b1-word-order',
          title: 'Longer sentence control',
          summary: 'B1 is where connected German starts needing real sentence discipline.',
          bullets: ['Watch the verb position', 'Don’t lose the clause ending', 'Break long thoughts into readable parts'],
          example: 'Obwohl ich müde war, habe ich den Bericht noch fertig geschrieben.',
        },
      ],
    },
  },
}
