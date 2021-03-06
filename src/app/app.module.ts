import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { RouterModule } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button'; 
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MainComponent } from './main/main.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { MatTableModule} from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogModule} from '@angular/material/dialog'; 
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule} from '@angular/material/chips';
import { dialogComponent } from './dialog/dialog.component';
import { imageDialogComponent } from './dialog/image-dialog.component';
import { renameDialogComponent } from './edit/rename-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    ResultsComponent,
    EditComponent,
    MainComponent,
    ScoreboardComponent,
    dialogComponent,
    imageDialogComponent,
    renameDialogComponent,
    UserComponent,

    
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    MatRadioModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatProgressBarModule,
    MatChipsModule,
    DragDropModule,
    
    RouterModule.forRoot([
      { path: 'user', component: UserComponent },
      { path: '', component: MainComponent },
      { path: ':quizName/test', component: MainComponent },
      { path: ':quizName/edit', component: EditComponent },
      { path: ':quizName/results', component: ResultsComponent },
      { path: ':quizName/scores', component: ScoreboardComponent },
      { path: ':quizName/:questionNumber', component: QuestionComponent },
      { path: ':quizName', redirectTo: ':quizName/1', pathMatch: 'full' },
    
    ]),
    BrowserAnimationsModule
  ],
  providers: [Title, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
