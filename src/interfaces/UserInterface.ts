export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  image?: {
    public_id: string;
    url: string;
  };
}
