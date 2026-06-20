<!-- BEGIN:nextjs-agent-rules -->

# AI Agents Context: Teras Foto Studio Frontend

You are a Senior Frontend Engineer with 10+ years of experience. You build highly optimized, accessible, and maintainable web applications using Next.js (App Router) and Tailwind CSS.

## Project Overview

Teras Foto Studio is a multi-room booking engine and POS management dashboard. The frontend consumes a local Express.js backend API (`http://localhost:3000/api`).

## Agent Role Assignment

When assisting with this project, assume the role of a Senior Frontend Engineer. Your primary directive is to deliver clean, modern Next.js 15+ code utilizing the App Router and React Compiler.

## Architecture Directory

- `src/app/`: Next.js Routing. Use `(grouping)` to separate `(auth)`, `(dashboard)`, and `(public)` routes without affecting the URL.
- `src/components/ui/`: Atomic, domain-agnostic UI primitives (e.g., `Button.jsx`, `Input.jsx`).
- `src/components/features/`: Domain-aware components (e.g., `BookingCalendar.jsx`, `RoomCard.jsx`).
- `src/components/layout/`: Komponen struktural halaman (Navbar, Footer, Sidebar).
- `src/contexts/`: React Context providers (misal: AuthContext) untuk state global.
- `src/hooks/`: Custom React hooks (strictly for client-side).
- `src/lib/`: API clients, fetch wrappers, and third-party integrations.
- `src/utils/`: Pure JavaScript utilities (`cn.js`, formatters, etc).

## API Integration Rules

- Base API URL is `http://localhost:3000/api`.
- For public APIs (e.g., fetching packages/rooms), perform the fetch directly in the Next.js Server Component.
- For protected APIs (Owner/Cashier dashboard), extract the JWT from the cookies before making the server-side fetch.

## Design System (Tailwind)

- **Mobile First:** All layouts must be responsive. Start with mobile classes, then use `md:`, `lg:`.
- **Spacing & Colors:** Use Tailwind defaults. Maintain generous padding/margins for touch targets (Gen Z user base).
- **Dark Mode:** Optional for now, but use Tailwind's `dark:` classes intelligently if requested.

# Agents Rules: Teras Foto Studio Frontend

You are a Senior Frontend Engineer with 10+ years of experience. You build highly optimized, accessible, and maintainable web applications using Next.js (App Router) and Tailwind CSS.

## 1. Core Principles

- **Server First:** Default to React Server Components (RSC). Push `'use client'` as far down the component tree as possible. Only use it when strictly necessary (hooks, event listeners, browser APIs).
- **Composition over Configuration:** Avoid massive prop drilling. Use `children` and slot patterns.
- **Predictability:** Keep components small (< 200 lines). Extract reusable logic.
- **User First:** Performance is a feature. Avoid premature optimization, but never compromise on LCP and CLS.

## 2. Tech Stack & Styling

- **Next.js App Router:** Strictly use `app/` directory.
- **Tailwind CSS:** Use it for all styling. Build a `cn()` utility (`clsx` + `tailwind-merge`) to handle class conflicts safely.
- **Variant Authority:** Use `class-variance-authority` (CVA) for complex UI components (Buttons, Badges, etc).
- **Images & Links:** STRICTLY use `next/image` (`<Image>`) and `next/link` (`<Link>`). Never use raw `<img>` or `<a>` tags for internal assets/routing.

## 3. Data Fetching & State

- **Server Fetching:** Use native `fetch` in Server Components for initial data load. Handle caching and revalidation using Next.js `next: { revalidate }` or `cache: 'no-store'`.
- **Client Fetching:** For client-side data fetching (or polling), use `swr`. DO NOT use manual `useEffect` + `fetch`.
- **Forms:** Use `react-hook-form` paired with `@hookform/resolvers/zod` for validation.
- **Race Conditions:** Use `AbortController` or `swr` to handle request cancellations.

## 4. Error Handling & Accessibility (A11y)

- **A11y:** Ensure semantic HTML. Forms must have `<label>`, buttons must have `aria-label` if icon-only. Focus states must be visible (`focus-visible:ring`).
- **Boundaries:** Implement `loading.jsx` (Skeletons, not spinners) and `error.jsx` for all major route segments.

## 5. Security & Env

- Never prefix sensitive environment variables with `NEXT_PUBLIC_`.

Berikut adalah versi **REVISI TERBARU** dari PRD Web Teras Foto Studio:

---

# PRD: Web Teras Foto Studio

## 1. Overview

Web Teras Foto Studio adalah platform reservasi dan sistem manajemen operasional berbasis web terintegrasi. Produk ini dirancang untuk mendigitalisasi proses _booking_ studio foto secara _real-time_ bagi pelanggan dengan **dukungan multi-ruangan dan multi-layanan secara bersamaan (_concurrent bookings_)**.

Sistem ini terintegrasi dengan _payment gateway_, sekaligus menyediakan _dashboard_ terpusat untuk kasir dan pemilik (Owner) demi meminimalisir _human error_, mengelola penjadwalan paralel, serta mengamankan data keuangan melalui pemisahan hak akses.

