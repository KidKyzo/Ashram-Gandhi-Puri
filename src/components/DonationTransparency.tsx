"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
  HeartHandshake,
  TrendingUp,
  Users,
} from "lucide-react";
import type { DonationRecord, DonationSummary } from "@/lib/donations";
import { formatRupiah, formatIndoDate } from "@/lib/donations";

interface DonationTransparencyProps {
  initialDonations: DonationRecord[];
  summary: DonationSummary;
}

export default function DonationTransparency({
  initialDonations,
  summary,
}: DonationTransparencyProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Ambil daftar unik kategori
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    initialDonations.forEach((d) => set.add(d.category));
    return Array.from(set);
  }, [initialDonations]);

  // Ambil daftar unik periode bulan
  const periodsList = useMemo(() => {
    const set = new Map<string, string>();
    initialDonations.forEach((d) => {
      if (!set.has(d.monthPeriod)) {
        set.set(d.monthPeriod, d.monthDisplay);
      }
    });
    return Array.from(set.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [initialDonations]);

  // Filter donasi
  const filteredDonations = useMemo(() => {
    return initialDonations.filter((d) => {
      // Filter periode
      if (selectedPeriod !== "ALL" && d.monthPeriod !== selectedPeriod) {
        return false;
      }

      // Filter kategori
      if (selectedCategory !== "ALL" && d.category !== selectedCategory) {
        return false;
      }

      // Pencarian kata kunci
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = d.id.toLowerCase().includes(q);
        const matchName = d.donorName.toLowerCase().includes(q);
        const matchEmail = d.emailCensored.toLowerCase().includes(q);
        const matchCat = d.category.toLowerCase().includes(q);
        const matchNotes = d.notes.toLowerCase().includes(q);
        return matchId || matchName || matchEmail || matchCat || matchNotes;
      }

      return true;
    });
  }, [initialDonations, selectedPeriod, selectedCategory, searchQuery]);

  // Total nominal dari data terfilter
  const filteredTotal = useMemo(() => {
    return filteredDonations.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredDonations]);

  return (
    <section className="section bg-[var(--color-tint)] border-t border-[var(--color-border)]" aria-labelledby="transparency-title">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-tint)] text-[var(--color-text)] text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparansi Keuangan Terbuka</span>
            </div>
            <h2 id="transparency-title" className="text-3xl md:text-4xl font-heading font-semibold text-[var(--color-text)]">
              Laporan Donasi & Dana Punia Publik
            </h2>
            <p className="mt-2 text-[var(--color-text)] leading-relaxed text-sm md:text-base">
              Setiap dana yang masuk ke rekening resmi Ashram Gandhi Puri dicatat secara transparan
              dan dapat diakses oleh publik. Demi melindungi privasi donatur, email disensor
              sebagian sesuai etika dan regulasi perlindungan data pribadi.
            </p>
          </div>

          {/* Tombol Unduh Laporan CSV */}
          <div className="flex-shrink-0">
            <a
              href="/api/donations/download"
              download
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-[var(--color-deep)] hover:bg-[#4C1D95] text-white font-medium text-sm shadow-none transition-all duration-200 cursor-pointer group"
              title="Unduh seluruh rekapitulasi data donasi dalam format CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Unduh Rekap CSV Publik</span>
              <Download className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100" />
            </a>
          </div>
        </div>

        {/* Ringkasan Statistik Transparansi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-lg bg-white border border-[var(--color-border)] shadow-none flex items-start gap-4">
            <div className="w-12 h-12 rounded-md bg-amber-50 border border-amber-200/60 flex items-center justify-center flex-shrink-0 text-amber-700">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Total Terverifikasi
              </p>
              <p className="text-xl md:text-2xl font-semibold font-heading text-[var(--color-text)] mt-0.5">
                {formatRupiah(summary.totalAmount)}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                Dari seluruh periode catatan
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-white border border-[var(--color-border)] shadow-none flex items-start gap-4">
            <div className="w-12 h-12 rounded-md bg-[var(--color-tint)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 text-[var(--color-text-muted)]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Total Donatur
              </p>
              <p className="text-xl md:text-2xl font-semibold font-heading text-[var(--color-text)] mt-0.5">
                {summary.totalDonors} Jiwa
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                Partisipasi Japa Malamitra
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-white border border-[var(--color-border)] shadow-none flex items-start gap-4">
            <div className="w-12 h-12 rounded-md bg-emerald-50 border border-emerald-200/60 flex items-center justify-center flex-shrink-0 text-emerald-700">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Bulan Berjalan
              </p>
              <p className="text-xl md:text-2xl font-semibold font-heading text-[var(--color-text)] mt-0.5">
                {formatRupiah(summary.currentMonthAmount)}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                {summary.currentMonthDonors} donasi bulan ini
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-white border border-[var(--color-border)] shadow-none flex items-start gap-4">
            <div className="w-12 h-12 rounded-md bg-[var(--color-tint)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 text-[var(--color-deep)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Status Akuntabilitas
              </p>
              <p className="text-xl md:text-2xl font-semibold font-heading text-emerald-700 mt-0.5">
                100% Terverifikasi
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                Rekening resmi Bank Mandiri
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white p-4 md:p-5 rounded-lg border border-[var(--color-border)] shadow-none mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Input Pencarian */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                aria-label="Cari donasi"
                placeholder="Cari donatur, email sensor, atau program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-md border border-[var(--color-border-strong)] focus:border-[var(--color-deep)] focus:ring-2 focus:ring-[var(--color-deep)] text-sm outline-none transition-all placeholder:text-[var(--color-text-muted)] text-[var(--color-text)]"
              />
            </div>

            {/* Filter Periode Bulan */}
            <div className="md:col-span-4 relative">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 hidden sm:block" />
                <select
                  aria-label="Periode donasi"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md border border-[var(--color-border-strong)] focus:border-[var(--color-deep)] focus:ring-2 focus:ring-[var(--color-deep)] text-sm outline-none bg-white text-[var(--color-text)] cursor-pointer"
                >
                  <option value="ALL">Semua Periode Bulan</option>
                  {periodsList.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Program */}
            <div className="md:col-span-3">
              <select
                aria-label="Program donasi"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md border border-[var(--color-border-strong)] focus:border-[var(--color-deep)] focus:ring-2 focus:ring-[var(--color-deep)] text-sm outline-none bg-white text-[var(--color-text)] cursor-pointer"
              >
                <option value="ALL">Semua Program</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between text-xs text-[var(--color-text-muted)] gap-2">
            <div>
              Menampilkan <strong>{filteredDonations.length}</strong> dari {initialDonations.length} catatan donasi
              {selectedPeriod !== "ALL" || selectedCategory !== "ALL" || searchQuery ? (
                <button
                  onClick={() => {
                    setSelectedPeriod("ALL");
                    setSelectedCategory("ALL");
                    setSearchQuery("");
                  }}
                  className="ml-2 text-amber-700 hover:text-amber-800 font-semibold underline cursor-pointer"
                >
                  Reset Filter
                </button>
              ) : null}
            </div>
            <div>
              Subtotal Terfilter: <strong className="text-[var(--color-text)] font-heading text-sm">{formatRupiah(filteredTotal)}</strong>
            </div>
          </div>
        </div>

        {/* Tabel Data Donasi Transparan */}
        <div className="bg-white rounded-lg border border-[var(--color-border)] shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-tint)] text-[var(--color-text)] text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">No / ID</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Donatur</th>
                  <th className="py-3.5 px-4">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[var(--color-primary-dark)]" />
                      Email (Disensor)
                    </span>
                  </th>
                  <th className="py-3.5 px-4">Peruntukan Program</th>
                  <th className="py-3.5 px-4 text-right">Nominal (IDR)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-xs md:text-sm text-[var(--color-text)]">
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[var(--color-tint)] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--color-text-muted)] font-medium">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--color-text)] whitespace-nowrap">
                        {formatIndoDate(item.date)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[var(--color-text)] whitespace-nowrap">
                        {item.donorName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--color-tint)] border border-[var(--color-border)]">
                          {item.emailCensored}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--color-text)]">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/50">
                          {item.category}
                        </span>
                        {item.notes ? (
                          <span className="block text-[11px] text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
                            {item.notes}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-[var(--color-text)] font-heading whitespace-nowrap">
                        {formatRupiah(item.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[var(--color-text-muted)]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-8 h-8 text-[var(--color-text-muted)]" />
                        <p className="font-medium text-sm">Tidak ditemukan data donasi yang sesuai kriteria.</p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Coba ganti filter periode bulan atau kata kunci pencarian Anda.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Transparansi & Catatan Privasi */}
          <div className="p-4 bg-[var(--color-tint)] border-t border-[var(--color-border)] text-xs text-[var(--color-text)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Jaminan Privasi:</strong> Alamat email dan identitas personal disensor demi kepatuhan
                UU Perlindungan Data Pribadi (UU PDP).
              </span>
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)]">
              Diperbarui berkala oleh Bendahara Yayasan Ashram Gandhi Puri
            </div>
          </div>
        </div>

        {/* Informasi Alur Transparansi */}
        <div className="mt-8 p-6 rounded-lg bg-white border border-[var(--color-border)] shadow-none">
          <h3 className="font-heading font-semibold text-lg text-[var(--color-text)] mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            Bagaimana Mekanisme Transparansi Donasi Bekerja?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-[var(--color-text)]">
            <div className="p-4 rounded-md bg-[var(--color-tint)] border border-[var(--color-border)]">
              <span className="inline-block w-6 h-6 rounded-full bg-[var(--color-deep)] text-white font-semibold text-center leading-6 text-xs mb-2">
                1
              </span>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">Transfer & Konfirmasi</h4>
              <p>
                Donatur melakukan transfer ke rekening resmi Bank Mandiri Yayasan Ashram Gandhi Puri dan mengisi formulir konfirmasi dengan melampirkan bukti transfer.
              </p>
            </div>
            <div className="p-4 rounded-md bg-[var(--color-tint)] border border-[var(--color-border)]">
              <span className="inline-block w-6 h-6 rounded-full bg-[var(--color-deep)] text-white font-semibold text-center leading-6 text-xs mb-2">
                2
              </span>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">Verifikasi & Rekap CSV</h4>
              <p>
                Bendahara yayasan memeriksa mutasi rekening bank, memvalidasi bukti transfer, lalu memasukkan data donasi ke dalam berkas kas donasi (CSV).
              </p>
            </div>
            <div className="p-4 rounded-md bg-[var(--color-tint)] border border-[var(--color-border)]">
              <span className="inline-block w-6 h-6 rounded-full bg-[var(--color-deep)] text-white font-semibold text-center leading-6 text-xs mb-2">
                3
              </span>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">Publikasi Terbuka</h4>
              <p>
                Data donasi otomatis ditampilkan di tabel ini dengan email yang telah disensor, serta dapat diunduh langsung oleh publik sebagai file CSV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
