export interface IProduct {
    shopId: string;
    productphoto: string;
    productname: string;
    productdetail: string;
    productstyle: string;
    productsize: string;
    productprice: number;
    productrentprice?: number;
    productAllowedToRent: boolean;
}