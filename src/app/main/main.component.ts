import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  quizName: string ="";
  errorText: string = "";
  constructor(  private router: Router, public dataService : DataService) { }

  ngOnInit(): void {

    if ( this.dataService.questionsData != null )
      this.quizName = this.dataService.questionsData.name;
    
  }

  scoreBoardClick()
  {
    this.dataService.questionsData = null;
    if ( this.quizName != "")
      this.router.navigateByUrl('/'+this.quizName+'/scores');
    else 
     {
      setTimeout(() => { this.errorText =""}, 5000);
      this.errorText ="Anna visan tunnus";
     }
  }

  quizClick(){
    this.dataService.questionsData = null;
    if ( this.quizName != "")
      this.router.navigateByUrl('/'+this.quizName);
    else 
    {
      setTimeout(() => { this.errorText =""}, 5000);
      this.errorText ="Anna visan tunnus";
    }
  }
  editClick(){
    this.dataService.questionsData = null;
    if ( this.quizName != "")
      this.router.navigateByUrl('/'+this.quizName+'/edit');
    else 
    {
      setTimeout(() => { this.errorText =""}, 5000);
      this.errorText ="Anna visan tunnus";
    }
  }

}
