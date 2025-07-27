import bcrypt from 'bcryptjs';

export class PasswordUtils {

    public static async hashPassword(password:string) : Promise<string> {
        const salt  = 12;
        return await bcrypt.hash(password, salt);
    }


    public static async comparePassword(password:string,hasshedPassword:string) :Promise<boolean> {
        return await bcrypt.compare(password, hasshedPassword);
    }
    

    public static validatePassword(password:string):{isValid :boolean, errors:string[]}{
        const errors : string[] = [];
        
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
    }
}