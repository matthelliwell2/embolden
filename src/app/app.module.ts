import { FontAwesomeModule } from "@fortawesome/angular-fontawesome"
import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { AppComponent } from "./app.component"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { EditComponent } from "./edit/edit.component"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faBold, faFolderOpen, faSlidersH, faWindowRestore } from "@fortawesome/free-solid-svg-icons"
import { ToolbarComponent } from "./toolbar/toolbar.component"
import { PropertiesBarComponent } from "./properties-bar/properties-bar.component"
import { FormsModule } from "@angular/forms"
import { StitchControlComponent } from "./stitch-control/stitch-control.component"
import { SettingsComponent } from "./settings/settings.component"
import { RenderSettingsComponent } from "./settings/render-settings/render-settings.component"
import { Ng5SliderModule } from "ng5-slider"
import { ColorChromeModule } from "ngx-color/chrome"
import { SettingsService } from "./settings.service"

library.add(faFolderOpen, faBold, faWindowRestore, faSlidersH)

@NgModule({
    declarations: [AppComponent, EditComponent, ToolbarComponent, PropertiesBarComponent, StitchControlComponent, SettingsComponent, RenderSettingsComponent],
    imports: [BrowserModule, NgbModule, FontAwesomeModule, FormsModule, Ng5SliderModule, ColorChromeModule],
    providers: [SettingsService],
    bootstrap: [AppComponent],
    entryComponents: [SettingsComponent]
})
export class AppModule {}
