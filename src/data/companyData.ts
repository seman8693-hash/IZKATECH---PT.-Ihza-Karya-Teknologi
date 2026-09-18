import { ServiceItem, ProjectItem, BrandPartner, MarketSector } from '../types/site.ts';

export const COMPANY_INFO = {
  name: 'PT. IHZA KARYA TEKNOLOGI',
  brandName: 'IZKATECH',
  tagline: 'Delivering integrated, reliable, and scalable technology solutions.',
  taglineId: 'Menghadirkan solusi teknologi terintegrasi, andal, dan terukur.',
  subheading: 'ICT SYSTEM INTEGRATOR & ME',
  website: 'www.izkatech.com',
  email: 'iingzaenal@gmail.com',
  phoneLandline: '(022) 6372 9430',
  phoneMobile: '+62 812 2383 9205',
  whatsappNumber: '6281223839205',
  socialMedia: {
    facebook: {
      url: 'https://facebook.com/izkatech',
      handle: '@izkatech',
      label: 'Facebook'
    },
    instagram: {
      url: 'https://instagram.com/izkatech',
      handle: '@izkatech',
      label: 'Instagram'
    },
    tiktok: {
      url: 'https://tiktok.com/@izkatech',
      handle: '@izkatech',
      label: 'TikTok'
    }
  },
  address: 'Bukit Mekar Indah Blok B No. 11 - Bandung, Jawa Barat',
  city: 'Bandung',
  province: 'Jawa Barat',
  country: 'Indonesia',
  about: `PT. Ihza Karya Teknologi adalah perusahaan yang bergerak di bidang Informasi dan Teknologi (ICT), perdagangan umum, serta penyedia peralatan IT dan elektronik seperti komputer beserta kelengkapannya, sekaligus berfokus pada perancangan dan pengembangan jaringan komputer, infrastruktur, serta keamanan sistem. Selain itu, kami juga menyediakan layanan Mechanical & Electrical (ME) dalam lingkup terbatas untuk mendukung integrasi sistem teknologi, seperti instalasi kelistrikan dan utilitas pendukung. Dengan didukung tenaga profesional yang berpengalaman dan berintegritas, kami berkomitmen memberikan solusi yang terintegrasi, efektif, dan terpercaya guna memenuhi kebutuhan pelanggan serta mendukung perkembangan teknologi di berbagai sektor.`,
  welcomeMessage: `Selamat datang di PT. Ihza Karya Teknologi, kami mengucapkan terima kasih atas kepercayaan Anda kepada kami sebagai mitra dalam memenuhi kebutuhan teknologi informasi, jaringan, serta sistem pendukung lainnya. Di era digital yang terus berkembang, kami hadir untuk memberikan solusi yang terintegrasi, mulai dari perencanaan, pengadaan, hingga implementasi sistem, termasuk dukungan Mechanical & Electrical (ME) secara terbatas. Dengan komitmen terhadap kualitas, pelayanan terbaik, serta respon yang cepat, kami siap mendukung peningkatan efisiensi dan produktivitas bisnis Anda serta menjalin kerja sama yang berkelanjutan di masa depan.`,
  vision: `Menjadi perusahaan terdepan dan terpercaya di bidang Informasi dan Teknologi yang mampu memberikan solusi inovatif, bernilai tambah, serta berkontribusi dalam mendorong kemajuan dan transformasi digital di berbagai sektor.`,
  mission: [
    `Memberikan solusi teknologi yang terintegrasi dan berorientasi pada kebutuhan pelanggan.`,
    `Menghadirkan produk dan layanan dengan standar kualitas terbaik.`,
    `Memastikan respon yang cepat, tepat, dan profesional dalam setiap pelayanan.`,
    `Didukung oleh sumber daya manusia yang kompeten, berintegritas tinggi, dan berpengalaman di bidangnya.`
  ],
  industryOverview: `Seiring dengan pesatnya perkembangan transformasi digital, kebutuhan akan sistem Informasi dan Teknologi yang terintegrasi, aman, dan andal semakin meningkat di berbagai sektor industri. Infrastruktur jaringan, keamanan sistem, serta dukungan Mechanical & Electrical menjadi elemen penting dalam menunjang operasional yang efisien dan berkelanjutan. Hal ini membuka peluang bagi perusahaan untuk menghadirkan solusi teknologi yang adaptif dan inovatif sesuai dengan dinamika kebutuhan pasar.`,
  competitiveAdvantage: `PT. Ihza Karya Teknologi memiliki keunggulan dalam menghadirkan solusi yang terintegrasi antara sistem ICT dan dukungan Mechanical & Electrical, dengan pendekatan yang berorientasi pada kebutuhan pelanggan. Didukung oleh tenaga profesional yang kompeten, respon yang cepat, serta komitmen terhadap kualitas, kami mampu memberikan layanan yang efektif, efisien, dan terpercaya, sehingga menjadi mitra strategis dalam pengembangan infrastruktur teknologi.`,
  keyPoints: [
    { title: 'Solusi End-to-End ICT & Inovatif', desc: 'Layanan lengkap dari konsultasi, desain arsitektur, pengadaan barang, hingga instalasi dan integrasi menyeluruh.' },
    { title: 'Dukungan ME Sebagai Nilai Tambah', desc: 'Dukungan mekanikal & elektrikal terpadu memastikan catu daya, panel distribusi, dan kelistrikan sistem IT bekerja optimal.' },
    { title: 'Kualitas & Kepuasan Pelanggan Prioritas', desc: 'Standar pengerjaan profesional dengan material berkualitas tinggi dan pengujian komprehensif.' },
    { title: 'Tim Profesional & Responsif', desc: 'Didukung engineer berpengalaman yang siap memberikan respon cepat, tepat sasaran, dan solutif.' },
    { title: 'Mitra Strategis Teknologi Terpercaya', desc: 'Rekam jejak terbukti di berbagai institusi pemerintah, BUMN, perguruan tinggi, dan korporasi swasta.' }
  ]
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'data-center-network',
    title: 'Data Center & Network Infrastructure',
    titleEn: 'Data Center & Network Infrastructure',
    category: 'network',
    description: 'Perancangan, instalasi, dan optimasi infrastruktur jaringan kabel terstruktur (UTP/FTP), serat optik (Fiber Optic), rak server, core switch, dan pusat data modern.',
    descriptionEn: 'Structured cabling, fiber optic backbone, server rack layout, switching, routing, and modern data center deployment.',
    features: [
      'Structured Cabling System (Cat6, Cat6A, Cat7)',
      'Fiber Optic Backbone & Splicing (Single/Multi-mode)',
      'Data Center Rack Management & Cable Organizer',
      'Enterprise Routing, Switching & Wireless Network',
      'Server Room Environment Monitoring'
    ],
    featuresEn: [
      'Structured Cabling System (Cat6, Cat6A, Cat7)',
      'Fiber Optic Backbone & Splicing',
      'Data Center Rack & Cable Management',
      'Enterprise Routing, Switching & Wi-Fi',
      'Server Room Environment Monitoring'
    ],
    brands: ['Cisco', 'Linksys', 'HP Enterprise', 'Panduit'],
    iconName: 'Server'
  },
  {
    id: 'network-security',
    title: 'Network Security',
    titleEn: 'Network Security',
    category: 'security',
    description: 'Sistem perlindungan pertahanan siber menyeluruh melalui Next-Generation Firewall (NGFW), Unified Threat Management (UTM), IPS/IDS, dan konektivitas VPN terenkripsi.',
    descriptionEn: 'Cyber defense through Next-Gen Firewalls, UTM, IPS/IDS, VPN tunnel encryption, and perimeter security.',
    features: [
      'Next-Generation Firewall (NGFW) Configuration',
      'Unified Threat Management (UTM) & Antivirus Gateway',
      'Site-to-Site & Remote Access IPsec/SSL VPN',
      'Bandwidth Management, QoS & Content Filtering',
      'Intrusion Detection & Prevention System (IDS/IPS)'
    ],
    featuresEn: [
      'Next-Gen Firewall (NGFW) Setup',
      'UTM & Gateway Antivirus',
      'Site-to-Site & Remote Access VPN',
      'Bandwidth Management & QoS',
      'IDS/IPS Intrusion Prevention'
    ],
    brands: ['Fortinet', 'Watchguard', 'Sangfor'],
    iconName: 'ShieldCheck'
  },
  {
    id: 'telecommunication',
    title: 'Telecommunication Equipment',
    titleEn: 'Telecommunication Equipment',
    category: 'telecom',
    description: 'Solusi komunikasi suara dan video terpadu melalui IP-PBX, PABX hybrid, IP Phones, interkom industri, dan sistem konferensi audio-visual enterprise.',
    descriptionEn: 'Integrated voice and video communication systems via IP-PBX, hybrid PABX, IP phones, and enterprise video conferencing.',
    features: [
      'IP-PBX & Hybrid PABX Communication Server',
      'Enterprise Video Conference Rooms System',
      'VoIP SIP Trunks, FXO/FXS Gateways',
      'Wireless Intercom & Digital Telephone Sets',
      'Unified Communications & Call Center Integration'
    ],
    featuresEn: [
      'IP-PBX & Hybrid PABX Server',
      'Video Conference Room Solutions',
      'VoIP SIP Trunks & Gateways',
      'Digital Intercom & Telephony',
      'Unified Communications & Call Centers'
    ],
    brands: ['Panasonic', 'Polycom', 'NEC', 'Cisco', 'Alcatel-Lucent'],
    iconName: 'PhoneCall'
  },
  {
    id: 'surveillance-cctv',
    title: 'Surveillance (CCTV Systems)',
    titleEn: 'Surveillance (CCTV Systems)',
    category: 'security',
    description: 'Sistem pemantauan visual berdefinisi tinggi (Full HD/4K), smart analytics (AI object detection, face recognition, LPR), NVR terpusat, dan integrasi VMS berskala luas.',
    descriptionEn: 'High-definition IP surveillance with AI analytics, vehicle license plate recognition, centralized NVR, and multi-site VMS.',
    features: [
      'High-Definition IP Dome, Bullet & PTZ Cameras',
      'Network Video Recorder (NVR) & SAN Storage',
      'AI Video Analytics (People Counting, Face Capture, LPR)',
      'Perimeter Intrusion Detection & Thermal Cameras',
      'Centralized Video Management Software (VMS)'
    ],
    featuresEn: [
      'HD IP Dome, Bullet & PTZ Cameras',
      'NVR & High-Capacity Storage',
      'AI Video Analytics & LPR Recognition',
      'Perimeter & Thermal Cameras',
      'Centralized Multi-Site VMS'
    ],
    brands: ['Hikvision', 'Dahua', 'Avigilon', 'Samsung', 'Uniview'],
    iconName: 'Camera'
  },
  {
    id: 'access-control',
    title: 'Access Control, Fingerprint, RFID & Smart Card',
    titleEn: 'Access Control, Fingerprint, RFID & Smart Card',
    category: 'security',
    description: 'Manajemen otorisasi akses pintu, gerbang barrier gate, turnstile tripod/flap, absensi biometrik (sidik jari, wajah), dan kartu pintar terintegrasi.',
    descriptionEn: 'Access control management for doors, barrier gates, optical turnstiles, biometric scanners, and smart card credentials.',
    features: [
      'Biometric Fingerprint & 3D Facial Recognition Terminal',
      'RFID, Mifare & Smart Card Door Controllers',
      'Pedestrian Speed Gates & Tripod Turnstiles',
      'Time Attendance Software Integration (HRMS)',
      'Elevator & Server Rack Floor Access Management'
    ],
    featuresEn: [
      'Fingerprint & Face Recognition Terminals',
      'RFID / Mifare Smart Card Readers',
      'Pedestrian Flap & Tripod Turnstiles',
      'Time Attendance & HRMS Sync',
      'Elevator & Server Rack Access Control'
    ],
    brands: ['HID', 'Suprema', 'Entry Pass'],
    iconName: 'Fingerprint'
  },
  {
    id: 'fire-alarm',
    title: 'Fire Alarm System',
    titleEn: 'Fire Alarm System',
    category: 'security',
    description: 'Sistem deteksi dini kebakaran dengan instalasi Master Control Fire Alarm (MCFA) addressable / konvensional, smoke detector, heat detector, dan integrasi annunciator.',
    descriptionEn: 'Early fire detection systems including addressable/conventional MCFA panels, smoke/heat sensors, and emergency notification sirens.',
    features: [
      'Addressable & Conventional MCFA Control Panels',
      'Photoelectric Smoke Detectors & Rate-of-Rise Heat Sensors',
      'Manual Call Points, Strobes & Alarm Bells',
      'Emergency Fire Annunciator & Graphic Monitoring',
      'Clean Agent Fire Suppression Integration (FM-200/Novec)'
    ],
    featuresEn: [
      'Addressable & Conventional MCFA Panels',
      'Smoke & Heat Sensor Arrays',
      'Manual Call Points, Strobes & Bells',
      'Graphic Monitoring Station',
      'Fire Suppression Integration'
    ],
    brands: ['Notifier', 'Hooseki'],
    iconName: 'Flame'
  },
  {
    id: 'sound-system',
    title: 'Sound System & Public Address',
    titleEn: 'Sound System & Public Address',
    category: 'telecom',
    description: 'Sistem tata suara gedung untuk paging pengumuman publik, pemutaran background music (BGM), dan integrasi audio evakuasi darurat (Voice Evacuation).',
    descriptionEn: 'Public address and paging systems, multi-zone background music (BGM), and integrated emergency voice evacuation.',
    features: [
      'Public Address (PA) & Zone Selector Systems',
      'Ceiling Speakers, Column Speakers & Horn Speakers',
      'Emergency Voice Alarm (EVAC) Building Integration',
      'Auditorium, Ballroom & Conference Sound Solutions',
      'Power Amplifiers & Audio Mixer Consoles'
    ],
    featuresEn: [
      'PA & Multi-Zone Selector Systems',
      'Ceiling, Column & Outdoor Horn Speakers',
      'Emergency Voice Evacuation (EVAC)',
      'Auditorium & Ballroom Sound Engineering',
      'High-Efficiency Amplifiers & Mixers'
    ],
    brands: ['TOA'],
    iconName: 'Volume2'
  },
  {
    id: 'mechanical-electrical',
    title: 'Mechanical & Electrical (ME) Support',
    titleEn: 'Mechanical & Electrical (ME) Support',
    category: 'me',
    description: 'Penyediaan dan instalasi utilitas kelistrikan pendukung sistem teknologi informasi: panel distribusi kelistrikan, sistem grounding, UPS, dan proteksi daya.',
    descriptionEn: 'Supportive electrical and mechanical utilities: distribution panels, surge protection, grounding systems, and enterprise UPS backup.',
    features: [
      'Instalasi Kelistrikan Ruang Server & Kantor',
      'Panel Distribusi Daya Listrik (LVMDP/Sub-Panel)',
      'Sistem Grounding Elektronik Rendah Hambatan (<1 Ohm)',
      'Uninterruptible Power Supply (UPS) Online Double Conversion',
      'Integrasi Catu Daya Cadangan Genset & Automatic Transfer Switch'
    ],
    featuresEn: [
      'Server Room & Office Power Cabling',
      'Power Distribution Panels & Sub-Panels',
      'Low-Resistance Electronic Grounding (<1 Ohm)',
      'Online Double-Conversion UPS Systems',
      'ATS & Generator Power Backup Integration'
    ],
    brands: ['Schneider', 'APC', 'Legrand', 'Socomec'],
    iconName: 'Zap'
  },
  {
    id: 'hardware-software',
    title: 'Hardware & Software Equipment Supply',
    titleEn: 'Hardware & Software Equipment Supply',
    category: 'hardware',
    description: 'Pengadaan perangkat keras komputer, server, workstation, media penyimpanan data (storage/HDD/SSD), sistem operasi resmi, serta perangkat lunak enterprise.',
    descriptionEn: 'Procurement of enterprise computing hardware, servers, workstations, high-reliability storage, genuine operating systems, and licensed software.',
    features: [
      'Server Rackmount / Tower & High-Performance Workstation',
      'Enterprise Storage Systems (SAN/NAS, SAS, Enterprise HDD/SSD)',
      'Komputer Desktop PC, All-in-One & Laptop Bisnis',
      'Perangkat Jaringan (Managed Switch, Router, AP)',
      'Lisensi Resmi Microsoft Windows Server, Office 365, dll.'
    ],
    featuresEn: [
      'Rackmount/Tower Servers & Workstations',
      'Enterprise SAN/NAS Storage, Enterprise Drives',
      'Commercial PCs & Business Laptops',
      'Managed Switches, Enterprise Routers & APs',
      'Genuine Microsoft & Enterprise Software Licenses'
    ],
    brands: ['Microsoft', 'HP', 'Western Digital', 'Seagate', 'Linksys'],
    iconName: 'Cpu'
  },
  {
    id: 'maintenance-services',
    title: 'Maintenance Services & SLA Support',
    titleEn: 'Maintenance Services & SLA Support',
    category: 'maintenance',
    description: 'Layanan pemeliharaan preventif dan korektif secara berkala untuk memastikan seluruh sistem teknologi, keamanan, dan kelistrikan beroperasi optimal tanpa gangguan.',
    descriptionEn: 'Scheduled preventive and corrective maintenance services with guaranteed Service Level Agreements (SLA) to maximize uptime.',
    features: [
      'Preventive Maintenance (Pembersihan, Cek Suhu, Audit Fisik)',
      'Corrective Maintenance & Troubleshooting Darurat',
      'Perjanjian Tingkat Layanan (SLA) Respons Terjamin',
      'Audit Jaringan, Keamanan & Pengujian Kelistrikan Berkala',
      'Dukungan Tim Teknis On-Site & Remote Konsultasi'
    ],
    featuresEn: [
      'Scheduled Preventive Maintenance & Health Checks',
      'Emergency Corrective Troubleshooting',
      'Guaranteed Service Level Agreement (SLA)',
      'Network & Security Periodic Audits',
      'On-Site & Remote Technical Engineering Support'
    ],
    brands: ['IZKATECH Certified Engineering'],
    iconName: 'Wrench'
  }
];