## 2. Problem Statement

Saat ini, Teras Foto Studio menghadapi beberapa tantangan utama:

- **Risiko Bentrok Jadwal di Banyak Ruangan:** Dengan banyaknya layanan dan ruangan yang beroperasi bersamaan, pencatatan manual di _Spreadsheet_ sangat rawan tumpang tindih (_double booking_) pada ruangan yang sama.
- **Inefisiensi Pemesanan:** Pelanggan harus menunggu admin mengecek ketersediaan jam secara manual satu per satu pada ruangan yang diminati pelanggan.
- **Informasi Tidak Terstruktur:** Portofolio statis di Instagram menyulitkan pelanggan menemukan paket spesifik.
- **Kurangnya Kontrol Keamanan (Manajerial vs Operasional):** Tidak ada pemisahan hak akses _Spreadsheet_ operasional, yang meningkatkan risiko manipulasi data keuangan.

## 3. Goals & Objectives

- **Digitalisasi Skala Multi-Ruangan:** Mengotomatisasi sistem kalender agar dapat menghandle reservasi paralel pada berbagai layanan/ruangan di waktu yang sama tanpa bentrok.
- **Peningkatan Layanan Pelanggan:** Memberikan fasilitas _self-service booking_ dengan kalender cerdas yang memfilter jadwal kosong berdasarkan layanan yang dipilih pelanggan.
- **Efisiensi Multi-User:** Memisahkan wewenang antara Owner (manajerial) dan Kasir (operasional).
- **Akurasi Keuangan & Operasional:** Merekam transaksi secara presisi dan mudah direkonsiliasi.

## 4. Target Users / User Persona

1.  **Customer (Gen Z):** Menyukai kepraktisan, ingin memilih layanan spesifik, melihat jadwal kosong di layanan tersebut secara _real-time_, dan terbiasa dengan transaksi _online_.
2.  **Kasir (Internal):** Staf di lokasi. Membutuhkan kalender master (_Master Calendar_) untuk melihat jadwal dari _semua ruangan_ secara bersamaan agar mudah mengarahkan pelanggan yang baru datang.
3.  **Super Admin / Owner (Internal):** Pemilik studio yang fokus pada pengembangan bisnis. Membutuhkan fitur untuk menambah ruangan baru, mengedit layanan, dan memantau performa tiap layanan.

## 5. User Stories

**Customer:**

- Sebagai pelanggan, saya ingin memilih jenis layanan yang saya inginkan, dan sistem hanya menampilkan kalender jadwal kosong untuk layanan/ruangan tersebut.
- Sebagai pelanggan, saya ingin bisa membayar DP atau Full via Midtrans agar pesanan otomatis terkonfirmasi.
- Sebagai pelanggan, saya ingin bisa mengajukan _reschedule_ maksimal H-3.

**Kasir:**

- **Sebagai kasir, saya ingin melihat _Master Calendar_ harian yang menampilkan kolom/jadwal dari seluruh ruangan secara berdampingan, agar saya tahu siapa yang menggunakan ruangan apa pada jam ini.**
- Sebagai kasir, saya ingin mengubah status _booking_ menjadi "Hadir".
- Sebagai kasir, saya ingin bisa menyetujui (_Approve_) atau menolak pengajuan _reschedule_ pelanggan.

**Owner/Super Admin:**

- **Sebagai owner, saya ingin bisa membuat Ruangan (Room A, Room B, dst) dan menghubungkan Layanan tertentu ke ruangan tersebut, agar sistem tahu kapasitas maksimal per waktu.**
- Sebagai owner, saya ingin bisa memblokir jadwal (_override_) pada layanan/ruangan tertentu saja (misal: Ruang A sedang direnovasi, tapi Ruang B tetap buka).
- Sebagai owner, saya ingin melihat laporan performa dan pendapatan.

## 6. Functional Requirements

Sistem akan dibangun dalam basis Web App dan dibagi menjadi 3 pilar utama:

**A. Customer Portal (Public Facing)**

- **Booking Engine (Multi-Service Logic):**
  - Pelanggan memilih **Layanan/Paket** terlebih dahulu.
  - Sistem membaca relasi layanan terhadap ruangan, lalu menampilkan kalender interaktif yang memfilter _slot_ tersedia _hanya_ untuk ruangan/layanan tersebut.
  - Sistem mendukung _concurrent booking_ (beberapa transaksi bisa masuk di jam 10:00 pagi selama paket/layanan yang dibooking menggunakan ruangan yang berbeda).
  - Sistem reservasi memiliki **durasi waktu dinamis** berdasarkan paket.
- **Payment Gateway (Midtrans):**
  - Opsi: _Down Payment_ (DP) atau Pembayaran Penuh (_Full_).
  - _Batas Waktu Pembayaran:_ Maks. 1 jam (_Expired_ otomatis).
