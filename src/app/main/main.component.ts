import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('selectQuiz') selectQuiz : any;

  quizName: string =""; 
  errorText: string = "";
  constructor(  private router: Router, public dataService : DataService, private route: ActivatedRoute) { 

  }

  ngOnInit(): void {

    this.dataService.listQuizData = []; // omat visat
    this.dataService.errorMsg ="";   
    if ( this.dataService.questionsData != null )
      this.quizName = this.dataService.questionsData.name;

      this.route.queryParams
      .subscribe(params => {
        this.newCode(params["code"]);
      });

  }

  scoreBoardClick()
  {
    this.dataService.questionsData = null;
    if ( this.quizName != "")
      this.router.navigateByUrl('/'+this.quizName+'/scores');
    else 
     {
      setTimeout(() => { this.errorText =""}, 5000);
      this.errorText ="Anna visan tunnus!";
     }
  }

  changeList(value: any) {
    this.quizName= value;
  }

  listQuizClick(q: any) {
    console.log("click click");
    this.quizName = q.name;
  }

  listAllOpened() {
    console.log("ladataan lista");
  }

  async listClick(){
    if ( this.dataService.listQuizData.length == 0 ) 
      await this.dataService.fetchQuizes();
    setTimeout( function (a: any){ a.open(); }, 100, this.selectQuiz);
  }

  quizClick(){
    this.dataService.questionsData = null;
    if ( this.quizName != "")
      this.router.navigateByUrl('/'+this.quizName);
    else 
    {
      setTimeout(() => { this.errorText =""}, 5000);
      this.errorText ="Anna visan tunnus!";
    }
  }

  editClick(){
    this.dataService.questionsData = null;
    if ( this.quizName != "")
      this.router.navigateByUrl('/'+this.quizName+'/edit');
    else 
    {
      setTimeout(() => { this.errorText =""}, 5000);
      this.errorText ="Anna visan tunnus!";
    }
  }

  async loginGoogle() 
  {
    window.open(this.dataService.APIURL+'/auth/google','_self');
  }

  async loginFacebook() 
  {
    window.open(this.dataService.APIURL+'/auth/facebook','_self');
  }

  async newCode(code : string|null) 
  {
     if ( code != null )
     {
       console.log("CODE "+code+"!!!!");
       this.router.navigateByUrl('/');
       this.dataService.getToken(code);
     }
  }
  
 
}
