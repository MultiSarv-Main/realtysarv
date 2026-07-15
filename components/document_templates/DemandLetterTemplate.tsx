
import React from 'react';
import { Lead, Project, PaymentPlanMilestone } from '../../types';

interface DemandLetterTemplateProps {
  lead: Lead;
  project: Project | null;
  data?: {
      milestone: PaymentPlanMilestone;
      demandDate: string;
      dueDate: string;
      milestoneDate?: string;
  };
  // Backward compatibility for direct milestone passing if needed, but we should prefer `data`
  milestone?: PaymentPlanMilestone; 
}

const DemandLetterTemplate: React.FC<DemandLetterTemplateProps> = ({ lead, project, data, milestone: propMilestone }) => {
    if (!lead.bookingDetails) return <p>Booking details not available.</p>;
    
    const milestone = data?.milestone || propMilestone;
    const demandDate = data?.demandDate ? new Date(data.demandDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    const dueDateStr = data?.dueDate ? new Date(data.dueDate).toLocaleDateString('en-IN') : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');
    const milestoneDateStr = data?.milestoneDate ? new Date(data.milestoneDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

    if (!milestone) return <p>Milestone details not found.</p>;

    const { primaryApplicant, priceBreakup } = lead.bookingDetails;
    const bookedUnit = project?.inventory.find(u => u.id === lead.bookingDetails!.unitId);
    
    // Calculate amounts based on Total Consideration + GST
    // Assuming the Payment Plan percentage applies to the (Total Consideration + GST) block
    // Breakdown:
    const baseDemandAmount = priceBreakup.totalConsideration * (milestone.percentage / 100);
    const gstDemandAmount = priceBreakup.gst * (milestone.percentage / 100);
    const totalDemandAmount = baseDemandAmount + gstDemandAmount;
    
    const cgstAmount = gstDemandAmount / 2;
    const sgstAmount = gstDemandAmount / 2;

    return (
        <div className="text-sm leading-relaxed text-gray-800">
             <header className="text-center mb-8 border-b border-gray-300 pb-4">
                <h1 className="text-xl font-bold">{project?.companyName}</h1>
                <p className="text-xs text-gray-600">Project: {project?.name} | RERA: {project?.reraNumber}</p>
            </header>

            <div className="flex justify-between mb-8">
                <div>
                    <p><strong>Ref:</strong> DEM/{bookedUnit?.unitNumber}/{milestone.name.substring(0,3).toUpperCase()}</p>
                    <p><strong>Date:</strong> {demandDate}</p>
                </div>
                <div className="text-right">
                    <p><strong>To,</strong></p>
                    <p><strong>{primaryApplicant.fullName}</strong></p>
                    <p className="whitespace-pre-line">{primaryApplicant.presentAddress}</p>
                </div>
            </div>

            <div className="mb-6 text-center">
                <h2 className="text-lg font-bold underline">DEMAND LETTER</h2>
                <p className="font-semibold mt-2">Sub: Demand for payment of "{milestone.name}"</p>
            </div>

            <p className="mb-4">Dear Sir/Madam,</p>
            
            <p className="mb-4">
                Greetings from <strong>{project?.companyName}</strong>. We are pleased to inform you that we have achieved the construction milestone <strong>"{milestone.name}"</strong>{milestoneDateStr ? ` on ${milestoneDateStr}` : ''} for your Unit No. <strong>{bookedUnit?.unitNumber}</strong> in <strong>{project?.name}</strong>.
            </p>
            
            <p className="mb-4">
                As per the payment schedule agreed upon in the Booking/Sale Agreement, the following amount is now due and payable:
            </p>

            <table className="w-full border border-gray-400 text-sm my-6">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2 text-left">Description</th>
                        <th className="border p-2 text-right">Amount (INR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2">
                            <strong>{milestone.name}</strong><br/>
                            <span className="text-xs text-gray-600">({milestone.percentage}% of Basic Consideration)</span>
                        </td>
                        <td className="border p-2 text-right font-mono">
                            {baseDemandAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        </td>
                    </tr>
                    <tr>
                        <td className="border p-2">CGST</td>
                        <td className="border p-2 text-right font-mono">
                            {cgstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        </td>
                    </tr>
                    <tr>
                        <td className="border p-2">SGST</td>
                        <td className="border p-2 text-right font-mono">
                            {sgstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        </td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="border p-2 font-bold">Total Amount Payable</td>
                        <td className="border p-2 text-right font-bold font-mono">
                            {totalDemandAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        </td>
                    </tr>
                </tbody>
            </table>

            <p className="mb-4">
                You are requested to make the payment on or before <strong>{dueDateStr}</strong> to avoid any interest charges on delayed payment.
            </p>
            
            <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
                <p className="font-bold text-xs uppercase text-gray-500 mb-2">Bank Details for RTGS/NEFT:</p>
                <p><strong>Account Name:</strong> {project?.companyName} Master Collection Account</p>
                <p><strong>Account No:</strong> XXXXXXXXXX</p>
                <p><strong>IFSC Code:</strong> BANK0000123</p>
                <p><strong>Bank:</strong> Global HDFC Bank</p>
            </div>

            <p className="mb-8">
                Please share the transaction details once payment is made for issuance of receipt.
            </p>

            <p>Thanking you,</p>
            <p className="mt-8 font-bold">For {project?.companyName}</p>
            <p className="text-xs">(Authorized Signatory)</p>
        </div>
    );
};

export default DemandLetterTemplate;
