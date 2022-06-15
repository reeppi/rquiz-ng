import { Component, Inject,ViewChild } from '@angular/core';
import {MatDialog,MatDialogConfig,MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from '../data.service';

@Component({
    selector: 'app-renamedialog',
    templateUrl: './rename-dialog.component.html',
  })
  export class renameDialogComponent {

    constructor(
      public dataService : DataService,
      public dialogRef: MatDialogRef<renameDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: { name:string} ) {}

    toName : string="";
    loading : Boolean=false;
    errorMsg ="";

    cancel() {
      this.dialogRef.close(this.data.name);
    }

    async ok() { 
      this.errorMsg ="";
      if ( this.toName=="") {  this.errorMsg="Uusi nimi puuttuu"; return; }

      var tokeni : string|null = window.sessionStorage.getItem("JWT");
      if ( tokeni == null ) { this.errorMsg = "Et ole kirjautuneena"; return; }

      this.loading=true;
      const response = await window.fetch(this.dataService.APIURL+"/rename?name="+this.data.name+"&to="+this.toName, { headers: new Headers({'Authorization': tokeni}) });
        if (response.ok) {
          const data  = await response.json();
          if ( data.hasOwnProperty('error') ) 
              this.errorMsg = data.error;
          if ( data.hasOwnProperty('done') )
            {
                console.log("Tunnus muutettu "+ data.done);
                this.dialogRef.close(data.done);
            }
        } else this.errorMsg = "Yhteys virhe";
      this.loading=false;
      
    }
  }