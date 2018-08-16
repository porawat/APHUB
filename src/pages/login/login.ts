import { Component } from '@angular/core';
import { IonicPage, NavController, Platform,NavParams ,LoadingController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../../pages/home/home';
import { Storage } from "@ionic/storage";
import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { User } from '../../models/model'
import firebase from 'firebase';
import { Facebook} from '@ionic-native/facebook';
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
    public platform: Platform,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: Facebook) {
      console.log(this.platform);
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
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber:user.phoneNumber
    }
    console.log(user);
    console.log(this.platform.is);
    if (this.platform.is('core')) {
      localStorage.setItem('user', JSON.stringify(data));
    }else{
      this.storage.set("user", data);
    }
    return userRef.set(data, { merge: true })    
  }
  doFacebookLogin() : Promise<any>{
    console.log('FB');
/*
    this.fb.login(['public_profile', 'user_friends', 'email'])
  .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
  .catch(e => console.log('Error logging into Facebook', e));

*/
//this.fb.logEvent(this.fb.EVENTS.);
return this.fb.login(['public_profile','user_friends','email'])
    .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then( user => { 
          
          let data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            phoneNumber:user.phoneNumber
          }
          this.updateUserData(data);
          this.navCtrl.setRoot(HomePage);
          console.log(data); 
        });

    }).catch((error) => { console.log(error) });
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
       // this.router.navigate(['/']);
    });
  }
  
}
