import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../data.service';
import * as Models from "../data.models";
import { Router } from '@angular/router';
import { BrowserModule, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    public dataService : DataService,
     private router: Router,
     private title:Title) { }

  public quizName :string | null = "";
  panelOpenState = false;

  ngOnInit(): void {

    const routeParams = this.route.snapshot.paramMap;
    this.quizName= routeParams.get('quizName');
    if ( this.quizName ) 
    {
      if ( this.dataService.questionsData == null )
      {
        this.dataService.fetchJsonData(this.quizName,true);
      }
    }
  }

  optionChanged(event: any,index:number,qIndex:number)
  {
    if ( this.dataService.questionsData == null ) return;
    let option: string = event.target.value
    this.dataService.questionsData.questions[qIndex].options[index] = option;
  }

  testChange()
  {
   if ( this.dataService.questionsData == null ) return;
  }

  openQuiz()
  {
    this.router.navigateByUrl('/'+this.quizName);
  }

  
  addQuestion()
  {
    if ( this.dataService.questionsData == null ) return;
    let question : Models.questionType;
    question = { text: "", options:[], true:0,answer:null };
    this.dataService.questionsData.questions.push(question);
  }

  addOption(option : string, qIndex : number) 
  {
    if ( this.dataService.questionsData == null ) return;  
    this.dataService.questionsData.questions[qIndex].options.push(option);    
  }

  removeOption(index : number, qIndex : number) 
  {
    if ( this.dataService.questionsData == null ) return;
    this.dataService.questionsData.questions[qIndex].options.splice(index,1);
  }

  removeQuestion(index: number)
  {
    if ( this.dataService.questionsData == null ) return;
   this.dataService.questionsData?.questions.splice(index,1);
  }

}
