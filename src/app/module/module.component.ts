
import { Component, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { log } from 'console';
import { Router } from '@angular/router';
declare let alertify: any;

@Component({
  selector: 'app-module',
  standalone: false,
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent
{
  modules: any[] = [];
  filteredModules: any[] = [];
 
  projects: any[] = [];
  activeProjects: any[] = [];
 
  searchText: string = '';
  statusFilter: string = 'Active';  
  navbar: boolean =true;
 
  pop: boolean = false;
  selectedModule: any = null;
 
  grid: boolean = true;
  add: boolean = false;
  edit: boolean = false;
  del : boolean = false;
  moduleForm!: FormGroup;
  editingModuleId: number | null = null;
  x: any;
  projectFilter : string = '';
  Rlength : any;
 
  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router)  {
    this.moduleForm = this.fb.group({
      
      MOD_ID: [''],
      MOD_NAME: ['', [Validators.required, Validators.maxLength(15)]],
      MOD_DESC: ['', [Validators.required, Validators.maxLength(15)] ],
      MOD_P_ID: ['', Validators.required],
      MOD_TS: new Date().toISOString(),
      MOD_U_ID: Number(localStorage.getItem('key')),
      MOD_ACTIVE: true 
    });
  }
 
  ngOnInit(): void {
    this.loadModules();
    this.loadProjects();
  }
 
  loadModules() :void {
    this.auth.getModulesDataFromAPI().subscribe(data => {
      console.log("Module API data", data);
      this.modules = data;
      this.applyFilters();
      this.grid = true;
      this.add = false;
      this.edit = false;
      this.moduleForm.reset();
    });
  }
 
  applyFilters() {
    this.currentPage = 1;
    let filtered = this.modules;
 
    if (this.statusFilter === 'Active') {
      filtered = filtered.filter(m => m.MOD_ACTIVE === 'Y' );
       this.Rlength = filtered.length,
      console.log("Rlength Y", this.Rlength);
      this.grid = true;
      this.del = false;
    } 
   
    
    else if (this.statusFilter === 'Inactive') {
      filtered = filtered.filter(m => m.MOD_ACTIVE === 'N');
        this.Rlength = filtered.length,
      console.log("Rlength N", this.Rlength);
      this.grid = true;
      this.del = false;
    }
    else if (this.statusFilter === 'Deleted') {
      filtered = filtered.filter(m => m.MOD_ACTIVE === 'D');
        this.Rlength = filtered.length,
      console.log("Rlength D", this.Rlength);
      this.grid = false;
      this.del = true;
    } 
    else {
      filtered = [...this.modules];
        this.Rlength = filtered.length,
      console.log("Rlength All", this.Rlength);
      this.grid = true;
      this.del = false;
    }
     if (this.projectFilter){
      filtered = filtered.filter(m => m.MOD_P_ID == this.projectFilter);
     }
    const term = this.searchText.toLowerCase();
    if (term) {
      filtered = filtered.filter(m => m.MOD_NAME.toLowerCase().includes(term));
    }
    this.filteredModules = filtered;
  }
 
  popup(module: any) {
    this.selectedModule = module;
    this.pop = true;
    console.log(this.selectedModule);
  }
 
  closePopup() {
    this.pop = false;
    this.selectedModule = null;
  }
 
    loadProjects() {
  this.auth.getdatafromAPI().subscribe(data => {
    console.log(data);
    this.activeProjects = data.filter((p: any)=> p.P_ACTIVE === 'Y' );
    console.log(this.activeProjects);
 
  });
}
 
  addModule() : void {
    this.grid = false;
    this.add = true;
    this.edit = false;
    this.moduleForm.reset();
    this.moduleForm.patchValue({ MOD_P_ID: '' }); 
    this.navbar=false;
    this.loadProjects();
  }
 
//  getMethods(module: any) {
//   const obj = {
//     md: {
//       mod: module.MOD_ID
//     }
//   };
//   console.log('Payload:', obj);
//   this.auth.getMethodsfromURL(obj).subscribe({
//     next: (data) => {
//       console.log('Fetched Methods:', data);
//       console.log('Fetched Methods:', data);
//     },
//     error: (err) => {
//       console.error('Error fetching methods:', err);
//     }
//   });
// }

  editModule(module: any) {
    this.grid = false;
    this.edit = true;
    this.add = false;
    this.editingModuleId = module.MOD_ID;
    this.selectedModule = module;
    this.navbar=false;
 
    this.moduleForm.patchValue({
      MOD_ID: module.MOD_ID,
      MOD_NAME: module.MOD_NAME,
      MOD_DESC: module.MOD_DESC,
      MOD_P_ID: module.MOD_P_ID,
      MOD_TS: module.MOD_TS,
      MOD_U_ID: module.MOD_U_ID,
      MOD_ACTIVE: module.MOD_ACTIVE === 'Y'
    });
  }
 
  cancel() {
    this.grid = true;
    this.add = false;
    this.edit = false;
    this.moduleForm.reset();
    this.navbar=true;
  }
 
 insertModule() {
  if (this.moduleForm.invalid || this.moduleForm.value.MOD_P_ID === 'default') {
    this.moduleForm.markAllAsTouched();
    alertify.error('Please fill out all fields correctly.');
    return;
  }
  const payload = {
    mod: {
      MOD_ID: 0,
      MOD_P_ID: this.moduleForm.value.MOD_P_ID,
      MOD_NAME: this.moduleForm.value.MOD_NAME,
      MOD_DESC: this.moduleForm.value.MOD_DESC,
      MOD_ACTIVE: this.moduleForm.value.MOD_ACTIVE ? 'Y' : 'N',
      action: 'A',
      MOD_U_ID: Number(localStorage.getItem('key')),
      MOD_TS: new Date().toISOString(),
    }    
  };
  console.log(payload);
  this.auth.insertModule(payload).subscribe({
    next: () => {
      alertify.success("Module added successfully!");
      this.loadModules();
        this.navbar = true;
    },
    error: () => {
      alertify.error('Failed to add module.')
    }
  });
}
 
 
  updateModule() {
    if (this.moduleForm.invalid) {
      alertify.error('Please fill out all fields correctly.')
      return;
    }
 
    const payload = {
      mod: {
        MOD_ID: this.moduleForm.value.MOD_ID,
        MOD_NAME: this.moduleForm.value.MOD_NAME,
        MOD_DESC: this.moduleForm.value.MOD_DESC,
        MOD_P_ID: this.moduleForm.value.MOD_P_ID,
        MOD_TS: new Date().toISOString(),
        MOD_U_ID: Number(localStorage.getItem("key")),
        MOD_ACTIVE: this.moduleForm.value.MOD_ACTIVE?'Y' :'N',
        action: 'U'
      },
    };
 
    this.auth.updateModule(payload).subscribe({
      next: () => {
        alertify.success('Module updated successfully!')
        this.loadModules();
      },
      error: () => {
        alertify.error('Failed to update module.')
      }
    });
    this.navbar=true;
  }
 
  deleteModule(module: any) : void{
    if (!confirm(`Are you sure you want to delete "${module.MOD_NAME}"?`)) return;
 
    const payload = {
      mod: {
        MOD_ID: module.MOD_ID,
        MOD_NAME: module.MOD_NAME,
        MOD_DESC: module.MOD_DESC,
        MOD_P_ID: module.MOD_P_ID,
        MOD_TS: new Date().toISOString(),
        MOD_U_ID: Number(localStorage.getItem('key')),
        MOD_ACTIVE: 'D',
        action: 'U'
      }
    };
 
    this.auth.updateModule(payload).subscribe({
      next: () => {
        alertify.success('Module deleted successfully!');
        this.loadModules();
      },
      error: () => {
        alertify.error('Failed to delete module.');
      }
    });
  }

  itemsPerPage: number = 8;

currentPage: number = 1;

get totalPages(): number {
  return Math.ceil(this.filteredModules.length / this.itemsPerPage);
}

get paginatedModules() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredModules.slice(startIndex, endIndex);
}

get pageNumbers(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

 
}