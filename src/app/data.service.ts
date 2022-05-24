import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as models from "./data.models";
import localQuiz from './quiz.json';

@Injectable({ providedIn: 'root' })
export class DataService {

  public listQuestionsData : models.listQuestionsType[] | null;
  public questionsData : models.questionsType | null;
  public scoresData : models.scoresType | null;
  public listQuizData : string[]=[];
  public errorMsg : string ="";
  public editErrorMsg : string ="";
  public username : string ="";
  public password : string ="";
  public APIURL: String="";
  public loadingQuiz : boolean =false;
  public online: boolean = false;
  public title = "TIETOVISA";
  public ssl : boolean = true;
  public token : string="";

  constructor( private cookieService: CookieService ){
      console.log (" :: "+window.location.hostname);
      this.questionsData = null;
      this.scoresData = null;
      this.listQuestionsData = null;
 
      if ( !this.ssl ) 
        this.APIURL = "http://localhost:8888";
      else
        this.APIURL = "https://localhost:8888";

      if (  window.location.hostname== "tietovisa.netlify.app" ) 
          this.APIURL = "https://reeppi-quiz.netlify.app";
      console.log("APIURL : "+ this.APIURL);
  }

  createNewQuiz() {
    console.log("Uusi visa");
    this.questionsData = { name:"", title:"", public:false, questions: [] }
  }



  async deleteQuestions(quizName: string | null) 
  {
    this.errorMsg ="";
    var tokeni : string|null = window.sessionStorage.getItem("JWT");
    if ( tokeni == null ) { this.editErrorMsg = "Kirjaudu ensiksi sisään"; return; }

    this.loadingQuiz=true;
    this.editErrorMsg="";
    const response = await window.fetch(this.APIURL+"/delete?name="+quizName,
    { 
    method: 'get', 
    headers: new Headers({
      'Authorization': tokeni, 
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
    
    this.loadingQuiz=false;
    
  }

  async updateQuestions(quizName: string | null)
  { 
    this.errorMsg ="";
    var tokeni : string|null = window.sessionStorage.getItem("JWT");
    if ( tokeni == null ) { this.editErrorMsg = "Kirjaudu ensiksi sisään"; return; }

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
     // 'Authorization': 'Basic '+btoa(this.username+':'+this.password), 
      'Authorization': tokeni,
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
    this.errorMsg ="";
    var tokeni : string|null = window.sessionStorage.getItem("JWT");
    if ( tokeni == null ) { 
      this.errorMsg = "Pistetaulu on vain kirjautuneille,";
      return; 
      }

    console.log("Adding to scoreboard "+name+":"+score);
    var scoreStr=score.toString();
    this.errorMsg ="";
    const response = await window.fetch(this.APIURL+"/addscore?name="+quizName+"&scorename="+name+"&score="+scoreStr, 
                { headers: new Headers({'Authorization': tokeni}) });
    if (response.ok) {
      const data  = await response.json();
      if ( data.hasOwnProperty('error') ) 
          this.errorMsg = data.error;
    } else
      this.errorMsg = "Yhteys virhe";
  }


  async fetchListQuestions() 
  {  
    if ( this.listQuestionsData != null ) return;

    console.log("fetch lista");
    const response = await window.fetch(this.APIURL+"/listall");
    this.loadingQuiz=false;
    if (response.ok) {
       this.listQuestionsData = await response.json();
    }
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

  async getToken(code : string)
  {
    this.errorMsg ="";
    const response = await window.fetch(this.APIURL+"/getToken?code="+code);
    if (response.ok) {
      const data  = await response.json();
      if ( data.hasOwnProperty('error') ) 
         this.errorMsg = data.error;
      if ( data.hasOwnProperty('token') ) 
      {
         console.log("token haettu.");
         window.sessionStorage.setItem("JWT", data.token);
         this.token = data.token;
         if ( data.hasOwnProperty('msg') )
            this.errorMsg = data.msg;
      }
    }
  }

  async fetchQuizes() {

    this.errorMsg ="";
    var tokeni : string|null = window.sessionStorage.getItem("JWT");
    if ( tokeni == null ) { return; }

    const response = await window.fetch(this.APIURL+"/list",{ headers: new Headers({'Authorization': tokeni}) } );
    if (response.ok)
      {
      const data  = await response.json();
      if ( data.hasOwnProperty('error') ) 
         this.errorMsg = data.error;
      if ( data.hasOwnProperty('quiz') ) 
      {
        console.log("Kaikki visat : "+data.quiz);
        this.listQuizData=data.quiz;
      }
    }
  }
  
  async profileTest() 
  {
    this.errorMsg ="";
    var tokeni : string|null = window.sessionStorage.getItem("JWT");
    if ( tokeni == null ) { this.errorMsg = "Kirjaudu ensiksi sisään"; return; }

    const response = await window.fetch(this.APIURL+"/profile",{ headers: new Headers({'Authorization': tokeni}) } );
    if (response.ok)
      {
      const data  = await response.json();
      if ( data.hasOwnProperty('error') ) 
          this.errorMsg = data.error;
      }

    
  }

}