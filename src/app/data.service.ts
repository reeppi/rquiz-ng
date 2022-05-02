import { Injectable } from '@angular/core';
import * as models from "./data.models";
import localQuiz from './quiz.json';

@Injectable({ providedIn: 'root' })
export class DataService {

  public questionsData : models.questionsType | null;
  public errorMsg : string ="";
  public editErrorMsg : string ="";
  public username : string ="";
  public password : string ="";

  public online: boolean = false;
  public APIURL: String="";

  public loadingQuiz : boolean =false;

  constructor(){
      this.questionsData = null;
      if ( this.online == true ) 
          this.APIURL = "https://reeppi-quiz.netlify.app";
      else 
          this.APIURL = "http://localhost:8888";
  }

  createNewQuiz() {
    console.log("Uusi visa");
    this.questionsData = { name:"", title:"", questions: [] }
  }

  async updateQuestion(quizName: string | null)
  { 
    this.loadingQuiz=true;
    this.editErrorMsg="";
    if ( quizName == null) return;
    if ( this.questionsData == null ) return;
    this.questionsData.name=quizName;
    console.log("update question");
    const response = await window.fetch(this.APIURL+"/edit?name="+quizName,
    { 
    method: 'post', 
    headers: new Headers({
      'Authorization': 'Basic '+btoa(this.username+':'+this.password), 
      'Content-Type': 'application/json'
      }),
    body : JSON.stringify(this.questionsData)
    });
    if (response.ok) {
      const data  = await response.json();
      if ( data.hasOwnProperty('error') ) 
      {
          this.editErrorMsg = data.error;
      }
    }
    this.loadingQuiz=false;
  }

  async fetchJsonData(quizName: string, edit: boolean) 
  {  
    console.log("Data fetching "+quizName)    
    //this.questionsData = JSON.parse(JSON.stringify(localQuiz));
    //this.questionsData = null;
    //this.createNewQuiz(); 
   
    this.loadingQuiz=true;
    const response = await window.fetch(this.APIURL+"/quiz?name="+quizName);
    if (response.ok) {
       const data  = await response.json();
       if ( data.hasOwnProperty('error') ) 
       {
          this.questionsData = null;
          this.errorMsg = data.error;
          if ( edit ) 
            this.createNewQuiz();
       }
       else 
       {
         this.errorMsg = "";
         this.questionsData  = data;
       }
       console.log("Data : "+ this.questionsData?.name);
    }
    this.loadingQuiz=false;


  }


}