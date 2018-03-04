import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { TwitterDisplayComponent } from './twitter-display/twitter-display.component'
import { MatCardModule } from '@angular/material/card'

@NgModule({
  declarations: [
    AppComponent,
    TwitterDisplayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