export const BRAND_PARTNERS: BrandPartner[] = [
  // CCTV
  { name: 'Hikvision', category: 'CCTV & Video Surveillance', categoryKey: 'cctv' },
  { name: 'Dahua', category: 'CCTV & Video Surveillance', categoryKey: 'cctv' },
  { name: 'Avigilon', category: 'AI High-End Surveillance', categoryKey: 'cctv' },
  { name: 'Samsung', category: 'Surveillance & Display', categoryKey: 'cctv' },
  { name: 'Uniview', category: 'IP Video Surveillance', categoryKey: 'cctv' },
  
  // ACCESS CONTROL
  { name: 'HID', category: 'Identity & Access Control', categoryKey: 'access' },
  { name: 'Suprema', category: 'Biometrics & Access Security', categoryKey: 'access' },
  { name: 'Entry Pass', category: 'Access Control Systems', categoryKey: 'access' },

  // NETWORK SECURITY
  { name: 'Fortinet', category: 'Next-Gen Firewall & Security', categoryKey: 'security' },
  { name: 'Watchguard', category: 'Network Security & UTM', categoryKey: 'security' },
  { name: 'Sangfor', category: 'HCI & Cyber Security', categoryKey: 'security' },

  // TELECOMMUNICATION EQUIPMENT
  { name: 'Cisco', category: 'Enterprise Network & Telecom', categoryKey: 'telecom' },
  { name: 'Panasonic', category: 'PBX & Business Telephony', categoryKey: 'telecom' },
  { name: 'Polycom', category: 'Video Conferencing Solutions', categoryKey: 'telecom' },
  { name: 'NEC', category: 'Unified Communications & PBX', categoryKey: 'telecom' },
  { name: 'Alcatel-Lucent', category: 'Enterprise Telecommunication', categoryKey: 'telecom' },

  // HARDWARE & SOFTWARE SUPPLY
  { name: 'Microsoft', category: 'Enterprise Software & Cloud', categoryKey: 'supply' },
  { name: 'HP', category: 'Server, PC & Workstation', categoryKey: 'supply' },
  { name: 'Western Digital', category: 'Enterprise Storage & Drives', categoryKey: 'supply' },
  { name: 'Seagate', category: 'Data Center Storage Solutions', categoryKey: 'supply' },
  { name: 'Linksys', category: 'Network Connectivity Gear', categoryKey: 'supply' },
  { name: 'Notifier', category: 'Advanced Fire Alarm Systems', categoryKey: 'supply' },
  { name: 'Hooseki', category: 'Fire Protection & Detection', categoryKey: 'supply' },
  { name: 'TOA', category: 'Commercial Public Address & Audio', categoryKey: 'supply' }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'mensa-mitra-medika',
    name: 'R&D Center PT. Mensa Mitra Medika',
    location: 'Indonesia',
    city: 'Nasional',
    sector: 'healthcare',
    sectorLabel: 'R&D & Farmasi',
    status: 'On Going',
    scope: 'Pembangunan infrastruktur jaringan data, sistem keamanan terintegrasi, dan utilitas instalasi kelistrikan ruang laboratorium R&D.',
    highlight: true
  },
  {
    id: 'beltway-office-tower',
    name: 'Beltway Office Tower',
    location: 'Jakarta',
    city: 'Jakarta Selatan',
    sector: 'commercial',
    sectorLabel: 'Gedung Perkantoran',
    status: 'Completed',
    scope: 'Instalasi jaringan backbone komunikasi, pengawasan CCTV terpusat, dan sistem akses kontrol pintu perkantoran premium.',
    highlight: true
  },
  {
    id: 'kejaksaan-musirawas',
    name: 'Kantor Kejaksaan Musirawas',
    location: 'Palembang, Sumatera Selatan',
    city: 'Palembang',
    sector: 'government',
    sectorLabel: 'Instansi Pemerintah',
    status: 'Completed',
    scope: 'Implementasi sistem keamanan surveillance, jaringan komputer terintegrasi, dan perangkat telekomunikasi kantor dinas.'
  },
  {
    id: 'unesa-surabaya',
    name: 'Universitas Negeri Surabaya (UNESA)',
    location: 'Surabaya, Jawa Timur',
    city: 'Surabaya',
    sector: 'education',
    sectorLabel: 'Perguruan Tinggi',
    status: 'Completed',
    scope: 'Pembangunan infrastruktur jaringan kampus, fiber optic backbone, dan sistem proteksi keamanan jaringan.'
  },
  {
    id: 'derma-aesthetic-tower',
    name: 'Derma Aesthetic Tower - Summarecon',
    location: 'Bekasi, Jawa Barat',
    city: 'Bekasi',
    sector: 'commercial',
    sectorLabel: 'Komersial & Klinik',
    status: 'Completed',
    scope: 'Sistem pengawasan CCTV, access control smart card, tata suara sound system, dan instalasi kelistrikan pendukung.'
  },
  {
    id: 'gallery-art-summarecon',
    name: 'Gallery Art - Summarecon',
    location: 'Bandung, Jawa Barat',
    city: 'Bandung',
    sector: 'commercial',
    sectorLabel: 'Komersial & Seni',
    status: 'Completed',
    scope: 'Pengadaan dan instalasi sistem tata suara (sound system), pencahayaan cerdas, dan surveillance keamanan galeri.'
  },
  {
    id: 'tol-serang-panimbang',
    name: 'Proyek Jalan Tol Serang - Panimbang',
    location: 'Banten',
    city: 'Serang - Banten',
    sector: 'infrastructure',
    sectorLabel: 'Infrastruktur Jalan Tol',
    status: 'Completed',
    scope: 'Penggelaran sistem telekomunikasi serat optik, surveillance CCTV jalan tol, dan instalasi perangkat pendukung gardu tol.',
    highlight: true
  },
  {
    id: 'rayz-hotel-malang',
    name: 'Rayz Hotel',
    location: 'Malang, Jawa Timur',
    city: 'Malang',
    sector: 'hospitality',
    sectorLabel: 'Perhotelan & Pariwisata',
    status: 'Completed',
    scope: 'Integrasi sistem IP-PBX telepon kamar, jaringan Wi-Fi tamu, surveillance CCTV perimeter, dan Public Address sound system.'
  },
  {
    id: 'hotel-dormitory-malang',
    name: 'Hotel Dormitory',
    location: 'Malang, Jawa Timur',
    city: 'Malang',
    sector: 'hospitality',
    sectorLabel: 'Akomodasi & Asrama',
    status: 'Completed',
    scope: 'Instalasi sistem access control pintu kamar RFID, CCTV pengawasan koridor, dan jaringan kabel data terstruktur.'
  },
  {
    id: 'sma-alfa-centauri',
    name: 'SMA Alfa Centauri',
    location: 'Bandung, Jawa Barat',
    city: 'Bandung',
    sector: 'education',
    sectorLabel: 'Institusi Pendidikan',
    status: 'Completed',
    scope: 'Perancangan jaringan komputer laboratorium, Wi-Fi sekolah terpadu, dan sistem absensi biometrik sidik jari & wajah.'
  },
  {
    id: 'stie-inaba-bandung',
    name: 'STIE INABA',
    location: 'Bandung, Jawa Barat',
    city: 'Bandung',
    sector: 'education',
    sectorLabel: 'Kampus & Universitas',
    status: 'Completed',
    scope: 'Modernisasi infrastruktur data center kampus, core switch, dan pengawasan CCTV seluruh gedung perkuliahan.'
  },
  {
    id: 'bpr-hik-parahyangan',
    name: 'Kantor Pusat BPR HIK - Parahyangan',
    location: 'Bandung, Jawa Barat',
    city: 'Bandung',
    sector: 'commercial',
    sectorLabel: 'Perbankan & Finansial',
    status: 'Completed',
    scope: 'Instalasi sistem keamanan tingkat tinggi: Fire Alarm System MCFA, Access Control biometric ruang khazanah, CCTV bank, dan UPS kelistrikan.'
  },
  {
    id: 'wisata-selfie-bandung',
    name: 'Wisata Selfie',
    location: 'Bandung, Jawa Barat',
    city: 'Bandung',
    sector: 'hospitality',
    sectorLabel: 'Pariwisata & Rekreasi',
    status: 'Completed',
    scope: 'Sistem ticketing barrier gate, access control, jaringan POS, dan instalasi sound system publik interaktif.'
  },
  {
    id: 'bandara-depati-amir',
    name: 'Gedung Kargo Bandara Depati Amir',
    location: 'Pangkal Pinang, Bangka Belitung',
    city: 'Pangkal Pinang',
    sector: 'infrastructure',
    sectorLabel: 'Bandara & Logistik',
    status: 'Completed',
    scope: 'Instalasi jaringan komunikasi data kargo, sistem surveillance perimeter cctv bandara, dan integrasi panel kelistrikan ME.',
    highlight: true
  },
  {
    id: 'lab-teknik-itb',
    name: 'Laboratorium Teknik ITB',
    location: 'Bandung, Jawa Barat',
    city: 'Bandung',
    sector: 'education',
    sectorLabel: 'Riset & Laboratorium ITB',
    status: 'Completed',
    scope: 'Pengadaan workstation riset berkecepatan tinggi, instalasi kabel data berstandar industri, dan sistem kelistrikan berarde rendah.'
  }
];

