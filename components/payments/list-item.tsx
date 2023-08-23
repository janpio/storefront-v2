import React, { MouseEvent } from 'react';
import Tooltip from '../tooltips/tooltip';

type ListItemProps = {
    order: any;
    onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void;
};

type StatusColors = {
    [key: string]: string;
    paid: string;
    pending: string;
    error: string;
    processing: string;
};

const PaymentListItem = ({ order, onMouseEnter, onMouseLeave }: ListItemProps) => {
    const total = (order.amount + order.tipAmount + order.networkFee + order.serviceFee + order.taxFee).toFixed(2);

    //const displayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const displayDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

    const statusColors: StatusColors = {
        'paid': 'text-green-500',
        'pending': 'text-yellow-500',
        'error': 'text-red-500',
        'processing': 'text-orange-500',
    };

    return (
        <div className="grid grid-cols-4 gap-12 w-full rounded-md px-2 py-2 justify-items-center bg-slate-50 hover:bg-violet-300"

            // This will relay the list item data being hovered to the response code widget
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="col-span-1">
                <p className="text-sm font-semibold text-gray-500">{order.id ?? "problem 😮‍💨"}</p>
            </div>
            <div className="col-span-1">
                <p className="text-sm font-semibold text-gray-500">{displayDate ?? "problem 😮‍💨"}</p>
            </div>
            <Tooltip
                content={
                    <div>
                        <div className="flex items-center">
                            <span className="text-green-500 py-1 mx-2">🟢</span> <span>Approved</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-yellow-500 py-1 mx-2">🟡</span> <span>Pending</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-red-500 py-1 mx-2">🔴</span> <span>Declined</span>
                        </div>
                    </div>
                }
            >
                <div className="col-span-1">
                    <p className={`text-sm font-semibold ${statusColors[order.status] || 'text-gray-500'}`}>{order.amount ?? "problem 😮‍💨"}</p>
                </div>
            </Tooltip>

            <div className="col-span-1">
                <p className="text-sm font-semibold text-gray-500">{order.customer?.firstName ?? "-"} {order.customer?.lastName ?? ''}</p>
            </div>
        </div>
    )
};

const ListItem = React.memo(PaymentListItem);
ListItem.displayName = "ListItem";

export default ListItem;
