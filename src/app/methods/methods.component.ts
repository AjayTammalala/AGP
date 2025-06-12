import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
declare let alertify: any;


@Component({
  selector: 'app-methods',
  standalone: false,
  templateUrl: './methods.component.html',
  styleUrl: './methods.component.scss'
})
export class MethodsComponent implements OnInit {
  selectedStatus: string = 'Active';
  selectedProjectId: number | null = null;
  selectedModuleId: number | null = null;
  searchText: string = '';
  activeProjects: any[] = [];
  allModules: any[] = [];
  filteredModules: any[] = [];
  methods: any[] = [];
  filteredMethods: any[] = [];
  selectedmethod: any = [];
  pop: boolean = false;
  addform: boolean = false;
  grid: boolean = true;
  edit: boolean = false;
  selectedModule: any;
  methodform: FormGroup;
  navbar: boolean = true;
  activeModules: any;
  add: boolean = false;
  del : boolean = false;
  Rlength : any;
  urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
  urlPattern1 = /^(https?:\/\/|www\.)[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/;
 
  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.methodform = this.fb.group({
      M_MOD_ID: ['', Validators.required],
      M_NAME: ['', [Validators.required, Validators.maxLength(15)]],
      M_DESC: ['', [Validators.required, Validators.maxLength(20)]],
      M_REQUEST_URL_SAMPLE: ['', [Validators.required, Validators.pattern(this.urlPattern1)]],
      M_RESPONCE_URL_SAMPLE: ['', [Validators.required, Validators.pattern(this.urlPattern1)]],
      M_ACTIVE: [true],
    });
  }
 
  ngOnInit(): void {
    this.selectedStatus = 'Y';
    this.selectedProjectId = null;
    this.selectedModuleId = null;
    this.loadProjects();
    this.loadModules();
    this.loadMethods();
  }
 
  loadProjects(): void {
    this.authService.getdatafromAPI().subscribe({
      next: (data: any[]) => {
        this.activeProjects = data.filter((project: any) => project.P_ACTIVE === 'Y');
        if (this.activeProjects.length > 0 && this.selectedProjectId === null) {
          this.selectedProjectId = this.activeProjects[0].P_ID;
         
        }
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        alertify.error('Failed to load projects.');
      }
    });
  }
 
  loadModules(): void {
    this.authService.getModulesDataFromAPI().subscribe({
      next: (data: any[]) => {
        this.allModules = data;
        this.activeModules = data.filter((module: any) => module.MOD_ACTIVE === "Y")
        console.log('active modules :', this.activeModules);
 
        if (this.selectedProjectId !== null) {
          this.onProjectChange();
        }
      },
      error: (err) => {
        console.error('Error loading modules:', err);
        alertify.error('Failed to load modules.');
      }
    });
  }
 
  loadMethods(): void {
    this.authService.getMethodsDataFromAPI().subscribe({
      next: (data: any[]) => {
        console.log('Methods data', data);
        this.methods = data;
        this.filterMethods();
      },
      error: (err) => {
        console.error('Error loading methods:', err);
        alertify.error('Failed to load methods.');
      }
    });
  }
 
  onProjectChange(): void {
    this.selectedModuleId = null;
 
    const projectIdAsNumber = Number(this.selectedProjectId);
 
    this.filteredModules = this.allModules.filter(mod =>
      Number(mod.MOD_P_ID) === projectIdAsNumber
    );
 
    this.filterMethods();
  }
 
  onModuleChange(): void {
    this.filterMethods();
  }
 
  filterMethods(): void {
    console.log('--- filterMethods() called ---');
    console.log('1. this.methods (all data fetched):', this.methods);
    console.log('2. Current filter states:', {
    selectedStatus: this.selectedStatus,
    selectedProjectId: this.selectedProjectId,
    selectedModuleId: this.selectedModuleId,
    searchText: this.searchText
  });
    this.currentPage = 1;
    let filtered = this.methods;
 
 
    if (this.selectedStatus === 'Y') {
      filtered = filtered.filter(m => m.M_ACTIVE === 'Y');
      this.Rlength = filtered.length,
      console.log("Rlength Y :", this.Rlength);
      this.grid = true;
      this.del = false;
    } 
    else if (this.selectedStatus === 'N') {
      filtered = filtered.filter(m => m.M_ACTIVE === 'N');
      this.Rlength = filtered.length,
      console.log("Rlength N :", this.Rlength);
      this.grid = true;
      this.del = false;
    } 
    else if (this.selectedStatus === 'D') {
      filtered = filtered.filter(m => m.M_ACTIVE === 'D');
      this.Rlength = filtered.length,
      console.log("Rlength D :", this.Rlength);
      this.grid = false;
      this.del = true;
    } 
    else {
      filtered = [...this.methods];
      this.Rlength = filtered.length,
      console.log("Rlength All :", this.Rlength);
      this.grid = true;
      this.del = false;
    }
 
   
    if (this.selectedModuleId !== null) {
      filtered = filtered.filter(m => Number(m.M_MOD_ID) === Number(this.selectedModuleId));
    }
    else if (this.selectedProjectId !== null) {
      const moduleIds = this.filteredModules.map(mod => Number(mod.MOD_ID));
      filtered = filtered.filter(m => moduleIds.includes(Number(m.M_MOD_ID)));
    }
 
    const term = this.searchText.toLowerCase();
    if (term) {
      filtered = filtered.filter(m => m.M_NAME.toLowerCase().includes(term));
    }
 
    this.filteredMethods = filtered;
  }
 
