export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber:string;
  }
  
  export interface Chat {
    message: string;
    pair: string;
    sender: string;
    time: number;
  }
  