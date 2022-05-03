import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    public dataService : DataService,
    private router: Router
    ) { }
  
  public quizName :string | null = "";
 
  displayedColumns: string[] = ['position', 'name', 'score'];

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.quizName= routeParams.get('quizName');
    if ( this.quizName ) 
      {
    //  if ( this.dataService.scoresData == null )
    //  {
        this.dataService.fetchScores(this.quizName);
     // }
    }
  }

}
