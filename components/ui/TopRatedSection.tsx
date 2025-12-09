import { Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  rating: number;
  review: string;
  image: string;
  featured?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Cotton Throw Blanket",
    rating: 5.0,
    review: "Great quality and value",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    featured: true,
  },
  {
    id: 2,
    name: "Wooden Coffee Table",
    rating: 5.0,
    review: "Great quality and value",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Classic Cotton T-Shirt",
    rating: 5.0,
    review: "Great quality and value",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Sports Water Bottle",
    rating: 4.5,
    review: "Great quality and value",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=200&fit=crop",
  },
];

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground/30"
        }`}
      />
    ))}
    <span className="text-xs text-muted-foreground ml-1">{rating}</span>
  </div>
);

const FeaturedCard = ({ product }: { product: Product }) => (
  <div className="group relative bg-card rounded-3xl overflow-hidden card-hover" style={{ boxShadow: 'var(--shadow-soft)' }}>
    <div className="absolute top-4 left-4 z-10">
      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
        Top Pick
      </span>
    </div>
    <div className="aspect-[4/5] overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-5">
      <h3 className="font-semibold text-lg text-foreground mb-2">{product.name}</h3>
      <RatingStars rating={product.rating} />
      <p className="text-sm text-muted-foreground mt-2 italic">"{product.review}"</p>
    </div>
  </div>
);

const HorizontalCard = ({ product }: { product: Product }) => (
  <div className="group flex bg-card rounded-2xl overflow-hidden card-hover" style={{ boxShadow: 'var(--shadow-soft)' }}>
    <div className="w-28 h-28 flex-shrink-0 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-4 flex flex-col justify-center">
      <h3 className="font-medium text-foreground text-sm mb-1.5">{product.name}</h3>
      <RatingStars rating={product.rating} />
      <p className="text-xs text-muted-foreground mt-1.5 italic line-clamp-1">"{product.review}"</p>
    </div>
  </div>
);

const TopRatedSection = () => {
  const featuredProduct = products.find((p) => p.featured);
  const otherProducts = products.filter((p) => !p.featured);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Top Rated Products
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Handpicked based on customer ratings and reviews
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Featured large card */}
          {featuredProduct && <FeaturedCard product={featuredProduct} />}

          {/* Stacked horizontal cards */}
          <div className="flex flex-col gap-4 justify-center">
            {otherProducts.map((product) => (
              <HorizontalCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopRatedSection;
