export interface AuthResponse {

        //user:User;   Es posible que por la logica no necesitemos el nombre
        accessToken: string;
        refreshToken: string;
        user?: {
            id:number
            email: string
            name: string
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
}

export interface AccessTokenResponse{
    statusCode: number;
    accessToken:string
    error?:string;
}
     