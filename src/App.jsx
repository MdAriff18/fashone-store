import PolicyPage from "./PolicyPage";
import { useEffect, useMemo, useState } from "react";
import "./index.css";
import MyOrders from "./MyOrders";

const fallbackProducts = [
  {
    id: 1,
    name: "JAPANESE PLAID PULLOVER",
    category: "Shirts",
    price: 2499,
    oldPrice: 2999,
    color: "SKy & Tobacco Ombree",
    image: "https://i.pinimg.com/736x/d7/0a/e4/d70ae47a5fe9551f5de0f36769cff23f.jpg",
    images: [
      "https://i.pinimg.com/736x/d7/0a/e4/d70ae47a5fe9551f5de0f36769cff23f.jpg",
      "https://i.pinimg.com/736x/7e/6b/65/7e6b658e0da881fa3707076ccb16e9e7.jpg",
      "https://i.pinimg.com/1200x/c3/32/b8/c332b8a8a3cbd738bba0526cecb8726a.jpg",
      "https://i.pinimg.com/736x/b0/38/e7/b038e70c1bfd68794a600635a616e063.jpg",
    ], 
    badge: "LIMITED",
  },
  {
    id: 2,
    name: "GRAPHIC RELAXED TEE",
    category: "T-Shirts",
    price: 699,
    oldPrice: 899,
    color: "Cloud White",
    image: "https://i.pinimg.com/1200x/1f/bc/ee/1fbceebdc7420cf3c5bd2bfcde1a573e.jpg",
    images: [
      "https://i.pinimg.com/1200x/1f/bc/ee/1fbceebdc7420cf3c5bd2bfcde1a573e.jpg",
      "https://i.pinimg.com/1200x/c6/24/22/c62422f4db0b3e8b0f982a50bd1e4090.jpg",
      "https://i.pinimg.com/1200x/c1/b2/7d/c1b27d8a53c7286f1a19df105152236c.jpg",
    ], 
    badge: "BEST SELLER",
  },
  {
    id: 3,
    name: "CLASSIC OXFORD T-SHIRT",
    category: "T-Shirts",
    price: 1499,
    oldPrice: 1799,
    color: "White",
    image: "https://i.pinimg.com/1200x/1e/ef/6a/1eef6a0bbb726c763c4c822c3668c87c.jpg",
    images: [
      "https://i.pinimg.com/1200x/1e/ef/6a/1eef6a0bbb726c763c4c822c3668c87c.jpg",
      "https://i.pinimg.com/1200x/c0/02/38/c00238aaba9913bf6301536736f23da7.jpg",
      "https://i.pinimg.com/1200x/54/10/9f/54109f437ad424782261735ce21a5508.jpg",
    ], 
    badge: "NEW",
  },
  {
    id: 4,
    name: "BLACK COLLARLESS CASUAL SHIRT",
    category: "Shirts",
    price: 749,
    oldPrice: 949,
    color: "Black",
    image: "https://i.pinimg.com/1200x/86/0b/89/860b8906bc1223fa78ee59b0bb193c31.jpg",
    images: [
      "https://i.pinimg.com/1200x/86/0b/89/860b8906bc1223fa78ee59b0bb193c31.jpg",
      "https://i.pinimg.com/1200x/0d/45/81/0d458175f9d2a4888107e1f4364c7fcc.jpg",
      "https://i.pinimg.com/1200x/45/ed/94/45ed94fff4cdd537231882420037127b.jpg",
      "https://i.pinimg.com/1200x/39/bd/36/39bd36f5aa9908ca584cd33f894f7455.jpg",
    ], 
    badge: "",
  },
  {
    id: 5,
    name: "DOUBLE POCKET REGULAR FIT",
    category: "Shirts",
    price: 1599,
    oldPrice: 1899,
    color: "Sky Blue",
    image: "https://i.pinimg.com/736x/10/d2/ca/10d2cab546f3886b226ca39e35a41b19.jpg",
    images: [
      "https://i.pinimg.com/736x/10/d2/ca/10d2cab546f3886b226ca39e35a41b19.jpg",
      "https://i.pinimg.com/1200x/90/17/e9/9017e9b35110d26ebd293b4ce3cd60bb.jpg",
      "https://i.pinimg.com/736x/db/e4/75/dbe47558f3bd26dadfdbac2292b9b5c3.jpg",
    ], 
    badge: "",
  },
  {
    id: 6,
    name: "STAY SICK PUFF PRINTED TEE",
    category: "T-Shirts",
    price: 1399,
    oldPrice: 1699,
    color: "Black",
    image: "https://veirdo.in/cdn/shop/files/Artboard3-2026-05-11T150159.258.jpg?v=1778492085&width=360",
    images: [
      "https://veirdo.in/cdn/shop/files/Artboard3-2026-05-11T150159.258.jpg?v=1778492085&width=360",
      "https://veirdo.in/cdn/shop/files/Artboard4-2026-05-11T150200.800.jpg?v=1778492085&width=360",
      "https://veirdo.in/cdn/shop/files/Artboard5-2026-05-11T150202.456.jpg?v=1778492085&width=360",
    ], 
    badge: "",
  },
  {
    id: 7,
    name: "GRAPHIC LETTER PRINTED TEE",
    category: "T-Shirts",
    price: 1599,
    oldPrice: 1899,
    color: "White & Blue",
    image: "https://i.pinimg.com/1200x/9c/79/0d/9c790d65867d5cda11b138cb0c4df005.jpg",
    images: [
      "https://i.pinimg.com/1200x/9c/79/0d/9c790d65867d5cda11b138cb0c4df005.jpg",
      "https://i.pinimg.com/736x/63/7e/73/637e7389ac140e9c669ff480953ff6cc.jpg",
    ], 
    badge: "",
  },
  {
    id: 8,
    name: "DICE PUFF PRINTED TEE",
    category: "T-Shirts",
    price: 1599,
    oldPrice: 1899,
    color: "Orange",
    image: "https://pronk.in/cdn/shop/files/02july2025christian11251.jpg?v=1753181595&width=1800",
    images: [
      "https://pronk.in/cdn/shop/files/02july2025christian11251.jpg?v=1753181595&width=1800",
      "https://pronk.in/cdn/shop/files/02july2025christian11265.jpg?v=1753181595&width=1800",
      "https://pronk.in/cdn/shop/files/EMBROIDERYPRINT24.jpg?v=1752042585&width=1800",
    ], 
    badge: "",
  },
  {
    id: 9,
    name: "MANDALA ROOTS PUFF PRINTED TEE",
    category: "T-Shirts",
    price: 799,
    oldPrice: 999,
    color: "Jet Black",
    image: "https://pronk.in/cdn/shop/files/TU-OST-025-BLK-S.jpg?v=1769853103&width=1800",
    images: [
      "https://pronk.in/cdn/shop/files/TU-OST-025-BLK-S.jpg?v=1769853103&width=1800",
      "https://pronk.in/cdn/shop/files/TU-OST-025-BLK-S_1.jpg?v=1769853103&width=1800",
      "https://pronk.in/cdn/shop/files/TU-OST-025-BLK-S_2.jpg?v=1769853103&width=1800",
    ], 
    badge: "BESTSELLER",
  },
  {
    id: 10,
    name: "CHINESE COLLAR CASUAL SHIRT",
    category: "Shirts",
    price: 1699,
    oldPrice: 1999,
    color: "Choco",
    image: "https://i.pinimg.com/736x/59/8e/16/598e1613512808ecd1d47c27c99a9a5d.jpg",
    images: [
      "https://i.pinimg.com/736x/59/8e/16/598e1613512808ecd1d47c27c99a9a5d.jpg",
      "https://i.pinimg.com/736x/26/47/bc/2647bcfd6dab251a4bd85f91881b7f95.jpg",
      "https://i.pinimg.com/736x/3f/4a/3b/3f4a3b057724c86a04bc8c06b3e0c1c9.jpg",
    ], 
    badge: "NEW",
  },
  {
    id: 11,
    name: "VERTICAL STRIPPED CASUAL SHIRT",
    category: "Shirts",
    price: 2499,
    oldPrice: 2999,
    color: "Beige",
    image: "https://i.pinimg.com/736x/7b/c4/95/7bc49524ac95e599560520e17936bca6.jpg",
    images: [
      "https://i.pinimg.com/736x/7b/c4/95/7bc49524ac95e599560520e17936bca6.jpg",
      "https://i.pinimg.com/736x/bd/f9/bb/bdf9bb5e8a0c22efe1afc8f44d70cbae.jpg",
      "https://i.pinimg.com/736x/df/1d/58/df1d586059356ec7b566fff50d557c93.jpg",
      "https://i.pinimg.com/736x/d4/a3/3f/d4a33fb7234bf5414585f50edaca9e6b.jpg",
    ], 
    badge: "LIMITED",
  },
  {
    id: 12,
    name: "OVERSIZED BAGGY TROUSER",
    category: "Trousers",
    price: 749,
    oldPrice: 949,
    color: "Off-white",
    image: "https://i.pinimg.com/736x/ab/31/99/ab31995dd33981e7baa87290cc30e9ba.jpg",
    images: [
      "https://i.pinimg.com/736x/ab/31/99/ab31995dd33981e7baa87290cc30e9ba.jpg",
      "https://i.pinimg.com/736x/49/fb/a3/49fba36cf4f463a7267f659987c87c68.jpg",
      "https://i.pinimg.com/736x/f2/ce/91/f2ce9193401f13e7499af21b0989026e.jpg",
    ], 
    badge: "",
  },
  {
    id: 13,
    name: "NAVY LINEN SHIRT",
    category: "Shirts",
    price: 1599,
    oldPrice: 1899,
    color: "Navy Blue",
    image: "https://i.pinimg.com/1200x/8d/c6/45/8dc645d1fe7bf0a730adfac18a196f96.jpg",
    images: [
      "https://i.pinimg.com/1200x/8d/c6/45/8dc645d1fe7bf0a730adfac18a196f96.jpg",
      "https://i.pinimg.com/1200x/68/c3/13/68c31358383d53f152dce5e388c26fe3.jpg",
      "https://i.pinimg.com/1200x/98/28/9a/98289a2545ee30abd15315c71d55035b.jpg",
    ], 
    badge: "",
  },
  {
    id: 14,
    name: "BARREL FIT SUIT TROUSER WITH TAB",
    category: "Trousers",
    price: 1399,
    oldPrice: 1699,
    color: "Stone Black",
    image: "https://static.zara.net/assets/public/a45b/e8f5/136c4d11b6ee/bd0c7b7c1d46/03046190800-p/03046190800-p.jpg?ts=1790090678200&w=1280",
    images: [
      "https://static.zara.net/assets/public/a45b/e8f5/136c4d11b6ee/bd0c7b7c1d46/03046190800-p/03046190800-p.jpg?ts=1790090678200&w=1280",
      "https://static.zara.net/assets/public/2ed3/5d18/f2bc4e1f94f9/d83ac7cfdc5c/03046190800-a5/03046190800-a5.jpg?ts=1790090678692&w=938",
      "https://static.zara.net/assets/public/a71b/ae8a/580b48a8af19/09ddf169195f/03046190800-a1/03046190800-a1.jpg?ts=1790090678328&w=1408",
      "https://static.zara.net/assets/public/728b/e91f/041d46428358/74e7c0f7979e/03046190800-e4/03046190800-e4.jpg?ts=1789988391214&w=1430",
    ], 
    badge: "",
  },
  {
    id: 15,
    name: "REGULAR FIT PINSTRIPE SUIT TROUSER",
    category: "Trousers",
    price: 1399,
    oldPrice: 1699,
    color: "Great Beige",
    image: "https://static.zara.net/assets/public/f8a2/f7ae/990b44b39906/39283cce3706/01051397707-p/01051397707-p.jpg?ts=1789571254456&w=1280",
    images: [
      "https://static.zara.net/assets/public/f8a2/f7ae/990b44b39906/39283cce3706/01051397707-p/01051397707-p.jpg?ts=1789571254456&w=1280",
      "https://static.zara.net/assets/public/3342/d21b/32974dbd994b/c4d556931b32/01051397707-a1/01051397707-a1.jpg?ts=1789571253888&w=1408",
      "https://static.zara.net/assets/public/d133/0658/66a249b580d3/9b45efb8c509/01051397707-e4/01051397707-e4.jpg?ts=1786530477065&w=938",
      "https://static.zara.net/assets/public/1b67/880c/4b6c470d95c7/249561c5527f/01051397707-a2/01051397707-a2.jpg?ts=1789571254364&w=938",
    ], 
    badge: "",
  },
  {
    id: 16,
    name: "RELAXED FIT PLEATED SUIT TROUSER",
    category: "Trousers",
    price: 1599,
    oldPrice: 1899,
    color: "Beige",
    image: "https://static.zara.net/assets/public/8ea2/92a3/f4994b83adbd/7558ce055f01/04702872746-a3/04702872746-a3.jpg?ts=1785334352634&w=938",
    images: [
      "https://static.zara.net/assets/public/8ea2/92a3/f4994b83adbd/7558ce055f01/04702872746-a3/04702872746-a3.jpg?ts=1785334352634&w=938",
      "https://static.zara.net/assets/public/5719/4cdf/d8ea4d2da881/8416ac4a3761/04702872746-a1/04702872746-a1.jpg?ts=1785334352825&w=1408",
      "https://static.zara.net/assets/public/7138/7177/a1c141ae97e0/9ca618fc2deb/04702872746-a2/04702872746-a2.jpg?ts=1785334355927&w=938",
      "https://static.zara.net/assets/public/987e/ae65/7640465e8ecf/f1bf41ccd59e/04702872746-e4/04702872746-e4.jpg?ts=1784715615475&w=1430",
    ], 
    badge: "",
  },
  {
    id: 17,
    name: "DOTTED BLACK LENIN TROUSER",
    category: "Trousers",
    price: 1599,
    oldPrice: 1899,
    color: "Black",
    image: "https://static.zara.net/assets/public/ff3f/8c6e/60de49cba6e5/cbc4da96279d/00706863807-p/00706863807-p.jpg?ts=1785334398745&w=1280",
    images: [
      "https://static.zara.net/assets/public/ff3f/8c6e/60de49cba6e5/cbc4da96279d/00706863807-p/00706863807-p.jpg?ts=1785334398745&w=1280",
      "https://static.zara.net/assets/public/eb3f/7168/2b1e4c959d9d/13352a993163/00706863807-a1/00706863807-a1.jpg?ts=1785334400481&w=1430",
      "https://static.zara.net/assets/public/7235/a0fc/0d9a4b148267/d93309cf0929/00706863807-a2/00706863807-a2.jpg?ts=1785334401226&w=1430",
      "https://static.zara.net/assets/public/9100/ce4a/5a3e4f9da286/5bc62691691f/00706863807-e4/00706863807-e4.jpg?ts=1784737624260&w=1430",
    ], 
    badge: "",
  },
  {
    id: 18,
    name: "COMFORT SUIT TROUSER",
    category: "Trousers",
    price: 1599,
    oldPrice: 1899,
    color: "Navy Blue",
    image: "https://static.zara.net/assets/public/1858/e42e/906d48c4a1a1/d62be47a56a5/04480232430-p/04480232430-p.jpg?ts=1785334390740&w=1280",
    images: [
      "https://static.zara.net/assets/public/1858/e42e/906d48c4a1a1/d62be47a56a5/04480232430-p/04480232430-p.jpg?ts=1785334390740&w=1280",
      "https://static.zara.net/assets/public/86ee/e67a/7a0249f197be/6a9201e87d6d/04480232430-a1/04480232430-a1.jpg?ts=1785334391838&w=1408",
      "https://static.zara.net/assets/public/ae8e/f95d/b95b4ee5a8e4/06100807fbc7/04480232430-a2/04480232430-a2.jpg?ts=1785334390245&w=938",
      "https://static.zara.net/assets/public/09ce/05ca/65954ed8bd7e/17bc0c51b8b0/04480232430-e4/04480232430-e4.jpg?ts=1783949181566&w=938",
    ], 
    badge: "",
  },
];

