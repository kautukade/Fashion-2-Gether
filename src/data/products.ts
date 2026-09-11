export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  images: string[];
  category: string;
  collection: string;
  colors: string[];
  sizes: string[];
  badge?: 'NEW' | 'TRENDING' | 'BESTSELLER' | 'LIMITED' | 'SALE';
  description: string;
  fabric: string;
  fit: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  avatar: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Oversized Silk Blend Shirt',
    slug: 'oversized-silk-blend-shirt',
    price: 1899,
    mrp: 2999,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop'
    ],
    category: 'Western Wear',
    collection: 'New Season',
    colors: ['Black', 'Ivory', 'Sage'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'NEW',
    description: 'Luxuriously soft oversized shirt crafted from premium silk blend fabric. Perfect for elevated everyday styling.',
    fabric: 'Silk Blend',
    fit: 'Oversized',
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Embroidered Anarkali Suit',
    slug: 'embroidered-anarkali-suit',
    price: 3499,
    mrp: 5499,
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'
    ],
    category: 'Ethnic Wear',
    collection: 'Festive Edit',
    colors: ['Maroon', 'Navy', 'Emerald'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'TRENDING',
    description: 'Exquisite hand-embroidered Anarkali suit with intricate zari work. A statement piece for every celebration.',
    fabric: 'Georgette',
    fit: 'Flared',
    inStock: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Structured Blazer Dress',
    slug: 'structured-blazer-dress',
    price: 2799,
    mrp: 4299,
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&h=800&fit=crop'
    ],
    category: 'Party Wear',
    collection: 'Power Dressing',
    colors: ['Black', 'Camel'],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: 'BESTSELLER',
    description: 'Power dressing redefined. This structured blazer dress commands attention with its sharp tailoring and modern silhouette.',
    fabric: 'Polyester Blend',
    fit: 'Structured',
    inStock: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: '4',
    name: 'Cotton Printed Kurti',
    slug: 'cotton-printed-kurti',
    price: 999,
    mrp: 1599,
    images: [
      'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583391733981-8498408ee5fa?w=600&h=800&fit=crop'
    ],
    category: 'Ethnic Wear',
    collection: 'Everyday Elegance',
    colors: ['Blue', 'Pink', 'Yellow'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'SALE',
    description: 'Beautiful block-printed cotton kurti with traditional motifs. Comfortable and stylish for daily wear.',
    fabric: 'Pure Cotton',
    fit: 'Regular',
    inStock: true,
    rating: 4.5,
    reviews: 312
  },
  {
    id: '5',
    name: 'Sequin Party Top',
    slug: 'sequin-party-top',
    price: 1599,
    mrp: 2499,
    images: [
      'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551163943-3f7fb894e3c1?w=600&h=800&fit=crop'
    ],
    category: 'Party Wear',
    collection: 'Night Out',
    colors: ['Gold', 'Silver', 'Black'],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: 'TRENDING',
    description: 'Show-stopping sequin top that catches every light in the room. Perfect for parties and celebrations.',
    fabric: 'Sequin on Net',
    fit: 'Slim',
    inStock: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: '6',
    name: 'Co-ord Set Floral',
    slug: 'co-ord-set-floral',
    price: 2299,
    mrp: 3499,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop'
    ],
    category: 'Western Wear',
    collection: 'New Season',
    colors: ['Floral Pink', 'Floral Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'NEW',
    description: 'Effortlessly chic co-ord set with beautiful floral prints. Mix and match or wear together for a complete look.',
    fabric: 'Viscose',
    fit: 'Relaxed',
    inStock: true,
    rating: 4.8,
    reviews: 98
  },
  {
    id: '7',
    name: 'Palazzo Pants Wide Leg',
    slug: 'palazzo-pants-wide-leg',
    price: 1199,
    mrp: 1899,
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551854838-212c9a5e9ef0?w=600&h=800&fit=crop'
    ],
    category: 'Bottom Wear',
    collection: 'Everyday Elegance',
    colors: ['Black', 'White', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'BESTSELLER',
    description: 'Flowing wide-leg palazzo pants that move with grace. The perfect bottom for any top in your wardrobe.',
    fabric: 'Rayon',
    fit: 'Wide Leg',
    inStock: true,
    rating: 4.4,
    reviews: 267
  },
  {
    id: '8',
    name: 'Designer Lehenga Choli',
    slug: 'designer-lehenga-choli',
    price: 8999,
    mrp: 14999,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop'
    ],
    category: 'Festive Wear',
    collection: 'Bridal Edit',
    colors: ['Red', 'Pink', 'Gold'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'LIMITED',
    description: 'Breathtaking designer lehenga with heavy embroidery and premium fabric. Made for your most special moments.',
    fabric: 'Silk & Net',
    fit: 'Custom',
    inStock: true,
    rating: 5.0,
    reviews: 45
  },
  {
    id: '9',
    name: 'Casual Linen Dress',
    slug: 'casual-linen-dress',
    price: 1699,
    mrp: 2599,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop'
    ],
    category: 'Casual Wear',
    collection: 'Summer Edit',
    colors: ['White', 'Sage', 'Dusty Rose'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'NEW',
    description: 'Breezy linen dress perfect for warm days. Effortless style meets ultimate comfort.',
    fabric: 'Pure Linen',
    fit: 'A-Line',
    inStock: true,
    rating: 4.7,
    reviews: 178
  },
  {
    id: '10',
    name: 'Crop Top & Skirt Set',
    slug: 'crop-top-skirt-set',
    price: 2099,
    mrp: 3299,
    images: [
      'https://images.unsplash.com/photo-1502716119720-b23a1e3f7f11?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop'
    ],
    category: 'Party Wear',
    collection: 'Night Out',
    colors: ['Black', 'Red'],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: 'TRENDING',
    description: 'Bold and beautiful crop top with matching skirt. Turn heads at every party with this stunning set.',
    fabric: 'Satin',
    fit: 'Bodycon',
    inStock: true,
    rating: 4.6,
    reviews: 134
  },
  {
    id: '11',
    name: 'Handloom Saree',
    slug: 'handloom-saree',
    price: 4599,
    mrp: 6999,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop'
    ],
    category: 'Ethnic Wear',
    collection: 'Heritage',
    colors: ['Blue', 'Green', 'Purple'],
    sizes: ['Free Size'],
    badge: 'LIMITED',
    description: 'Authentic handloom saree woven by master artisans. Each piece tells a story of tradition and craftsmanship.',
    fabric: 'Pure Silk',
    fit: 'Free Size',
    inStock: true,
    rating: 4.9,
    reviews: 67
  },
  {
    id: '12',
    name: 'Denim Jacket Oversized',
    slug: 'denim-jacket-oversized',
    price: 2199,
    mrp: 3499,
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop'
    ],
    category: 'Western Wear',
    collection: 'Street Style',
    colors: ['Light Wash', 'Dark Wash', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'BESTSELLER',
    description: 'Classic oversized denim jacket with a modern edge. The perfect layering piece for any season.',
    fabric: 'Premium Denim',
    fit: 'Oversized',
    inStock: true,
    rating: 4.8,
    reviews: 289
  }
];

