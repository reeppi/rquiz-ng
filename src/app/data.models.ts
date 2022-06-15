export type userType = {
  email: string;
  quiz?: string[];
  name?: string;
  max?: string;
  age?: number;
  desc?: string;
  image?: boolean;
  audio?: boolean;
}

export type listQuestionsType = {
  name: string;
  title: string;
  cat: string;
} | null

export type questionsType = {
    name: string;
    title: string;
    questions: Array<questionType>
    public: boolean;
  } | null

export type questionType = {   
    text: string;
    image: string;
    audio: string;
    width: number;
    height: number;
    audioEdit?: {url:string; blob:any };
    options: Array<string>
    true: number;
    answer: number | null;
}

export type scoresType = {
  name: string;
  scores: Array<scoreType>
}

export type scoreType = {   
  name: string;
  score: number;
}