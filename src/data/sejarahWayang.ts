export interface EraData {
	id: string;
	nomor: string;
	judul: string;
	periode: string;
	image: string;
	warna: string;
	r: number;
	g: number;
	b: number;
	narasi: string;
	detail: string[];
	quote?: string;
}

export const SEJARAH_WAYANG: EraData[] = [
	{
		id: "pra-hindu",
		nomor: "I",
		judul: "Pra-Hindu",
		periode: "Sebelum Abad ke-4",
		image: "/era1.webp",
		warna: "#D97742",
		r: 217,
		g: 119,
		b: 66,
		narasi:
			"Sebelum agama Hindu menyentuh tanah Jawa, masyarakat kuno telah memuja roh leluhur yang mereka sebut Hyang. Dari kepercayaan animisme inilah wayang lahir — bukan sebagai hiburan, melainkan ritual sakral memanggil arwah para pendahulu.",
		detail: [
			"Fungsi awal: ritual religius memanggil dan menghormati Ma Hyang",
			"Bentuk: bayangan sederhana dari kulit hewan atau kayu mentah",
		],
		quote:
			"Wayang lahir dari kegelapan api unggun, jauh sebelum ia menjadi seni.",
	},
	{
		id: "hindu-buddha",
		nomor: "II",
		judul: "Hindu-Buddha",
		periode: "Abad ke-4 – ke-15",
		image: "/era2.webp",
		warna: "#C8922A",
		r: 200,
		g: 146,
		b: 42,
		narasi:
			"Masuknya budaya India membawa perubahan besar. Para pujangga Jawa memadukan ritual lokal dengan epos besar Mahabharata dan Ramayana — namun dengan kecerdasan lokal, lahirlah Punakawan: Semar, Gareng, Petruk, Bagong — karakter asli Jawa yang tidak ada dalam versi India manapun.",
		detail: [
			"Adopsi cerita Mahabharata dan Ramayana, diadaptasi ke konteks Jawa",
			"Wayang Kulit Purwa berkembang pesat di era Kediri, Singasari, Majapahit",
			"Prasasti Balitung (abad ke-9) telah menyebut istilah 'Mawayang'",
		],
	},
	{
		id: "wali-songo",
		nomor: "III",
		judul: "Wali Songo",
		periode: "Abad ke-15 – ke-16",
		image: "/era3.webp",
		warna: "#3D5A6C",
		r: 61,
		g: 90,
		b: 108,
		narasi:
			"Ketika Islam datang, hukum agama melarang penggambaran realistis makhluk hidup. Sunan Kalijaga merespons dengan kejeniusan: proporsi wayang diubah total — tangan memanjang, wajah terdistorsi — menjadi simbol, bukan tiruan manusia. Wayang pun menjelma media dakwah paling efektif.",
		detail: [
			"Proporsi tubuh diubah agar tidak menyerupai manusia secara realistis",
			"Wayang menjadi media dakwah — pesan moral Islam disisipkan tanpa menghapus tradisi lama",
			"Sunan Kalijaga menyempurnakan bentuk wayang, kelir, dan kotak wayang",
		],
	},
	{
		id: "kolonial",
		nomor: "IV",
		judul: "Kolonial – Pasca Kemerdekaan",
		periode: "Abad ke-17 – ke-20",
		image: "/era4.webp",
		warna: "#8B6F47",
		r: 139,
		g: 111,
		b: 71,
		narasi:
			"Wayang pecah menjadi banyak wujud — Golek dari kayu di tanah Sunda, Wayang Orang yang dimainkan manusia, Wayang Klitik yang pipih. Di masa penjajahan dan perjuangan kemerdekaan, ia berubah fungsi: dari ritual sakral menjadi alat kritik sosial dan pembakar semangat.",
		detail: [
			"Diferensiasi jenis: Wayang Golek, Wayang Orang, Wayang Klitik",
			"Menjadi media kritik sosial dan propaganda perjuangan kemerdekaan",
		],
	},
	{
		id: "modern",
		nomor: "V",
		judul: "Pengakuan Dunia",
		periode: "Abad ke-21",
		image: "/era5.webp",
		warna: "#A8892A",
		r: 168,
		g: 137,
		b: 42,
		narasi:
			"Pada 7 November 2003, UNESCO menetapkan wayang sebagai Mahakarya Warisan Budaya Lisan dan Takbenda Manusia. Namun pengakuan dunia bukan akhir cerita — ia terus hidup lewat tangan-tangan muda yang mewarisi keterampilan ini, dari generasi ke generasi, di bawah rimbun bambu yang sama.",
		detail: [
			"7 November 2003 — UNESCO: Masterpiece of Oral and Intangible Heritage of Humanity",
			"Beradaptasi lewat pertunjukan digital, musik modern, komik, dan game",
		],
		quote:
			"Warisan sejati bukan yang disimpan di museum, melainkan yang diturunkan ke tangan berikutnya.",
	},
];
