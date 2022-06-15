import { Component, OnInit,Inject ,ElementRef,ViewChild} from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../data.service';
import * as Models from "../data.models";
import { Router } from '@angular/router';
import {MatDialog,MatDialogConfig,MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { dialogComponent } from '../dialog/dialog.component';
import {ChangeDetectorRef} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    public dataService : DataService,
    public  router: Router,
    public dialog: MatDialog
    ) { }

    errorMsg:string="";
    ngOnInit(): void {
      this.startUp();
    }
   
    openEdit(quizName:string) {
      this.dataService.questionsData=null;
      this.router.navigateByUrl('/'+quizName+'/edit');
    }

    async startUp()
    { 
      var data = await this.dataService.fetchUserData("",null);
      if (data.email) 
      {
        const dialogRef = this.dialog.open(dialogComponent,{  data: { text:"Luodaanko uusi "+data.email+" käyttäjä?", buttons :{ok:"Kyllä", cancel:"Ei"} }});
        dialogRef.afterClosed().subscribe(result => { 
          if ( result )  
            this.userAdd();
      });
    }
    }
    
    async userAdd()
    {
      await this.dataService.addUser();
      await this.dataService.fetchUserData("",null);
    }

    testi()
    {
      this.startUp();
    }

    logout()
    {
      window.sessionStorage.removeItem("JWT",);
      this.dataService.userData=null;
      this.router.navigateByUrl('/');
    }

    save()
    {
      
      const params = new URLSearchParams();
      if ( this.dataService.userData ) {
         if ( this.dataService.userData.name != undefined )
            params.append("name",this.dataService.userData.name);
        if ( this.dataService.userData.desc != undefined )
            params.append("desc",this.dataService.userData.desc);
      }
      console.log("::"+params.toString());
      var query = params.toString();
      if ( query !="" )
       this.dataService.fetchUserData("?"+query,null);
      else
      this.dataService.fetchUserData("",null);
    }
}
