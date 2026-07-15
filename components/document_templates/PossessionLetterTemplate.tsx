
import React from 'react';
import { Lead, Project } from '../../types';

interface PossessionLetterTemplateProps {
  lead: Lead;
  project: Project | null;
}

const PossessionLetterTemplate: React.FC<PossessionLetterTemplateProps> = ({ lead, project }) => {
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

            <div className="mb-6 text-center">
                <h2 className="text-lg font-bold underline">LETTER OF POSSESSION</h2>
            </div>
            
            <p className="mb-4">
                This is to certify that we, <strong>[Your Company Name]</strong>, have handed over the physical, vacant, and peaceful possession of the property described below to <strong>{allApplicants}</strong> on this day.
            </p>

            <table className="w-full border border-gray-400 text-sm my-6">
                <tbody>
                    <tr className="border-b border-gray-300">
                        <td className="p-2 font-semibold bg-gray-100 w-1/3">Project Name</td>
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
                        <td className="p-2 font-semibold bg-gray-100">Floor</td>
                        <td className="p-2">{bookedUnit?.floor}</td>
                    </tr>
                </tbody>
            </table>
            
            <p className="mb-4">
                The allottee(s) has/have inspected the said unit and is/are satisfied with the construction, finishes, and fittings. All dues towards the said unit, including the final installment and other applicable charges, have been cleared by the allottee(s).
            </p>

            <p className="mb-6">
                This letter confirms the handover of the keys and the transfer of all responsibilities related to the maintenance and upkeep of the said unit to the allottee(s).
            </p>
            
            <div className="mt-16 grid grid-cols-2 gap-16 text-sm">
                <div className="border-t border-gray-400 pt-2">
                    <p className="font-bold">Signature of Allottee(s)</p>
                    <p className="mt-1">(Received Possession)</p>
                </div>
                 <div className="border-t border-gray-400 pt-2 text-right">
                    <p className="font-bold">For [Your Company Name]</p>
                    <p className="mt-1">(Authorized Signatory - Handed Over Possession)</p>
                </div>
            </div>
        </div>
    );
};

export default PossessionLetterTemplate;
