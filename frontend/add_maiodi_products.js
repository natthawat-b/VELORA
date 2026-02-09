import axios from 'axios';

const products = [
  {
    productname: "Maiodi Summer Dress",
    productdetail: "A beautiful white summer dress perfect for warm days. Minimalist design by Maiodi.",
    productstyle: "Casual",
    productsize: "M",
    productAllowedToRent: true,
    productPrice: 1590,
    productphoto: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    productname: "Maiodi Linen Shirt",
    productdetail: "Premium blue linen shirt for men. Breathable fabric and stylish cut.",
    productstyle: "Semi-Formal",
    productsize: "L",
    productAllowedToRent: true,
    productPrice: 1290,
    productphoto: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    productname: "Maiodi Trousers",
    productdetail: "Elegant black trousers suitable for work or evening events.",
    productstyle: "Formal",
    productsize: "32",
    productAllowedToRent: true,
    productPrice: 1890,
    productphoto: "https://images.unsplash.com/photo-1594633312681-425c7b97d1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const addProducts = async () => {
  console.log('Adding products to https://velora-x8m0.onrender.com/api/product/add ...');
  for (const product of products) {
    try {
      const response = await axios.post('https://velora-x8m0.onrender.com/api/product/add', product);
      console.log(`Added ${product.productname}:`, response.data.message || 'Success');
    } catch (error) {
      console.error(`Error adding ${product.productname}:`, error.message);
      if (error.response) console.error(error.response.data);
    }
  }
};

addProducts();
