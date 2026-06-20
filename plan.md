# Master Implementation Plan: Teras Foto Studio Frontend Refactoring

> **For AI Implementer:** Selesaikan rencana kerja ini secara sekuensial (task-by-task). Jangan melompat ke tugas berikutnya sebelum tugas aktif berhasil lolos uji build (`npm run build`) dan linting (`npm run lint`). Lakukan git commit pada setiap penyelesaian tugas.

**Goal:** Mengembalikan arsitektur Next.js 16 App Router ke jalur yang benar sesuai prinsip *Server-First* (RSC), membersihkan pelanggaran aksesibilitas (A11y), dan merapikan data fetching menggunakan SWR deklaratif.

**Architecture:** Memindahkan seluruh logika interaktif (client-side hooks, state, event handlers) dari file routing `page.jsx` (yang harusnya merupakan Server Component murni) ke dalam komponen Client terdedikasi di folder `src/components/features/`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, SWR, Lucide React, class-variance-authority (CVA).

---

## 🔴 PRIORITAS 1: CRITICAL (RSC Migration & Server-First Audit)

### Task 1.1: Refactor Manajemen Layanan Admin (`/admin/services`)
**Objective:** Mengubah rute halaman `/admin/services` menjadi Server Component steril dan memindahkan interaksi ke Client Component.

**Files:**
- Modify: `src/app/admin/services/page.jsx`
- Create: `src/components/features/services/AdminServicesClient.jsx`

**Step 1: Buat Komponen Klien Baru**
Create `src/components/features/services/AdminServicesClient.jsx` dan pindahkan seluruh logika state, fetch SWR, dan UI dari halaman sebelumnya:

```jsx
'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getAdminServices, deleteService } from '@/lib/services/serviceService';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Trash2, Loader2, AlertCircle, Camera, Clock, Tag } from 'lucide-react';
import { formatRupiah } from '@/utils/format';

export default function AdminServicesClient({ initialServices }) {
	const [deletingId, setDeletingId] = useState(null);
	const [error, setError] = useState(null);

	const {
		data: servicesResponse,
		error: fetchError,
		isLoading,
	} = useSWR('/admin/services', () => getAdminServices(), {
		fallbackData: { data: initialServices }
	});

	const services = servicesResponse?.data || [];

	const handleDelete = async id => {
		if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;
		setDeletingId(id);
		setError(null);
		try {
			await deleteService(id);
			mutate('/admin/services');
		} catch (err) {
			setError(err.message || 'Gagal menghapus layanan.');
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
			{/* ... pindahkan seluruh JSX dari page.jsx asli ke sini ... */}
		</div>
	);
}
```

**Step 2: Ubah File Routing Menjadi Server Component**
Tulis ulang `src/app/admin/services/page.jsx` agar steril dari `'use client'` dan mengambil data awal di server:

```jsx
import { cookies } from 'next/headers';
import AdminServicesClient from '@/components/features/services/AdminServicesClient';

export default async function AdminServicesPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	let initialServices = [];
	try {
		const res = await fetch('http://localhost:3000/api/admin/services', {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			cache: 'no-store', // SSR real-time
		});
		if (res.ok) {
			const json = await res.json();
			initialServices = json.data;
		}
	} catch (err) {
		console.error('Error pre-fetching services on server:', err);
	}

	return <AdminServicesClient initialServices={initialServices} />;
}
```

**Step 3: Jalankan Verifikasi**
Uji keselarasan kompilasi Next.js:
- Perintah: `npm run build`
- Expected: Build berhasil tanpa error SSR / Hydration mismatch.

**Step 4: Commit Perubahan**
```bash
git add src/app/admin/services/page.jsx src/components/features/services/AdminServicesClient.jsx
git commit -m "feat: refactor admin services page to RSC pattern"
```

---

### Task 1.2: Refactor Antrean Cetak Kasir (`/cashier/print-queue`)
**Objective:** Mengubah rute halaman `/cashier/print-queue` menjadi Server Component steril dan memindahkan interaksi Kanban ke Client Component.

