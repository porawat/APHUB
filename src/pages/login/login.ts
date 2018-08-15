import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController, Loading} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../../pages/home/home';
import { Storage } from "@ionic/storage";
import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { User } from '../../models/model'
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
  user: Observable<User>;
  constructor(public navCtrl: NavController, 
    private formBuilder: FormBuilder ,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,) {
      this.todo = this.formBuilder.group({
        Mobile: ['', Validators.required],      
        Password: ['',Validators.required],     
      });
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            return of(null)
          }
        })
      )
  
  }

  ionViewDidLoad() : void {
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
  doGoogleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
        this.navCtrl.setRoot(HomePage);
      })
  }


  private updateUserData(user) {
    // Sets user data to firestore on login
    
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    let data = {
      Uid: user.uid,
      Email: user.email,
      DisplayName: user.displayName,
      photoURL: user.photoURL,
      Phone:user.phoneNumber
    }
    console.log(user);
    this.storage.set("login", data);
    return userRef.set(data, { merge: true })

  }


  signOut() {
    this.afAuth.auth.signOut().then(() => {
       // this.router.navigate(['/']);
    });
  }
}
