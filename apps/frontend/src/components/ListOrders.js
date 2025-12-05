function ListOrders({ orders }) {
	return (
		<>
			<h1>All Orders</h1>
			<ul>
				{orders?.map((order) => (
					<li key={order.orderId}>
						{order.orderId} with price {order.price}
					</li>
				))}
			</ul>
		</>
	);
}

export { ListOrders };
