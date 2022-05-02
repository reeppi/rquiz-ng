export type questionsType = {
    name: string;
    title: string;
    questions: Array<questionType>
  } | null
  
export type questionType = {   
    text: string;
    options: Array<string>
    true: number;
    answer: number | null;
}