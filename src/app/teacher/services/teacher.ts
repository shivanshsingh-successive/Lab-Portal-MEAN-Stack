export class Teacher{
    _id: string;
    firstname: string;
    username: string;
    code: string;
    subjectname: string;
    students: [];
    labs: [{
        labno: number,
        solution: any
    }]
}