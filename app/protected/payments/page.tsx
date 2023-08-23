"use client"
import CommandBar from "@/components/generics/command-bar";
import Container from "@/components/generics/container";
import Widget from "@/components/generics/widget";
import PaymentButtons from "@/components/payments/buttons";
import { fetchLatestOrder } from "@/components/payments/data-refresh";
import { HoveredItemProvider, useHoveredItem } from "@/components/payments/hovered-context";
import PaymentList from "@/components/payments/list";
import CustomerDetails from "@/components/widgets/customer-details";
import DateRangePicker from "@/components/widgets/datepicker";
import ResponseCodes from "@/components/widgets/payment-details";
import { Order } from "@prisma/client";
import { useSession } from "next-auth/react";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Payments() {
    const [activeWidget, setActiveWidget] = useState<string | null>(null);


    return (
        <HoveredItemProvider>
            <PaymentDataHook activeWidget={activeWidget} setActiveWidget={setActiveWidget} />
        </HoveredItemProvider>
    )
}

function PaymentDataHook({ activeWidget, setActiveWidget }: { activeWidget: string | null, setActiveWidget: (widget: string | null) => void }) {
    const { hoveredItem } = useHoveredItem();
    const { data: session } = useSession()
    const [dateRange, setDateRange] = useState<{ startDate: Date | null, endDate: Date | null }>({ startDate: null, endDate: null });
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [limit] = useState(10);

    const [orders, setOrders] = useState<Array<Order>>([])

    const handleDateRangeChange = (startDate: Date, endDate: Date) => {
        setDateRange({ startDate, endDate });
    };

    const handleRefresh = async () => {
        console.log('handleRefresh called');
        const latestOrder = await fetchLatestOrder();

        if (latestOrder && (!orders.length || latestOrder.id !== orders[0].id)) {
            setOrders([latestOrder, ...orders]);
        }
    };

    const getOrders = useCallback(async () => {
        console.log('Fetching orders');

        try {
            if (!session?.user?.merchantId) {
                return
            }

            setLoading(true)
            const query = queryString.stringify({
                page,
                limit,
                dateRange
            })
            const response = await fetch(`/api/order?${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const result = await response.json();

            if (response.ok) {
                setOrders(prevOrders => prevOrders.concat(result.rows));
                setTotal(result.count);
            } else {
                throw new Error(result.message || result.error)
            }
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }

    }, [page, limit, dateRange, session])

    useEffect(() => {
        getOrders()
    }, [getOrders])

    return (
        <div className="relative w-screen h-screen">
            <Container title={"Payments"} footer={<PaymentButtons orders={undefined} />}>
                <PaymentList
                    orders={orders}
                    loading={loading}
                    total={total}
                    handleRefresh={handleRefresh}
                    loadMore={() => {
                        console.log('loadMore called');  // Debugging line
                        setPage(page + 1);
                    }}
                />
            </Container>
            <CommandBar
                slot1={'Payment Details'}
                slot2={'Date Range'}
                slot3={'Customer Details'}
                changeWidget={setActiveWidget}
            />
            {activeWidget === 'Payment Details' && <Widget title="Payment Details"><ResponseCodes data={hoveredItem} /></Widget>}
            {activeWidget === 'Date Range' && <Widget title="Date Range"><DateRangePicker onChange={handleDateRangeChange} /></Widget>}
            {activeWidget === 'Customer Details' && <Widget title="Customer Details"><CustomerDetails data={hoveredItem} /></Widget>}
        </div>
    )
}