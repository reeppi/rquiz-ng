import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../data.service';
import * as Models from "../data.models";
import { Router } from '@angular/router';
import { BrowserModule, Title } from '@angular/platform-browser';
import {MatDialog,MatDialogConfig,MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute, 
    public dataService : DataService,
     public router: Router,
     private title:Title,
     public dialog: MatDialog) { }

  public quizName :string | null = "";
  panelOpenState = false;
  fileName = '';
  selQuestion : number=0;
  uploadingImage : Boolean = false;
  uploadingProgress : number=0;

  ngOnInit(): void {
    this.dataService.editErrorMsg = "";
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

  test(x: number){
    console.log(x);
  }

  removeImage(x: number) {
    const dialogRef = this.dialog.open(deleteQuestionsComponent,{  data: { question:"Haluatko varmasti poistaa kuvan?" }});
    dialogRef.afterClosed().subscribe(result => { 
      if ( this.dataService.questionsData != null )
        if ( result )  
          this.dataService.questionsData.questions[x].image="";
    });
  }

  async onFileSelected(event: any) {

    await this.dataService.updateQuestions(this.quizName);
    this.uploadingImage = true;
    this.uploadingProgress = 0;
    var tokeni : string|null = window.sessionStorage.getItem("JWT");
    if ( tokeni == null ) { this.dataService.editErrorMsg = "Kirjaudu ensiksi sisään"; return; }
    var uploadSub: Subscription;    
    const file:File = event.target.files[0];
    if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("image", file);
        const upload$ = this.http.post<any>(this.dataService.APIURL+"/upload?name="+this.quizName+"&question="+this.selQuestion, formData,
        {
            reportProgress: true,
            observe: 'events',
            headers: new HttpHeaders({ 'Authorization': tokeni })
          }
          );
        uploadSub = upload$.subscribe(event => {
          if (event.type == HttpEventType.UploadProgress) {
              if ( event.total )
                this.uploadingProgress = event.loaded/event.total*100;
          }
          if ( event.type == HttpEventType.Response) {
            if ( event.body )
            {
              this.uploadingImage = false;
              if ( event.body.hasOwnProperty('error'))
              {
                this.dataService.editErrorMsg = event.body.error;
              }
              if ( event.body.hasOwnProperty('done'))
              {
                 if ( this.dataService.questionsData != null ) 
                 {
                    this.dataService.questionsData.questions[this.selQuestion].image=event.body.done; 
                    this.dataService.questionsData.questions[this.selQuestion].width=event.body.width;
                    this.dataService.questionsData.questions[this.selQuestion].height=event.body.height;
                 }
              }
            }
          }
        })        
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
    question = { text: "", options:[], true:0, image:"", width:0, height:0, answer:null };
    this.dataService.questionsData.questions.push(question);
    this.selQuestion=this.dataService.questionsData.questions.length-1;
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
    const dialogRef = this.dialog.open(deleteQuestionsComponent,{  data: { question:"Haluatko varmasti poistaa kysymyksen?" }});
      dialogRef.afterClosed().subscribe(result => { 
        if ( this.dataService.questionsData != null )
          if ( result )  
            this.dataService.questionsData.questions.splice(index,1);
      });
  }

  deleteQuestions() {
    const dialogRef = this.dialog.open(deleteQuestionsComponent,{  data: { question:"Haluatko varmasti poistaa visan?" }});
    dialogRef.afterClosed().subscribe(result => { if ( result ) this.dataService.deleteQuestions(this.quizName);});
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.html',
})
export class deleteQuestionsComponent {
  constructor(public dialogRef: MatDialogRef<deleteQuestionsComponent>, @Inject(MAT_DIALOG_DATA) public data: { question:string }) {}
  cancel() {
    this.dialogRef.close(false);
  }
  delete() {
    this.dialogRef.close(true);
  }
}