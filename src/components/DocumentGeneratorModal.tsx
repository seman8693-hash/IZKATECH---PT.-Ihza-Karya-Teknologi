import React, { useState, useMemo } from 'react';
import { AdminInquiry } from '../types/admin.ts';
import { COMPANY_INFO } from '../data/companyData.ts';
import { getBrandSettings } from '../data/adminStore';
import { X, Printer, Plus, Trash2, FileText, FileSignature } from 'lucide-react';
import { Logo } from './Logo.tsx';

interface DocItem {
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

interface DocumentGeneratorModalProps {
  inquiry: AdminInquiry;
  docType: 'SPH' | 'PKS' | 'INVOICE';
  onClose: () => void;
}

const formatRupiah = (n: number) =>
  'Rp ' + n.toLocaleString('id-ID', { maximumFractionDigits: 0 });

const todayStr = () => {
  const d = new Date();
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const DocumentGeneratorModal: React.FC<DocumentGeneratorModalProps> = ({ inquiry, docType, onClose }) => {
  const [docNumber, setDocNumber] = useState(
    `${docType}/IZKT/${new Date().getFullYear()}/${inquiry.id.replace(/[^0-9]/g, '') || '001'}`
  );
  const [docDate, setDocDate] = useState(todayStr());
  const [clientCompany, setClientCompany] = useState(inquiry.companyName);
  const [clientAddress, setClientAddress] = useState('');
  const [attention, setAttention] = useState(inquiry.clientName);
  const [subject, setSubject] = useState(
    docType === 'SPH'
      ? `Penawaran Harga ${inquiry.serviceInterest.join(', ')}`
      : docType === 'INVOICE'
      ? `Tagihan / Invoice Pembayaran ${inquiry.serviceInterest.join(', ')}`
      : `Perjanjian Kerja Sama ${inquiry.serviceInterest.join(', ')}`
  );
  const [items, setItems] = useState<DocItem[]>([
    { description: inquiry.serviceInterest[0] || 'Layanan ICT & ME', qty: 1, unit: 'Paket', unitPrice: 0 },
  ]);
  const [terms, setTerms] = useState(
    docType === 'SPH'
      ? '1. Penawaran harga berlaku selama 30 hari kalender.\n2. Harga belum termasuk PPN 11%.\n3. Pembayaran: DP 50% saat SPK, 50% setelah serah terima (BAST).\n4. Waktu pelaksanaan menyesuaikan jadwal survei & kesepakatan.'
      : docType === 'INVOICE'
      ? '1. Pembayaran mohon ditransfer melalui rekening PT. Ihza Karya Teknologi.\n2. Harap cantumkan nomor Invoice pada berita transfer.\n3. Konfirmasi transfer / bukti bayar dapat dikirimkan melalui WhatsApp resmi.\n4. Terima kasih atas kerja sama Anda.'
      : 'Pasal 1 â€” Lingkup Pekerjaan: sesuai rincian teknis dan BoQ yang disepakati.\nPasal 2 â€” Nilai Kontrak: sebesar nilai total pekerjaan dalam Surat Penawaran terlampir.\nPasal 3 â€” Jangka Waktu: pelaksanaan sesuai jadwal yang disepakati kedua belah pihak.\nPasal 4 â€” Pembayaran: termin sesuai progres pekerjaan dan kesepakatan.\nPasal 5 â€” Kedua belah pihak wajib menjaga kerahasiaan data dan informasi proyek.'
  );

  const total = useMemo(() => items.reduce((s, it) => s + it.qty * it.unitPrice, 0), [items]);

  // Identitas brand aktif (diatur dari menu Pengaturan — single source of truth)
  const brand = getBrandSettings();
  const brandName = brand.legal.companyName || COMPANY_INFO.name;

  const updateItem = (idx: number, patch: Partial<DocItem>) =>
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const handlePrint = () => {
    document.body.classList.add('doc-printing');
    window.print();
    setTimeout(() => document.body.classList.remove('doc-printing'), 500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-white backdrop-blur-sm">
      <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 print:hidden">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            {docType === 'SPH' ? <FileText className="w-4 h-4 text-cyan-600" /> : docType === 'INVOICE' ? <FileText className="w-4 h-4 text-emerald-600" /> : <FileSignature className="w-4 h-4 text-cyan-600" />}
            {docType === 'SPH' ? 'Buat Surat Penawaran Harga (SPH)' : docType === 'INVOICE' ? 'Buat Invoice Pembayaran' : 'Buat Perjanjian Kerja Sama (PKS)'} â€” {inquiry.id}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-200 hover:bg-slate-700 text-slate-600 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Editor Form */}
          <div className="lg:col-span-5 space-y-3 print:hidden">
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500">NOMOR DOKUMEN</span>
                <input value={docNumber} onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full mt-1 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400" />
              </label>
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500">TANGGAL</span>
                <input value={docDate} onChange={(e) => setDocDate(e.target.value)}
                  className="w-full mt-1 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400" />
              </label>
            </div>
            <label className="block">
              <span className="text-[10px] font-mono text-slate-500">PERUSAHAAN KLIEN</span>
              <input value={clientCompany} onChange={(e) => setClientCompany(e.target.value)}
                className="w-full mt-1 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400" />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono text-slate-500">ALAMAT KLIEN</span>
              <textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} rows={2}
                placeholder="Alamat lengkap klien..."
                className="w-full mt-1 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400" />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono text-slate-500">U.P. (NAMA PIC)</span>
              <input value={attention} onChange={(e) => setAttention(e.target.value)}
                className="w-full mt-1 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400" />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono text-slate-500">PERIHAL</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400" />
            </label>

            {/* Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {docType === 'SPH' ? 'RINCIAN BARANG / JASA' : 'LINGKUP PEKERJAAN & NILAI'}
                </span>
                <button
                  onClick={() => setItems([...items, { description: '', qty: 1, unit: 'Unit', unitPrice: 0 }])}
                  className="flex items-center gap-1 text-[10px] font-semibold text-cyan-600 hover:text-cyan-700 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Tambah Item
                </button>
              </div>
              {items.map((it, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <input value={it.description} onChange={(e) => updateItem(idx, { description: e.target.value })}
                      placeholder="Deskripsi item..."
                      className="flex-1 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400" />
                    <button onClick={() => setItems(items.filter((_, i) => i !== idx))}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input type="number" min={1} value={it.qty} onChange={(e) => updateItem(idx, { qty: Number(e.target.value) || 1 })}
                      title="Qty"
                      className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400" />
                    <input value={it.unit} onChange={(e) => updateItem(idx, { unit: e.target.value })} placeholder="Satuan"
                      className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400" />
                    <input type="number" min={0} value={it.unitPrice} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) || 0 })}
                      title="Harga satuan (Rp)" placeholder="Harga (Rp)"
                      className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400" />
                  </div>
                </div>
              ))}
              <div className="text-right text-xs font-bold text-cyan-700">
                Total: {formatRupiah(total)}
              </div>
            </div>

            <label className="block">
              <span className="text-[10px] font-mono text-slate-500">
                {docType === 'SPH' ? 'SYARAT & KETENTUAN' : 'PASAL-PASAL PERJANJIAN'}
              </span>
              <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={6}
                className="w-full mt-1 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 leading-relaxed focus:outline-none focus:border-cyan-400" />
            </label>
          </div>

          {/* Document Preview (printable) */}
          <div className="lg:col-span-7">
            <div id="printable-doc" className="relative bg-white text-slate-900 rounded-xl p-8 text-[11px] leading-relaxed shadow-2xl min-h-[600px]">
              {/* Watermark arsip transparan (diatur dari menu Pengaturan) */}
              {brand.letterhead.showWatermark && (brand.monoLogo || brand.mainLogo) && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  style={{ zIndex: -1 }}
                >
                  <img
                    src={brand.monoLogo || brand.mainLogo!}
                    alt=""
                    className="w-72 h-72 object-contain"
                    style={{ opacity: brand.letterhead.watermarkOpacity / 100 }}
                  />
                </div>
              )}

              {/* Letterhead */}
              <div className="flex items-start justify-between border-b-4 border-cyan-600 pb-3">
                <div className="flex items-center gap-3">
                  {brand.letterhead.showHeaderLogo && (
                    <Logo size="sm" variant="cyan-gold" showSubtitle={false} className="shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-sm tracking-wide">{brandName}</div>
                    <div className="text-[10px] text-slate-600">{COMPANY_INFO.subheading}</div>
                    <div className="text-[9px] text-slate-500">{COMPANY_INFO.address} â€¢ {COMPANY_INFO.phoneLandline} â€¢ {COMPANY_INFO.website}</div>
                  </div>
                </div>
                <div className="text-right text-[9px] text-slate-600">
                  <div>{COMPANY_INFO.email}</div>
                  <div>{COMPANY_INFO.phoneMobile}</div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mt-5">
                <div className="font-bold text-base underline uppercase tracking-wide">
                  {docType === 'SPH' ? 'Surat Penawaran Harga' : docType === 'INVOICE' ? 'INVOICE PEMBAYARAN' : 'Perjanjian Kerja Sama'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Nomor: {docNumber}</div>
              </div>

              {docType === 'SPH' || docType === 'INVOICE' ? (
                <>
                  <div className="mt-5 text-[11px]">
                    <div>{docType === 'INVOICE' ? 'Tagihan Kepada:' : 'Kepada Yth.'}</div>
                    <div className="font-bold">{clientCompany}</div>
                    {clientAddress && <div className="whitespace-pre-wrap text-slate-600">{clientAddress}</div>}
                    <div>U.P. {attention}</div>
                  </div>
                  <p className="mt-3">{docType === 'INVOICE' ? 'Dengan hormat, berikut adalah rincian tagihan / invoice pembayaran untuk pekerjaan berikut:' : 'Dengan hormat,'}</p>
                  {docType === 'SPH' && (
                    <p className="mt-1">
                      Bersama surat ini, kami <strong>{brandName}</strong> bermaksud mengajukan penawaran harga untuk:{' '}
                      <strong>{subject}</strong>. Rincian penawaran sebagai berikut:
                    </p>
                  )}
                  <table className="w-full mt-3 border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-400 p-1.5 w-8">No</th>
                        <th className="border border-slate-400 p-1.5 text-left">Deskripsi</th>
                        <th className="border border-slate-400 p-1.5 w-10">Qty</th>
                        <th className="border border-slate-400 p-1.5 w-14">Satuan</th>
                        <th className="border border-slate-400 p-1.5 w-24 text-right">Harga Satuan</th>
                        <th className="border border-slate-400 p-1.5 w-28 text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, i) => (
                        <tr key={i}>
                          <td className="border border-slate-400 p-1.5 text-center">{i + 1}</td>
                          <td className="border border-slate-400 p-1.5">{it.description}</td>
                          <td className="border border-slate-400 p-1.5 text-center">{it.qty}</td>
                          <td className="border border-slate-400 p-1.5">{it.unit}</td>
                          <td className="border border-slate-400 p-1.5 text-right">{formatRupiah(it.unitPrice)}</td>
                          <td className="border border-slate-400 p-1.5 text-right">{formatRupiah(it.qty * it.unitPrice)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-bold">
                        <td colSpan={5} className="border border-slate-400 p-1.5 text-right">TOTAL</td>
                        <td className="border border-slate-400 p-1.5 text-right">{formatRupiah(total)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="mt-3 font-semibold">{docType === 'INVOICE' ? 'Instruksi Pembayaran & Catatan:' : 'Syarat & Ketentuan:'}</p>
                  <p className="whitespace-pre-wrap text-[10px]">{terms}</p>
                  <p className="mt-3">{docType === 'INVOICE' ? 'Demikian invoice ini diterbitkan agar dapat dipergunakan sebagaimana mestinya. Terima kasih.' : 'Demikian penawaran ini kami sampaikan. Besar harapan kami untuk dapat bekerja sama dengan perusahaan Bapak/Ibu.'}</p>
                </>
              ) : (
                <>
                  <p className="mt-5 text-justify">
                    Pada hari ini, <strong>{docDate}</strong>, bertindak untuk dan atas nama:
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-[10px]">
                    <div className="border border-slate-400 rounded-lg p-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        {brand.letterhead.showHeaderLogo && (
                          <Logo size="sm" variant="cyan-gold" showSubtitle={false} className="shrink-0" />
                        )}
                        <div className="font-bold text-[11px]">PIHAK PERTAMA</div>
                      </div>
                      <div>{brandName}</div>
                      <div className="text-slate-600">{COMPANY_INFO.address}</div>
                    </div>
                    <div className="border border-slate-400 rounded-lg p-2.5">
                      <div className="font-bold text-[11px]">PIHAK KEDUA</div>
                      <div className="font-bold">{clientCompany}</div>
                      {clientAddress && <div className="whitespace-pre-wrap text-slate-600">{clientAddress}</div>}
                      <div>U.P. {attention}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-justify">
                    secara sukarela dan tanpa paksaan dari pihak manapun, sepakat mengadakan <strong>Perjanjian Kerja Sama</strong> untuk:{' '}
                    <strong>{subject}</strong>, dengan ketentuan sebagai berikut:
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-[10px]">{terms}</p>
                  <div className="mt-2 text-[10px]">Nilai Keseluruhan Pekerjaan: <strong>{formatRupiah(total)}</strong></div>
                </>
              )}

              {/* Signature block */}
              <div className="mt-8 flex justify-end">
                <div className="text-center text-[10px]">
                  <div>{docType === 'SPH' ? 'Bandung, ' : ''}{docDate}</div>
                  <div>{docType === 'SPH' ? 'Hormat kami,' : 'PIHAK PERTAMA'}</div>
                  <div className="h-14" />
                  <div className="font-bold underline">{brandName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          body.doc-printing * { visibility: hidden !important; }
          body.doc-printing #printable-doc, body.doc-printing #printable-doc * { visibility: visible !important; }
          body.doc-printing #printable-doc { position: absolute; left: 0; top: 0; width: 100%; border-radius: 0; box-shadow: none; padding: 24px; }
        }
      `}</style>
    </div>
  );
};
