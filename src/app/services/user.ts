export class User{
  _id: string;
  firstname: string;
  username: number;
  password: string;
  subjects: [{
    _id: string,
    subjname: string,
    subjcode: string
  }]
}
