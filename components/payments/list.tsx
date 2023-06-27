"use client"

import { useState } from 'react';
import { dummyData } from 'utils/dummyData';
import PaymentItem from './item';
import styles from './payments.module.css';

export type Payment = {
    paymentId: string;
    orderAmount: number;
    orderId: string;
    tip: number;
    networkFee: number;
    serviceFee: number;
    tax: number;
    txHash: string;
    status: string;
    responseCode: number;
    createdAt: string;
    cancelledAt?: string;
};

export default function PaymentList() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const payments: Payment[] = dummyData;

    return (
        <div className={styles.rowContainer}>
            <div className={styles.rowHeader}>
                <div className={styles.headerCell}>Order ID</div>
                <div className={styles.headerCell}>Total</div>
                <div className={styles.headerCell}>Status</div>
                <div className={styles.headerCell}>Response Code</div>
                <div className={styles.headerCell}>Timestamp</div>
            </div>
            <div className={styles.rowContainer}>
                {payments.map((payment, index) => (
                    <PaymentItem
                        key={payment.paymentId}
                        payment={payment}
                        isExpanded={expandedIndex === index}
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} customer={{
                            name: 'Randal Randerson',
                            email: 'randy@handyman.com',
                            phone: '+1 206 555 1234',
                            records: 'NaN',
                            ltv: 'NaN'
                        }} status={{
                            authentication: '10000',
                            authorization: '10000',
                            captured: '10000',
                            status: '10000',
                            dispute: '20057'
                        }} />
                ))}
            </div>
        </div>
    );
}