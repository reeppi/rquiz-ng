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
import { dialogComponent } from '../dialog/dialog.component';
import { imageDialogComponent } from '../dialog/image-dialog.component';
import  * as RecordRTC   from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import {ChangeDetectorRef} from '@angular/core';
import { NgStyle } from '@angular/common';


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
     public dialog: MatDialog,
     private domSanitizer: DomSanitizer,
     private cd : ChangeDetectorRef

     ) { }

  public quizName :string | null = "";
  panelOpenState = false;
  fileName = '';
  selQuestion : number=0;
  uploadingImage : Boolean = false;
  uploadingProgress : number=0;


  public recording = false;
  public url : any;
  public error : string ="";
  public recorder:any;
  public audioBlob: any;
  public seconds: number=0;
  public timerId: any;

  ngOnInit(): void {
    this.dataService.editErrorMsg = "";
    const routeParams = this.route.snapshot.paramMap;
    this.quizName= routeParams.get('quizName');
    if ( this.quizName ) 
    {
      if ( this.dataService.questionsData == null )
      {
        this.fetchQuiz();
      }
    }
  }
  sanitize(url:string){
    return this.domSanitizer.bypassSecurityTrustUrl(url);
}

  initiateRecording() {
    let mediaConstraints = { video: false, audio: true};
    navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.successCallback.bind(this), this.errorCallback.bind(this));
}

successCallback(stream:any) {
    this.seconds=0;
    this.timerId=setInterval(()=>{ this.seconds++; if ( this.seconds >= 60 ) this.stopRecording(); },1000); 
    this.url="";
    this.recording = true;
     this.recorder = new RecordRTC.default(stream,{mimeType:"audio/webm",bitrate:64000});
     this.recorder.startRecording();
}

stopRecording() {
  clearInterval(this.timerId);
  this.recording = false;
  this.recorder.stopRecording(this.audioReady.bind(this));
}

audioReady(blobUrl:any){
  this.url=blobUrl;
  this.audioBlob = this.recorder.getBlob();
  this.cd.detectChanges();
}

errorCallback(error:any) {
  this.dataService.editErrorMsg = 'Mikrofonia ei pääse käyttämään!';
}

saveAudio() {
  var tokeni : string|null = window.sessionStorage.getItem("JWT");
  if ( tokeni == null ) { this.dataService.editErrorMsg = "Kirjaudu ensiksi sisään"; return; }

  this.uploadingImage = true;
  this.uploadingProgress = 0;
  this.cd.detectChanges();

  const formData = new FormData();
  formData.append("audio", this.audioBlob);
  const upload$ = this.http.post<any>(this.dataService.APIURL+"/uploadaudio?name="+this.quizName+"&question="+this.selQuestion, formData,
  {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({ 'Authorization': tokeni })
    }
  );
  upload$.subscribe(event => {
    if (event.type == HttpEventType.UploadProgress) {
        if ( event.total )
        {
          this.uploadingProgress = event.loaded/event.total*100;
          this.cd.detectChanges();
        }
    }
    if ( event.type == HttpEventType.Response) {
      if ( event.body )
      {
        this.uploadingImage = false;
        this.cd.detectChanges();

        if ( event.body.hasOwnProperty('error'))
        {
          this.dataService.editErrorMsg = event.body.error;
        }
        if ( event.body.hasOwnProperty('done'))
        {
          if ( this.dataService.questionsData != null ) 
          {
            console.log("event.body.done "+event.body.done);
             this.dataService.questionsData.questions[this.selQuestion].audio=event.body.done;
          }
        }
      }
    }
  }) 

}



  async fetchQuiz()
  {
    if ( this.quizName == null)  return;
    await this.dataService.fetchJsonData(this.quizName,true,null);
    if ( this.dataService.newQuiz ) {
      const dialogRef = this.dialog.open(dialogComponent,
        {  data: { text:"Tallennetaanko uusi visa "+this.quizName, 
                    buttons: {ok:"Tallenna",cancel:"Keskeytä"}}});
          dialogRef.afterClosed().subscribe(result => 
        { 
          this.dataService.newQuiz= false;
            if ( result ) { this.dataService.updateQuestions(this.quizName); }
        });
    }
  }



  test(x: number){
    console.log(x);
  }

  removeImage(x: number) {
    if ( this.dataService.questionsData == null ) return;
    var imageName: string=this.dataService.questionsData.questions[x].image;
    var image:string=this.dataService.imageUrl+"/"+this.quizName+"/"+imageName;
    const dialogRef = this.dialog.open(imageDialogComponent,{  data: { image:image, question:"Haluatko varmasti poistaa kuvan?", edit:true }});
    dialogRef.afterClosed().subscribe(result => { 
      if ( this.dataService.questionsData != null )
        if ( result )  
          this.dataService.questionsData.questions[x].image="";
    });
  }

  async onFileSelected(event: any) {
    var tokeni : string|null = window.sessionStorage.getItem("JWT");
    if ( tokeni == null ) { this.dataService.editErrorMsg = "Kirjaudu ensiksi sisään"; return; }

    
    await this.dataService.updateQuestions(this.quizName);
    this.uploadingImage = true;
    this.uploadingProgress = 0;

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
    question = { text: "", options:[], true:0, image:"", audio:"", width:0, height:0, answer:null };
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
    const dialogRef = this.dialog.open(dialogComponent,{  data: { text:"Haluatko varmasti poistaa kysymyksen?", buttons :{ok:"Poista", cancel:"Keskeytä"} }});
      dialogRef.afterClosed().subscribe(result => { 
        if ( this.dataService.questionsData != null )
          if ( result )  
            this.dataService.questionsData.questions.splice(index,1);
      });
  }

  deleteQuestions() {
      const dialogRef = this.dialog.open(dialogComponent,{  data: { text:"Haluatko varmasti poistaa visan?", buttons :{ok:"Poista",cancel:"Keskeytä"} }});
      dialogRef.afterClosed().subscribe(result => { if ( result ) this.dataService.deleteQuestions(this.quizName);});
  }

}

/*
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
}*/