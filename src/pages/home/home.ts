import { Component } from '@angular/core';
import { NavController,LoadingController,ToastController} from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Storage } from "@ionic/storage";
import { FireserviceProvider} from '../../providers/fireservice/fireservice';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items: Observable<any[]>;
  loginForm = {email:'',name:'',time:null};
  constructor(public navCtrl: NavController,
   public db: AngularFirestore,
   private Fservice: FireserviceProvider,
   private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage
  ) {
    this.items = db.collection('users').valueChanges();
  }
  ngOnInit() {
    this.storage.get("login-user").then(login => {
      if (login && login.email !== "") {
       // this.navCtrl.push(ChatsPage); ไปหาที่ต้องการ
       console.log(login);
      }
    });
  }
  loginUser() {

    console.log(this.loginForm);
    if (this.loginForm.email === '') {
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
        this.storage.set("login-user", this.loginForm);
                  //myLoader.dismiss();
                  let toast = this.toastCtrl.create({
                    message: "Login In Successful",
                    duration: 3000,
                    position: "top"
                  });
                  toast.present();
                  myLoader.dismiss();
                  this.loginForm = {email:'',name:'',time:new Date().getTime()};
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