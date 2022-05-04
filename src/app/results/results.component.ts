import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute  } from '@angular/router';
import * as Models from "../data.models";
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    public dataService : DataService,
     public router: Router) { }

  public quizName :string | null = "";
  name : string="";
  scoreResult : number=0;


  getBackGround(q: number, i: number)
  {
    if ( this.dataService.questionsData ) 
    {
      var question : Models.questionType  =  this.dataService.questionsData.questions[q];
      if ( question.answer == question.true && i == question.answer ) 
        return "#33cc33";
      else if ( question.answer != question.true && i == question.answer ) 
        return "#ff0000";
      else if ( question.true  == i ) 
        return "#ffff00";
    }
    return "#ffffffaa"
  }

  calculateScores()
  {
    if (this.dataService.questionsData  == null) return;
    let questions : Array<Models.questionType>  =  this.dataService.questionsData.questions;
    this.scoreResult=0;
    for ( let i=0;i< questions.length;i++) 
    {
      if ( questions[i].answer == questions[i].true)
        this.scoreResult+=1;
    }
    console.log("scores: "+this.scoreResult);
  }

  async addScoreboard()
  {
    if (this.dataService.questionsData  == null) return;
    if ( this.quizName == null) return;
      await this.dataService.addScoreboard(this.quizName,this.name,this.scoreResult);
    console.log("------"+this.dataService.errorMsg);
    if ( this.dataService.errorMsg == "") 
      this.router.navigateByUrl('/'+this.quizName+'/scores');
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.scoreResult=0;
    this.dataService.errorMsg="";
    this.quizName= routeParams.get('quizName');
    if ( this.quizName ) 
    {
      if ( this.dataService.questionsData == null )
        this.dataService.fetchJsonData(this.quizName,false);
      else
        this.calculateScores();
    }
  }

}