**Files:**
- Modify: `src/app/cashier/print-queue/page.jsx`
- Create: `src/components/features/dashboard/PrintQueueClient.jsx`

**Step 1: Buat Komponen Klien Baru**
Create `src/components/features/dashboard/PrintQueueClient.jsx` dan pindahkan antarmuka Kanban antrean cetak:

```jsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Printer, CheckCircle, Clock, User, Package, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

const fetcher = url => api.get(url).then(res => res.data);

export default function PrintQueueClient({ initialQueues, initialDate }) {
	const [selectedDate, setSelectedDate] = useState(initialDate);

	const {
		data: queues,
		error,
		isLoading,
		mutate,
	} = useSWR(`/print-queues?date=${selectedDate}`, fetcher, {
		fallbackData: initialQueues
	});

	const handleUpdateStatus = async (queueId, newStatus) => {
		try {
			await api.put(`/print-queues/${queueId}/status`, { queue_status: newStatus });
			mutate();
		} catch (error) {
			alert('Gagal memperbarui status antrean cetak');
		}
	};

	// Filter data based on status
	const waitingQueues = queues?.filter(q => q.queue_status === 'waiting') || [];
	const printingQueues = queues?.filter(q => q.queue_status === 'printing') || [];
	const doneQueues = queues?.filter(q => q.queue_status === 'done') || [];

	return (
		<div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
			{/* ... salin seluruh sisa JSX render dan komponen anak <PrintCard> di sini ... */}
		</div>
	);
}
```

**Step 2: Ubah Halaman Rute Menjadi Server Component**
Ubah file `src/app/cashier/print-queue/page.jsx`:

```jsx
import { cookies } from 'next/headers';
import { format } from 'date-fns';
import PrintQueueClient from '@/components/features/dashboard/PrintQueueClient';

export default async function PrintQueuePage({ searchParams }) {
	const resolvedSearchParams = await searchParams;
	const selectedDate = resolvedSearchParams?.date || format(new Date(), 'yyyy-MM-dd');

	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	let initialQueues = null;
	try {
		const res = await fetch(`http://localhost:3000/api/print-queues?date=${selectedDate}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			cache: 'no-store',
		});
		if (res.ok) {
			const json = await res.json();
			initialQueues = json.data;
		}
	} catch (err) {
		console.error('Error pre-fetching print queues on server:', err);
	}

	return <PrintQueueClient initialQueues={initialQueues} initialDate={selectedDate} />;
}
```

**Step 3: Uji & Commit**
- Perintah: `npm run build`
- Git commit: `git commit -am "feat: refactor print queue to server component"`

---

### Task 1.3: Refactor Persetujuan Reschedule Kasir (`/cashier/reschedules`)
**Objective:** Mengubah rute halaman `/cashier/reschedules` menjadi Server Component steril dan memindahkan interaksi list ke Client Component.

**Files:**
- Modify: `src/app/cashier/reschedules/page.jsx`
- Create: `src/components/features/dashboard/ReschedulesClient.jsx`

**Step 1: Buat Komponen Klien Baru**
Create `src/components/features/dashboard/ReschedulesClient.jsx` untuk menampung fungsi persetujuan reschedule:

```jsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Clock, User, Package, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const fetcher = url => api.get(url).then(res => res.data);

export default function ReschedulesClient({ initialReschedules }) {
	const { data: reschedules, error, isLoading, mutate } = useSWR('/cashier/reschedules', fetcher, {
		fallbackData: initialReschedules
	});
	const [processingId, setProcessingId] = useState(null);

	const handleReview = async (rescheduleId, action) => {
		if (!confirm(`Apakah Anda yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} pengajuan ini?`)) return;
		setProcessingId(rescheduleId);
		try {
			await api.put(`/cashier/reschedules/${rescheduleId}/review`, { action });
			mutate();
		} catch (error) {
			alert(error.response?.data?.message || 'Gagal memproses pengajuan reschedule');
		} finally {
			setProcessingId(null);
		}
	};

	return (
		<div className="p-8">
			{/* ... salin seluruh sisa JSX render dan komponen anak <RescheduleCard> di sini ... */}
		</div>
	);
}
```

**Step 2: Ubah Halaman Rute Menjadi Server Component**
Ubah file `src/app/cashier/reschedules/page.jsx`:

```jsx
import { cookies } from 'next/headers';
import ReschedulesClient from '@/components/features/dashboard/ReschedulesClient';

