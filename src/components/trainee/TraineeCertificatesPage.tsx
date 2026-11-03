import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import { Award, Plus, Download, Eye, FileText, CheckCircle2, Clock, X, Upload } from 'lucide-react';

interface TraineeCertificatesPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeCertificatesPage: React.FC<TraineeCertificatesPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { earnedCertificates, uploadedEvidence, addEvidence } = useTraineeData();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewCertificateModal, setViewCertificateModal] = useState<string | null>(null);

  // Upload Form State
  const [fileName, setFileName] = useState('');
  const [provider, setProvider] = useState('IMD Training Institute');
  const [year, setYear] = useState('2026');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;
    addEvidence(fileName.trim(), provider, year);
    setUploadModalOpen(false);
    setFileName('');
    showToast('Evidence uploaded and queued for MoES registry verification');
  };

  const handleDownloadCertificate = (title: string) => {
    showToast(`Downloading certified PDF for "${title}" (Digital Signature Verified)`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header matching 20-certificates */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
            Certificates
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6478] mt-1">
            Earned certificates and your uploaded evidence
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUploadModalOpen(true)}
          className="h-10 px-5 rounded-xl bg-[#1f5eff] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Upload certificate</span>
        </button>
      </div>

      {/* 4 Earned Certificate Cards (4 columns) matching 20-certificates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {earnedCertificates.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
          >
            <div>
              {/* Certificate preview container with blue text CERTIFICATE */}
              <div className="w-full h-32 rounded-xl bg-[#e8efff]/50 border border-[#1f5eff]/20 flex flex-col items-center justify-center text-[#1f5eff] mb-3 group-hover:bg-[#e8efff]/80 transition-colors">
                <span className="text-xs font-bold tracking-widest text-[#1f5eff] uppercase">
                  CERTIFICATE
                </span>
                <span className="text-[10px] text-[#5b6478] mt-1 font-mono">
                  {cert.verificationCode}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#1c2333]">
                {cert.title}
              </h3>
              <p className="text-xs text-[#5b6478] mt-0.5">
                Issued {cert.issueDate}
              </p>
            </div>

            {/* View and Download Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setViewCertificateModal(cert.title)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#1c2333] transition-colors cursor-pointer text-center"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => handleDownloadCertificate(cert.title)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#1c2333] transition-colors cursor-pointer text-center"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Card: My uploaded evidence matching 20-certificates */}
      <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#1c2333]">
            My uploaded evidence
          </h3>
          <p className="text-xs text-[#5b6478] mt-0.5">
            Checked against MoES and IMD-linked providers
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-[#5b6478] border-b border-slate-100 font-medium text-xs">
                <th className="pb-3.5 font-medium">File</th>
                <th className="pb-3.5 font-medium">Provider</th>
                <th className="pb-3.5 font-medium">Uploaded</th>
                <th className="pb-3.5 font-medium text-right">Evidence check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {uploadedEvidence.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 pr-4 font-bold text-[#1c2333]">
                    {ev.fileName}
                  </td>
                  <td className="py-4 px-4 text-[#5b6478] text-xs">
                    {ev.provider}
                  </td>
                  <td className="py-4 px-4 text-[#5b6478] text-xs">
                    {ev.uploadedDate}
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ev.evidenceCheck === 'Verified'
                          ? 'bg-[#e7f7ee] text-[#15803d]'
                          : ev.evidenceCheck === 'Pending'
                          ? 'bg-[#fff1e0] text-[#b45309]'
                          : 'bg-[#fde8ea] text-[#b91c1c]'
                      }`}
                    >
                      {ev.evidenceCheck}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Certificate Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1c2333]">
                  Upload External Certificate
                </h3>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  Automated verification via MoES and IMD Training Database
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1c2333] mb-1">
                  Document File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Doppler_Radar_Techniques.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#1c2333] focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c2333] mb-1">
                  Issuing Institute / Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#1c2333] focus:outline-hidden"
                >
                  <option value="IMD Training Institute">IMD Training Institute (MTI Pune)</option>
                  <option value="Ministry of Earth Sciences (MoES)">Ministry of Earth Sciences (MoES)</option>
                  <option value="IITM Pune">Indian Institute of Tropical Meteorology (IITM)</option>
                  <option value="INCOIS Hyderabad">INCOIS Hyderabad</option>
                  <option value="WMO Regional Training Center">WMO Regional Training Center</option>
                  <option value="Online provider">Online provider</option>
                  <option value="Unrecognised provider">Unrecognised provider</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c2333] mb-1">
                  Year of Completion
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#1c2333] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1f5eff] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Submit for verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Certificate Preview Modal */}
      {viewCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 text-center animate-in zoom-in-95 duration-150">
            <div className="border-4 border-double border-slate-200 p-8 rounded-xl bg-slate-50/50 relative">
              <span className="text-[11px] font-bold tracking-widest text-[#1d4ed8] uppercase block mb-1">
                INDIA METEOROLOGICAL DEPARTMENT
              </span>
              <p className="text-[10px] text-slate-500 mb-6">MINISTRY OF EARTH SCIENCES · GOVT. OF INDIA</p>

              <h2 className="text-xl font-bold text-[#1c2333] tracking-tight mb-2">
                Certificate of Competency
              </h2>
              <p className="text-xs text-slate-600 mb-4">This certifies that</p>
              <h3 className="text-lg font-bold text-[#1f5eff] underline decoration-dotted mb-4">
                Asha Verma
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                has successfully fulfilled all operational curriculum and assessment criteria for{' '}
                <strong>{viewCertificateModal}</strong>.
              </p>

              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Verified: MoES-REG-2026</span>
                <span>Dr. Ravi Menon · Training Director</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setViewCertificateModal(null)}
                className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadCertificate(viewCertificateModal);
                  setViewCertificateModal(null);
                }}
                className="px-5 py-2 bg-[#1f5eff] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
