import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../../pages/home/home';
import { Storage } from "@ionic/storage";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private todo : FormGroup;
  loginForm = {Mobile:'',Password:''};
  constructor(public navCtrl: NavController, 
    private formBuilder: FormBuilder ,
    private storage: Storage,
    public navParams: NavParams) {
      this.todo = this.formBuilder.group({
        Mobile: ['', Validators.required],      
        Password: ['',Validators.required],     
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  loginUser(){
   
    console.log(this.todo.value);
    console.log(this.loginForm);
    this.loginForm = {Mobile:'',Password:''};
  }
  newuser(){
    this.navCtrl.setRoot(HomePage);
  }
  resetpass(){

  }
}
