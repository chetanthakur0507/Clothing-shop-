const categories = [
	{
		name: "Mens Collection",
		subtitle: "Kurta, shirts, denim aur festive wear",
	},
	{
		name: "Ladies Fashion",
		subtitle: "Saree, suits, tops aur elegant styles",
	},
	{
		name: "Kids Corner",
		subtitle: "Comfortable aur trendy bachchon ke outfits",
	},
	{
		name: "Season Sale",
		subtitle: "Har hafte fresh offers aur combo deals",
	},
];

const featuredItems = [
	{
		title: "Festival Kurta Set",
		price: "Rs. 1,499",
		tag: "Best Seller",
	},
	{
		title: "Classic Cotton Saree",
		price: "Rs. 1,999",
		tag: "New Arrival",
	},
	{
		title: "Premium Formal Shirt",
		price: "Rs. 899",
		tag: "Hot Pick",
	},
];

export default function Home() {
	return (
		<main className="showroom-page">
			<section className="hero-wrap">
				<div className="hero-overlay" />
				<div className="hero-content">
					<p className="top-badge">Trusted Family Clothing Store</p>
					<h1>Shree Ram Readymade Showroom</h1>
					<p className="hero-text">
						Stylish readymade kapde, sahi fitting aur honest pricing ke saath.
						Har age group ke liye latest collection ek hi jagah.
					</p>
					<div className="hero-actions">
						<a href="#collection" className="btn btn-primary">
							Collection Dekhein
						</a>
						<a href="#visit" className="btn btn-outline">
							Store Visit Karein
						</a>
					</div>
				</div>
			</section>

			<section id="collection" className="section section-light">
				<div className="section-head">
					<p className="section-kicker">Our Categories</p>
					<h2>Har Occasion Ke Liye Perfect Outfit</h2>
				</div>
				<div className="category-grid">
					{categories.map((category) => (
						<article className="category-card" key={category.name}>
							<h3>{category.name}</h3>
							<p>{category.subtitle}</p>
						</article>
					))}
				</div>
			</section>

			<section className="section section-dark">
				<div className="section-head">
					<p className="section-kicker">Featured Products</p>
					<h2>Popular Picks</h2>
				</div>
				<div className="product-grid">
					{featuredItems.map((item) => (
						<article className="product-card" key={item.title}>
							<span className="product-tag">{item.tag}</span>
							<h3>{item.title}</h3>
							<p className="product-price">{item.price}</p>
							<button type="button" className="btn btn-small">
								Enquire Now
							</button>
						</article>
					))}
				</div>
			</section>

			<section className="section section-light" id="visit">
				<div className="visit-card">
					<div>
						<p className="section-kicker">Visit The Store</p>
						<h2>Shree Ram Readymade Showroom</h2>
						<p>
							Main Market Road, Near Bus Stand, aapke shehar ka trusted fashion
							destination.
						</p>
					</div>
					<div className="visit-details">
						<p>Mon-Sat: 10:00 AM - 9:00 PM</p>
						<p>Sunday: 11:00 AM - 7:00 PM</p>
						<a href="tel:+919876543210" className="btn btn-primary">
							Call: +91 98765 43210
						</a>
					</div>
				</div>
			</section>
		</main>
	);
}
