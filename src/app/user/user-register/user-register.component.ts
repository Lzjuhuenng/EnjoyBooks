import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from '../model/user-model';
import { Account } from '../model/account-model';
import { UserRegisterService } from './user-register.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  public accountForm: FormGroup;
  public accountInfo: Account = new Account();
  private isEmailExist :boolean = false;
  private isAccountExist : boolean = false;

  public formErrors = {
    'account': '',
    'email': '',
    'password': '',
    'confirmPassword': '',
    'formError': '',
    'vcode':''
  };
  validationMessages = {
    'account': {
      'required': '用户名必须输入。',
      'minlength': '用户名4到32个字符。',
    },
    'email': {
      'required': '邮箱必须输入。',
      'pattern': '请输入正确的邮箱地址。'
    },
    'password': {
      'required': '密码必须输入。',
      'minlength': '密码至少要8位。'
    },
    'confirmPassword': {
      'required': '重复密码必须输入。',
      'minlength': '密码至少要8位。',
      'validateEqual': "两次输入的密码不一致。"
    },
    'vcode': {
      'required': '验证码必须输入。',
      'minlength': '4位验证码',
      'maxlength': '4位验证码'
    },
  };

  constructor(
    public fb: FormBuilder,
    public userRegisterService: UserRegisterService,
    public router: Router,
    public route: ActivatedRoute,
    private toastr:ToastsManager
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.accountForm = this.fb.group({
      "account": [
        this.accountInfo.account,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32)
        ]
      ],
      // "nickName": [
      //   this.userInfo.nickName,
      //   [
      //     Validators.required,
      //     Validators.minLength(2),
      //     Validators.maxLength(32)
      //   ]
      // ],
      "email": [
        this.accountInfo.email,
        [
          Validators.required,
          Validators.pattern("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$")
        ]
      ],
      "password": [
        this.accountInfo.password,
        [
          Validators.required,
          Validators.minLength(8),
        ]
      ],
      "confirmPassword": [
        this.accountInfo.confirmPassword,
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],
      // "vcode": [
      //   this.userInfo.vcode,
      //   [
      //     Validators.required,
      //     Validators.minLength(4),
      //     Validators.maxLength(4)
      //   ]
      // ]
    });
    this.accountForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.accountForm) { return; }
    const form = this.accountForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  doRegister() {
    if (this.accountForm.valid) {
      this.accountInfo = this.accountForm.value;
      this.userRegisterService.register(this.accountInfo)
        .subscribe(
          data => {

            console.log(data);
            if(data){

                this.toastr.success('退出成功！','系统提示');
                this.router.navigateByUrl("login");
            }else{
               this.formErrors.formError = "注册失败，请重试"
            }
          },
          error => {
            this.formErrors.formError = error.message;
            console.error(error);
          }
        );
    }else{
       this.formErrors.formError = "存在不合法的输入项，请检查。";
    }
    console.log(this.accountInfo);
  }

  testEmail(){
    let email = this.accountForm.get("email").value;
    this.userRegisterService.testEmail(email)
      .subscribe(
        data => {
          console.log(data);
          this.isEmailExist = data;
        },
        error => {
          console.error(error);
        }
      )
  }

  testAccount(){
    let account = this.accountForm.get('account').value;
     this.userRegisterService.testAccount(account)
      .subscribe(
        data => {
          this.isAccountExist = data;
          console.log(data);
        },
        error => {
          console.error(error);
        }
      )
  }

//    required(c: Control): StringMap<string, boolean> {  
//     return isBlank(c.value) || c.value == "" ? {"required": true} : null;  
// }
}
