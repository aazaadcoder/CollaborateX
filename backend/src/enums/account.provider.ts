export const ProvideEnum = {
    GOOGLE : "GOOGLE",
    GITHUB :"GITHUB",
    FACEBOOK : "FACEBOOK",
    EMAIL : "EMAIL",
    PHONE : "PHONE"
}

export type ProvideEnumTypes =  keyof typeof ProvideEnum;   