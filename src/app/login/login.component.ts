import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
email : any;
password : any;
errormessage: any;

constructor (private auth : AuthService , private router : Router) {}

login() {
  const body = {
    'username' : this.email,
    'password' : this.password
  }
  
this.auth.login(body).subscribe({
  next:(res) => {   
    console.log(res);
    if ( res == -1) {
      alert("Invalid creds");
      this.router.navigate(['/login']);
    }
    else{
    localStorage.setItem('userID', res);
      this.router.navigate(['/home']);
    }    
  },

  error: (err) => {
    this.errormessage = 'Invalid email or password';
  }
  
})
}
}
