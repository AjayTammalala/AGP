import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-methods',
  standalone: false,
  templateUrl: './methods.component.html',
  styleUrl: './methods.component.scss'
})
export class MethodsComponent implements OnInit {
  methodform: FormGroup;
  modulesdata: any[] = [];
  modulesdatafromMethods: any[] = [];
  norecords: boolean = false;
  addform: boolean = false;
  selectedModule: any;
  selectedmethod: any = null;
  pop: boolean = false;
  edit: boolean = false;
  statusFilter: string = 'all'; 

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.methodform = this.fb.group({
      M_MOD_ID: [''],
      M_NAME: ['', Validators.required],
      M_DESC: ['', Validators.required],
      M_REQUEST_URL_SAMPLE: ['', Validators.required],
      M_RESPONCE_URL_SAMPLE: ['', Validators.required],
      M_ACTIVE: [true],
    });
  }

  ngOnInit(): void {
    const moduleID = Number(this.route.snapshot.paramMap.get('id'));
    this.loadModules(moduleID);
    this.getmethodsdata(moduleID);
  }

  getmethodsdata(id: number): void {
    const payload = {
      md: { mod: id },
    };

    this.auth.getMethodsfromURL(payload).subscribe({
      next: (data: any[]) => {
        this.modulesdata = this.applyFilter(data);
        this.norecords = this.modulesdata.length === 0;
      },
      error: (err) => {
        console.error('Error fetching methods:', err);
      },
    });
  }

  applyFilter(data: any[]): any[] {
    if (this.statusFilter === 'all') {
      return data;
    }
    else if (this.statusFilter === 'inactive'){
      return data.filter((item) => item.M_ACTIVE == 'N');
    }
    else {
      return data.filter((item) => item.M_ACTIVE === 'Y');
    }
  }

  loadModules(moduleID: number): void {
    this.auth.getModulesDataFromAPI().subscribe((data) => {
      this.modulesdatafromMethods = data;
      this.selectedModule = this.modulesdatafromMethods.find(
        (module: any) => module.MOD_ID === moduleID
      );
      if (this.selectedModule) {
        this.methodform.patchValue({
          M_MOD_ID: this.selectedModule.MOD_ID,
          M_NAME: '',
          M_DESC: '',
          M_REQUEST_URL_SAMPLE: '',
          M_RESPONCE_URL_SAMPLE: '',
          M_ACTIVE: true,
        });
      }
    });
  }

  onStatusFilterChange(event: any): void {
    this.statusFilter = event.target.value;
    this.getmethodsdata(this.selectedModule.MOD_ID); 
  }

  addmodule(): void {
    this.norecords = false;
    this.addform = true;
    this.methodform.reset({
      M_MOD_ID: this.selectedModule.MOD_ID,
      M_ACTIVE: true,
    });
  }

  addMethods() {
    if (this.methodform.invalid) {
      this.methodform.markAllAsTouched();
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      m: {
        M_ID: 0,
        M_MOD_ID: this.selectedModule.MOD_ID,
        M_NAME: this.methodform.value.M_NAME,
        M_DESC: this.methodform.value.M_DESC,
        M_REQUEST_URL_SAMPLE: this.methodform.value.M_REQUEST_URL_SAMPLE,
        M_RESPONCE_URL_SAMPLE: this.methodform.value.M_RESPONCE_URL_SAMPLE,
        M_ACTIVE: this.methodform.value.M_ACTIVE ? 'Y' : 'N',
        M_TYPE: 'G',
        action: 'A',
      },
    };

    this.auth.Getaddmethods(payload).subscribe({
      next: () => {
        alert('Method added successfully!');
        this.addform = false;
        this.getmethodsdata(this.selectedModule.MOD_ID);
      },
      error: () => {
        alert('Failed to add method.');
      },
    });
  }

  cancel() {
    this.addform = false;
    this.norecords = this.modulesdata.length === 0;
    this.methodform.reset();
  }

  popup(md: any) {
    this.selectedmethod = md;
    this.pop = true;
  }

  closePopup() {
    this.pop = false;
    this.selectedmethod = null;
  }

  editMethod(md: any) {
    this.addform = true;
    this.edit = true;
    this.selectedmethod = md;

    this.methodform.patchValue({
      M_MOD_ID: this.selectedModule.MOD_ID,
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
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      m: {
        M_ID: this.selectedmethod.M_ID,
        M_MOD_ID: this.selectedModule.MOD_ID,
        M_NAME: this.methodform.value.M_NAME,
        M_DESC: this.methodform.value.M_DESC,
        M_REQUEST_URL_SAMPLE: this.methodform.value.M_REQUEST_URL_SAMPLE,
        M_RESPONCE_URL_SAMPLE: this.methodform.value.M_RESPONCE_URL_SAMPLE,
        M_ACTIVE: this.methodform.value.M_ACTIVE ? 'Y' : 'N',
        action: 'U',
        M_TS: new Date().toISOString(),
      },
    };

    this.auth.Getaddmethods(payload).subscribe({
      next: () => {
        alert('Method updated successfully!');
        this.addform = false;
        this.getmethodsdata(this.selectedModule.MOD_ID);
      },
      error: () => {
        alert('Failed to update method.');
      },
    });
  }

  deleteMethod(method: any) {
    if (!confirm(`Are you sure you want to delete "${method.M_NAME}"?`)) return;
    const payload = {
      m: {
        M_ID: method.M_ID,
        action: 'D',
      },
    };

    this.auth.deleteMethod(payload).subscribe({
      next: () => {
        alert('Method deleted successfully!');
        this.getmethodsdata(this.selectedModule.MOD_ID); 
      },
      error: () => {
        alert('Failed to delete method.');
      },
    });
  }
}