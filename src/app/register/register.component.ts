import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../Service/customer.service';
import { NgForm } from '@angular/forms';
import { Customer } from '../Model/Customer';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { Plan } from '../Model/Plan';
import { PlanService } from '../Service/plan.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../Service/index';
import { AuthenticateService } from '../Service/authenticate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  plans: Plan[];
  selectedValue: string;
  selectedFile: File;
  fileName: string;
  content: string;
  // plans: Plan[] = [
  //   {name: 'Yoga', description: 'Yoga description'},
  //   {name: 'Gain weight', description: 'Gain weight description'},
  //   {name: 'Lose weight', description: 'Lose weight description'}
  // ];

  planControl = new FormControl('', [Validators.required]);


  loading = false;
  newCustomer: Customer;
 // customers: Customer[];

  constructor(private customerService: CustomerService,
    private planservice: PlanService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public authenticateService: AuthenticateService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      params => {
        //var plan = this.activatedRoute.snapshot.params.plan;
        this.getPlans();
      });

  }

  getPlans(): void {
    console.log("getting plans!");
    this.planservice.getPlans().subscribe(
      plans => this.plans = plans
    );
  
  }

    onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name;
    console.log(this.selectedFile.name);
  }

  onSubmit(form: NgForm) {

    //console.log("====="+this.selectedValue);
    this.loading = true;
    console.log(this.selectedValue['title']);
    const formInput = Object.assign({}, form.value);
    // console.log("---",formInput.plans);
    //const formData = new FormData();
   // formData.append('image',this.selectedFile, this.selectedFile.name);
    const customer: Customer = {
      firstName: formInput.firstName,
      lastName: formInput.lastName,
      phone: formInput.phone,
      email: formInput.email,
      plan: this.selectedValue['title'],
      profileImage: this.selectedFile,
      approved: 'N'
    };

    this.customerService.postCustomer(customer)
    .toPromise().then(data => {
      console.log('posting new data');
      form.reset();
      this.newCustomer = data;
      console.log('new data posted');
    }).then(()=>{
      if(this.authenticateService.isLoggedIn()){
        this.router.navigateByUrl('/all');
      }else{
        this.alertService.success("Register success!");
      }
    });
  }
}
