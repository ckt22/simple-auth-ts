import bcrypt from 'bcrypt';
import { AuthSource, CreateUserDto, User } from '../database/entities/user.entity';

function isValidPassword(password: string, confirmPassword: string): boolean {
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

    if (!isValidPassword(password, confirmPassword)) {
        return false;
    }

    return true;

}

export async function resetPassword(userId: number, currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<{ success: boolean, message: string }> {
    // check for existing users
    const existingUser = await User.findOne({
        where: { 
            id: userId,
            authSource: AuthSource.email
        },
        select: {
            id: true,
            password: true
        }
    });

    if (!existingUser) {
        return {
            success: false,
            message: 'Invalid user id'
        };
    };

    const isCorrectCurrentPassword = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isCorrectCurrentPassword) {
        return {
            success: false,
            message: 'Wrong current password.'
        }
    };

    if (currentPassword === newPassword) {
        return {
            success: false,
            message: 'Your new password is the same as your current password.'
        }
    };

    if (!isValidPassword(newPassword, confirmNewPassword)) {
        return {
            success: false,
            message: 'Invalid new password.'
        }
    };

    existingUser.password = await bcrypt.hash(newPassword, 10);
    await existingUser.save();
    return {
        success: true,
        message: 'Password updated.'
    }
        
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

export async function getAllUsers(): Promise<User[]> {
    return await User.find({});
}