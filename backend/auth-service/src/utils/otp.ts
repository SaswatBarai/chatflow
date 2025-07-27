
export class OTPUtils{

    public static generateOTP():string {
        return Math.floor(100000+ Math.random() * 900000).toString();
    }

    //Calculate the expiration time for the OTP

    public static getExpiryTime(minutes:number = 5) : Date{
        const now = new Date();
        now.setMinutes(now.getMinutes() + minutes);
        return now;
    }


    //check if the OTP is expired

    public static isOTPExpired(expiryTime:Date) : boolean{
        const now = new Date();
        return now > expiryTime;
    }
}