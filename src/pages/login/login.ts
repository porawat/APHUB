import { Component } from '@angular/core';
import { IonicPage, NavController, Platform,NavParams ,LoadingController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../../pages/home/home';
import { Storage } from "@ionic/storage";
import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { User } from '../../models/model'
import { FeedPage } from '../../pages/feed/feed';

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
    public fb :Facebook,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    ) {
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
    this.navCtrl.setRoot(FeedPage);
  }
  resetpass(){

  }
  doGoogleLogin() {
    const provider = new auth.GoogleAuthProvider()

    return this.oAuthLogin(provider); 
  }

  private oAuthLogin(provider) :Promise<any>{
    
      return this.afAuth.auth.signInWithRedirect(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
        this.navCtrl.setRoot(FeedPage);
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
      this.navCtrl.setRoot(FeedPage);
    }else{
      this.storage.set("user", data);
      this.navCtrl.setRoot(FeedPage);
    }
    return userRef.set(data, { merge: true })    
  }
  signInWithGoogle() : Promise<any>{
		console.log('Sign in with google');
		return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
	}
        private oauthSignIn(provider: AuthProvider) {
		if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider).then(result=>{

        let token = result.credential.accessToken;
					// The signed-in user info.
					let user = result.user;
          console.log(token, user);
          this.updateUserData(user);
      }).catch(function(error) {
					// Handle Errors here.
					alert(error.message);
				});
      
		} else {
			return this.afAuth.auth.signInWithRedirect(provider)
			.then(() => {
				return this.afAuth.auth.getRedirectResult().then( result => {
					// This gives you a Google Access Token.
					// You can use it to access the Google API.
					let token = result.credential.accessToken;
					// The signed-in user info.
					let user = result.user;
          console.log(token, user);
          this.updateUserData(user);
				}).catch(function(error) {
					// Handle Errors here.
					alert(error.message);
				});
			});
		}
  }
 
  doFacebookLogin() {
    console.log('FB');
/*
    this.fb.login(['public_profile', 'user_friends', 'email'])
  .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
  .catch(e => console.log('Error logging into Facebook', e));

*/
//this.fb.logEvent(this.fb.EVENTS.);
//return this.fb.login(['public_profile','user_friends','email'])
this.fb.login(['public_profile', 'user_friends', 'email'])

.then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))

.catch(e => console.log('Error logging into Facebook', e));

//this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
       // this.router.navigate(['/']);
    });
  }
  
}
