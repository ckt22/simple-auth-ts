import bcrypt from 'bcrypt';
import { AuthSource, CreateUserDto, User } from '../database/entities/user.entity';

export async function validateSignup(email: string, password: string, confirmPassword: string): Promise<boolean> {

    // check for existing users
    const existingUser = await User.findOne({
        where: { email }
    });
    if (existingUser) {
        return false;
    };

    // ensue email is an email
    if (!email.toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
        return false;
    };

    // ensure password meets security requirements
    if (!password.match(/(?=.*\d)(?=.*[a-z])(?=.*[$&+,:;=?@#|'<>.^*()%!-])(?=.*[A-Z]).{8,}/)) {
        return false;
    };

    // ensure confirm password matches password
    if (password !== confirmPassword) {
        return false;
    };

    return true;

}

export async function createUser(user: CreateUserDto): Promise<User> {
    const newUser = new User();
    newUser.authSource = user.authSource;

    if (user.authSource === AuthSource.email) {
        newUser.email = user.email;
        newUser.password = await bcrypt.hash(user.password, 10);
        newUser.isEmailVerified = false;
        newUser.profile = user.profile;
        newUser.emailVerificationCode = user.emailVerificationCode;
    }

    newUser.authSource = user.authSource;
    await newUser.save();

    return newUser;
}

export async function getUserDetails(userId: number): Promise<User> {
    return await User.findOne({ where: { id: userId } });
}

export async function updateUserDetails(userId: number, name: string): Promise<User> {
    const user = await User.findOne({ where: { id: userId } });
    user.profile = {
        ...user.profile,
        name
    };
    return await user.save();
}

export async function verifyEmailAddress(email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email, authSource: AuthSource.email }});
    if (!user) {
        return false;
    } else {
        user.isEmailVerified = true;
        await user.save();
        return true;
    }
}