export interface User {
    Email: string;
    Mobile: string;
    DisplayName: string;
    Password: string;
    rePassword:string;
    Type:boolean;
  }
  
  export interface Chat {
    message: string;
    pair: string;
    sender: string;
    time: number;
  }
  