const productDescriptions = {
  1: {
    description:
      "Meet your everyday essential. The Everyday Relaxed Tee in Cloud White brings a clean, understated look to your daily wardrobe. Its versatile colour makes it easy to style for casual outings and everyday wear.",
    styling:
      "Style it with black trousers, blue denim, or beige bottoms for a clean, modern look.",
  },

  2: {
    description:
      "A timeless white essential for a wardrobe built around simplicity. The Classic Oxford T-Shirt in Pure White works effortlessly with everyday outfits and can be styled for both relaxed and polished casual looks.",
    styling:
      "Pair it with navy trousers, dark denim, or black bottoms for a refined outfit.",
  },

  3: {
    description:
      "Add a distinctive touch to your everyday wardrobe with the LINEN Shirt in Teal Blue. Its rich colour creates a confident look and works well for casual outings, weekend plans, and smart-casual styling.",
    styling:
      "Pair it with cream or beige trousers to create a balanced colour combination.",
  },

  4: {
    description:
      "The Premium Casual Shirt in Jeans Blue is a versatile choice for everyday dressing. Its classic blue shade makes outfit planning simple, whether you're heading out with friends or putting together a smart-casual look.",
    styling:
      "Wear it with black trousers or dark denim and finish with minimal sneakers.",
  },

  5: {
    description:
      "Build your wardrobe around a versatile staple with the Relaxed Fit Trousers in Black. The understated colour makes them easy to combine with different tops, creating looks that work across everyday occasions.",
    styling:
      "Pair with a white tee for a minimal outfit or a casual shirt for a sharper look.",
  },

  6: {
    description:
      "Bring an earthy touch to your wardrobe with the Formal Trouser in Brownie. Its brown shade offers an alternative to classic black and pairs naturally with a range of neutral colours.",
    styling:
      "Style it with a cream, white, or black shirt for a balanced outfit.",
  },

  7: {
    description:
      "Make everyday dressing feel more expressive with the Essential Oversized Tee in Jet Black. Its dark colour and oversized-inspired styling create a modern starting point for relaxed, streetwear-influenced outfits.",
    styling:
      "Pair it with relaxed trousers and sneakers for a contemporary casual look.",
  },

  8: {
    description:
      "The Modern Oversized T-shirt in Stone Black brings a contemporary edge to everyday dressing. Its understated colour makes it a versatile choice for building simple outfits with a modern aesthetic.",
    styling:
      "Combine it with beige trousers or dark denim for an easy, balanced look.",
  },

  9: {
    description:
      "Complete your outfit with the Urban Bomber Jacket in Black. Its classic dark colour makes it a versatile outerwear choice, suitable for layering and creating a more defined everyday look.",
    styling:
      "Layer it over a white tee with black trousers and sneakers for a clean monochrome outfit.",
  },

  10: {
    description:
      "The Minimal Everyday Tee in Brown adds warmth to a simple wardrobe. Its earthy colour works well with neutral shades, making it an easy option for casual dressing without relying on bold colours.",
    styling:
      "Pair it with beige trousers, cream bottoms, or dark denim.",
  },

  11: {
    description:
      "Bring a fresh colour to your wardrobe with the LINEN Shirt in Ocean Blue. Its blue shade offers a versatile option for everyday outfits, casual gatherings, and smart-casual combinations.",
    styling:
      "Wear it with white or beige trousers for contrast, or pair it with darker bottoms.",
  },

  12: {
    description:
      "The Premium Casual Shirt in Olive adds an earthy, understated tone to your collection. Its versatile colour works well with neutral wardrobe staples and gives everyday outfits a distinctive finish.",
    styling:
      "Pair it with black trousers, beige chinos, or dark denim.",
  },

  13: {
    description:
      "Add a softer colour to your everyday rotation with the Premium Casual Shirt in Pastel Coral. Its gentle colour creates a fresh alternative to traditional neutrals and works well in simple, coordinated outfits.",
    styling:
      "Combine it with white, cream, or beige bottoms to keep the outfit balanced.",
  },

  14: {
    description:
      "The Relaxed Trouser in Beige is a versatile wardrobe staple that makes outfit coordination simple. Its neutral shade works with a wide range of colours, helping you create understated everyday combinations.",
    styling:
      "Pair it with a black tee for contrast or a white shirt for a clean, minimal look.",
  },

  15: {
    description:
      "Make a distinctive style choice with the Dotted Trouser in White. Its light colour creates a statement within a simple outfit and pairs well with darker tops for a clear contrast.",
    styling:
      "Style it with a black shirt or dark tee to let the colour combination stand out.",
  },

  16: {
    description:
      "The Formal Trouser in Navy Blue brings a timeless colour into your wardrobe. Navy is easy to coordinate with classic neutrals, making it a useful choice for polished everyday and formal-inspired outfits.",
    styling:
      "Pair it with a white or light-blue shirt and complete the look with suitable footwear.",
  },
};