- **Customer Dashboard & Booking Management:**
  - **Cancel Booking:** Peringatan bahwa uang DP hangus.
  - **Fitur Pengajuan Reschedule:** Maks 1 kali, Maks H-3, wajib isi alasan, dan sistem akan mengunci (_reserve_) sementara jadwal pengganti yang dipilih di ruangan yang sama hingga disetujui kasir.
- **Sistem Notifikasi:** Melalui **Email** dan _update_ di **Dashboard Web**.

**B. Cashier Dashboard (Operasional)**

- **Master Schedule Board:** Antarmuka kalender harian (seperti _timetable/Gantt Chart_) yang menampilkan jadwal terbagi berdasarkan Ruangan/Layanan (Kolom Ruang A, Kolom Ruang B, dll) untuk memonitor operasional paralel.
- **Validasi Kedatangan:** Mengubah status ("Pending" -> "Hadir" -> "Selesai").
- **Manajemen Approval Reschedule:** Menyetujui atau menolak pengajuan ubah jadwal dari pelanggan.
- **Sistem Add-on:** Input layanan ekstra di lokasi (cetak, tambah durasi, dll).
- **Manajemen Cetak:** Antrean urutan cetak foto yang sudah dibayar.

**C. Super Admin / Owner Dashboard (Manajerial)**

- **Manajemen Ruangan (Room Management):** Fitur CRUD untuk mendaftarkan ruangan fisik yang ada di studio (Misal: Studio 1, Studio 2, Self-Photo Room).
- **Manajemen Paket & Produk (Service Mapping):** Fitur CRUD Paket. Owner wajib memetakan (_mapping_) Paket ini akan menggunakan Ruangan mana, durasinya berapa lama, harganya, dan fotonya.
- **Manajemen Penutupan Jadwal:** Memblokir jadwal bisa dilakukan secara global (Tutup Studio penuh) atau spesifik (Tutup Studio 1 saja).
- **Analisis & Laporan Keuangan:** _Dashboard analytics_ Harian/Bulanan/Tahunan.

## 7. Non-Functional Requirements

- **Tech Stack:**
  - **Frontend:** Next.js (JavaScript) dengan Tailwind CSS.
  - **Backend:** Express.js (JavaScript) dengan Prisma ORM.
  - **Database:** MySQL (Relasi tabel harus mendukung arsitektur _One-to-Many_ atau _Many-to-Many_ antara entitas `Rooms`, `Services`, dan `Bookings`).
- **Hosting & Deployment:** Infrastruktur **Vercel** untuk Frontend dan Backend.
- **Payment Gateway:** Midtrans Core API / Snap API.
- **Responsivitas:** UI/UX wajib mendukung tampilan _Mobile_ secara sempurna.
- **Keamanan Data:** JSON Web Tokens (JWT) dan _Role-Based Access Control_ (RBAC).

## 8. Out of Scope

- Pembuatan aplikasi _Mobile Native_ (Android APK / iOS App).
- Integrasi otomatis WhatsApp Notifikasi (Gateway WA).
- Integrasi dengan mesin kasir fisik (_Hardware_ Printer POS / _Cash Drawer_).
- Integrasi dengan software akuntansi pihak ketiga seperti Jurnal/Accurate.
- Sistem pengembalian dana (_Refund_) otomatis via API.

## 9. Success Metrics

1.  **0% Kejadian _Double Booking_ Per Ruangan:** Validasi sistem harus memastikan tidak ada dua pelanggan di jam yang sama pada _ruangan_ yang sama.
2.  **Kesesuaian Keuangan:** 100% kecocokan laporan sistem vs uang tunai fisik.
3.  **Optimalisasi Kapasitas Studio:** Kemampuan melayani reservasi secara serentak (_concurrent_) berjalan lancar.

## 10. Timeline

**Tenggat Waktu Akhir (Final Launch):** 30 Mei 2026.
_(Estimasi fase pengerjaan [ASUMSI])_

- **Q3 2025:** Tahap Riset UI/UX dan Desain Prototype (Figma).
- **Q4 2025:** Pengembangan Backend, Arsitektur Database Multi-Ruangan (MySQL & Prisma), & Integrasi Midtrans.
- **Q1 2026:** Pengembangan Frontend (Next.js & Tailwind).
- **Maret - April 2026:** _System Integration Testing_, _User Acceptance Testing_ (UAT), dan _Bug Fixing_.
- **Mei 2026:** Masa Transisi, _Training_ Kasir, dan Peluncuran Resmi (Go-Live).

---

**Catatan untuk Developer (Tim Backend/Database):**
Karena ada penambahan fitur Multi-Ruangan dan Layanan, relasi Prisma schema (_database_) nantinya harus dikonsep dengan matang. Pastikan validasi _availability_ jadwal tidak sekadar mengecek `waktu_booking`, melainkan kombinasi pengecekan `waktu_booking` _overlap_ dan `room_id`.

Revisi ini membuat aplikasi web Teras Foto Studio jauh lebih _scalable_ (bisa dikembangkan jika sewaktu-waktu studio membuka cabang atau menambah gedung baru). Silakan jika ada detail lain yang ingin ditambahkan!

<!-- END:nextjs-agent-rules -->
