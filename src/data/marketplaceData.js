// ── marketplaceData.js — AgriConnect Crop Marketplace Dummy Data ──────────────

// Local crop images (uploaded by team)
import imgBasmatiRice    from '../assets/basmati_rice.jpg';
import imgBrinjal        from '../assets/brinjal.jpeg';
import imgCauliflower    from '../assets/cauliflower.jpeg';
import imgChickpeas      from '../assets/chickpeas_bold.webp';
import imgCotton         from '../assets/cotton_shankar.jpg';
import imgGingerFresh    from '../assets/ginger_fresh.jpg';
import imgGreenChilli    from '../assets/green_chilli.jpg';
import imgGreenMoong     from '../assets/green_moong.webp';
import imgMustardSeeds   from '../assets/mustard_seeds.jpg';
import imgPomegranate    from '../assets/pomegranate.webp';
import imgRedLentils     from '../assets/red_lentils.jpg';
import imgSoybeanYellow  from '../assets/soybean_yellow.jpeg';
import imgSugarcane      from '../assets/sugarcane.webp';
import imgTurmeric       from '../assets/turmeric.jpeg';
import imgOnion          from '../assets/onion.jpg';
import imgSorghum        from '../assets/sorghum.jpg';
import imgYellowMaize    from '../assets/yellow_maize.jpeg';


