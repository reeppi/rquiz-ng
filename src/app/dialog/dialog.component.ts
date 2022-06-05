import { Component, Inject } from '@angular/core';
import {MatDialog,MatDialogConfig,MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
  })
  export class dialogComponent {
    constructor(public dialogRef: MatDialogRef<dialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: { text:string, buttons: {ok:string,cancel:string}} ) {}
    cancel() {
      this.dialogRef.close(false);
    }
    ok() {
      this.dialogRef.close(true);
    }
  }