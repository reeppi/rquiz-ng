import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import {MatDialog } from '@angular/material/dialog';
import { dialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent  {

  public constructor(public dialog: MatDialog) {

   }

  infoDialog() {

    const dialogRef = this.dialog.open(dialogComponent,
      {  data: { text:'tuomas.kokki@outlook.com', 
                  buttons: {ok:"Sulje"}}});
        dialogRef.afterClosed().subscribe(result => 
      { 
      });

  }
  
  title = 'TIETOVISA';

 
}