const productHighlights = {
  1: [
    "Timeless Everyday Style",
    "Easy Colour Pairing",
    "Minimal Wardrobe Essential",
  ],
  2: [
    "Clean White Look",
    "Versatile Styling",
    "Classic Everyday Appeal",
  ],
  3: [
    "Distinctive Teal Shade",
    "Smart-Casual Styling",
    "Easy Neutral Pairing",
  ],
  4: [
    "Versatile Blue Colour",
    "Casual-to-Smart Styling",
    "Everyday Wardrobe Essential",
  ],
  5: [
    "Classic Black Colour",
    "Easy Outfit Coordination",
    "Versatile Styling",
  ],
  6: [
    "Earthy Brown Shade",
    "Refined Colour Combination",
    "Smart Outfit Pairing",
  ],
  7: [
    "Bold Black Look",
    "Modern Streetwear Styling",
    "Easy Layering Combinations",
  ],
  8: [
    "Contemporary Colour",
    "Modern Casual Styling",
    "Versatile Outfit Pairing",
  ],
  9: [
    "Classic Black Outerwear",
    "Easy Layering Options",
    "Monochrome Styling",
  ],
  10: [
    "Warm Earthy Colour",
    "Minimal Everyday Styling",
    "Neutral Colour Pairing",
  ],
  11: [
    "Fresh Blue Shade",
    "Versatile Outfit Pairing",
    "Smart-Casual Styling",
  ],
  12: [
    "Earthy Olive Colour",
    "Modern Casual Appeal",
    "Neutral Outfit Pairing",
  ],
  13: [
    "Soft Colour Accent",
    "Fresh Outfit Combinations",
    "Minimal Styling Appeal",
  ],
  14: [
    "Timeless Neutral Colour",
    "Multiple Styling Options",
    "Everyday Wardrobe Essential",
  ],
  15: [
    "Standout White Colour",
    "Contrasting Outfit Options",
    "Distinctive Styling",
  ],
  16: [
    "Classic Navy Colour",
    "Smart Outfit Combinations",
    "Versatile Wardrobe Essential",
  ],
};

