import React from 'react';
import Math from 'app/src/lib/icons/Assistants/Math';
import Facts from 'app/src/lib/icons/Assistants/Facts';
import Email from 'app/src/lib/icons/Assistants/Email';
import Travel from 'app/src/lib/icons/Assistants/Travel';
import Health from 'app/src/lib/icons/Assistants/Health';
import Support from 'app/src/lib/icons/Assistants/Support';
import Recipes from 'app/src/lib/icons/Assistants/Recipes';
import Technology from 'app/src/lib/icons/Assistants/Technology';
import Programming from 'app/src/lib/icons/Assistants/Programming';
import Translation from 'app/src/lib/icons/Assistants/Translation';

export const ASSISTANTS = [
  {
    id: 1,
    icon: <Travel />,
    name: {
      en: 'Travel',
      fr: 'Voyage',
      ar: 'سفر',
    },
    description: {
      en: 'Get destination recommendations, travel hacks, and packing guidelines',
      fr: "Obtenez des recommandations de destination, des astuces de voyage et des consignes d'emballage",
      ar: 'احصل على توصيات بشأن الوجهة ، واختراقات السفر ، وإرشادات التعبئة',
    },
    questions: {
      en: [
        'What are some must-visit places in Paris?',
        'How do I find affordable accommodation for my trip?',
        'What essential items should I pack for a beach vacation?',
      ],
      fr: [
        'Quels sont les lieux incontournables à visiter à Paris?',
        'Comment trouver un logement pas cher pour mon voyage?',
        'Quels articles essentiels dois-je emporter pour des vacances à la plage?',
      ],
      ar: [
        'ما هي بعض الأماكن التي يجب زيارتها في باريس؟',
        'كيف أجد سكنًا ميسور التكلفة لرحلتي؟',
        'ما هي العناصر الأساسية التي يجب أن أحزمها لقضاء إجازة على الشاطئ؟',
      ],
    },
  },
  {
    id: 2,
    icon: <Email />,
    name: {
      en: 'Email Writing',
      fr: "Rédaction d'e-mails",
      ar: 'كتابة البريد الإلكتروني',
    },
    description: {
      en: 'Get tips and guidance on writing effective and professional emails for various purposes',
      fr: "Obtenez des conseils et des conseils sur la rédaction d'e-mails efficaces et professionnels à diverses fins",
      ar: 'احصل على نصائح وإرشادات حول كتابة رسائل بريد إلكتروني فعالة ومهنية لأغراض مختلفة',
    },
    questions: {
      en: [
        'How do I write a formal email to inquire about a job opening?',
        'Can you provide tips on writing a persuasive email for a business proposal?',
        'What should I consider when composing a professional thank-you email after an interview?',
      ],
      fr: [
        "Comment puis-je écrire un e-mail formel pour me renseigner sur une offre d'emploi?",
        "Pouvez-vous donner des conseils sur la rédaction d'un e-mail persuasif pour une proposition commerciale?",
        "Que dois-je prendre en compte lors de la rédaction d'un e-mail de remerciement professionnel après un entretien?",
      ],
      ar: [
        'كيف أكتب بريدًا إلكترونيًا رسميًا للاستعلام عن وظيفة شاغرة؟',
        'هل يمكنك تقديم نصائح حول كتابة بريد إلكتروني مقنع لاقتراح عمل؟',
        'ما الذي يجب علي مراعاته عند كتابة رسالة شكر مهنية بعد إجراء مقابلة؟',
      ],
    },
  },
  {
    id: 3,
    icon: <Translation />,
    name: {
      en: 'Translation',
      fr: 'Traduction',
      ar: 'ترجمة',
    },
    description: {
      en: 'Translate phrases or sentences between multiple languages quickly and accurately',
      fr: 'Traduire des expressions ou des phrases entre plusieurs langues rapidement et avec précision',
      ar: 'ترجمة العبارات أو الجمل بين لغات متعددة بسرعة ودقة',
    },
    questions: {
      en: [
        'How do you say "Hello, how are you?" in Spanish?',
        'What\'s the French translation for "Thank you"?',
        'Translate the phrase "Good morning" into Japanese',
      ],
      fr: [
        'Comment dit-on "Bonjour, comment vas-tu ?" en espagnol?',
        'Quelle est la traduction française de "Merci"?',
        'Traduisez la phrase "Bonjour" en japonais',
      ],
      ar: ['كيف تقول "مرحبا كيف حالك" بالإسبانية؟', 'ما هي الترجمة الفرنسية لكلمة "شكرًا"؟', 'ترجمة عبارة "صباح الخير" إلى اليابانية'],
    },
  },
  {
    id: 4,
    icon: <Technology />,
    name: {
      en: 'Technology',
      fr: 'Technologie',
      ar: 'تكنولوجيا',
    },
    description: {
      en: 'Stay up-to-date with the latest in the tech world',
      fr: 'Restez à jour avec les dernières nouveautés du monde de la technologie',
      ar: 'ابق على اطلاع بأحدث المستجدات في عالم التكنولوجيا',
    },
    questions: {
      en: [
        'What are the latest tech news headlines?',
        'Tell me about the recent advancements in artificial intelligence.',
        "What's the release date for the new iPhone model?",
      ],
      fr: [
        "Quels sont les derniers titres de l'actualité technologique?",
        "Parlez-moi des avancées récentes de l'intelligence artificielle.",
        "Quelle est la date de sortie du nouveau modèle d'iPhone ?",
      ],
      ar: ['ما هي آخر عناوين الأخبار التقنية؟', 'أخبرني عن التطورات الأخيرة في الذكاء الاصطناعي.', 'ما هو تاريخ إصدار طراز iPhone الجديد؟'],
    },
  },
  {
    id: 5,
    icon: <Programming />,
    name: {
      en: 'Programming',
      fr: 'Programmation',
      ar: 'برمجة',
    },
    description: {
      en: 'Get coding examples, explanations, and programming concepts',
      fr: 'Obtenez des exemples de codage, des explications et des concepts de programmation',
      ar: 'احصل على أمثلة حول الترميز وشروحات ومفاهيم البرمجة',
    },
    questions: {
      en: [
        'How do I declare a variable in Python?',
        'Explain the concept of object-oriented programming.',
        'Can you provide an example of a for loop in JavaScript?',
      ],
      fr: [
        'Comment déclarer une variable en Python ?',
        'Expliquer le concept de programmation orientée objet.',
        'Pouvez-vous fournir un exemple de boucle for en JavaScript?',
      ],
      ar: ['كيف يمكنني التصريح عن متغير في بايثون؟', 'اشرح مفهوم البرمجة الشيئية.', 'هل يمكنك تقديم مثال عن حلقة for في JavaScript؟'],
    },
  },
  {
    id: 6,
    icon: <Math />,
    name: {
      en: 'Math',
      fr: 'Mathématiques',
      ar: 'رياضيات',
    },
    description: {
      en: 'Need help with math problems? Get assistance with calculations, equations, and more',
      fr: "Besoin d'aide avec des problèmes de mathématiques? Obtenez de l'aide pour les calculs, les équations, etc.",
      ar: 'هل تود مساعدة لحل مشاكل الحساب؟ احصل على مساعدة في العمليات الحسابية والمعادلات والمزيد',
    },
    questions: {
      en: [
        'What is the square root of 225?',
        'Can you help me solve this equation: 3x + 7 = 22?',
        'Calculate the area of a circle with a radius of 5 units.',
      ],
      fr: [
        'Quelle est la racine carrée de 225 ?',
        "Pouvez-vous m'aider à résoudre cette équation : 3x + 7 = 22 ?",
        "Calculer l'aire d'un cercle de rayon 5 unités.",
      ],
      ar: ['ما هو الجذر التربيعي للرقم 225؟', 'هل يمكنك مساعدتي في حل هذه المعادلة: 3x + 7 = 22؟', 'احسب مساحة دائرة نصف قطرها 5 وحدات.'],
    },
  },
  {
    id: 7,
    icon: <Recipes />,
    name: {
      en: 'Recipes',
      fr: 'Recettes',
      ar: 'وصفات',
    },
    description: {
      en: 'Get guided through the steps to create mouthwatering dishes.',
      fr: 'Laissez-vous guider à travers les étapes pour créer des plats appétissants.',
      ar: 'احصل على إرشاد من خلال الخطوات لإعداد أطباق شهية.',
    },
    questions: {
      en: [
        'Can you provide a recipe for spaghetti carbonara?',
        'How do I make a classic chocolate chip cookie?',
        'What are the ingredients and steps to prepare chicken curry?',
      ],
      fr: [
        'Pouvez-vous donner une recette de spaghetti carbonara?',
        'Comment faire un cookie classique aux pépites de chocolat ?',
        'Quels sont les ingrédients et les étapes pour préparer le curry de poulet ?',
      ],
      ar: ['هل يمكنك تقديم وصفة معكرونة كاربونارا؟', 'كيف أصنع كعكة كلاسيكية برقائق الشوكولاتة؟', 'ما هي مكونات وخطوات تحضير الدجاج بالكاري؟'],
    },
  },
  {
    id: 8,
    icon: <Facts />,
    name: {
      en: 'Facts',
      fr: 'Faits',
      ar: 'حقائق',
    },
    description: {
      en: 'Expand your knowledge with fascinating and fun facts on various topics',
      fr: 'Développez vos connaissances avec des faits fascinants et amusants sur divers sujets',
      ar: 'قم بتوسيع معرفتك بحقائق رائعة وممتعة حول مواضيع مختلفة',
    },
    questions: {
      en: [
        'Tell me an interesting fact about the Great Wall of China.',
        "What's a surprising fact about elephants?",
        'Share a fun historical fact from the 18th century.',
      ],
      fr: [
        'Racontez-moi un fait intéressant sur la Grande Muraille de Chine.',
        "Qu'y a-t-il de surprenant à propos des éléphants?",
        'Partagez un fait historique amusant du 18ème siècle.',
      ],
      ar: ['قل لي حقيقة مثيرة للاهتمام حول سور الصين العظيم.', 'ما هي الحقيقة المدهشة عن الفيلة؟', 'شارك حقيقة تاريخية مرحة من القرن الثامن عشر.'],
    },
  },

  {
    id: 9,
    icon: <Support />,
    name: {
      en: 'Support',
      fr: 'Support',
      ar: 'دعم',
    },
    description: {
      en: 'Resolve problems with your devices and software',
      fr: 'Résoudre les problèmes avec vos appareils et logiciels',
      ar: 'حل المشاكل مع أجهزتك وبرامجك',
    },
    questions: {
      en: [
        'My computer is not starting up. What should I do?',
        'How do I troubleshoot internet connection issues?',
        'Can you help me resolve a software installation problem?',
      ],
      fr: [
        'Mon ordinateur ne démarre pas. Que dois-je faire?',
        'Comment résoudre les problèmes de connexion Internet ?',
        "Pouvez-vous m'aider à résoudre un problème d'installation de logiciel ?",
      ],
      ar: [
        'جهاز الكمبيوتر الخاص بي لا يعمل. ماذا علي أن أفعل؟',
        'كيف يمكنني استكشاف مشكلات الاتصال بالإنترنت وإصلاحها؟',
        'هل يمكنك مساعدتي في حل مشكلة تثبيت البرنامج؟',
      ],
    },
  },
  {
    id: 10,
    icon: <Health />,
    name: {
      en: 'Health',
      fr: 'Santé',
      ar: 'صحة',
    },
    description: {
      en: 'Find workout routines, nutrition tips, and wellness advice',
      fr: "Trouvez des routines d'entraînement, des conseils nutritionnels et des conseils de bien-être",
      ar: 'ابحث عن روتين التمارين ونصائح التغذية ونصائح العافية',
    },
    questions: {
      en: [
        'What are some effective exercises for core strength?',
        'Can you suggest a 30-minute home workout routine?',
        'How important is stretching before and after exercise?',
      ],
      fr: [
        'Quels sont les exercices efficaces pour la force de base?',
        "Pouvez-vous suggérer une routine d'entraînement à domicile de 30 minutes?",
        'How important is stretching before and after exercise?',
      ],
      ar: [
        'ما هي بعض التمارين الفعالة للقوة الأساسية؟',
        'هل يمكنك اقتراح نظام تمرين منزلي مدته 30 دقيقة؟',
        'ما هي أهمية تمارين الإطالة قبل وبعد التمرين؟',
      ],
    },
  },
];
