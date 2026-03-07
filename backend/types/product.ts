export interface IProduct {
    productid: string;
    shopId: string;
    productphoto: string;
    productname: string;
    productdetail: string;
    productstyle: string;
    productAdditionalImages?: string[]; // Array of base64 strings
    productsize: string;
    productAllowedToRent: boolean;
    productPrice: number;
}