const categories = ["All", "T-Shirts", "Shirts", "Trousers", "Jackets"];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function readSavedCart() {
  try {
    return JSON.parse(localStorage.getItem("fashone-cart")) || [];
  } catch {
    return [];
  }
}

function BrandIntro() {
  return (
    <div className="fashone-intro" role="status" aria-label="FASHONE">
      <div className="intro-image" />

      <svg
        className="intro-mask"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="fashone-cutout"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1000"
            height="500"
          >
            <rect
              x="0"
              y="0"
              width="1000"
              height="500"
              fill="white"
            />
            <text
              className="intro-signature"
              x="500"
              y="315"
              textAnchor="middle"
              fontFamily="Italianno, cursive"
              fontSize="300"
              fontWeight="400"
              fill="none"
              stroke="black"
              strokeWidth="1.2"
            >
              Fashone
            </text>
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="1000"
          height="500"
          fill="#777"
          fillOpacity="0.85"
          mask="url(#fashone-cutout)"
        />
      </svg>
    </div>
  );
}

function StoreApp() {
  const [products, setProducts] = useState(fallbackProducts);
  const [showIntro, setShowIntro] = useState(true);
  const heroImages = [
  "/images/hero1.jpeg",
  "/images/hero2.jpeg",
  "/images/hero3.jpeg",
  "/images/hero4.jpeg",
  "/images/hero.png",
  ];

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(readSavedCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [optionsPanelMode, setOptionsPanelMode] = useState("open");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [customer, setCustomer] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "https://fashone-backend.onrender.com"}/api/products`
        );

        if (!response.ok) {
          throw new Error("Unable to load products");
        }

        const data = await response.json();

        if (!Array.isArray(data.products)) {
          throw new Error("Invalid products response");
        }

        const loadedProducts = fallbackProducts.map((localProduct) => {
          const backendProduct = data.products.find(
            (product) => Number(product.id) === Number(localProduct.id)
          );

          return {
            ...localProduct,

            // Product details and images are managed in App.jsx.
            id: Number(localProduct.id),
            name: localProduct.name,
            category: localProduct.category,
            price: Number(localProduct.price),
            oldPrice: Number(localProduct.oldPrice || 0),
            color: localProduct.color,
            image: localProduct.image,
            images: localProduct.images || [localProduct.image],
            badge: localProduct.badge || "",

            // Keep live stock quantity from the backend.
            stockQuantity: Number(
              backendProduct?.stockQuantity ??
              backendProduct?.stock_quantity ??
              0
            ),
          };
        });

        if (!cancelled) {
          setProducts(loadedProducts);

          setSelectedProduct((current) => {
            if (!current) return current;

            return (
              loadedProducts.find(
                (product) => product.id === Number(current.id)
              ) || current
            );
          });
        }
      } catch (error) {
        console.error("Products API failed:", error.message);
      }
    }

    loadProducts();

    const refreshOnFocus = () => loadProducts();

    window.addEventListener("focus", refreshOnFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 3800);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("fashone-cart", JSON.stringify(cart));
  }, [cart]);

  // Lock background scrolling while a modal or drawer is open.
  useEffect(() => {
    const shouldLockScroll =
      Boolean(selectedProduct) ||
      cartOpen ||
      checkoutOpen ||
      Boolean(orderSuccess);

    if (!shouldLockScroll) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProduct, cartOpen, checkoutOpen, orderSuccess]);

  useEffect(() => {
    if (!selectedProduct && !sizeChartOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (sizeChartOpen) {
          setSizeChartOpen(false);
        } else {
          setSelectedProduct(null);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedProduct, sizeChartOpen]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const searchTerm = search.toLowerCase();

      const matchesSearch =
        String(product.name || "").toLowerCase().includes(searchTerm) ||
        String(product.color || "").toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  function openProduct(product) {
    setSelectedProduct(product);
    setSelectedSize("M");
    setSizeChartOpen(false);
    setNotice("");
  }

  function closeProduct() {
    setSelectedProduct(null);
    setSizeChartOpen(false);
  }

  async function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
      setNotice("Your bag is empty.");
      return;
    }

    setPlacingOrder(true);
    setNotice("");

    try {
      const response = await fetch(
        "https://fashone-backend.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...customer,
            items: cart.map((item) => ({
              id: item.id,
              name: item.name,
              color: item.color,
              size: item.size || null,
              quantity: item.quantity,
              price: item.price,
            })),
            subtotal,
            shipping_fee: 0,
            total: subtotal,
            payment_method: "COD",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to place order.");
      }

      setOrderSuccess(data.order);
      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      setCustomer({
        customer_name: "",
        phone: "",
        email: "",
        address_line: "",
        city: "",
        state: "",
        postal_code: "",
      });
      setNotice("");
    } catch (error) {
      setNotice(
        error.message === "Failed to fetch"
          ? "Backend connection failed. Please try again."
          : error.message
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  function addToCart(product) {
    const stock = Number(product.stockQuantity ?? 0);

    if (stock <= 0) {
      setNotice("Sorry, this product is out of stock.");
      setCartOpen(true);
      return;
    }

    const existing = cart.find(
      (item) =>
        Number(item.id) === Number(product.id) &&
        item.size === product.size
    );

    if (existing && existing.quantity >= stock) {
      setNotice(`Only ${stock} item(s) available in stock.`);
      setCartOpen(true);
      return;
    }

    setCart((current) => {
      const currentItem = current.find(
        (item) =>
          Number(item.id) === Number(product.id) &&
          item.size === product.size
      );

      if (currentItem) {
        if (currentItem.quantity >= stock) {
          return current;
        }

        return current.map((item) =>
          Number(item.id) === Number(product.id) &&
          item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setNotice(`${product.name} added to your bag`);
    setCartOpen(true);
  }

  function changeQuantity(id, size, amount) {
    const cartItem = cart.find(
      (item) =>
        Number(item.id) === Number(id) &&
        item.size === size
    );

    if (!cartItem) return;

    const product = products.find(
      (item) => Number(item.id) === Number(id)
    );

    const stock = Number(product?.stockQuantity ?? 0);
    const nextQuantity = cartItem.quantity + amount;

    if (nextQuantity > stock) {
      setNotice(`Only ${stock} item(s) available in stock.`);
      return;
    }

    setCart((current) =>
      current
        .map((item) =>
          Number(item.id) === Number(id) && item.size === size
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    setNotice("");
  }

  const colourValues = {
    "cloud white": "#f4f4ef",
    "pure white": "#ffffff",
    "teal blue": "#247d83",
    "jeans blue": "#4f78a8",
    black: "#171717",
    brownie: "#795548",
    "jet black": "#111111",
    "stone black": "#393939",
    brown: "#795548",
    "ocean blue": "#286b91",
    olive: "#77764a",
    "pastal coral": "#e58f83",
    beige: "#d8c6a5",
    white: "#ffffff",
    "navy blue": "#1d2c4a",
  };

  const colourVariants = selectedProduct
    ? products
        .filter(
          (variant) =>
            variant.category === selectedProduct.category &&
            String(variant.name || "").trim().toLowerCase() ===
              String(selectedProduct.name || "").trim().toLowerCase() &&
            Number(variant.price) === Number(selectedProduct.price)
        )
        .filter(
          (variant, index, all) =>
            all.findIndex(
              (item) =>
                String(item.color || "").trim().toLowerCase() ===
                String(variant.color || "").trim().toLowerCase()
            ) === index
        )
    : [];

  return (
    <>
      {showIntro && <BrandIntro />}

      <div className="site-shell">
        <header className="header">
          <a className="wordmark" href="#home" aria-label="FASHONE home">
            <img
              src="/images/fashone-logo-transparent.png"
              alt="FASHONE"
              className="wordmark-image"
            />
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#home">HOME</a>
            <a href="#collection">SHOP MEN</a>
            <a href="#story">OUR STORY</a>
            <a href="/orders">ORDERS</a>
          </nav>

          <div className="header-actions">
            <button
              className="icon-button search-toggle"
              onClick={() => {
                document.getElementById("product-search")?.focus();
                document.getElementById("collection")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              aria-label="Search products"
            >
              SEARCH
            </button>

            <button
              className="bag-button"
              onClick={() => setCartOpen((current) => !current)}
            >
              BAG ({cartCount})
            </button>
          </div>
        </header>

        <main>
          <section className="hero" id="home">
            <div className="hero-image-animated" key={heroIndex}>
              <img
                className="hero-image"
                src={heroImages[heroIndex]}
                alt="FASHONE premium men's fashion"
              />
            </div>

            <div className="hero-shade" />

            <div className="hero-copy">
              <p className="eyebrow light">FASHONE / COLLECTION 01</p>

              <h1>
                LESS NOISE.
                <br />
                MORE STYLE.
              </h1>

              <p className="hero-description">
                Everyday essentials. Elevated design.
                <br />
                Made for the way you move.
              </p>

              <a className="primary-button" href="#collection">
                SHOP THE COLLECTION <span>↗</span>
              </a>
            </div>

            <div className="hero-index">01 — 04 / THE NEW STANDARD</div>
          </section>

          <div className="announcement">
            NEW SEASON, NEW ESSENTIALS — FREE SHIPPING ON ORDERS ABOVE ₹1,999
          </div>

          <section className="intro-strip">
            <p>BUILT FOR EVERY DAY.</p>
            <p>DESIGNED TO STAND OUT.</p>
            <p>MADE TO BE YOURS.</p>
          </section>

          <section className="collection section-wrap" id="collection">
            <div className="section-heading">
              <div>
                <p className="eyebrow">THE FASHONE EDIT</p>
                <h2>MEN'S COLLECTION</h2>
                <p className="muted">
                  Considered essentials for your everyday wardrobe.
                </p>
              </div>

              <div className="search-box">
                <span>⌕</span>
                <input
                  id="product-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                  aria-label="Search products"
                />
              </div>
            </div>

            <div className="collection-toolbar">
              <div className="category-list">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      category === item ? "category active" : "category"
                    }
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <span className="result-count">
                {filteredProducts.length} PRODUCTS
              </span>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onMouseEnter={(event) => {
                        if (product.images?.length > 1) {
                          event.currentTarget.src = product.images[1];
                        }
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.src = product.image;
                      }}
                      onClick={() => openProduct(product)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openProduct(product);
                        }
                      }}
                      aria-label={`View ${product.name} details`}
                    />

                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}

                    <button
                      className="quick-add"
                      disabled={Number(product.stockQuantity ?? 0) <= 0}
                      onClick={() =>
                        addToCart({ ...product, size: "M" })
                      }
                    >
                      {Number(product.stockQuantity ?? 0) <= 0
                        ? "SOLD OUT"
                        : "ADD TO BAG"}
                      {Number(product.stockQuantity ?? 0) > 0 && (
                        <span>+</span>
                      )}
                    </button>
                  </div>

                  <div className="product-info">
                    <div>
                      <h3
                        className="clickable-product-name"
                        onClick={() => openProduct(product)}
                      >
                        {product.name}
                      </h3>
                      <p className="product-color">{product.color}</p>
                    </div>

                    <div className="price-wrap">
                      <span className="price">{money(product.price)}</span>
                      {Number(product.oldPrice) > Number(product.price) && (
                        <span className="old-price">
                          {money(product.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-results">
                <h3>No products found</h3>
                <p>Try another search or choose a different category.</p>

                <button
                  className="outline-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  CLEAR FILTERS
                </button>
              </div>
            )}
          </section>

          <section className="our-story section-wrap" id="story">
            <div className="story-label">
              <span className="story-line"></span>
              <p className="eyebrow">GET TO KNOW FASHONE</p>
            </div>

            <div className="story-content">
              <div className="story-heading">
                <p className="story-number">01 — OUR STORY</p>
                <h2>
                  LESS NOISE.
                  <br />
                  <span>MORE MEANING.</span>
                </h2>
              </div>

              <div className="story-description">
                <p className="story-intro">
                  Style doesn't need to be loud to make a statement.
                </p>

                <p>
                  FASHONE was built around a simple idea — everyday clothing
                  should feel effortless, look refined, and reflect who you are.
                </p>

                <p>
                  We believe in timeless essentials, thoughtful details, and
                  versatile pieces that go beyond passing trends. Our approach
                  to fashion is rooted in simplicity: pieces that work together,
                  feel comfortable, and give you confidence wherever the day
                  takes you.
                </p>

                <p>
                  From everyday essentials to elevated looks, our vision is to
                  make getting dressed feel natural. No unnecessary noise.
                  No need to follow every trend. Just a style that feels like you.
                </p>

                <a href="#collection" className="story-link">
                  DISCOVER THE COLLECTION <span>↗</span>
                </a>
              </div>
            </div>

            <div className="story-bottom">
              <span>TIMELESS BY DESIGN</span>
              <span>MADE FOR YOUR EVERYDAY</span>
              <span>FASHONE®</span>
            </div>
          </section>

          <section className="our-story section-wrap" id="about">
            <div className="story-label">
              <span className="story-line"></span>
              <p className="eyebrow">ABOUT FASHONE</p>
            </div>

            <div className="story-content">
              <div className="story-heading">
                <p className="story-number">02 — ABOUT US</p>
                <h2>
                  MORE THAN
                  <br />
                  <span>JUST CLOTHING.</span>
                </h2>
              </div>

              <div className="story-description">
                <p className="story-intro">
                  Modern essentials. Everyday confidence.
                </p>

                <p>
                  FASHONE is a modern menswear brand built around clean design,
                  versatile essentials, and a confident approach to everyday style.
                </p>

                <p>
                  We believe great style comes from the details — a considered
                  fit, a simple silhouette, and colours that work effortlessly
                  with the rest of your wardrobe.
                </p>

                <p>
                  Our aim is to make fashion feel approachable and personal.
                  Whether you're dressing for a casual day out or putting
                  together a more refined look, we want your wardrobe to feel
                  effortless and true to you.
                </p>

                <div className="about-values">
                  <div>
                    <span>01</span>
                    <h3>OUR VISION</h3>
                    <p>
                      Timeless style that feels relevant today and beyond
                      passing trends.
                    </p>
                  </div>

                  <div>
                    <span>02</span>
                    <h3>OUR APPROACH</h3>
                    <p>
                      Clean design, versatile essentials, and a simple
                      shopping experience.
                    </p>
                  </div>
                </div>

                <a href="#collection" className="story-link">
                  EXPLORE OUR COLLECTION <span>↗</span>
                </a>
              </div>
            </div>

            <div className="story-bottom">
              <span>MINIMAL BY DESIGN</span>
              <span>TIMELESS IN STYLE</span>
              <span>FASHONE®</span>
            </div>
          </section>

          <section className="brand-banner">
            <p className="eyebrow light">THE FASHONE PHILOSOPHY</p>
            <h2>
              YOUR STYLE.
              <br />
              YOUR RULES.
            </h2>
            <p>
              Less, but better. Pieces you'll reach for again and again.
            </p>

            <a href="#collection" className="outline-light-button">
              FIND YOUR FIT ↗
            </a>
          </section>

          <section className="newsletter">
            <p className="eyebrow">STAY IN THE LOOP</p>
            <h2>GOOD STYLE. NO SPAM.</h2>
            <p>
              Be first to hear about new drops and collection updates.
            </p>

            <form
              className="newsletter-form"
              onSubmit={(event) => {
                event.preventDefault();
                setNotice(
                  "Newsletter signup needs an email service to be connected."
                );
                setCartOpen(true);
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Your email address"
                required
              />
              <button type="submit">SIGN ME UP ↗</button>
            </form>
          </section>
        </main>

        <footer className="footer">
          <a className="wordmark footer-logo" href="/#home">
            FASHONE<span>.</span>
          </a>

          <p>MODERN ESSENTIALS. EVERYDAY CONFIDENCE.</p>

          <nav className="footer-links" aria-label="Footer navigation">
            <a href="/about">ABOUT US</a>
            <a href="/contact">CONTACT</a>
            <a href="/shipping-policy">SHIPPING POLICY</a>
            <a href="/return-policy">RETURNS &amp; REFUNDS</a>
            <a href="/track-order">TRACK ORDER</a>
          </nav>

          <p className="footer-small">
            © {new Date().getFullYear()} FASHONE. ALL RIGHTS RESERVED.
          </p>
        </footer>

        {/* PRODUCT DETAILS MODAL */}
        {selectedProduct && (
          <div
            className="product-modal-backdrop"
            onClick={closeProduct}
          >
            <section
              className={`product-modal ${
                optionsPanelMode === "open"
                  ? "options-open"
                  : optionsPanelMode === "image"
                  ? "options-hidden-image"
                  : "options-hidden-details"
              }`}
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedProduct.name} details`}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="product-modal-close"
                onClick={closeProduct}
                aria-label="Close product details"
              >
                ×
              </button>

              {/* EXISTING PANEL ARROWS */}
              {optionsPanelMode === "open" ? (
                <>
                  <button
                    type="button"
                    className="options-panel-arrow options-arrow-left"
                    onClick={() => setOptionsPanelMode("image")}
                    aria-label="Expand product image"
                    title="Expand product image"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    className="options-panel-arrow options-arrow-right"
                    onClick={() => setOptionsPanelMode("details")}
                    aria-label="Expand product details"
                    title="Expand product details"
                  >
                    →
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={`options-panel-arrow options-arrow-reopen ${
                    optionsPanelMode === "image"
                      ? "reopen-from-image"
                      : "reopen-from-details"
                  }`}
                  onClick={() => setOptionsPanelMode("open")}
                  aria-label="Show colour and size options"
                  title="Show colour and size options"
                >
                  {optionsPanelMode === "image" ? "→" : "←"}
                </button>
              )}

              {/* LEFT 40% — PRODUCT IMAGE GALLERY */}
              <div className="product-modal-image-wrap">
                {(selectedProduct.images?.length > 0
                  ? selectedProduct.images
                  : [selectedProduct.image]
                ).map((imageUrl, index) => (
                  <img
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`${selectedProduct.name} - Pose ${index + 1}`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ))}
              </div>

              {/* MIDDLE 20% — SIZES, COLOURS AND HIGHLIGHTS */}
              <div className="product-modal-options">
                <div className="modal-brand-heading">
                  <p className="eyebrow">THE FASHONE EDIT</p>
                  <span>SIMPLICITY IN EVERY DETAIL</span>
                </div>

                {/* SIZE SELECTION — FIRST */}
                <div className="modal-panel-section modal-panel-size-section">
                  <div className="modal-panel-label">
                    <span>01 / YOUR FIT</span>

                    <button
                      type="button"
                      className="size-chart-link"
                      onClick={() => setSizeChartOpen(true)}
                    >
                      SIZE GUIDE ↗
                    </button>
                  </div>

                  <div className="size-options">
                    {["S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={
                          selectedSize === size
                            ? "size-option selected"
                            : "size-option"
                        }
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={selectedSize === size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <p className="modal-size-note">
                    Select your preferred size.
                  </p>
                </div>

                {/* COLOUR SELECTION — SECOND */}
                <div className="modal-panel-section">
                  <div className="modal-panel-label">
                    <span>02 / COLOUR</span>
                    <span className="modal-panel-line" />
                  </div>

                  <p className="modal-selected-colour">
                    {selectedProduct.color}
                  </p>

                  <div
                    className="modal-colour-options"
                    aria-label="Available colours"
                  >
                    {colourVariants.map((variant) => (
                      <button
                        key={`${variant.id}-${variant.color}`}
                        type="button"
                        className={`modal-colour-chip ${
                          Number(variant.id) === Number(selectedProduct.id)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => setSelectedProduct(variant)}
                        aria-pressed={
                          Number(variant.id) === Number(selectedProduct.id)
                        }
                        title={variant.color}
                      >
                        <span
                          className="modal-colour-dot"
                          aria-hidden="true"
                          style={{
                            backgroundColor:
                              colourValues[
                                String(variant.color || "")
                                  .trim()
                                  .toLowerCase()
                              ] || "#d8d8d8",
                          }}
                        />
                        <span>{variant.color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRODUCT HIGHLIGHTS — THIRD */}
                <div className="modal-panel-section">
                  <div className="modal-panel-label">
                    <span>PRODUCT HIGHLIGHTS</span>
                    <span className="modal-panel-line" />
                  </div>
                  <ul className="product-highlights-list">
                    {(productHighlights[Number(selectedProduct.id)] || []).map(
                      (highlight, index) => (
                        <li key={index}>
                          <span className="highlight-check">✓</span>
                          <span>{highlight}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* PRODUCT CARE — ALWAYS VISIBLE */}
                <div className="modal-panel-section">
                  <div className="modal-panel-label">
                    <span>PRODUCT CARE</span>
                    <span className="modal-panel-line" />
                  </div>

                  <ul className="product-highlights-list">
                    <li>
                      <span className="highlight-check">✓</span>
                      <span>Wash with similar colours.</span>
                    </li>
                    <li>
                      <span className="highlight-check">✓</span>
                      <span>Avoid harsh bleach.</span>
                    </li>
                    <li>
                      <span className="highlight-check">✓</span>
                      <span>Follow the garment care label.</span>
                    </li>
                  </ul>
                </div>

                <div className="modal-signature-footer">
                  <img
                    src="/images/fashone-signature.png"
                    alt="FASHONE"
                    className="modal-signature-logo"
                  />

                  <p>LESS NOISE. MORE STYLE.</p>
                </div>
              </div>

              {/* RIGHT 40% — PRODUCT DETAILS AND PURCHASE */}
              <div className="product-modal-info">
                <p className="eyebrow">FASHONE / COLLECTION 01</p>

                {selectedProduct.badge && (
                  <span className="modal-product-badge">
                    {selectedProduct.badge}
                  </span>
                )}

                <h2>{selectedProduct.name}</h2>

                <p className="modal-product-color">
                  Colour: {selectedProduct.color}
                </p>

                <div className="modal-product-price">
                  <strong>{money(selectedProduct.price)}</strong>

                  {Number(selectedProduct.oldPrice) >
                    Number(selectedProduct.price) && (
                    <span>{money(selectedProduct.oldPrice)}</span>
                  )}
                </div>

                {/* PRODUCT DESCRIPTION */}
                <div className="modal-product-description">
                  <p>
                    {productDescriptions[Number(selectedProduct.id)]
                      ?.description ||
                      "Discover an everyday essential from the FASHONE collection, designed to complement your personal style."}
                  </p>

                  {/* STYLING TIP */}
                  <div className="product-styling-tip">
                    <span className="product-styling-label">
                      STYLE IT YOUR WAY
                    </span>

                    <p>
                      {productDescriptions[Number(selectedProduct.id)]
                        ?.styling ||
                        "Pair it with your favourite wardrobe essentials to create your own look."}
                    </p>
                  </div>
                </div>

                {/* STOCK STATUS */}
                <div className="modal-stock-status">
                  <span
                    className={`modal-stock-dot ${
                      Number(selectedProduct.stockQuantity ?? 0) > 0
                        ? "in-stock"
                        : "out-of-stock"
                    }`}
                  />

                  {Number(selectedProduct.stockQuantity ?? 0) > 0
                    ? `${Number(selectedProduct.stockQuantity)} available`
                    : "Currently out of stock"}
                </div>

                {/* ADD TO BAG */}
                <button
                  type="button"
                  className="modal-add-button"
                  disabled={
                    Number(selectedProduct.stockQuantity ?? 0) <= 0
                  }
                  onClick={() => {
                    if (
                      Number(selectedProduct.stockQuantity ?? 0) <= 0
                    ) {
                      setNotice("Sorry, this product is out of stock.");
                      return;
                    }

                    addToCart({
                      ...selectedProduct,
                      size: selectedSize,
                    });

                    closeProduct();
                  }}
                >
                  {Number(selectedProduct.stockQuantity ?? 0) <= 0
                    ? "SOLD OUT"
                    : `ADD TO BAG — ${money(selectedProduct.price)}`}
                </button>

                {/* BUY NOW */}
                <button
                  type="button"
                  className="modal-buy-now-button"
                  disabled={
                    Number(selectedProduct.stockQuantity ?? 0) <= 0
                  }
                  onClick={() => {
                    if (
                      Number(selectedProduct.stockQuantity ?? 0) <= 0
                    ) {
                      setNotice("Sorry, this product is out of stock.");
                      return;
                    }

                    addToCart({
                      ...selectedProduct,
                      size: selectedSize,
                    });

                    closeProduct();
                    setCartOpen(false);
                    setNotice("");
                    setCheckoutOpen(true);
                  }}
                >
                  BUY NOW ↗
                </button>

                <p className="modal-small-note">
                  Easy everyday style. Made to be yours.
                </p>
                
                {/* RELATED PRODUCTS */}
                <section className="related-products">
                  <div className="related-products-heading">
                    <p className="eyebrow">FASHONE / DISCOVER MORE</p>
                    <h3>YOU MAY ALSO LIKE</h3>
                  </div>

                  <div className="related-products-grid">
                    {products
                      .filter(
                        (product) =>
                          Number(product.id) !== Number(selectedProduct.id)
                      )
                      .slice(0, 4)
                      .map((product) => (
                        <button
                          type="button"
                          className="related-product-card"
                          key={product.id}
                          onClick={() => openProduct(product)}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                          />
                          <span className="related-product-name">
                            {product.name}
                          </span>
                          <span className="related-product-price">
                            {money(product.price)}
                          </span>
                        </button>
                      ))}
                  </div>
                </section>

              </div>

              {/* SIZE GUIDE */}
              {sizeChartOpen && (
                <div
                  className="size-chart-backdrop"
                  onClick={() => setSizeChartOpen(false)}
                >
                  <section
                    className="size-chart-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Size guide"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="size-chart-close"
                      onClick={() => setSizeChartOpen(false)}
                      aria-label="Close size guide"
                    >
                      ×
                    </button>

                    <p className="eyebrow">FASHONE FIT GUIDE</p>
                    <h3>SIZE GUIDE</h3>

                    <p className="size-chart-intro">
                      Select your usual size, or compare this item with a
                      similar garment you already own. Exact garment
                      measurements are not available for this product yet.
                    </p>

                    <div className="size-chart-size-list">
                      {["S", "M", "L", "XL"].map((size) => (
                        <button
                          type="button"
                          key={size}
                          className={
                            selectedSize === size
                              ? "size-option selected"
                              : "size-option"
                          }
                          onClick={() => {
                            setSelectedSize(size);
                            setSizeChartOpen(false);
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <p className="size-chart-footnote">
                      Garment measurements will be added when verified sizing
                      information is available.
                    </p>
                  </section>
                </div>
              )}
            </section>
          </div>
        )}

        {/* SHOPPING BAG */}
        {cartOpen && (
          <div
            className="drawer-backdrop"
            onClick={() => setCartOpen(false)}
          >
            <aside
              className="cart-drawer"
              onClick={(event) => event.stopPropagation()}
              aria-label="Shopping bag"
            >
              <div className="drawer-heading">
                <div>
                  <p className="eyebrow">YOUR SELECTION</p>
                  <h2>YOUR BAG ({cartCount})</h2>
                </div>

                <button
                  className="close-button"
                  onClick={() => setCartOpen(false)}
                  aria-label="Close bag"
                >
                  ×
                </button>
              </div>

              {notice && <p className="cart-notice">{notice}</p>}

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your bag is waiting for something good.</p>
                  <button
                    className="primary-button"
                    onClick={() => setCartOpen(false)}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div
                        className="cart-item"
                        key={`${item.id}-${item.size || "default"}`}
                      >
                        <img src={item.image} alt={item.name} />

                        <div className="cart-item-details">
                          <h3>{item.name}</h3>
                          <p>
                            {item.color}
                            {item.size ? ` · Size ${item.size}` : ""}
                          </p>
                          <strong>{money(item.price)}</strong>

                          <div className="quantity-control">
                            <button
                              onClick={() =>
                                changeQuantity(item.id, item.size, -1)
                              }
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              onClick={() =>
                                changeQuantity(item.id, item.size, 1)
                              }
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="remove-item"
                            onClick={() =>
                              setCart((current) =>
                                current.filter(
                                  (cartItem) =>
                                    !(
                                      Number(cartItem.id) === Number(item.id) &&
                                      cartItem.size === item.size
                                    )
                                )
                              )
                            }
                          >
                            REMOVE ITEM ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-summary">
                    <div className="subtotal-row">
                      <span>SUBTOTAL</span>
                      <strong>{money(subtotal)}</strong>
                    </div>

                    <p>Shipping and taxes calculated at checkout.</p>

                    <button
                      className="checkout-button"
                      onClick={() => {
                        setNotice("");
                        setCartOpen(false);
                        setCheckoutOpen(true);
                      }}
                    >
                      PROCEED TO CHECKOUT ↗
                    </button>

                    <button
                      className="continue-button"
                      onClick={() => setCartOpen(false)}
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
        )}

        {/* COD CHECKOUT */}
        {checkoutOpen && (
          <div
            className="drawer-backdrop"
            onClick={() => {
              if (!placingOrder) setCheckoutOpen(false);
            }}
          >
            <section
              className="cart-drawer checkout-panel"
              onClick={(event) => event.stopPropagation()}
              aria-label="Checkout"
            >
              <div className="drawer-heading">
                <div>
                  <p className="eyebrow">ALMOST YOURS</p>
                  <h2>DELIVERY DETAILS</h2>
                </div>

                <button
                  className="close-button"
                  onClick={() => setCheckoutOpen(false)}
                  aria-label="Close checkout"
                  disabled={placingOrder}
                >
                  ×
                </button>
              </div>

              {notice && <p className="cart-notice">{notice}</p>}

              <form onSubmit={placeOrder} className="checkout-form">
                <label>
                  Full name
                  <input
                    required
                    autoComplete="name"
                    value={customer.customer_name}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        customer_name: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Phone number
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit Indian phone number"
                    autoComplete="tel"
                    value={customer.phone}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        phone: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Email address
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={customer.email || ""}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        email: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  House number and street address
                  <textarea
                    required
                    autoComplete="street-address"
                    value={customer.address_line}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        address_line: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  City
                  <input
                    required
                    autoComplete="address-level2"
                    value={customer.city}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        city: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  State
                  <input
                    required
                    autoComplete="address-level1"
                    value={customer.state}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        state: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  PIN code
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    title="Enter a 6-digit PIN code"
                    autoComplete="postal-code"
                    value={customer.postal_code}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        postal_code: event.target.value,
                      })
                    }
                  />
                </label>

                <div className="checkout-total">
                  <span>Payment method</span>
                  <strong>Cash on Delivery (COD)</strong>
                </div>

                <div className="checkout-total">
                  <span>Subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>

                <div className="checkout-total">
                  <span>Shipping</span>
                  <strong>FREE</strong>
                </div>

                <div className="checkout-total">
                  <span>Total</span>
                  <strong>{money(subtotal)}</strong>
                </div>

                <button
                  type="submit"
                  className="checkout-button"
                  disabled={placingOrder}
                >
                  {placingOrder ? "PLACING ORDER..." : "PLACE COD ORDER ↗"}
                </button>
              </form>
            </section>
          </div>
        )}

        {/* ORDER SUCCESS */}
        {orderSuccess && (
          <div className="drawer-backdrop">
            <section className="cart-drawer order-success">
              <p className="eyebrow">THANK YOU FOR CHOOSING FASHONE</p>

              <h2>ORDER PLACED</h2>

              <p>Your order has been saved successfully.</p>

              <div className="order-number-box">
                <span className="eyebrow">YOUR ORDER NUMBER</span>
                <strong>{orderSuccess.order_number}</strong>
                <span className="order-confirmed">✓ ORDER CONFIRMED</span>
              </div>

              <button
                type="button"
                className="continue-button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      orderSuccess.order_number
                    );
                    setNotice("Order number copied successfully!");
                  } catch {
                    setNotice(
                      `Your order number is ${orderSuccess.order_number}`
                    );
                  }
                }}
              >
                COPY ORDER NUMBER
              </button>

              {notice && <p role="status">{notice}</p>}

              <a
                href="/track-order"
                className="checkout-button"
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                  marginTop: 12,
                }}
              >
                TRACK YOUR ORDER →
              </a>

              <button
                type="button"
                className="continue-button"
                style={{ marginTop: 12 }}
                onClick={() => {
                  setOrderSuccess(null);
                  setNotice("");
                }}
              >
                CONTINUE SHOPPING
              </button>
            </section>
          </div>
        )}
      </div>
    </>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  const policyPaths = [
    "/about",
    "/contact",
    "/shipping-policy",
    "/return-policy",
  ];

  if (path === "/orders") {
    return <MyOrders />;
  }

  if (path === "/track-order") {
    return <PolicyPage path={path} />;
  }

  if (policyPaths.includes(path)) {
    return <PolicyPage path={path} />;
  }

  return <StoreApp />;
}