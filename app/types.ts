

export interface Character {
  id: number;
  name: string;
  image: string;
  bio: {
    alternativeNames?: string[] | string;
    nationality?: string;
    ethnicity?: string;
    ages?: string[] | string;
    born?: string;
    died?: string[] | string;
  };
  personalInformation?: {
    loveInterest?: string;
    weaponsOfChoice?: string[] | string;
    fightingStyles?: string[] | string;
  };
}

export interface Episode {
    id: number;
    Season: string; 
    NumInSeason: string; 
    Title: string;
    OriginalAirDate: string;
    Description?: string; 
}
export interface Store {
  name: string;
  latitude: number;
  longitude: number;
  element: "fire" | "water" | "earth" | "air";
  address: string;
  rating: number;

}



//quizz
export type AnswerKey = 'a' | 'b' | 'c' | 'd'; // belangrijk voor welke knop er word gekozen
// de reden waarom ik dit apart als type en niet inline in de interface eb gedaan is zodat k dit kan hergebruiken
export interface ApiQuestions {
    id: number;
    question: string;
    possibleAnsers: string[];
    correctAnswer: string;
}

export interface Answers {
    a: string;
    b: string;
    c: string;
    d: string;
}

export interface QuizQuestion {
    _id: string;
    question: string;
    answers: Answers;
    correctAnswer: AnswerKey;
    correctAnswerText: string;
}
