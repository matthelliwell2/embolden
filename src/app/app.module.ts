import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {AppComponent} from './app.component'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {EditComponent} from './edit/edit.component'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faBold, faFolderOpen, faWindowRestore} from '@fortawesome/free-solid-svg-icons'
import {ToolbarComponent} from './toolbar/toolbar.component'
import {PropertiesBarComponent} from './properties-bar/properties-bar.component'
import {FormsModule} from "@angular/forms"
import {StitchControlComponent} from './stitch-control/stitch-control.component'

library.add(faFolderOpen, faBold, faWindowRestore)

@NgModule({
    declarations: [
        AppComponent,
        EditComponent,
        ToolbarComponent,
        PropertiesBarComponent,
        StitchControlComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        FontAwesomeModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