  popup(method: any) {
    this.selectedmethod = method;
    this.pop = true;
  }
 
  closePopup() {
    this.pop = false;
    this.selectedmethod = null;
  }
 
  deleteMethod(method: any) {
    if (!confirm(`Are you sure you want to delete "${method.M_NAME}"?`)) return;
    const payload = {
      m: {
        M_ID: method.M_ID,
        action: 'D',
      },
    };
    console.log('payload', payload)
    this.authService.deleteMethod(payload).subscribe({
      next: () => {
        alertify.success("Method deleted successfully!");
        this.loadMethods();
      },
      error: () => {
        alertify.error('Failed to delete method.')
      },
    });
  }
 
  openAddMethodForm(): void {
    this.navbar = false;
    this.grid = false;
    this.addform = true;
    this.edit = false;
    this.methodform.reset();
  }
 
  addMethods() {
    if (this.methodform.invalid) {
      this.methodform.markAllAsTouched();
      alertify.error("Please fill all required fields");
      return;
    }
 
    const payload = {
      m: {
        M_ID: 0,
        M_MOD_ID: Number(this.methodform.value.M_MOD_ID),
        M_NAME: this.methodform.value.M_NAME,
        M_DESC: this.methodform.value.M_DESC,
        M_REQUEST_URL_SAMPLE: this.methodform.value.M_REQUEST_URL_SAMPLE,
        M_RESPONCE_URL_SAMPLE: this.methodform.value.M_RESPONCE_URL_SAMPLE,
        M_ACTIVE: this.methodform.value.M_ACTIVE ? 'Y' : 'N',
        M_TS: new Date().toISOString(),
        M_TYPE: "G",
        action: 'A',
      },
    };
    console.log('add methods', payload);
    this.authService.Getaddmethods(payload).subscribe({
      next: () => {
        alertify.success("Method added successfully!");
        this.addform = false;
        this.loadMethods();
      },
      error: () => {
        alertify.error("Failed to add method.")
      },
    });
    this.navbar = true;
    this.grid = true;
  }
 
  cancel() {
    this.addform = false;
    this.methodform.reset();
    this.navbar = true;
    this.grid = true;
  }
 
  editMethod(md: any) {
    this.navbar = false;
    this.addform = true;
    this.edit = true;
    this.grid = false;
    this.selectedmethod = md;
 
    this.methodform.patchValue({
      M_MOD_ID: md.M_MOD_ID,
      M_NAME: md.M_NAME,
      M_DESC: md.M_DESC,
      M_REQUEST_URL_SAMPLE: md.M_REQUEST_URL_SAMPLE,
      M_RESPONCE_URL_SAMPLE: md.M_RESPONCE_URL_SAMPLE,
      M_ACTIVE: md.M_ACTIVE === 'Y',
    });
  }
 
  updateMethod() {
    if (this.methodform.invalid) {
      this.methodform.markAllAsTouched();
      alertify.error('Please fill all required fields');
      return;
    }
 
    const payload = {
      m: {
        M_ID: this.selectedmethod.M_ID,
        M_MOD_ID: Number(this.methodform.value.M_MOD_ID),
        M_NAME: this.methodform.value.M_NAME,
        M_DESC: this.methodform.value.M_DESC,
        M_REQUEST_URL_SAMPLE: this.methodform.value.M_REQUEST_URL_SAMPLE,
        M_RESPONCE_URL_SAMPLE: this.methodform.value.M_RESPONCE_URL_SAMPLE,
        M_ACTIVE: this.methodform.value.M_ACTIVE ? 'Y' : 'N',
        action: 'U',
        M_TS: new Date().toISOString(),
      },
    };
    console.log('edit payload :', payload);
    this.authService.Getaddmethods(payload).subscribe({
      next: () => {
        alertify.success('Method Updated Successfully..!');
        this.loadMethods();
        this.addform = false;
      },
      error: () => {
        alertify.error('Failed to update method.');
      },
    });
    this.navbar = true;
    this.grid = true;
    this.addform = false;
  }

    itemsPerPage: number = 8;

currentPage: number = 1;

get totalPages(): number {
  return Math.ceil(this.filteredMethods.length / this.itemsPerPage);
}

get paginatedMethods() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredMethods.slice(startIndex, endIndex);
}

get pageNumbers(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

}