import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Ecom';


interface JwtPayload {
  userId: number;  
  email?: string;
  isVerified?:boolean  
}
export const generateToken = (payload: JwtPayload,expiresIn:string) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};
