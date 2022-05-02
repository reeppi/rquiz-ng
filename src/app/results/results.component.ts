import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute  } from '@angular/router';
import * as Models from "../data.models";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(private route: ActivatedRoute, public dataService : DataService) { }

  public quizName :string | null = "";

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

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.quizName= routeParams.get('quizName');
    if ( this.quizName ) 
    {
      if ( this.dataService.questionsData == null )
      {
        this.dataService.fetchJsonData(this.quizName,false);
      }
    }
  }

}
