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
    name: 'Travel',
    description: 'Get destination recommendations, travel hacks, and packing guidelines',
    questions: [
      'What are some must-visit places in Paris?',
      'How do I find affordable accommodation for my trip?',
      'What essential items should I pack for a beach vacation?',
    ],
  },
  {
    id: 2,
    icon: <Email />,
    name: 'Email Writing',
    description: 'Get tips and guidance on writing effective and professional emails for various purposes',
    questions: [
      'How do I write a formal email to inquire about a job opening?',
      'Can you provide tips on writing a persuasive email for a business proposal?',
      'What should I consider when composing a professional thank-you email after an interview?',
    ],
  },
  {
    id: 3,
    icon: <Translation />,
    name: 'Translation',
    description: 'Translate phrases or sentences between multiple languages quickly and accurately',
    questions: [
      'How do you say "Hello, how are you?" in Spanish?',
      'What\'s the French translation for "Thank you"?',
      'Translate the phrase "Good morning" into Japanese',
    ],
  },
  {
    id: 4,
    icon: <Technology />,
    name: 'Technology',
    description: 'Stay up-to-date with the latest in the tech world',
    questions: [
      'What are the latest tech news headlines?',
      'Tell me about the recent advancements in artificial intelligence.',
      "What's the release date for the new iPhone model?",
    ],
  },
  {
    id: 5,
    icon: <Programming />,
    name: 'Programming',
    description: 'Get coding examples, explanations, and programming concepts',
    questions: [
      'How do I declare a variable in Python?',
      'Explain the concept of object-oriented programming.',
      'Explain the concept of object-oriented programming.',
    ],
  },
  {
    id: 6,
    icon: <Math />,
    name: 'Math',
    description: 'Need help with math problems? Get assistance with calculations, equations, and more',
    questions: [
      'What is the square root of 225?',
      'Can you help me solve this equation: 3x + 7 = 22?',
      'Calculate the area of a circle with a radius of 5 units.',
    ],
  },
  {
    id: 7,
    icon: <Recipes />,
    name: 'Recipes',
    description: 'Get guided through the steps to create mouthwatering dishes.',
    questions: [
      'Can you provide a recipe for spaghetti carbonara?',
      'How do I make a classic chocolate chip cookie?',
      'What are the ingredients and steps to prepare chicken curry?',
    ],
  },
  {
    id: 8,
    icon: <Facts />,
    name: 'Facts',
    description: 'Expand your knowledge with fascinating and fun facts on various topics',
    questions: [
      'Tell me an interesting fact about the Great Wall of China.',
      "What's a surprising fact about elephants?",
      'Share a fun historical fact from the 18th century.',
    ],
  },

  {
    id: 9,
    icon: <Support />,
    name: 'Support',
    description: 'Resolve problems with your devices and software',
    questions: [
      'My computer is not starting up. What should I do?',
      'How do I troubleshoot internet connection issues?',
      'Can you help me resolve a software installation problem?',
    ],
  },
  {
    id: 10,
    icon: <Health />,
    name: 'Health',
    description: 'Find workout routines, nutrition tips, and wellness advice',
    questions: [
      'What are some effective exercises for core strength?',
      'Can you suggest a 30-minute home workout routine?',
      'How important is stretching before and after exercise?',
    ],
  },
];