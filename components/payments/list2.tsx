import { Order } from '@prisma/client';
import { useHoveredItem } from './hovered-context';
import ListItem from './list-item'; // Ensure the path to the list-item component is correct

type ListProps = {
    orders: Order[];
};

export default function PaymentList({ orders }: ListProps) {

    // This will relay the list item data being hovered to the response code widget
    const { setHoveredItem } = useHoveredItem();
    console.log(orders);

    return (
        <div>
            <div className="grid grid-cols-4 pb-4 justify-items-center">
                <p><strong>Order ID</strong></p>
                <p><strong>Time</strong></p>
                <p><strong>Order</strong></p>
                <p><strong>Customer</strong></p>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-80">
                {orders.map(order => (
                    <ListItem
                        key={order.id}
                        order={order}
                        onMouseEnter={(e) => setHoveredItem(order)}
                        onMouseLeave={(e) => setHoveredItem(null)}
                    />
                ))}
            </div>
        </div>
    );
}