export const categories: Category[] = [
  {
    id: '1',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop',
    description: 'Fresh drops, latest trends',
    productCount: 24
  },
  {
    id: '2',
    name: 'Ethnic Wear',
    slug: 'ethnic-wear',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    description: 'Tradition meets elegance',
    productCount: 36
  },
  {
    id: '3',
    name: 'Western Wear',
    slug: 'western-wear',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=800&fit=crop',
    description: 'Modern & bold',
    productCount: 42
  },
  {
    id: '4',
    name: 'Party Wear',
    slug: 'party-wear',
    image: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600&h=800&fit=crop',
    description: 'Shine at every event',
    productCount: 28
  },
  {
    id: '5',
    name: 'Dresses',
    slug: 'dresses',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop',
    description: 'For every occasion',
    productCount: 31
  },
  {
    id: '6',
    name: 'Festive Wear',
    slug: 'festive-wear',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop',
    description: 'Celebrate in style',
    productCount: 19
  }
];

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Priya S.',
    rating: 5,
    text: 'Absolutely love the quality! The silk blend shirt is so comfortable and looks even better in person. Will definitely order again.',
    date: '2 days ago',
    verified: true,
    avatar: 'P'
  },
  {
    id: '2',
    name: 'Ananya M.',
    rating: 5,
    text: 'The Anarkali suit is stunning! Got so many compliments at the wedding. Fabric quality is premium and the embroidery is beautiful.',
    date: '5 days ago',
    verified: true,
    avatar: 'A'
  },
  {
    id: '3',
    name: 'Sneha K.',
    rating: 4,
    text: 'Great collection and fast delivery. The co-ord set fits perfectly. Only wish there were more color options!',
    date: '1 week ago',
    verified: true,
    avatar: 'S'
  },
  {
    id: '4',
    name: 'Ritu P.',
    rating: 5,
    text: 'Fashion 2 Gether never disappoints! Every piece I\'ve ordered has exceeded my expectations. Their customer service is amazing too.',
    date: '1 week ago',
    verified: true,
    avatar: 'R'
  },
  {
    id: '5',
    name: 'Meera D.',
    rating: 5,
    text: 'The lehenga I ordered for my engagement was breathtaking. Everyone asked where I got it from. Thank you F2G!',
    date: '2 weeks ago',
    verified: true,
    avatar: 'M'
  }
];

export const reels = [
  {
    id: '1',
    title: 'New Season Drop',
    caption: 'Fresh styles just landed ✨',
    thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=700&fit=crop',
    products: ['1', '6', '9']
  },
  {
    id: '2',
    title: 'Festive Edit',
    caption: 'Get ready for celebrations 🎉',
    thumbnail: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=700&fit=crop',
    products: ['2', '8', '11']
  },
  {
    id: '3',
    title: 'Party Night',
    caption: 'Slay every party 💃',
    thumbnail: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=400&h=700&fit=crop',
    products: ['3', '5', '10']
  },
  {
    id: '4',
    title: 'Everyday Style',
    caption: 'Casual but make it fashion 🌿',
    thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=700&fit=crop',
    products: ['4', '7', '12']
  }
];
