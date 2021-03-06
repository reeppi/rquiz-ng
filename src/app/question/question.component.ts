import { Component, OnInit,Inject} from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../data.service';
import * as Models from "../data.models";
import { MatRadioButton } from '@angular/material/radio';
import { Router } from '@angular/router';
import {MatDialog,MatDialogConfig,MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { imageDialogComponent } from '../dialog/image-dialog.component';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})

export class QuestionComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    public dataService : DataService,
    private router: Router,
    public dialog: MatDialog
    ) { }

  public questionNumber: number = 1;
  public quizName :string | null = "";

  radioIndex : number | null = null ;

  updateQuestion(index: string ){ 
    this.questionNumber = Number(index);
    if ( this.questionNumber <=0 ) this.questionNumber=1;
    if ( this.dataService.questionsData != null ) 
     this.radioIndex = this.dataService.questionsData.questions[this.questionNumber-1].answer;

     var pp = document.getElementById("player") as any;
     if ( pp != null)  pp.load();
     
  }

  navClick(index : number) {
    this.router.navigateByUrl('/'+this.quizName+'/'+(this.questionNumber+index));
  }
  newQuizClick() {
    this.router.navigateByUrl('/'+this.quizName+'/edit');
  }

  navMain() {
    this.router.navigateByUrl('/');
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
        this.quizName=this.quizName.toLowerCase()
      if ( this.dataService.questionsData == null )
      {
        this.dataService.fetchJsonData(this.quizName,false,null);
      }
    }
  }

  openImage(qNumber:number) {
    if ( this.dataService.questionsData == null ) return;
    var imageName: string=this.dataService.questionsData.questions[qNumber-1].image;
    var image:string=this.dataService.imageUrl+"/"+this.quizName+"/images/"+imageName;
    const dialogRef = this.dialog.open(imageDialogComponent,{  data: { image, edit:false}});
    dialogRef.afterClosed().subscribe(result => {});
  }

}

