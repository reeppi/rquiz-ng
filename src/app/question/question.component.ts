import { Component, OnInit} from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../data.service';
import * as Models from "../data.models";
import { MatRadioButton } from '@angular/material/radio';
import { Router } from '@angular/router';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})

export class QuestionComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    public dataService : DataService,
    private router: Router
    ) { }

  public questionNumber: number = 1;
  public quizName :string | null = "";

  radioIndex : number | null = null ;

  updateQuestion(index: string ){ 
    this.questionNumber = Number(index);
    if ( this.questionNumber <=0 ) this.questionNumber=1;
    console.log("--->"+ this.questionNumber);
    if ( this.dataService.questionsData != null ) 
     this.radioIndex = this.dataService.questionsData.questions[this.questionNumber-1].answer;
     
  }

  navClick(index : number) {
    this.router.navigateByUrl('/'+this.quizName+'/'+(this.questionNumber+index));
  }
  newQuizClick() {
    this.router.navigateByUrl('/'+this.quizName+'/edit');
  }

  navResults() {
    this.router.navigateByUrl('/'+this.quizName+'/results');
  }

  radioChange(value: any)
  {
    console.log("Change : "+ value);
    if ( this.dataService.questionsData != null ) 
      this.dataService.questionsData.questions[this.questionNumber-1].answer=value;
  }



  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.route.params.subscribe(routeParams => {
        this.updateQuestion(routeParams['questionNumber']);
    });
 
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
