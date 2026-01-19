import { Component } from '@angular/core';
import { HomeComponent } from '../../../features/home/home/home.component';

import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../../../features/auth/login/login.component';


@Component({
  selector: 'app-main',
  imports: [RouterOutlet,HomeComponent,HeaderComponent,FooterComponent,LoginComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
