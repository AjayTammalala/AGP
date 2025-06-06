import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule, FormsModule} from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  myform!: FormGroup;

  editdata: boolean = false;
  grid: boolean = false;
  add: boolean = false;
  addEdit: boolean = false;
  navbar: boolean =true;

  searchTerm: string = '';
  selectedStatus: string = 'Y'; 

  allProjects: any[] = [];
  filteredProjects: any[] = [];

  pop: boolean = false;
  selectedProject: any = null;

  constructor(
    private http: HttpClient,
    private authServ: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.myform = this.fb.group({
      projectname: ['', Validators.required],
      devurl: ['',Validators.required],
      stagingurl: ['',Validators.required],
      produrl: ['',Validators.required],
      testurl: ['',Validators.required],
      isActive: [false]
    });
  }

  ngOnInit(): void {
    this.getprojects();
  }

  getprojects() {
    this.authServ.getdatafromAPI().subscribe(
      (response) => {
        this.allProjects = response;
        this.applyStatusFilter();
        this.editdata = false;
        this.grid = true;
      },
      (error) => {
        console.error('Failed to fetch projects', error);
      }
    );
  }

  applyStatusFilter() {
    const term = this.searchTerm.toLowerCase();

    if (this.selectedStatus === 'All') {
      this.filteredProjects = this.allProjects.filter(project =>
        project.P_PRJ_NAME?.toLowerCase().includes(term)
      );
    } else if (this.selectedStatus === 'Y') {
      this.filteredProjects = this.allProjects.filter(project =>
        (project.P_ACTIVE === 'Y' ) &&
        project.P_PRJ_NAME?.toLowerCase().includes(term)
      );
    } else if (this.selectedStatus === 'N') {
      this.filteredProjects = this.allProjects.filter(project =>
        project.P_ACTIVE === 'N' &&
        project.P_PRJ_NAME?.toLowerCase().includes(term)
      );
    }
  }

  filterProjects() {
    this.applyStatusFilter();
  }

  popup(project: any) {
    this.selectedProject = project;
    this.pop = true;
  }

  closePopup() {
    this.selectedProject = null;
    this.pop = false;
  }

  addproject() {
    this.addEdit = true;
    this.navbar= false;
    this.add = true;
    this.grid = false;
    this.editdata = false;
    this.selectedProject = null;
    this.myform.reset();
  }

  editproject(p: any) {
    this.editdata = true;
    this.addEdit = true;
    this.grid = false;
    this.add = false;
    this.selectedProject = p;
    this.navbar=false;

    this.myform.patchValue({
      projectname: p?.P_PRJ_NAME || '',
      devurl: p?.P_API_URL_DEV || '',
      stagingurl: p?.P_API_URL_STAG || '',
      produrl: p?.P_API_URL_PROD || '',
      testurl: p?.P_API_URL_TEST || '',
      isActive: p?.P_ACTIVE === 'Y' 
    });
    console.log("edit project", p);
    
    this.selectedProject=p;
  }
  
  InsertProject() {
    if (this.myform.invalid) {
      this.myform.markAllAsTouched();
      alert("Please fill out all fields correctly.");
      return;
    }

    const obj = {
      prj: {
        P_ID: 0,
        P_PEP_P_ID: Number(localStorage.getItem("userID")),
        P_PRJ_NAME: this.myform.value.projectname,
        P_API_URL_DEV: this.myform.value.devurl,
        P_API_URL_STAG: this.myform.value.stagingurl,
        P_API_URL_PROD: this.myform.value.produrl,
        P_API_URL_TEST: this.myform.value.testurl,
        P_TS: "",
        P_ACTIVE: this.myform.value.isActive ? 'Y' : 'N',
        action: "A",
        P_U_ID: Number(localStorage.getItem("userID"))
      }
    };
console.log(obj);

    this.authServ.insertProject(obj).subscribe({
      next: () => {
        alert("Project added successfully!");
        this.getprojects();
        this.cancel();
        this.getprojects();
      },
      error: () => {
        alert("Failed to add project.");
      }
    });
  }

  updateProject() {
    if (this.myform.invalid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const updatedProject = {
      prj: {
        P_ID: this.selectedProject.P_ID,
        P_PEP_P_ID: this.selectedProject.P_PEP_P_ID,
        P_PRJ_NAME: this.myform.value.projectname,
        P_API_URL_DEV: this.myform.value.devurl,
        P_API_URL_STAG: this.myform.value.stagingurl,
        P_API_URL_PROD: this.myform.value.produrl,
        P_API_URL_TEST: this.myform.value.testurl,
        P_TS: new Date().toISOString(),
        P_ACTIVE: this.myform.value.isActive ? 'Y' : 'N',
        action: 'U',
        P_U_ID: Number(localStorage.getItem("userID"))
      }
    };

    this.authServ.updateProject(updatedProject).subscribe({
      next: () => {
        alert("Project updated successfully!");
        this.getprojects();
        this.cancel();
      },
      error: () => {
        alert("Failed to update project.");
      }
    });
  }

  cancel() {
    this.editdata = false;
    this.grid = true;
    this.myform.reset();
    this.navbar=true;
  }

  delproject(project: any) {
    if (confirm(`Are you sure you want to delete project "${project.P_PRJ_NAME}"?`)) {
      const deletePayload = {
        prj: {
          P_ID: project.P_ID,
          action: 'D'
        }
      };

      this.authServ.deleteProject(deletePayload).subscribe({
        next: () => {
          this.getprojects();
        },
        error: (err) => {
          console.error("Delete failed", err);
        }
      });
    }
  }
}