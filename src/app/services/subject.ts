export class Subject{
    _id: string;
    name: string;
    code:string;
    experiments: [{
      _id: string,
      labno: string,
      question: string
    }];
  }
  