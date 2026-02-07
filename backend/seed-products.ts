import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Shop from './model/shop';
import Product from './model/product';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/velora';

async function seedProducts() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // หา Shop ที่มีอยู่แล้ว หรือสร้างใหม่
        let shop = await Shop.findOne({});
        if (!shop) {
            shop = await Shop.create({
                shopusername: 'demo_shop_' + Date.now(),
                shopname: 'ร้านเสื้อผ้าสวยๆ',
                shopEmail: 'demo_' + Date.now() + '@velora.com',
                shopPassword: 'demo123',
                shopPhone: '0812345678',
                shopIDcard: String(Date.now()),
                shopBank: 'กสิกรไทย',
                shopBankNumber: '1234567890'
            });
            console.log('Created demo shop:', shop._id);
        } else {
            console.log('Using existing shop:', shop._id, shop.shopname);
        }

        // ลบสินค้าเก่าทั้งหมด (optional)
        await Product.deleteMany({ shopId: shop._id });
        console.log('Cleared old products');

        // สร้างสินค้าตัวอย่าง
        const products = [
            {
                shopId: shop._id,
                productphoto: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
                productname: 'ชุดราตรียาวสีดำ',
                productdetail: 'ชุดราตรียาวสีดำ เนื้อผ้านุ่ม ใส่สบาย เหมาะสำหรับงานปาร์ตี้',
                productstyle: 'Elegant',
                productsize: 'M, L, XL',
                productprice: 2500,
                productrentprice: 500,
                productAllowedToRent: true
            },
            {
                shopId: shop._id,
                productphoto: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
                productname: 'เดรสสีแดงสวย',
                productdetail: 'เดรสสีแดงสดใส ตัดเย็บประณีต เหมาะสำหรับออกงาน',
                productstyle: 'Casual',
                productsize: 'S, M, L',
                productprice: 1800,
                productrentprice: 350,
                productAllowedToRent: true
            },
            {
                shopId: shop._id,
                productphoto: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400',
                productname: 'กระโปรงยาวลายดอก',
                productdetail: 'กระโปรงยาวลายดอกไม้ สไตล์วินเทจ น่ารักมาก',
                productstyle: 'Vintage',
                productsize: 'M, L',
                productprice: 1200,
                productrentprice: 250,
                productAllowedToRent: true
            },
            {
                shopId: shop._id,
                productphoto: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400',
                productname: 'เสื้อเชิ้ตสีขาว',
                productdetail: 'เสื้อเชิ้ตสีขาว ผ้าคอตตอน ใส่สบาย',
                productstyle: 'Minimal',
                productsize: 'S, M, L, XL',
                productprice: 890,
                productrentprice: 150,
                productAllowedToRent: true
            }
        ];

        const createdProducts = await Product.insertMany(products);
        console.log(`Created ${createdProducts.length} products`);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();