export default async function ReschedulesPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	let initialReschedules = null;
	try {
		const res = await fetch('http://localhost:3000/api/cashier/reschedules', {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			cache: 'no-store',
		});
		if (res.ok) {
			const json = await res.json();
			initialReschedules = json.data;
		}
	} catch (err) {
		console.error('Error pre-fetching reschedules on server:', err);
	}

	return <ReschedulesClient initialReschedules={initialReschedules} />;
}
```

**Step 3: Uji & Commit**
- Perintah: `npm run build`
- Git commit: `git commit -am "feat: refactor cashier reschedules page to RSC"`

---

## 🟠 PRIORITAS 2: MAJOR (UX, Spacing, & DRY Principles)

### Task 2.1: Pembenahan Semantic HTML di ContactInfo
**Objective:** Menghentikan praktik penyarangan elemen interaktif `<button>` di dalam tag tautan `<a>`.

**Files:**
- Modify: `src/components/features/about/ContactInfo.jsx`

**Step 1: Deteksi Pelanggaran**
Buka file `src/components/features/about/ContactInfo.jsx` sekitar baris 116-140.

**Step 2: Ganti Tag Pembungkus**
Ubah struktur tautan WA dan Maps agar tidak membungkus komponen `<Button>` melainkan memindahkan kelas-kelas styling langsung ke dalam tag `<a>` bermodel tombol atau berikan parameter `as` jika didukung:

*Sebelum:*
```jsx
<a href="https://wa.me/..." target="_blank" rel="noopener noreferrer" className="flex-1">
	<Button variant="primary" size="lg" className="w-full bg-[#705D00] hover:bg-[#5c4b00] rounded-xl ...">
		Kunjungi studio
	</Button>
</a>
```

*Sesudah (Ubah tag pembungkus <a> menjadi tombol murni secara visual):*
```jsx
<a
	href="https://wa.me/6281246078809"
	target="_blank"
	rel="noopener noreferrer"
	className="flex-1 text-center inline-flex items-center justify-center gap-2 px-8 h-11 text-base font-semibold text-white bg-[#705D00] hover:bg-[#5c4b00] rounded-xl shadow-lg shadow-[#705D00]/20 transition-all">
	Kunjungi studio
</a>
```
Lakukan hal yang sama untuk tombol Lihat di Google Maps di bawahnya.

**Step 3: Uji**
- Perintah: `npm run lint`
- Expected: Linter bersih, tidak ada warning nest tag `<button>` inside `<a>`.

---

## 🟢 PRIORITAS 3: MINOR (A11y & Form Standards)

### Task 3.1: Tambahkan `aria-label` untuk Tombol Navigasi Ikon-Only
**Objective:** Memastikan pembaca layar (*screen reader*) memahami aksi tombol ikon.

**Files:**
- Modify: `src/components/features/dashboard/BookingHistoryPreview.jsx`
- Modify: `src/components/features/booking/CalendarGrid.jsx`

**Step 1: Modifikasi Tombol Ikon**
Temukan semua tombol yang hanya membungkus komponen ikon Lucide (seperti `<ChevronLeft />`, `<Eye />`, `<Trash />`) dan tambahkan properti `aria-label`.

*Contoh:*
```jsx
// Sebelum:
<button onClick={prevMonth} className="...">
	<ChevronLeft className="w-5 h-5" />
</button>

// Sesudah:
<button onClick={prevMonth} aria-label="Bulan sebelumnya" className="...">
	<ChevronLeft className="w-5 h-5" />
</button>
```

**Step 2: Commit**
```bash
git commit -am "style: fix semantic html nesting and add a11y aria-labels"
```

---

## 🚦 TAHAP AKHIR: PENGUJIAN INTEGRASI
Jalankan kompilasi penuh:
```bash
npm run lint
npm run build
```
Pastikan status keluar adalah `0` (tidak ada error). Selesai!
