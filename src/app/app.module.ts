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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MainComponent } from './main/main.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    ResultsComponent,
    EditComponent,
    MainComponent,
    ScoreboardComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatRadioModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    
    RouterModule.forRoot([
      { path: '', component: MainComponent },
      { path: ':quizName/edit', component: EditComponent },
      { path: ':quizName/results', component: ResultsComponent },
      { path: ':quizName/scores', component: ScoreboardComponent },
      { path: ':quizName/:questionNumber', component: QuestionComponent },
      { path: ':quizName', redirectTo: ':quizName/1', pathMatch: 'full' }
    ]),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