export const TARGET_MARKETS: MarketSector[] = [
  {
    title: 'Gedung Perkantoran & Komersial',
    description: 'Solusi jaringan enterprise berkecepatan tinggi, access control pintu & lift, sistem tata suara, serta CCTV pemantauan aset bisnis.',
    icon: 'Building2',
    examples: 'Beltway Office Tower, Derma Aesthetic Tower, BPR HIK'
  },
  {
    title: 'Kawasan Industri & Manufaktur',
    description: 'Infrastruktur jaringan industri tahan suhu tinggi, pengawasan CCTV perimeter luas, fire alarm system, dan backup daya ME terpercaya.',
    icon: 'Factory',
    examples: 'Pabrik farmasi, gudang kargo, zona manufaktur'
  },
  {
    title: 'Institusi Pendidikan & Kampus',
    description: 'Jaringan Wi-Fi berskala ribuan pengguna, fiber optic antar gedung, lab komputer, smart access kontrol asrama, dan absensi.',
    icon: 'GraduationCap',
    examples: 'UNESA Surabaya, ITB Bandung, STIE INABA, SMA Alfa Centauri'
  },
  {
    title: 'Perhotelan & Industri Pariwisata',
    description: 'Sistem IP-PBX terpadu, koneksi internet kamar tamu cepat & stabil, smart door lock RFID, dan tata suara public address.',
    icon: 'Hotel',
    examples: 'Rayz Hotel Malang, Hotel Dormitory, Wisata Selfie'
  },
  {
    title: 'Proyek Infrastruktur & Transportasi',
    description: 'Sistem telekomunikasi jalan tol, pemantauan CCTV lalu lintas, sistem kargo bandara, dan instalasi mekanikal elektrikal gardu.',
    icon: 'TrainTrack',
    examples: 'Jalan Tol Serang - Panimbang, Kargo Bandara Depati Amir'
  },
  {
    title: 'Instansi Pemerintah & Kesehatan',
    description: 'Keamanan data dan siber perimeter, sistem pengawasan terpusat, pengadaan komputer resmi, dan fire alarm bersertifikasi.',
    icon: 'Landmark',
    examples: 'Kantor Kejaksaan Musirawas, R&D PT Mensa Mitra Medika'
  }
];
