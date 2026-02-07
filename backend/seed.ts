import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Shop from './model/shop';
import Product from './model/product';

dotenv.config();

// เชื่อมต่อ MongoDB
const MONGO_URI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/velora';

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // เช็คว่ามีร้านค้าหรือยัง
    let shop = await Shop.findOne({ shopusername: 'fashionshop' });

    if (!shop) {
      // สร้างร้านค้าใหม่ถ้ายังไม่มี
      shop = await Shop.create({
        shopusername: 'fashionshop',
        shopname: 'Fashion Style Shop',
        shopEmail: 'fashion@example.com',
        shopPassword: '123456',
        shopPhone: '0891234567',
        shopIDcard: '1234567890123',
        shopBank: 'กสิกรไทย',
        shopBankNumber: '1234567890'
      });
      console.log('Created new shop:', shop._id, shop.shopname);
    } else {
      console.log('Found existing shop:', shop._id, shop.shopname);
    }

    // ลบสินค้าเก่าออกก่อน (เพื่อป้องกันข้อมูลซ้ำซ้อน)
    await Product.deleteMany({ shopId: shop._id });
    console.log('Cleared old products');

    console.log('Created shop:', shop._id, shop.shopname);

    // สร้างสินค้าตัวอย่าง
    const products = await Product.create([
      {
        shopId: shop._id,
        productphoto: 'https://via.placeholder.com/300x400/87CEEB/FFFFFF?text=T-Shirt',
        productname: 'เสื้อยืดสีขาว Premium',
        productdetail: 'เสื้อยืดผ้า Cotton 100% นุ่มสบาย ใส่ได้ทุกวัน',
        productstyle: 'Casual',
        productsize: 'M, L, XL',
        productprice: 590,
        productrentprice: 100,
        productAllowedToRent: true
      },
      {
        shopId: shop._id,
        productphoto: 'https://via.placeholder.com/300x400/90EE90/FFFFFF?text=Dress',
        productname: 'เดรสลายดอก Summer',
        productdetail: 'เดรสสั้นลายดอกไม้ ผ้าบางเบา เหมาะกับหน้าร้อน',
        productstyle: 'Summer',
        productsize: 'S, M, L',
        productprice: 890,
        productrentprice: 150,
        productAllowedToRent: true
      },
      {
        shopId: shop._id,
        productphoto: 'https://via.placeholder.com/300x400/FFB6C1/FFFFFF?text=Jeans',
        productname: 'กางเกงยีนส์ทรง Slim',
        productdetail: 'กางเกงยีนส์ทรงสลิม ผ้ายืด ใส่สบาย',
        productstyle: 'Casual',
        productsize: '28, 30, 32, 34',
        productprice: 1290,
        productrentprice: 200,
        productAllowedToRent: true
      },
      {
        shopId: shop._id,
        productphoto: 'https://via.placeholder.com/300x400/DDA0DD/FFFFFF?text=Jacket',
        productname: 'แจ็คเก็ตยีนส์ Vintage',
        productdetail: 'แจ็คเก็ตยีนส์สไตล์วินเทจ มีกระเป๋าด้านหน้า',
        productstyle: 'Vintage',
        productsize: 'M, L, XL',
        productprice: 1590,
        productrentprice: 250,
        productAllowedToRent: true
      }
    ]);

    console.log(`Created ${products.length} products`);
    console.log('Product IDs:', products.map(p => p._id));

    console.log('\n✅ Seed data created successfully!');
    console.log('Shop ID:', shop._id);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
