
import React from 'react';
import { Lead, Project, Applicant } from '../../types';

interface BookingFormTemplateProps {
  lead: Lead;
  project: Project | null;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-600 pb-1 mb-3 mt-4">{children}</h3>
);

const DetailRow: React.FC<{ label: string, value?: React.ReactNode, fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => (
    <div className={`py-1.5 ${fullWidth ? 'col-span-2' : ''}`}>
        <span className="font-semibold text-gray-600 text-sm">{label}:</span>
        <span className="ml-2 text-gray-800 text-sm">{value || 'N/A'}</span>
    </div>
);

const ApplicantTable: React.FC<{ applicant: Applicant, title: string }> = ({ applicant, title }) => (
    <div>
        <h4 className="font-bold bg-gray-200 p-2 text-sm">{title}</h4>
        <div className="grid grid-cols-2 border border-gray-300 p-2 gap-x-4">
            <DetailRow label="Full Name" value={applicant.fullName} />
            <DetailRow label="S/o, W/o, D/o" value={applicant.relationValue} />
            <DetailRow label="PAN" value={applicant.pan} />
            <DetailRow label="Aadhaar" value={applicant.aadhaar} />
            <DetailRow label="Mobile" value={applicant.mobile} />
            <DetailRow label="Email" value={applicant.email} />
            <DetailRow label="Present Address" value={applicant.presentAddress} fullWidth />
        </div>
    </div>
);


const BookingFormTemplate: React.FC<BookingFormTemplateProps> = ({ lead, project }) => {
    if (!lead.bookingDetails) return <p>Booking details not available.</p>;

    const { primaryApplicant, coApplicants, priceBreakup, tokenDetails } = lead.bookingDetails;
    const bookedUnit = project?.inventory.find(u => u.id === lead.bookingDetails!.unitId);

    const costRows = [
        { label: 'Basic Sale Price', value: priceBreakup.basicSalePrice },
        { label: 'Other Charges', value: priceBreakup.otherCharges },
        { label: 'Total Consideration', value: priceBreakup.totalConsideration, isBold: true },
        { label: 'GST', value: priceBreakup.gst },
        { label: 'Stamp Duty', value: priceBreakup.stampDuty },
        { label: 'Registration Charges', value: priceBreakup.registrationCharges },
        { label: 'Society Formation', value: priceBreakup.societyFormationCharges },
        { label: 'Legal Charges', value: priceBreakup.legalCharges },
        { label: 'Maintenance Charges', value: priceBreakup.maintenanceCharges },
        { label: 'Corpus Fund', value: priceBreakup.corpusFund },
    ];
    
    return (
        <div className="text-xs">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">BOOKING FORM / APPLICATION FOR ALLOTMENT</h1>
                <h2 className="text-xl font-semibold">{project?.name}</h2>
                <p className="text-sm">RERA No: {project?.reraNumber}</p>
            </div>

            <SectionTitle>Property Details</SectionTitle>
            <div className="grid grid-cols-3 border border-gray-300 p-2 text-sm">
                <DetailRow label="Unit No." value={bookedUnit?.unitNumber} />
                <DetailRow label="Floor" value={bookedUnit?.floor} />
                <DetailRow label="Unit Type" value={bookedUnit?.type} />
                <DetailRow label="Carpet Area" value={`${bookedUnit?.carpetArea || 'N/A'} sq.ft.`} />
                <DetailRow label="Saleable Area" value={`${bookedUnit?.area || 'N/A'} sq.ft.`} />
            </div>

            <SectionTitle>Applicant Details</SectionTitle>
            <div className="space-y-3">
                <ApplicantTable applicant={primaryApplicant} title="Primary Applicant" />
                {coApplicants.map((coApp, index) => (
                    <ApplicantTable key={coApp.id} applicant={coApp} title={`Co-Applicant ${index + 1}`} />
                ))}
            </div>
            
            <SectionTitle>Cost Breakup</SectionTitle>
            <table className="w-full border border-gray-300 text-sm">
                <tbody>
                    {costRows.filter(row => row.value > 0).map(row => (
                        <tr key={row.label} className={`border-b border-gray-200 ${row.isBold ? 'font-bold bg-gray-100' : ''}`}>
                            <td className="p-2">{row.label}</td>
                            <td className="p-2 text-right font-mono">₹{row.value.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                        </tr>
                    ))}
                    <tr className="font-bold bg-gray-200 text-base">
                        <td className="p-2">Grand Total</td>
                        <td className="p-2 text-right font-mono">₹{priceBreakup.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    </tr>
                </tbody>
            </table>

            <SectionTitle>Token / Booking Amount Details</SectionTitle>
            <div className="grid grid-cols-2 border border-gray-300 p-2 text-sm gap-x-4">
                <DetailRow label="Amount Paid" value={`₹${tokenDetails.amount.toLocaleString('en-IN')}`} />
                <DetailRow label="Payment Mode" value={tokenDetails.mode} />
                <DetailRow label="Transaction/Cheque No." value={tokenDetails.transactionId} />
                <DetailRow label="Bank Name" value={tokenDetails.bankName} />
                <DetailRow label="Date" value={tokenDetails.transactionDate} />
            </div>

            <div className="mt-8 text-xs text-gray-600">
                <p className="font-bold">Declaration:</p>
                <p>I/We, the undersigned, have read and understood the terms and conditions of the booking and agree to abide by them. I/We request the allotment of the above-mentioned unit in my/our name(s).</p>
            </div>
            
            <div className="mt-16 grid grid-cols-2 gap-16 text-sm">
                <div className="border-t border-gray-400 pt-2">
                    <p className="font-bold">Signature of Applicant(s)</p>
                </div>
                 <div className="border-t border-gray-400 pt-2 text-right">
                    <p className="font-bold">For [Developer Name]</p>
                    <p>(Authorized Signatory)</p>
                </div>
            </div>
        </div>
    );
};

export default BookingFormTemplate;
