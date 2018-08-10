import { Injectable } from '@angular/core';
import {AngularFirestoreDocument,AngularFirestore,AngularFirestoreCollection } from "angularfire2/firestore";
import { User, Chat } from "../../models/model";
import { Firebase_Config } from '../../app/app.firebase';
@Injectable()
export class FireserviceProvider {

  users: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;

  chats: AngularFirestoreCollection<Chat>;
  private chatDoc: AngularFirestoreDocument<Chat>;

  constructor(private db: AngularFirestore) {

    this.users = db.collection<User>(Firebase_Config.users_endpoint);
    this.chats = db.collection<Chat>(Firebase_Config.chats_endpoint);
    console.log('Hello FireserviceProvider Provider');
  }
  addUser(payload) {
    return this.users.add(payload);
  } //addUser
}
