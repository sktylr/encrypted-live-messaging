export interface TokenClaims {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    id: string;
    username: string;
    first_name: string;
    last_name: string;
}

export interface Tokens {
    access: string;
    refresh: string;
}

export interface FormValue {
    value: string;
    error: boolean;
    errorMessage: string;
}

interface BaseModel {
    id: string;
    updated_at: string | Date;
    created_at: string | Date;
}

export interface MessageGroup extends BaseModel {
    group_name: string;
    users: NestedUser[];
    created_by: User;
}

interface NestedUser {
    user: User;
}

export interface User extends BaseModel {
    first_name: string;
    last_name: string;
    email: string;
}

export interface Message extends BaseModel {
    cipher_text: string;
    user: User;
    group: string;
    initialisation_vector: string;
    key: string;
}