const U = (id, w = 400) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const CROP_LISTINGS = [
  // Grains
  { id: 1,  name: 'Wheat Sona',      hindi: '\u0917\u0947\u0939\u0942\u0902 \u0938\u094b\u0928\u093e',      category: 'Grain',     price: 2300, unit: 'qt', qty: 120, quality: 'A Grade',       farmer: 'Ramesh Singh',     state: 'Punjab',           city: 'Amritsar',   img: U('1574323347407-f5e1ad6d020b'), bio: 'Machine-cleaned, 12% moisture',    verified: true,  listed: '2 hrs ago'  },
  { id: 2,  name: 'Basmati Rice',    hindi: '\u092c\u093e\u0938\u092e\u0924\u0940 \u091a\u093e\u0935\u0932',     category: 'Grain',     price: 1560, unit: 'qt', qty:  90, quality: 'Premium',       farmer: 'Amit Kumar',       state: 'Haryana',          city: 'Karnal',     img: imgBasmatiRice,                   bio: 'Long-grain, aromatic variety',     verified: true,  listed: '5 hrs ago'  },
  { id: 3,  name: 'Maize Yellow',    hindi: '\u092e\u0915\u094d\u0915\u093e \u092a\u0940\u0932\u093e',      category: 'Grain',     price:  980, unit: 'qt', qty: 200, quality: 'Good',           farmer: 'Vijay Lodha',      state: 'Madhya Pradesh',   city: 'Indore',     img: imgYellowMaize,                   bio: 'Dry, well-sorted kernels',         verified: false, listed: '1 day ago'  },
  { id: 4,  name: 'Sorghum',         hindi: '\u091c\u094d\u0935\u093e\u0930',            category: 'Grain',     price: 1850, unit: 'qt', qty:  80, quality: 'A Grade',       farmer: 'Suresh Patil',     state: 'Maharashtra',      city: 'Nagpur',     img: imgSorghum,                       bio: 'High-protein sorghum grain',       verified: true,  listed: '3 hrs ago'  },

  // Vegetables
  { id: 5,  name: 'Hybrid Tomato',   hindi: '\u0939\u093e\u0907\u092c\u094d\u0930\u093f\u0921 \u091f\u092e\u093e\u091f\u0930', category: 'Vegetable', price: 1880, unit: 'qt', qty:  40, quality: 'Fresh',         farmer: 'Ganesh Pawar',     state: 'Maharashtra',      city: 'Nashik',     img: U('1546094096-0df4bcaaa337'),    bio: 'Firm, red, export quality',        verified: true,  listed: '1 hr ago'   },
  { id: 6,  name: 'Potato Kufri',    hindi: '\u0906\u0932\u0942 \u0915\u0941\u092b\u0930\u0940',       category: 'Vegetable', price: 1250, unit: 'qt', qty: 150, quality: 'A Grade',       farmer: 'Mahesh Yadav',     state: 'Uttar Pradesh',    city: 'Agra',       img: U('1518977676601-b53f82aba655'), bio: 'Medium-sized, clean tubers',       verified: true,  listed: '4 hrs ago'  },
  { id: 7,  name: 'Onion Red',       hindi: '\u092a\u094d\u092f\u093e\u091c \u0932\u093e\u0932',       category: 'Vegetable', price: 2100, unit: 'qt', qty:  75, quality: 'Export Quality', farmer: 'Bhimrao Salunke',  state: 'Maharashtra',      city: 'Nashik',     img: imgOnion, bio: 'Dry, tight-skinned, 50-60mm',     verified: true,  listed: '6 hrs ago'  },
  { id: 8,  name: 'Green Chilli',    hindi: '\u0939\u0930\u0940 \u092e\u093f\u0930\u094d\u091a',       category: 'Vegetable', price: 3200, unit: 'qt', qty:  25, quality: 'Fresh',         farmer: 'Ravi Naidu',       state: 'Andhra Pradesh',   city: 'Guntur',     img: imgGreenChilli,                   bio: 'Long variety, medium heat',        verified: false, listed: '2 days ago' },
  { id: 9,  name: 'Brinjal',         hindi: '\u092c\u0948\u0902\u0917\u0928',            category: 'Vegetable', price:  940, unit: 'qt', qty:  30, quality: 'Good',           farmer: 'Dinesh Pandey',    state: 'West Bengal',      city: 'Kolkata',    img: imgBrinjal,                       bio: 'Round, shiny, uniform size',       verified: false, listed: '1 day ago'  },
  { id: 10, name: 'Sugarcane',       hindi: '\u0917\u0928\u094d\u0928\u093e',            category: 'Vegetable', price:  340, unit: 'qt', qty: 300, quality: 'Fresh Cut',      farmer: 'Dinesh Chaudhary', state: 'Uttar Pradesh',    city: 'Meerut',     img: imgSugarcane,                     bio: 'High sucrose content cane',        verified: true,  listed: '8 hrs ago'  },
  { id: 11, name: 'Mustard Seeds',   hindi: '\u0938\u0930\u0938\u094b\u0902',            category: 'Vegetable', price: 5100, unit: 'qt', qty:  80, quality: 'A Grade',       farmer: 'Bhanwar Lal',      state: 'Rajasthan',        city: 'Jaipur',     img: imgMustardSeeds,                  bio: 'Bold seeds, 42% oil content',      verified: true,  listed: '3 hrs ago'  },
  { id: 12, name: 'Cauliflower',     hindi: '\u092b\u0942\u0932\u0917\u094b\u092d\u0940',          category: 'Vegetable', price: 1100, unit: 'qt', qty:  60, quality: 'Fresh',         farmer: 'Karan Lodhi',      state: 'Bihar',            city: 'Patna',      img: imgCauliflower,                   bio: 'White curd, no yellowing',         verified: true,  listed: '5 hrs ago'  },

  // Fruits
  { id: 13, name: 'Mango Alphonso',  hindi: '\u0906\u092e \u0905\u0932\u092b\u093e\u0902\u0938\u094b',      category: 'Fruit',     price: 6200, unit: 'qt', qty:  45, quality: 'Export Quality', farmer: 'Nilesh Patil',     state: 'Maharashtra',      city: 'Ratnagiri',  img: U('1553279768-865429fa0078'),    bio: 'GI tagged Hapus, box-packed',      verified: true,  listed: '1 hr ago'   },
  { id: 14, name: 'Banana Dwarf',    hindi: '\u0915\u0947\u0932\u093e \u092c\u094c\u0928\u093e',        category: 'Fruit',     price: 1400, unit: 'qt', qty:  60, quality: 'Premium',       farmer: 'Arun Kumar',       state: 'Tamil Nadu',       city: 'Trichy',     img: U('1571771894821-ce9b6c11b08e'), bio: 'Fully ripe, 100-120mm finger',    verified: true,  listed: '2 hrs ago'  },
  { id: 15, name: 'Apple Himachal',  hindi: '\u0938\u0947\u092c \u0939\u093f\u092e\u093e\u091a\u0932',      category: 'Fruit',     price: 8500, unit: 'qt', qty:  30, quality: 'Premium',       farmer: 'Kamal Thakur',     state: 'Himachal Pradesh', city: 'Shimla',     img: U('1619546813926-a78fa6372cd2'), bio: 'Red Delicious, 70mm+ size',       verified: true,  listed: '4 hrs ago'  },
  { id: 16, name: 'Black Grapes',    hindi: '\u0915\u093e\u0932\u0947 \u0905\u0902\u0917\u0942\u0930',      category: 'Fruit',     price: 4800, unit: 'qt', qty:  35, quality: 'Fresh',         farmer: 'Santosh More',     state: 'Maharashtra',      city: 'Sangli',     img: U('1596363505729-4190a9506133'), bio: 'Seedless, firm, sweet variety',   verified: false, listed: '1 day ago'  },
  { id: 17, name: 'Carrot Nantes',   hindi: '\u0917\u093e\u091c\u0930 \u0928\u093e\u0902\u091f\u0947\u0938',     category: 'Vegetable', price: 1100, unit: 'qt', qty:  55, quality: 'A Grade',       farmer: 'Rahul Kumar',      state: 'Delhi NCR',        city: 'Azadpur',    img: U('1447175008436-054170c2e979'), bio: 'Smooth, uniform, sweet core',     verified: true,  listed: '6 hrs ago'  },
  { id: 18, name: 'Pomegranate',     hindi: '\u0905\u0928\u093e\u0930',             category: 'Fruit',     price: 7200, unit: 'qt', qty:  20, quality: 'Export Quality', farmer: 'Vilas Mane',       state: 'Maharashtra',      city: 'Solapur',    img: imgPomegranate,                   bio: 'Bhagwa variety, export grade',     verified: true,  listed: '3 hrs ago'  },

  // Pulses
  { id: 19, name: 'Chickpea Bold',   hindi: '\u091a\u0928\u093e \u0926\u093e\u0928\u093e',         category: 'Pulse',     price: 5600, unit: 'qt', qty: 100, quality: 'Premium',       farmer: 'Rajesh Verma',     state: 'Rajasthan',        city: 'Kota',       img: imgChickpeas,                     bio: 'Kabuli type, 9-10mm bold',         verified: true,  listed: '2 hrs ago'  },
  { id: 20, name: 'Soybean Yellow',  hindi: '\u0938\u094b\u092f\u093e\u092c\u0940\u0928 \u092a\u0940\u0932\u093e',    category: 'Pulse',     price: 4200, unit: 'qt', qty: 110, quality: 'Good',           farmer: 'Prashant Dhoke',   state: 'Madhya Pradesh',   city: 'Ujjain',     img: imgSoybeanYellow,                 bio: 'Clean, 18% protein content',      verified: true,  listed: '5 hrs ago'  },
  { id: 21, name: 'Lentil Red',      hindi: '\u0932\u093e\u0932 \u092e\u0938\u0942\u0930',         category: 'Pulse',     price: 6800, unit: 'qt', qty:  65, quality: 'A Grade',       farmer: 'Vijay Kale',       state: 'Madhya Pradesh',   city: 'Bhopal',     img: imgRedLentils,                    bio: 'Split red lentil, uniform size',  verified: true,  listed: '1 hr ago'   },
  { id: 22, name: 'Green Moong',     hindi: '\u0939\u0930\u093e \u092e\u0942\u0902\u0917',         category: 'Pulse',     price: 7500, unit: 'qt', qty:  40, quality: 'Organic',       farmer: 'Deepak Sharma',    state: 'Rajasthan',        city: 'Jodhpur',    img: imgGreenMoong,                    bio: 'Certified organic, bold grain',   verified: true,  listed: '3 hrs ago'  },

  // Cash Crops
  { id: 23, name: 'Cotton Shankar',  hindi: '\u0915\u092a\u093e\u0938 \u0936\u0902\u0915\u0930',       category: 'Cash Crop', price: 6500, unit: 'qt', qty:  70, quality: 'Premium',       farmer: 'Naresh Patel',     state: 'Gujarat',          city: 'Rajkot',     img: imgCotton,                        bio: '28mm staple, 4.0g strength',      verified: true,  listed: '4 hrs ago'  },
  { id: 24, name: 'Turmeric Finger', hindi: '\u0939\u0932\u094d\u0926\u0940 \u092b\u093f\u0902\u0917\u0930',     category: 'Cash Crop', price: 9200, unit: 'qt', qty:  25, quality: 'Export Quality', farmer: 'Arvind Reddy',     state: 'Telangana',        city: 'Nizamabad',  img: imgTurmeric,                      bio: '3% curcumin, GI certified',       verified: true,  listed: '2 hrs ago'  },
  { id: 25, name: 'Ginger Fresh',    hindi: '\u0905\u0926\u0930\u0915 \u0924\u093e\u091c\u093e',       category: 'Cash Crop', price: 4500, unit: 'qt', qty:  35, quality: 'Fresh',         farmer: 'Binu Thomas',      state: 'Kerala',           city: 'Wayanad',    img: imgGingerFresh,                   bio: 'High-oil content fresh ginger',   verified: false, listed: '1 day ago'  },
];

