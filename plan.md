# Instruksi Kerja Refactoring Frontend Teras Foto Studio

Dokumen ini berisi daftar instruksi kerja terperinci yang dirancang untuk dieksekusi oleh _Junior Programmer_ atau _AI Agent_. Kerjakan langkah-langkah di bawah ini secara sistematis dari Prioritas 1 (Critical) hingga Prioritas 3 (Minor). Pastikan setelah mengerjakan setiap task, kode selalu berhasil di-_compile_ (`npm run build` / `npm run dev`) dan linter berjalan tanpa error (`npm run lint`).

---

## 🔴 PRIORITAS 1: CRITICAL (Wajib dikerjakan pertama)

### Task 1.1: Refactor Halaman Menjadi Server Components

Sebagian besar file `page.jsx` langsung menggunakan `'use client'` di baris teratas, yang mematikan manfaat Next.js Server Components.

**Langkah Pengerjaan:**

1. Buka file-file utama `page.jsx` berikut secara bertahap:
   - `src/app/admin/dashboard/page.jsx`
   - `src/app/cashier/page.jsx`
   - `src/app/(public)/portofolio/page.jsx`
   - `src/app/admin/bookings/page.jsx`
   - `src/app/admin/rooms/page.jsx`
2. **Hapus** tulisan `'use client';` dari baris paling atas di file `page.jsx` tersebut.
3. Analisis isi file. Jika komponen menggunakan _Hooks_ (seperti `useState`, `useEffect`, `useSWR`) atau _Event Handlers_ (seperti `onClick`, `onChange`):
   - Buat file baru di direktori yang sesuai (misal: `src/components/features/dashboard/DashboardClient.jsx`).
   - Pindahkan seluruh logika _Client_ dan JSX yang interaktif tersebut ke file baru ini.
   - Tambahkan `'use client';` **hanya** pada file baru ini.
4. Di file `page.jsx` asal (yang sekarang sudah menjadi Server Component), _import_ komponen Client yang baru dibuat dan _render_ di dalam JSX.

### Task 1.2: Perbaikan Pengambilan Data Client (Ganti `useEffect` dengan `useSWR`)

Di komponen kalender booking, ada pengambilan data yang dilakukan secara manual dengan `useEffect`. Ini melanggar aturan penggunaan `swr`.

**Langkah Pengerjaan:**

1. Buka file `src/components/features/booking/BookingWidget.jsx`.
2. Cari `useEffect` (sekitar baris 72) yang melakukan `api.get` untuk memuat data _Occupied Slots_.
3. Hapus blok `useEffect` dan state `occupiedSlots` manual (`useState`).
4. Ganti menggunakan sintaks SWR deklaratif:
   ```javascript
   const { data: occupiedSlots, error, isLoading } = useSWR(
     selectedService ? `/bookings/availability?start_date=${start}&end_date=${end}&room_id=${roomId}` : null,
     fetcher
   );
   ```
5. Sesuaikan variabel di dalam komponen agar menggunakan `occupiedSlots` yang berasal dari balikan `useSWR`.

### Task 1.3: Implementasi Fetching Data Awal (Initial Data Load) di Server

Server Component saat ini jarang mengambil data secara native.

**Langkah Pengerjaan:**

1. Pada file Server Component yang telah di-refactor di **Task 1.1** (misalnya halaman Portofolio Publik), gunakan fungsi `fetch()` asli bawaan Next.js untuk memuat data.
2. Contoh: `const res = await fetch('http://localhost:3000/api/portofolio', { next: { revalidate: 60 } });`
3. Oper data hasil _fetch_ tersebut sebagai _props_ (misalnya `initialData={data}`) ke komponen Client-nya agar saat render awal, halaman langsung berisi data tanpa menunggu loading client-side.

---

## 🟠 PRIORITAS 2: MAJOR (Pembenahan UI, Maintainability, & Kualitas Kode)

### Task 2.1: Migrasi `<img>` HTML ke `<Image>` Next.js

**Langkah Pengerjaan:**

1. Buka file `src/components/features/services/CreateServiceForm.jsx`.
2. Cari tag HTML standar `<img src={...} />` (sekitar baris 154).
3. Ubah menjadi `<Image src={...} alt="..." width={...} height={...} />`.
4. Pastikan menambahkan import `import Image from 'next/image';` di atas file.
5. (Jika ada file lain, lakukan pencarian regex `<img ` di folder `src` dan terapkan langkah yang sama).

