export interface Trip {
    _id: string; // Internal primary key in MongoDB
    code: string;
    name: string;
    lengthInDays: number;
    start: Date;
    resort: string;
    price: number;
    image: string;
    description: string;
}