export const CATEGORIES     = ['All', 'Grain', 'Vegetable', 'Fruit', 'Pulse', 'Cash Crop'];
export const QUALITIES      = ['All Quality', 'Premium', 'A Grade', 'Export Quality', 'Organic', 'Fresh', 'Fresh Cut', 'Good'];
export const ALL_STATES_MKT = [...new Set(CROP_LISTINGS.map(c => c.state))].sort();
export const FEATURED_IDS   = [1, 2, 5, 13, 24, 22];

// Best Mandi dummy data — multiple mandis per crop, enables real sorting/filtering
export const BEST_MANDI_DATA = [
  { id:   1, crop: 'Wheat',        mandi: 'Indore',       state: 'Madhya Pradesh',  price: 2480, change:  150, trend: 'up'   },
  { id:   2, crop: 'Wheat',        mandi: 'Amritsar',     state: 'Punjab',          price: 2350, change:   80, trend: 'up'   },
  { id:   3, crop: 'Wheat',        mandi: 'Jaipur',       state: 'Rajasthan',       price: 2290, change:  -40, trend: 'down' },
  { id:   4, crop: 'Wheat',        mandi: 'Lucknow',      state: 'Uttar Pradesh',   price: 2210, change:   20, trend: 'up'   },
  { id:   5, crop: 'Rice',         mandi: 'Karnal',       state: 'Haryana',         price: 2850, change:  200, trend: 'up'   },
  { id:   6, crop: 'Rice',         mandi: 'Warangal',     state: 'Telangana',       price: 2720, change:   90, trend: 'up'   },
  { id:   7, crop: 'Rice',         mandi: 'Cuttack',      state: 'Odisha',          price: 2600, change:  -60, trend: 'down' },
  { id:   8, crop: 'Rice',         mandi: 'Patna',        state: 'Bihar',           price: 2500, change:   30, trend: 'up'   },
  { id:   9, crop: 'Tomato',       mandi: 'Nashik',       state: 'Maharashtra',     price: 1950, change:  430, trend: 'up'   },
  { id:  10, crop: 'Tomato',       mandi: 'Kolar',        state: 'Karnataka',       price: 1780, change:  280, trend: 'up'   },
  { id:  11, crop: 'Tomato',       mandi: 'Pune',         state: 'Maharashtra',     price: 1650, change:  150, trend: 'up'   },
  { id:  12, crop: 'Tomato',       mandi: 'Hyderabad',    state: 'Telangana',       price: 1500, change:  -80, trend: 'down' },
  { id:  13, crop: 'Onion',        mandi: 'Lasalgaon',    state: 'Maharashtra',     price: 2400, change:  320, trend: 'up'   },
  { id:  14, crop: 'Onion',        mandi: 'Pimpalgaon',   state: 'Maharashtra',     price: 2250, change:  200, trend: 'up'   },
  { id:  15, crop: 'Onion',        mandi: 'Hubli',        state: 'Karnataka',       price: 2100, change:   80, trend: 'up'   },
  { id:  16, crop: 'Onion',        mandi: 'Agra',         state: 'Uttar Pradesh',   price: 1950, change:  -50, trend: 'down' },
  { id:  17, crop: 'Potato',       mandi: 'Agra',         state: 'Uttar Pradesh',   price: 1380, change:   90, trend: 'up'   },
  { id:  18, crop: 'Potato',       mandi: 'Jalandhar',    state: 'Punjab',          price: 1320, change:   60, trend: 'up'   },
  { id:  19, crop: 'Potato',       mandi: 'Kolkata',      state: 'West Bengal',     price: 1250, change:  -40, trend: 'down' },
  { id:  20, crop: 'Potato',       mandi: 'Indore',       state: 'Madhya Pradesh',  price: 1190, change:   20, trend: 'up'   },
  { id:  21, crop: 'Soybean',      mandi: 'Ujjain',       state: 'Madhya Pradesh',  price: 4600, change:  280, trend: 'up'   },
  { id:  22, crop: 'Soybean',      mandi: 'Latur',        state: 'Maharashtra',     price: 4450, change:  150, trend: 'up'   },
  { id:  23, crop: 'Soybean',      mandi: 'Indore',       state: 'Madhya Pradesh',  price: 4320, change:   80, trend: 'up'   },
  { id:  24, crop: 'Soybean',      mandi: 'Nagpur',       state: 'Maharashtra',     price: 4180, change:  -60, trend: 'down' },
  { id:  25, crop: 'Chickpea',     mandi: 'Kota',         state: 'Rajasthan',       price: 5900, change:  250, trend: 'up'   },
  { id:  26, crop: 'Chickpea',     mandi: 'Akola',        state: 'Maharashtra',     price: 5720, change:  140, trend: 'up'   },
  { id:  27, crop: 'Chickpea',     mandi: 'Gulbarga',     state: 'Karnataka',       price: 5580, change:   70, trend: 'up'   },
  { id:  28, crop: 'Chickpea',     mandi: 'Bhopal',       state: 'Madhya Pradesh',  price: 5410, change:  -90, trend: 'down' },
  { id:  29, crop: 'Cotton',       mandi: 'Rajkot',       state: 'Gujarat',         price: 7200, change:  400, trend: 'up'   },
  { id:  30, crop: 'Cotton',       mandi: 'Surendranagar',state: 'Gujarat',         price: 7050, change:  280, trend: 'up'   },
  { id:  31, crop: 'Cotton',       mandi: 'Adilabad',     state: 'Telangana',       price: 6850, change:  150, trend: 'up'   },
  { id:  32, crop: 'Cotton',       mandi: 'Amravati',     state: 'Maharashtra',     price: 6620, change:  -80, trend: 'down' },
  { id:  33, crop: 'Turmeric',     mandi: 'Nizamabad',    state: 'Telangana',       price: 9800, change:  500, trend: 'up'   },
  { id:  34, crop: 'Turmeric',     mandi: 'Erode',        state: 'Tamil Nadu',      price: 9550, change:  300, trend: 'up'   },
  { id:  35, crop: 'Turmeric',     mandi: 'Sangli',       state: 'Maharashtra',     price: 9300, change:  180, trend: 'up'   },
  { id:  36, crop: 'Turmeric',     mandi: 'Warangal',     state: 'Telangana',       price: 9100, change:  -60, trend: 'down' },
  { id:  37, crop: 'Green Chilli', mandi: 'Guntur',       state: 'Andhra Pradesh',  price: 3500, change:  300, trend: 'up'   },
  { id:  38, crop: 'Green Chilli', mandi: 'Warangal',     state: 'Telangana',       price: 3280, change:  140, trend: 'up'   },
  { id:  39, crop: 'Green Chilli', mandi: 'Hubli',        state: 'Karnataka',       price: 3100, change:   60, trend: 'up'   },
  { id:  40, crop: 'Green Chilli', mandi: 'Pune',         state: 'Maharashtra',     price: 2950, change:  -90, trend: 'down' },
  { id:  41, crop: 'Mustard',      mandi: 'Alwar',        state: 'Rajasthan',       price: 5450, change:  280, trend: 'up'   },
  { id:  42, crop: 'Mustard',      mandi: 'Bharatpur',    state: 'Rajasthan',       price: 5300, change:  160, trend: 'up'   },
  { id:  43, crop: 'Mustard',      mandi: 'Mathura',      state: 'Uttar Pradesh',   price: 5180, change:   70, trend: 'up'   },
  { id:  44, crop: 'Mustard',      mandi: 'Agra',         state: 'Uttar Pradesh',   price: 5050, change:  -50, trend: 'down' },
  { id:  45, crop: 'Ginger',       mandi: 'Wayanad',      state: 'Kerala',          price: 4900, change:  350, trend: 'up'   },
  { id:  46, crop: 'Ginger',       mandi: 'Guntur',       state: 'Andhra Pradesh',  price: 4720, change:  210, trend: 'up'   },
  { id:  47, crop: 'Ginger',       mandi: 'Erode',        state: 'Tamil Nadu',      price: 4550, change:  100, trend: 'up'   },
  { id:  48, crop: 'Ginger',       mandi: 'Kolkata',      state: 'West Bengal',     price: 4380, change:  -70, trend: 'down' },
];

export const BEST_MANDI_CROPS  = [...new Set(BEST_MANDI_DATA.map(d => d.crop))].sort();
export const BEST_MANDI_STATES = [...new Set(BEST_MANDI_DATA.map(d => d.state))].sort();