### Task 2.2: Gunakan Komponen UI `<Button>` Alih-Alih Tag HTML `<button>`

Saat ini banyak tombol dibuat manual menggunakan class Tailwind yang panjang padahal sudah ada komponen spesifik `Button.jsx` berbasis CVA.

**Langkah Pengerjaan:**

1. Cari tag `<button className="...">` yang bersifat tombol utama/sekunder (terutama di dalam `admin/analytics/page.jsx`, `admin/dashboard/page.jsx`, `admin/bookings/page.jsx`).
2. _Import_ komponen tombol yang benar: `import { Button } from '@/components/ui/Button';`
3. Ganti tag manual dengan `<Button variant="primary" size="md">Teks Tombol</Button>`.
4. Sesuaikan `variant` dan `size` yang ada di CVA `Button.jsx`.

### Task 2.3: Menggunakan utilitas `cn()` untuk Dynamic Styling

**Langkah Pengerjaan:**

1. Buka file-file yang sering memanipulasi string class secara manual (seperti `BookingWidget.jsx`, `CreateServiceForm.jsx`, dan `admin/bookings/page.jsx`).
2. Import fungsi `cn`: `import { cn } from '@/utils/cn';`.
3. Temukan sintaks yang terlihat seperti ini:
   ``className={`w-full px-5 py-4 ${errors.room_id ? 'border-red-500' : 'border-gray-200'}`}``
4. Ubah menjadi rapi menggunakan `cn`:
   `className={cn("w-full px-5 py-4", errors.room_id ? "border-red-500" : "border-gray-200")}`

### Task 2.4: Memecah Komponen Monolitik `BookingWidget.jsx`

File ini memiliki >600 baris kode yang melanggar aturan "_Keep components small (< 200 lines)_".

**Langkah Pengerjaan:**

1. Buat folder/file baru di `src/components/features/booking/`:
   - `CalendarGrid.jsx` (untuk me-render kotak kalender bulan/hari)
   - `TimeSlotSelector.jsx` (untuk me-render pilihan waktu jam)
   - `BookingSummaryPanel.jsx` (untuk panel rincian di sebelah kanan/bawah)
2. Pindahkan logika, _state_, dan bagian _return JSX_ dari `BookingWidget.jsx` ke dalam masing-masing file baru tersebut.
3. Import kembali file-file tersebut ke dalam `BookingWidget.jsx` dengan passing `props` dan _callback_ (misalnya `onDateSelect`, `onTimeSelect`).

---

## 🟡 PRIORITAS 3: MINOR (Aksesibilitas A11y & Standar Form)

### Task 3.1: Menambahkan `aria-label` pada Tombol Ikon

Banyak tombol navigasi (Next/Prev) atau tombol Edit/Hapus yang hanya memuat _icon_ (SVG / Lucide). Jika dibiarkan, pengguna tuna netra (dengan _screen reader_) tidak tahu apa fungsi tombol tersebut.

**Langkah Pengerjaan:**

1. Buka file seperti `admin/dashboard/page.jsx` (baris 291), `admin/bookings/page.jsx` (baris 367), dan `BookingHistoryPreview.jsx` (baris 94).
2. Temukan `<button>` atau `<Button>` yang isinya hanya berupa ikon.
3. Tambahkan `aria-label="Teks Deskriptif"`.
   - Contoh: `<button aria-label="Lihat detail pesanan" className="..."><EyeIcon/></button>`

### Task 3.2: Migrasi Form ke react-hook-form & Zod

**Langkah Pengerjaan:**

1. Temukan form kecil atau modal di halaman pengaturan admin yang masih mengandalkan kontrol manual (`onChange={(e) => setVal(e.target.value)}`).
2. Import `useForm` dari `react-hook-form` dan `zodResolver` dari `@hookform/resolvers/zod`.
3. Buat skema konstan `z.object({ ... })`.
4. Ganti properti `value` & `onChange` dengan menyebarkan fungsi register: `{...register('nama_field')}`.
5. Tangani pesan error secara otomatis lewat objek `errors`.

---

_Instruksi: Jangan mengerjakan semua hal sekaligus dalam satu proses Pull Request (PR) atau komit dan buat branch baru berdasarkan task yang dikejakan jangan commit ke branch main. Kerjakan secara berurutan, selesaikan per Task (Misalnya: Kerjakan Task 1.1 terlebih dahulu, lalu komit, uji coba, baru melangkah ke Task 1.2)._
