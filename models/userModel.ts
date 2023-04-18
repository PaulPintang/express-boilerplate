import { Schema, model } from "mongoose";
export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  password: string;
  image: {
    public_id: string;
    url: string;
  };
}
const userSchema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default model<UserInterface>("User", userSchema);
