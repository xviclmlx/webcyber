export interface AuthResponse {

        //user:User;   Es posible que por la logica no necesitemos el nombre
        accessToken: string;
        refreshToken: string;
        user?: {
            id:number
            email: string;
            name: string;
            rol: 'ADMIN' | 'USER';
        }
        

    
}

export interface AuthResponseError{
    body:{
        error:string;
    };

}

export interface User {
    _id:string;
    name:string;
    email:string;
    rol: 'ADMIN' | 'USER';
}

export interface AccessTokenResponse{
    statusCode: number;
    accessToken:string
    error?:string;
}
     