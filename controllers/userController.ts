import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import User, { UserInterface } from "../models/userModel";
import {
  registerValidation,
  loginValidation,
  emailValidation,
  passValidation,
} from "../services/userValidation";
import sendEmail from "../services/sendEmail";
import cloudinary from "../services/cloudinary";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  // VALIDATION
  const { error } = registerValidation({ name, email, password });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const emailExist = await User.findOne({ email });
  if (emailExist)
    return res.status(400).json({ error: "Email already exists!" });

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create new user
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: {
        public_id: "",
        url: "",
      },
    });
    res.json({ user: user._id, email: user.email });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  // VALIDATION
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Check if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Email not found!" });

  const isValidPass = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPass) return res.status(400).json({ error: "Invalid password!" });

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SCRT!, {
    expiresIn: "30d",
  });
  // res.header("auth-token", token).json({ token: token });
  res.header("auth-token", token).json({
    name: user.name,
    email: user.email,
    image: user.image?.url,
    token: token,
  });
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const current = await User.findById(req.params.id);

    const ImgId = current?.image?.public_id;

    if (ImgId) {
      await cloudinary.uploader.destroy(ImgId);
    }
    const user = await User.findByIdAndDelete(req.params.id);

    res.json({ Deleted: user?._id });
  } catch (error) {
    next(error);
  }
};

export const uploadPicture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { image, _id } = req.body;
  try {
    // delete prev image to cloudinary
    if (image !== "") {
      const current = await User.findById(_id);

      const ImgId = current?.image?.public_id;

      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "pictures",
    });

    const user = await User.findByIdAndUpdate(_id, {
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
};

export const generateOTP = async (req: Request, res: Response) => {
  const { error } = emailValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Check if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ error: "Email not found, create an account first" });

  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const data = {
    email: req.body.email,
    OTP: req.app.locals.OTP,
  };

  if (req.app.locals.OTP) {
    const sent = await sendEmail(data);
    sent && res.send().status(200);
  }
};

export const verifyOTP = async (
  req: Request<{}, {}, {}, { OTP: string }>,
  res: Response
) => {
  // if verified reset session
  const { OTP } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(OTP)) {
    req.app.locals.session = true;
    return res.send(req.app.locals.session);
  }
  return res.send(req.app.locals.session);
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const user = await User.findOne({ email });
    await User.findByIdAndUpdate(
      user?._id,
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );
    req.app.locals.session = false;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.user._id);
    const data: UserInterface | null = user;
    res.json({
      name: data?.name,
      email: data?.email,
      image: data?.image.url,
      _id: data?._id,
    });
  } catch (error) {
    next(error);
  }
};
