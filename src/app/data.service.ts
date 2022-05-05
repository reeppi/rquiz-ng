import { Injectable } from '@angular/core';
import * as models from "./data.models";
import localQuiz from './quiz.json';

@Injectable({ providedIn: 'root' })
export class DataService {

  public questionsData : models.questionsType | null;
  public scoresData : models.scoresType | null;
  public errorMsg : string ="";
  public editErrorMsg : string ="";
  public username : string ="";
  public password : string ="";
  public APIURL: String="";
  public loadingQuiz : boolean =false;
  public online: boolean = false;
  public title = "TIETOVISA";

  constructor(){
      console.log (" :: "+window.location.hostname);
      this.questionsData = null;
      this.scoresData = null;
      this.APIURL = "http://localhost:8888";
      if (  window.location.hostname== "tietovisa.netlify.app" ) 
          this.APIURL = "https://reeppi-quiz.netlify.app";
      console.log("APIURL : "+ this.APIURL);
  }

  createNewQuiz() {
    console.log("Uusi visa");
    this.questionsData = { name:"", title:"", questions: [] }
  }


  async deleteQuestions(quizName: string | null) 
  {
    this.editErrorMsg="";
    const response = await window.fetch(this.APIURL+"/delete?name="+quizName,
    { 
    method: 'get', 
    headers: new Headers({
      'Authorization': 'Basic '+btoa(this.username+':'+this.password), 
      'Content-Type': 'application/json'
      }),
    });
    if (response.ok) {
      const data  = await response.json();
      if ( data.hasOwnProperty('error') ) 
        this.editErrorMsg = data.error;
      if ( data.hasOwnProperty('done') )
        {
          this.editErrorMsg = data.done;
          if ( this.questionsData) 
          {
          this.questionsData.questions = [];
          this.questionsData.title =""; 
          }
        }
    } else
      this.editErrorMsg = "Yhteys virhe";
  }

  async updateQuestions(quizName: string | null)
  { 
    this.loadingQuiz=true;
    this.editErrorMsg="";
    if ( quizName == null) return;
    if ( this.questionsData == null ) return;
    this.questionsData.name=quizName;
    console.log("update questions");
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
          this.editErrorMsg = data.error;
    }
    this.loadingQuiz=false;
  }

  async addScoreboard(quizName: string, name: string, score: number) 
  {
    console.log("Adding to scoreboard "+name+":"+score);
    var scoreStr=score.toString();
    this.errorMsg ="";
    const response = await window.fetch(this.APIURL+"/addscore?name="+quizName+"&scorename="+name+"&score="+scoreStr);
    if (response.ok) {
      const data  = await response.json();
      if ( data.hasOwnProperty('error') ) 
          this.errorMsg = data.error;
    } else
      this.errorMsg = "Yhteys virhe";
  }

  async fetchJsonData(quizName: string, edit: boolean) 
  {  
    console.log("Data fetching "+quizName)    
    //this.questionsData = JSON.parse(JSON.stringify(localQuiz));
    //this.questionsData = null;
    //this.createNewQuiz(); 
   
    
    this.loadingQuiz=true;
    const response = await window.fetch(this.APIURL+"/quiz?name="+quizName);
    this.loadingQuiz=false;
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
       console.log("DataName : "+ this.questionsData?.name);
    }
  }

  
  async fetchScores(quizName: string) 
  {
    this.loadingQuiz=true;
    const response = await window.fetch(this.APIURL+"/scoreboard?name="+quizName);
    this.loadingQuiz=false;
    if (response.ok) {
       const data  = await response.json();
       if ( data.hasOwnProperty('error') ) 
       {
          this.scoresData = null;
          this.errorMsg = data.error;
       }
       else 
       {
         this.errorMsg = "";
         this.scoresData  = data;
       }
       console.log("Fetched scores : "+ this.scoresData?.name);
    }
    
  }



}