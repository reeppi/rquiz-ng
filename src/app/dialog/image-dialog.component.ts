import { Component, Inject } from '@angular/core';
import {MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'image-dialog',
    templateUrl: './image-dialog.component.html',
    styleUrls: ['./dialog.component.css']
  })
  export class imageDialogComponent {
    constructor(public dialogRef: MatDialogRef<imageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { image:string, edit:boolean }) { }
    cancel() {
      this.dialogRef.close(false);
    }
    ok() {
        this.dialogRef.close(true);
      }
  }