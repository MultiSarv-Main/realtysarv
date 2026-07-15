
import React from 'react';
import { Lead, Project } from '../../types';

interface AllotmentLetterTemplateProps {
  lead: Lead;
  project: Project | null;
}

const AllotmentLetterTemplate: React.FC<AllotmentLetterTemplateProps> = ({ lead, project }) => {
    if (!lead.bookingDetails) return <p>Booking details not available.</p>;

    const { primaryApplicant, coApplicants } = lead.bookingDetails;
    const bookedUnit = project?.inventory.find(u => u.id === lead.bookingDetails!.unitId);
    const allApplicants = [primaryApplicant, ...coApplicants].map(a => a.fullName).join(', ');

    return (
        <div className="text-sm leading-relaxed text-gray-800">
            <header className="text-center mb-8">
                <h1 className="text-xl font-bold">[Your Company Name / Letterhead]</h1>
                <p className="text-xs">[Company Address] | [Contact Info]</p>
            </header>
            
            <div className="flex justify-between mb-6">
                <div>
                    <p><strong>Ref No:</strong> [Auto-Generated Ref No]</p>
                </div>
                <div className="text-right">
                    <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            <div className="mb-6">
                <p>To,</p>
                <p><strong>{allApplicants}</strong></p>
                <p className="whitespace-pre-line">{primaryApplicant.presentAddress}</p>
            </div>

            <div className="mb-6">
                <p><strong>Subject: Allotment of Unit No. {bookedUnit?.unitNumber} in the project "{project?.name}"</strong></p>
            </div>
            
            <p className="mb-4">Dear Sir/Madam,</p>
            
            <p className="mb-4">
                With reference to your Application Form dated <strong>{lead.bookingDetails.tokenDetails.transactionDate}</strong> and the payment of the booking amount of 
                <strong> ₹{lead.bookingDetails.tokenDetails.amount.toLocaleString('en-IN')}</strong>, we are pleased to provisionally allot the following unit to you in our project "{project?.name}".
            </p>

            <table className="w-full border border-gray-400 text-sm my-6">
                <tbody>
                    <tr className="border-b border-gray-300">
                        <td className="p-2 font-semibold bg-gray-100 w-1/3">Allottee(s) Name</td>
                        <td className="p-2">{allApplicants}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="p-2 font-semibold bg-gray-100">Project Name</td>
                        <td className="p-2">{project?.name}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="p-2 font-semibold bg-gray-100">Unit Number</td>
                        <td className="p-2">{bookedUnit?.unitNumber}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="p-2 font-semibold bg-gray-100">Unit Type</td>
                        <td className="p-2">{bookedUnit?.type}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="p-2 font-semibold bg-gray-100">Saleable Area</td>
                        <td className="p-2">{bookedUnit?.area} sq.ft. (approx.)</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="p-2 font-semibold bg-gray-100">Total Agreement Value</td>
                        <td className="p-2 font-bold">₹{lead.bookingDetails.priceBreakup.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    </tr>
                </tbody>
            </table>
            
            <p className="mb-4">
                This allotment is subject to the terms and conditions mentioned in the Application Form and the forthcoming Agreement for Sale. You are requested to complete the necessary formalities and execute the Agreement for Sale within 30 days from the date of this letter.
            </p>
            
            <p className="mb-6">
                We welcome you to the [Your Company Name] family and assure you of our best services at all times.
            </p>

            <p>Thanking you,</p>
            
            <div className="mt-12">
                <p>For <strong>[Your Company Name]</strong></p>
                <div className="h-20"></div>
                <p><strong>(Authorized Signatory)</strong></p>
            </div>
        </div>
    );
};

export default AllotmentLetterTemplate;
