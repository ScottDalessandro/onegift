export default function RegistryItems() {
	return (
		<div className="items-content">
			<div className="items-content-header">
				<h1>TESTING!!!</h1>
				{/* <button className="add-item-btn">Add Item</button> */}
			</div>

			<div className="items-header">
				<h2>Registry Items</h2>
				<button className="add-item-btn">Add Item</button>
			</div>

			<div className="items-grid">
				<div className="item-card">
					<div className="item-image-placeholder"></div>
					<div className="item-details">
						<span className="item-status want">Want</span>
						<h3>LEGO Friends Heartlake City School</h3>
						<p>Emma loves building and creating stories with LEGO sets.</p>
						<span className="price">$59.99</span>
					</div>
				</div>

				<div className="item-card">
					<div className="item-image-placeholder"></div>
					<div className="item-details">
						<span className="item-status need">Need</span>
						<h3>Art Supplies Set</h3>
						<p>Emma is getting into drawing and painting.</p>
						<span className="price">$29.99</span>
					</div>
				</div>
			</div>

			{/* Category Balance */}
			<div className="category-balance">
				<h3>Category Balance</h3>
				<div className="category-grid">
					<div className="category want">
						<span className="count">1</span>
						<span className="label">Want</span>
					</div>
					<div className="category need">
						<span className="count">1</span>
						<span className="label">Need</span>
					</div>
					<div className="category experience">
						<span className="count">0</span>
						<span className="label">Experience</span>
					</div>
					<div className="category wear">
						<span className="count">0</span>
						<span className="label">Wear</span>
					</div>
					<div className="category learn">
						<span className="count">0</span>
						<span className="label">Learn</span>
					</div>
				</div>
			</div>
		</div>
	)
}
