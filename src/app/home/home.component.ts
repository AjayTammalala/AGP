import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgFor } from '@angular/common';
import { log } from 'node:console';



@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent implements OnInit {
  userFirstName: string = '';
   userLastName: string = '';
   profileImageUrl : any;
  

  data: any;
 today: Date = new Date();
  constructor(
    private http: HttpClient,
    private authServ: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
     this.fetchUserData();
     this.livetimer();
    
  }
livetimer() :void{
  setInterval(() => {
    this.today = new Date();
  }, 1000);
}

fetchUserData(): void {
  const userID = 199;
  this.authServ.getuserInfo(userID).subscribe(
    (response) => {
      console.log('Raw API Response:', response); 

      try {
        const parsedData = JSON.parse(response);
        console.log('Parsed JSON:', parsedData); 

        
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          this.userFirstName = parsedData[0]?.U_FIRST_NAME || 'not found'; 
          this.userLastName = parsedData[0]?.U_LAST_NAME || 'not found'; 
          this.profileImageUrl = `https://sep.spyhre.com/Uploads/Profile/${parsedData[0]?.U_PROFILE_IMAGE}`;
          console.log("Profile Image URL:", this.profileImageUrl);
        } else {
          console.error('Parsed data is empty or incorrect format!');
          this.userFirstName = 'not found';
          this.userLastName = 'not found';
        }

        console.log("User First Name:", this.userFirstName, "User Last Name:", this.userLastName,);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    },
    (error) => {
      console.error('Error fetching user first name:', error);
    }
  );
}
gotologin(): void {
  this.router.navigate(['']);
}

isSidebarVisible: boolean = true;
MenuLists() {
    this.isSidebarVisible = !this.isSidebarVisible; 
    
  }
}
