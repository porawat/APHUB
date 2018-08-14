import { Component } from '@angular/core';
import { NavController,LoadingController,ToastController} from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Storage } from "@ionic/storage";
import { FireserviceProvider} from '../../providers/fireservice/fireservice';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items: Observable<any[]>;
  loginForm = {Email:'',Mobile:'',DisplayName:'',Password:'',rePassword:'',Type:true,time:null};
  private todo : FormGroup;
  constructor(public navCtrl: NavController,
   public db: AngularFirestore,
   private Fservice: FireserviceProvider,
   private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private formBuilder: FormBuilder 
  ) {
    this.items = db.collection('users').valueChanges();
    this.todo = this.formBuilder.group({
      Mobile: ['', Validators.required],
      Email: ['',Validators.required],
      DisplayName: [''],
      Password: ['',Validators.required],
      RePassword: ['',Validators.required],
      Type:['1']
    });
  }
  ngOnInit() {
    this.storage.get("login").then(login => {
      if (login && login.Email === "") {
       // this.navCtrl.push(ChatsPage); ไปหาที่ต้องการ
       this.navCtrl.setRoot(HomePage);
       console.log(login);
      }
    });
  }
  loginUser() {
  //  console.log(this.todo.value);
  //  console.log(this.loginForm);

   
    if (this.loginForm.Email === '') {
      let myLoader = this.loadingCtrl.create({
        content: "Please wait...",    
      });
      myLoader.present().then(()=>{
        let toast = this.toastCtrl.create({
          message: "Email ต้องไม่ว่าง",
          duration: 2000,
          position: "top"
        });
        toast.present();
        myLoader.dismiss();
      })
          
    }else{
      let myLoader = this.loadingCtrl.create({
        content: "Please wait...",    
      });
      myLoader.present().then(()=>{
        this.loginForm.time = new Date().getTime();
        this.Fservice.addUser(this.loginForm).then(res=>{
        this.storage.set("login", this.loginForm);
                  //myLoader.dismiss();
                  let toast = this.toastCtrl.create({
                    message: "Login In Successful",
                    duration: 3000,
                    position: "top"
                  });
                  toast.present();
                  myLoader.dismiss();             
                  this.loginForm = {Email:'',Mobile:'',DisplayName:'',Password:'',rePassword:'',Type:true,time:new Date().getTime()};
      }).catch(err => {
        console.log(err);
        let toast = this.toastCtrl.create({
          message: "Error "+err,
          duration: 3000,
          position: "top"
        });
        toast.present();
        myLoader.dismiss();
      });
      })
      
  }
 
}

}