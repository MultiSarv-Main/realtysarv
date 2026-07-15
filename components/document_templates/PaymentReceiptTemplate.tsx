
import React from 'react';
import { Lead, Project, PaymentRecord } from '../../types';

interface PaymentReceiptTemplateProps {
  lead: Lead;
  project: Project | null;
  payment: PaymentRecord;
}

const PaymentReceiptTemplate: React.FC<PaymentReceiptTemplateProps> = ({ lead, project, payment }) => {
    if (!lead.bookingDetails) return <p>Booking details not available.</p>;
    const { primaryApplicant } = lead.bookingDetails;
    const bookedUnit = project?.inventory.find(u => u.id === lead.bookingDetails!.unitId);

    // Simple number to words converter (simplified for demo)
    const inWords = (num: number): string => {
        return "Amount in words"; // Placeholder
    };

    return (
        <div className="text-sm font-sans text-gray-800">
            <div className="border-2 border-gray-800 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold uppercase tracking-wide">Payment Receipt</h1>
                    <h2 className="text-lg font-semibold mt-1">{project?.companyName}</h2>
                    <p className="text-xs text-gray-600">{project?.location} | {project?.reraNumber}</p>
                </div>

                <div className="flex justify-between mb-6">
                    <div>
                        <p><strong>Receipt No:</strong> REC-{payment.id.substring(0,8).toUpperCase()}</p>
                        <p><strong>Date:</strong> {new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                         <p><strong>Unit No:</strong> {bookedUnit?.unitNumber} ({bookedUnit?.type})</p>
                         <p><strong>Project:</strong> {project?.name}</p>
                    </div>
                </div>

                <div className="mb-6 leading-loose">
                    <p>Received with thanks from <strong>{primaryApplicant.fullName}</strong>,</p>
                    <p>a sum of <strong>₹ {payment.amount.toLocaleString('en-IN')}</strong> (Rupees {inWords(payment.amount)} Only)</p>
                    <p>vide <strong>{payment.mode}</strong>, Transaction/Cheque No. <strong>{payment.transactionId}</strong> dated <strong>{payment.date}</strong></p>
                    {payment.bankName && <p>drawn on <strong>{payment.bankName}</strong></p>}
                    <p>towards <strong>{payment.milestoneName || 'Part Payment'}</strong> for the above mentioned unit.</p>
                </div>

                <div className="mt-8 border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-gray-500">Note: This receipt is subject to realization of cheque/payment.</p>
                        </div>
                        <div className="text-center">
                            <div className="h-16 mb-2"></div>
                            <p className="font-bold border-t border-gray-400 px-4 pt-1">Authorized Signatory</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentReceiptTemplate;
