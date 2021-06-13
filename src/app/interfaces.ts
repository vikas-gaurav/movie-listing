export interface IMovie{
    title: string;
    description: string;
    genres: string;
    uuid: string;
}

export interface IUser{
    name: string;
    token: string;
}

export interface IAuthResponse{
    is_success : boolean;
    data?: {
        token: string;
    };
    error?: {
        message: string;
        code : string;
    }  
    
}