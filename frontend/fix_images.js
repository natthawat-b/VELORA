import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
const NEW_PLACEHOLDER = 'https://placehold.co/300x400/EEE/31343C';

async function fixProductImages() {
  try {
    // 1. Get all products
    console.log('Fetching products...');
    const res = await axios.get(`${API_URL}/product`);
    const products = res.data.payload;

    console.log(`Found ${products.length} products.`);

    let updateCount = 0;

    // 2. Iterate and update if URL is broken
    for (const product of products) {
      if (product.productphoto && product.productphoto.includes('via.placeholder.com')) {
        console.log(`Updating product: ${product.productname} (${product._id})`);
        
        try {
          await axios.put(`${API_URL}/product/${product._id}`, {
            ...product, // Keep other fields
            productphoto: NEW_PLACEHOLDER
          });
          updateCount++;
          console.log(`  > Success`);
        } catch (updateErr) {
          console.error(`  > Failed to update ${product._id}:`, updateErr.message);
        }
      }
    }

    console.log(`\nFixed ${updateCount} products.`);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fixProductImages();
