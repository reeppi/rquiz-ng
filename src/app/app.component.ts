import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent  {

  public constructor(private route: ActivatedRoute,  private router: Router, private dataservice : DataService) {

   }


  
  title = 'TIETOVISA';

 
}
