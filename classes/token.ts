import jwt from 'jsonwebtoken';

export default class Token {
    
    private static seed: string = 'seed-secret-for-token';
    private static expiration: string = '30d';

    constructor() {}

    static getToken(payload: any): string {
        return jwt.sign({
            user: payload
        }, this.seed, {expiresIn: this.expiration});
    }

    static checkToken(userToken: string) {

        return new Promise((resolve, reject) => {

            jwt.verify(userToken, this.seed, (error, decoded) => {
                if (error) {
                    // Invalid Token
                    reject();
                } else {
                    // Valid Token
                    resolve(decoded);
                }
            });

        });
    }

}