"use client";
import { useState, useEffect, useRef } from 'react';

const translations = {
  tr: {
    lab: "Simülasyon Lab",
    library: "Vaka Kütüphanesi",
    team: "Ekip",
    history: "Geçmiş Seanslarım",
    about: "Proje Hakkında",
    admin: "Yetkili Paneli",
    newSim: "Yeni Simülasyon",
    help: "Yardım Merkezi",
    search: "Simülasyon veya vaka ara...",
    guest: "Ziyaretçi",
    title: "Klinik Psikolog",
    welcome: "Hoş Geldiniz!",
    profileDesc: "Profilinizi kişiselleştirmek için bilgilerinizi girebilirsiniz.",
    namePlaceholder: "Adınız Soyadınız",
    titlePlaceholder: "Unvan (Örn: Klinik Psikolog)",
    saveStart: "Kaydet ve Başla",
    skip: "Boş Bırak ve Devam Et",
    sysPrep: "Sistem Hazırlanıyor",
    sysWake: "Sunucu uyandırılıyor...",
    heroTitle: "Yapay Zeka Destekli Klinik Süpervizyon Simülatörü",
    heroDesc: "Psikolog adayları için geliştirildi. Sesli veya yazılı olarak gerçekçi vakalarla görüşün, GPT tabanlı anlık klinik geri bildirim ve empati analizi alın.",
    startBtn: "🚀 Simülasyona Başla",
    feature1Title: "🎙️ Sesli veya Yazılı Terapi",
    feature1Desc: "Whisper AI altyapısıyla danışanlarla gerçek zamanlı ve doğal iletişim kurun.",
    feature2Title: "🧠 GPT Destekli Analiz",
    feature2Desc: "Seans sonu terapötik ittifakınızı ve empati skorunuzu anında görün.",
    feature3Title: "📈 Klinik Gelişim",
    feature3Desc: "Gerçekçi senaryolarla risksiz ortamda klinik reflekslerinizi güçlendirin.",
    howItWorks: "Nasıl Çalışır?",
    step1: "1. Vaka Seç",
    step1Desc: "Kütüphaneden size uygun senaryoyu belirleyin.",
    step2: "2. Seansı Yönet",
    step2Desc: "Danışanla etkileşime geçip müdahalelerde bulunun.",
    step3: "3. Raporunu Al",
    step3Desc: "Yapay zeka süpervizörden detaylı analiz ve skor alın.",
    sysStatus: "SİSTEM DURUMU",
    online: "Çevrimiçi",
    ready: "Bağlantı Hazır",
    regCases: "KAYITLI VAKA",
    loading: "Yükleniyor...",
    patient: "Danışan",
    waitSession: "Seans Bekliyor",
    syncing: "Senkronize ediliyor",
    clinicRoom: "KLİNİK ODA",
    available: "Müsait",
    readyMeet: "Görüşmeye Hazır",
    activeSim: "Aktif Simülasyon",
    activeSimDesc: "Devam eden seans verileri",
    seeAll: "Tümünü Gör ➔",
    ongoing: "DEVAM EDİYOR",
    noSelectedCase: "Seçili Vaka Yok",
    lastAction: "Son etkileşim",
    notStarted: "Henüz başlanmadı",
    messages: "MESAJLAR",
    duration: "SÜRE",
    patientFile: "DANIŞAN DOSYASI",
    waitSim: "Bekleyen Simülasyon",
    reviewFile: "Dosyayı İncele ➔",
    notFound: "Vaka Bulunamadı",
    simCases: "Simülasyon Vakaları",
    simCasesDesc: "Klinik deneyiminizi geliştirmek için titizlikle hazırlanmış gerçekçi vaka senaryolarını keşfedin.",
    clinicCase: "KLİNİK VAKA",
    reviewStart: "İncele ve Başlat",
    noCaseFound: "Aradığınız kriterde veya sistemde kayıtlı vaka bulunamadı.",
    addCaseAdmin: "Yetkili Panelinden Vaka Ekle",
    loadingCases: "Vakalar sunucudan yükleniyor...",
    teamTitle: "Ekip Üyeleri",
    teamDesc: "Psiko-Sim Laboratuvarı, teknolojiyi ve psikolojiyi bir araya getirerek yarının klinik eğitimini inşa ediyor.",
    role: "GÖREV",
    vision: "Vizyonumuz",
    visionDesc: "Psiko-Sim Laboratuvarı ekibi olarak, her klinik vakada insan hikayesini merkeze alıyoruz.",
    yearRnd: "Yıllık Ar-Ge",
    simCount: "Simülasyon",
    aboutTitle: "Proje Hakkında",
    aboutDesc: "Psiko-Sim, klinik psikoloji eğitimini dijital bir laboratuvara dönüştüren simülasyon platformdur, psikolog adayları için gerçekçi ve etkili bir öğrenme deneyimi sunar.",
    impNote: "Önemli Not",
    impNoteDesc: "Bu uygulamada yer alan tüm vaka örnekleri ve karakterler tamamen kurgusal olup, herhangi bir gerçek kişiyle benzerlik göstermesi tesadüfidir. Vaka içerikleri; psikoloji öğrencileri, uzmanlar ve ilgili alanlarda eğitim alan bireyler için eğitim ve simülasyon amacıyla hazırlanmıştır. Bu uygulama, gerçek bir psikolojik danışmanlık veya terapi hizmeti sunmamaktadır ve bu amaçla kullanılmamalıdır.",
    adminLogin: "Yetkili Girişi",
    adminLoginDesc: "Vaka kütüphanesini yönetmek için uzman şifresini girin.",
    passPlaceholder: "Şifre",
    loginBtn: "Giriş Yap",
    caseMgmt: "Vaka Yönetimi",
    logout: "Çıkış",
    updateTitle: "🔄 Güncelle",
    addTitle: "📝 Ekle",
    cancel: "İptal Et",
    caseName: "Vaka Adı / Tanı",
    summary: "Vaka Özeti",
    prompt: "Sistem Kuralları (Prompt)",
    updateBtn: "Güncelle",
    saveBtn: "Kaydet",
    edit: "Düzenle",
    test: "Test Et",
    delete: "Sil",
    systemReg: "Sistemde Kayıtlı",
    emptyDb: "Sistemde hiç vaka bulunmuyor.",
    simComplete: "Simülasyon Tamamlandı",
    totalTime: "Toplam Süre",
    clinicEval: "Klinik Değerlendirme",
    aiAnalyzing: "Yapay Zeka Seansı Analiz Ediyor...",
    therapeutic: "Terapötik İttifak",
    suggestion: "Öneri",
    empScore: "EMPATİ SKORU",
    backLab: "Laboratuvara Dön",
    printRep: "📄 Raporu Yazdır / İndir",
    sessionHub: "Session Hub",
    metrics: "Metrikler",
    interventions: "Müdahaleler",
    endSession: "↪ Seansı Bitir",
    testMode: "TEST",
    activeSession: "AKTİF SEANS",
    patientStatus: "HASTA DURUMU",
    clinicComm: "Klinik İletişim",
    testStart: "Test Başlıyor...",
    patientWait: "Danışan odada bekliyor.",
    firstQ: "İlk sorunuzu yazabilir veya sesli iletebilirsiniz.",
    listening: "Dinleniyor...",
    typeMsg: "Mesajınızı yazın...",
    stressLevel: "STRES SEVİYESİ",
    liveMeasure: "Canlı Ölçüm Aktif",
    waiting: "Bekleniyor",
    empMatch: "EMPATİ UYUMU",
    analyzing: "Analiz Ediliyor",
    waitSessionStart: "SEANSIN BAŞLAMASI BEKLENİYOR",
    quickNotes: "HIZLI NOTLAR",
    notesPlaceholder: "Seans notlarını buraya girin...",
    you: "SEN",
    patientSpeaker: "DANIŞAN",
    unknown: "Bilinmiyor",
    endBtn: "Bitir ↪",
    totalInteraction: "Toplam Etkileşim",
    msgCount: "Mesaj",
    currentStatus: "Mevcut Durum",
    tensionRising: "Tansiyon Artıyor",
    obsStage: "Gözlem Aşaması",
    refListen: "Yansıtıcı Dinleme",
    refListenDesc: "Danışanın son söylediği kelimeleri aynalayarak empatik bağ kurun.",
    openQ: "Açık Uçlu Soru",
    openQDesc: '"Bu hissettiğin duyguyu biraz daha açabilir misin?"',
    livePrompt: "Canlı Prompt Düzenleyici",
    sysRules: "Sistem Kuralları",
    saveDb: "💾 Kalıcı Olarak Kaydet",
    pastSessions: "Geçmiş Seanslar",
    noHistory: "Henüz tamamlanmış bir seans bulunmuyor.",
    date: "Tarih",
    score: "Skor"
  },
  en: {
    lab: "Simulation Lab",
    library: "Case Library",
    team: "Team",
    history: "Past Sessions",
    about: "About Project",
    admin: "Admin Panel",
    newSim: "New Simulation",
    help: "Help Center",
    search: "Search simulations or cases...",
    guest: "Guest",
    title: "Clinical Psychologist",
    welcome: "Welcome!",
    profileDesc: "You can enter your details to personalize your profile.",
    namePlaceholder: "Full Name",
    titlePlaceholder: "Title (e.g. Clinical Psychologist)",
    saveStart: "Save & Start",
    skip: "Skip & Continue",
    sysPrep: "System Preparing",
    sysWake: "Waking up server...",
    heroTitle: "AI-Powered Clinical Supervision Simulator",
    heroDesc: "Developed for psychology students. Conduct voice or text sessions with realistic cases, get instant GPT-based clinical feedback and empathy analysis.",
    startBtn: "🚀 Start Simulation",
    feature1Title: "🎙️ Voice or Text Therapy",
    feature1Desc: "Communicate with clients naturally in real-time using Whisper AI infrastructure.",
    feature2Title: "🧠 GPT-Powered Analysis",
    feature2Desc: "See your therapeutic alliance and empathy score instantly after the session.",
    feature3Title: "📈 Clinical Development",
    feature3Desc: "Strengthen your clinical reflexes in a risk-free environment with realistic scenarios.",
    howItWorks: "How It Works?",
    step1: "1. Select Case",
    step1Desc: "Choose a scenario from the library.",
    step2: "2. Manage Session",
    step2Desc: "Interact and intervene with the client.",
    step3: "3. Get Report",
    step3Desc: "Receive detailed analysis from the AI supervisor.",
    sysStatus: "SYSTEM STATUS",
    online: "Online",
    ready: "Connection Ready",
    regCases: "REGISTERED CASES",
    loading: "Loading...",
    patient: "Clients",
    waitSession: "Awaiting Session",
    syncing: "Syncing DB",
    clinicRoom: "CLINIC ROOM",
    available: "Available",
    readyMeet: "Ready to Meet",
    activeSim: "Active Simulation",
    activeSimDesc: "Ongoing session data",
    seeAll: "See All ➔",
    ongoing: "ONGOING",
    noSelectedCase: "No Selected Case",
    lastAction: "Last interaction",
    notStarted: "Not started yet",
    messages: "MESSAGES",
    duration: "DURATION",
    patientFile: "CLIENT FILE",
    waitSim: "Pending Simulation",
    reviewFile: "Review File ➔",
    notFound: "Case Not Found",
    simCases: "Simulation Cases",
    simCasesDesc: "Explore meticulously prepared realistic case scenarios to improve your clinical experience.",
    clinicCase: "CLINICAL CASE",
    reviewStart: "Review & Start",
    noCaseFound: "No cases found matching your criteria or registered in the system.",
    addCaseAdmin: "Add Case from Admin Panel",
    loadingCases: "Loading cases from server...",
    teamTitle: "Team Members",
    teamDesc: "Psiko-Sim Laboratory builds tomorrow's clinical education by combining technology and psychology.",
    role: "ROLE",
    vision: "Our Vision",
    visionDesc: "As the Psiko-Sim Laboratory team, we put the human story at the center of every clinical case.",
    yearRnd: "Years R&D",
    simCount: "Simulations",
    aboutTitle: "About the Project",
    aboutDesc: "Psiko-Sim is a simulation platform that transforms clinical psychology education into a digital laboratory, offering a realistic learning experience.",
    impNote: "Important Note",
    impNoteDesc: "All case examples and characters in this application are purely fictional. The contents are prepared for educational and simulation purposes for psychology students and professionals. This application does not provide real psychological counseling or therapy.",
    adminLogin: "Admin Login",
    adminLoginDesc: "Enter the expert password to manage the case library.",
    passPlaceholder: "Password",
    loginBtn: "Login",
    caseMgmt: "Case Management",
    logout: "Logout",
    updateTitle: "🔄 Update",
    addTitle: "📝 Add",
    cancel: "Cancel",
    caseName: "Case Name / Diagnosis",
    summary: "Summary",
    prompt: "System Rules (Prompt)",
    updateBtn: "Update",
    saveBtn: "Save",
    edit: "Edit",
    test: "Test",
    delete: "Delete",
    systemReg: "Registered in System",
    emptyDb: "No cases found in the database.",
    simComplete: "Simulation Complete",
    totalTime: "Total Time",
    clinicEval: "Clinical Evaluation",
    aiAnalyzing: "AI is analyzing the session...",
    therapeutic: "Therapeutic Alliance",
    suggestion: "Suggestion",
    empScore: "EMPATHY SCORE",
    backLab: "Return to Lab",
    printRep: "📄 Print / Download Report",
    sessionHub: "Session Hub",
    metrics: "Metrics",
    interventions: "Interventions",
    endSession: "↪ End Session",
    testMode: "TEST",
    activeSession: "ACTIVE SESSION",
    patientStatus: "PATIENT STATUS",
    clinicComm: "Clinical Comm.",
    testStart: "Test Starting...",
    patientWait: "The client is waiting in the room.",
    firstQ: "You can write or speak your first question.",
    listening: "Listening...",
    typeMsg: "Type your message...",
    stressLevel: "STRESS LEVEL",
    liveMeasure: "Live Measure Active",
    waiting: "Waiting",
    empMatch: "EMPATHY MATCH",
    analyzing: "Analyzing",
    waitSessionStart: "WAITING FOR SESSION TO START",
    quickNotes: "QUICK NOTES",
    notesPlaceholder: "Enter session notes here...",
    you: "YOU",
    patientSpeaker: "CLIENT",
    unknown: "Unknown",
    endBtn: "End ↪",
    totalInteraction: "Total Interaction",
    msgCount: "Messages",
    currentStatus: "Current Status",
    tensionRising: "Tension Rising",
    obsStage: "Observation Stage",
    refListen: "Reflective Listening",
    refListenDesc: "Establish an empathic bond by mirroring the client's last words.",
    openQ: "Open-Ended Question",
    openQDesc: '"Can you expand a little more on this feeling?"',
    livePrompt: "Live Prompt Editor",
    sysRules: "System Rules",
    saveDb: "💾 Save Permanently to DB",
    pastSessions: "Past Sessions",
    noHistory: "No completed sessions found yet.",
    date: "Date",
    score: "Score"
  }
};

export default function PsikoSimMaster() {
  const [lang, setLang] = useState('tr'); 
  const t = translations[lang as keyof typeof translations]; 

  const [activePage, setActivePage] = useState('dashboard');
  const [vakalar, setVakalar] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [duzenlenenVaka, setDuzenlenenVaka] = useState<any>(null);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mesajlar, setMesajlar] = useState<any[]>([]);
  const [seansSuresi, setSeansSuresi] = useState(0);
  const [currentVaka, setCurrentVaka] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [chatPopup, setChatPopup] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analizSonucu, setAnalizSonucu] = useState<any>(null);
  const [hizliNot, setHizliNot] = useState(""); 
  const [seansGecmisi, setSeansGecmisi] = useState<any[]>([]);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempTitle, setTempTitle] = useState("");

  useEffect(() => {
    document.title = "Psiko-Sim | Klinik Süpervizyon Laboratuvarı";
    const savedUser = localStorage.getItem("psikosim_user");
    if (savedUser) {
      if (savedUser === "skipped") {
        setShowProfileModal(false);
      } else {
        try {
          const parsed = JSON.parse(savedUser);
          setUserName(parsed.name || "");
          setUserTitle(parsed.title || "");
          setUserInitials(parsed.initials || "");
          setShowProfileModal(false);
        } catch (e) {}
      }
    } else {
      setShowProfileModal(true);
    }
    
    const savedHistory = localStorage.getItem("psikosim_history");
    if (savedHistory) setSeansGecmisi(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [activePage]);

  const vakaYukle = async () => {
    setIsLoading(true); 
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`https://psikosim-backend.onrender.com/vakalar?t=${timestamp}`, { cache: 'no-store' });
      const data = await res.json();
      const gercekDizi = Array.isArray(data) ? data : data.vakalar;
      if (gercekDizi && Array.isArray(gercekDizi)) setVakalar(gercekDizi);
    } catch (err) { 
      console.error("Bağlantı koptu:", err); 
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => { vakaYukle(); }, [activePage]);

  useEffect(() => {
    let interval: any;
    if (activePage === 'chat-session') {
      interval = setInterval(() => { setSeansSuresi(s => s + 1); }, 1000);
    } else {
      setSeansSuresi(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activePage]);

  useEffect(() => {
    if (activePage === 'chat-session') scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesajlar, activePage]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleAdminLogin = () => {
    if (adminPassword.trim().toLowerCase() === "nisanyagmuru") {
      setIsAdminAuth(true);
      setAdminPassword("");
    } else {
      alert("Hatalı şifre!");
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuth(false);
    setActivePage('dashboard');
  };

  const handleVakaKaydet = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      if (duzenlenenVaka) {
        const guncelVeri = { eski_vaka_adi: duzenlenenVaka.vaka_adi, yeni_vaka_adi: formData.get("vaka_adi"), ozet: formData.get("ozet"), kurallar: formData.get("kurallar") };
        await fetch(`https://psikosim-backend.onrender.com/vaka-guncelle`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(guncelVeri) });
        setDuzenlenenVaka(null);
      } else {
        const vakaVerisi = { vaka_adi: formData.get("vaka_adi"), ozet: formData.get("ozet"), kurallar: formData.get("kurallar") };
        await fetch("https://psikosim-backend.onrender.com/vaka-ekle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vakaVerisi) });
      }
      vakaYukle(); 
      e.target.reset();
      alert("İşlem Başarılı!"); 
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    }
  };

  const handleVakaSil = async (adi: string) => {
    if(window.confirm(`'${adi}' adlı vakayı silmek istediğinize emin misiniz?`)) {
      try {
        const res = await fetch(`https://psikosim-backend.onrender.com/vaka-sil/${adi}`, { method: "DELETE" });
        if(res.ok) { setVakalar(prev => prev.filter(v => v.vaka_adi !== adi)); vakaYukle(); }
      } catch (err) { console.error("Silme hatası:", err); }
    }
  };

  const handleTesttenKaydet = async () => {
    if(!currentVaka) return;
    try {
      const guncelVeri = { eski_vaka_adi: currentVaka.vaka_adi, yeni_vaka_adi: currentVaka.vaka_adi, ozet: currentVaka.ozet, kurallar: currentVaka.kurallar };
      const res = await fetch(`https://psikosim-backend.onrender.com/vaka-guncelle`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(guncelVeri) });
      if(res.ok) { alert("Canlı test kuralları başarıyla veritabanına kaydedildi!"); vakaYukle(); } else { alert("Kaydetme hatası!"); }
    } catch(err) { alert("Bağlantı hatası!"); }
  };

  const toggleRecording = async () => {
    if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append("file", audioBlob, "audio.webm");
                try {
                    const res = await fetch("https://psikosim-backend.onrender.com/ses-isleme", { method: "POST", body: formData });
                    const data = await res.json();
                    if (data.text) { mesajIlet(data.text, true); }
                } catch (err) { console.error("Ses işleme hatası", err); }
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) { alert("Mikrofon erişimi reddedildi."); }
    }
  };

  const mesajIlet = async (text: string, voiceMode: boolean) => {
     if(!text.trim()) return;
     const userMsg = { role: 'user', content: text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
     setMesajlar(prev => [...prev, userMsg]);
     setInput("");
     const apiGecmis = mesajlar.map(m => ({ role: m.role, content: m.content }));
     const vakaKurallari = currentVaka ? currentVaka.kurallar : "Sen bir danışansın.";
     const langRule = lang === 'en' ? "\n7. IMPORTANT: YOU MUST PLAY YOUR ROLE AND RESPOND COMPLETELY IN ENGLISH NO MATTER WHAT THE USER SAYS." : "";
     
     const systemPrompt = `Aşağıdaki karakter protokolüne KESİN OLARAK uyacaksın:
${vakaKurallari}

GENEL DAVRANIŞ KURALLARI:
1. Karakterinin dışına asla çıkma. Yardımcı bir asistan gibi değil, sadece bu vakanın kendisi gibi davran.
2. Cevapların kısa, duygusal ve sadece kendi yaşadığın sıkıntılar üzerine olsun.
3. Asla parantez içinde mimik veya eylem belirtme, sadece konuş.
4. Eğer kullanıcı "Merhaba" derse, karakterinin o anki ruh haline uygun bir giriş yap (Asla standart bir asistan karşılaması yapma). ${langRule}`;

     try {
        const response = await fetch("https://psikosim-backend.onrender.com/chat", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ messages: [ { role: "system", content: systemPrompt }, ...apiGecmis, { role: "user", content: text } ] })
        });
        const data = await response.json();
        if (data.answer) {
           setMesajlar(prev => [...prev, { role: 'assistant', content: data.answer, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
           if (voiceMode && data.audio_base64) { const audio = new Audio(data.audio_base64); audio.play(); }
        }
     } catch (err) { console.error("Chat bağlantı hatası:", err); }
  };

  const startSession = (vaka: any) => {
    setCurrentVaka(vaka);
    setMesajlar([]);
    setChatPopup(null);
    setHizliNot(""); 
    setIsTestMode(false); 
    setActivePage('chat-session');
  };

  const startTestSession = (vaka: any) => {
    setCurrentVaka(vaka);
    setMesajlar([]);
    setChatPopup(null);
    setHizliNot(""); 
    setIsTestMode(true); 
    setActivePage('chat-session');
  };

  const handleSeansBitir = async () => {
    setActivePage('seans-raporu');
    setIsAnalyzing(true);
    try {
      const apiGecmis = mesajlar.map(m => ({ role: m.role, content: m.content }));
      if(lang === 'en') { apiGecmis.push({ role: "system", content: "CRITICAL INSTRUCTION: Analyze the session and write the 'terapotik_ittifak' and 'oneri' fields entirely in ENGLISH." }); }

      const response = await fetch("https://psikosim-backend.onrender.com/seans-analizi", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: apiGecmis, hizli_notlar: hizliNot }) 
      });
      const data = await response.json();
      setAnalizSonucu(data);

      const yeniKayit = {
        id: Date.now(),
        vaka: currentVaka?.vaka_adi || t.unknown,
        skor: data.empati_skoru || 0,
        tarih: new Date().toLocaleDateString()
      };
      const yeniGecmis = [yeniKayit, ...seansGecmisi];
      setSeansGecmisi(yeniGecmis);
      localStorage.setItem("psikosim_history", JSON.stringify(yeniGecmis));

    } catch (err) {
      console.error("Analiz hatası:", err);
      setAnalizSonucu({
          empati_skoru: 0,
          terapotik_ittifak: lang === 'en' ? "An error occurred while analyzing." : "Seans analiz edilirken bir hata oluştu.",
          oneri: lang === 'en' ? "Feedback could not be generated." : "Geri bildirim şu an oluşturulamadı."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProfileSave = () => {
    let newInitials = "";
    if (tempName.trim() !== "") {
      setUserName(tempName);
      setUserTitle(tempTitle);
      const words = tempName.trim().split(" ").filter(w => w.length > 0);
      if (words.length >= 2) {
         newInitials = (words[0][0] + words[words.length-1][0]).toUpperCase();
         setUserInitials(newInitials);
      } else if (words.length === 1) {
         newInitials = words[0].substring(0, 2).toUpperCase();
         setUserInitials(newInitials);
      }
      localStorage.setItem("psikosim_user", JSON.stringify({ name: tempName, title: tempTitle, initials: newInitials }));
    } else {
      localStorage.setItem("psikosim_user", "skipped");
    }
    setShowProfileModal(false);
  };

  const filteredVakalar = vakalar.filter(v => (v.vaka_adi || "").toLowerCase().includes(searchTerm.toLowerCase()));

  // FIX: Header'i bağımsız JSX bloğu olarak tanımladık, böylece re-render'da arama kutusu odağı kaybetmez
  const headerJSX = (
    <header className="h-[70px] md:h-[90px] bg-[#F8FAFC] flex items-center justify-between px-4 md:px-10 shrink-0 sticky top-0 z-30 border-b border-slate-100">
      <div className="flex-1 flex items-center gap-4 md:gap-6">
         <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
         </button>

         {activePage !== 'chat-session' && (
           <div className="relative w-full max-w-[400px] hidden sm:block">
             <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             <input 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder={t.search} 
               className="w-full bg-white border border-slate-200 rounded-full py-2.5 md:py-3 px-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3E34FA] text-slate-700 shadow-sm" 
             />
           </div>
         )}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center bg-slate-200 rounded-full p-1">
          <button onClick={() => setLang('tr')} className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${lang === 'tr' ? 'bg-white shadow-sm text-[#3E34FA]' : 'text-slate-400 hover:text-slate-600'}`}>TR</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${lang === 'en' ? 'bg-white shadow-sm text-[#3E34FA]' : 'text-slate-400 hover:text-slate-600'}`}>EN</button>
        </div>

        <div className="relative">
          <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="text-slate-400 hover:text-slate-600 relative hidden sm:block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95">
              <h4 className="font-bold text-sm mb-3">Bildirimler</h4>
              <div className="space-y-3">
                <div className="text-[11px] p-3 bg-emerald-50 rounded-xl text-emerald-700 font-bold flex items-start gap-2"><span className="text-sm">🟢</span> Sistem veritabanı başarıyla senkronize edildi.</div>
                <div className="text-[11px] p-3 bg-indigo-50 rounded-xl text-indigo-700 font-bold flex items-start gap-2"><span className="text-sm">👤</span> {filteredVakalar[0]?.vaka_adi || 'Selin'} vakası simülasyon için hazır bekliyor.</div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 md:h-8 w-px bg-slate-200 hidden sm:block"></div> 
        {userName ? (
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setTempName(userName); setTempTitle(userTitle); setShowProfileModal(true); }}>
               <div className="text-right hidden md:block group-hover:opacity-70 transition-opacity">
                  <p className="text-sm font-bold text-[#1E293B] leading-tight">{userName}</p>
                  <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest">{userTitle}</p>
               </div>
               <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1E293B] rounded-full flex items-center justify-center text-white font-bold shadow-md text-xs md:text-base group-hover:scale-105 transition-transform">{userInitials}</div>
            </div>
        ) : (
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowProfileModal(true)}>
               <div className="text-right hidden md:block group-hover:opacity-70 transition-opacity">
                  <p className="text-sm font-bold text-[#1E293B] leading-tight">{t.guest}</p>
                  <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest">{t.title}</p>
               </div>
               <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
               </div>
            </div>
        )}
      </div>
    </header>
  );

  return (
    <main className="flex h-screen bg-[#F8FAFC] text-[#1E293B] font-sans overflow-hidden antialiased relative">
      
      {isLoading && (
        <div className="fixed bottom-6 right-6 bg-white border border-slate-100 p-4 rounded-2xl shadow-xl z-[100] flex items-center gap-4 animate-in slide-in-from-bottom-4">
          <div className="w-6 h-6 border-2 border-[#3E34FA] border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="text-sm font-bold text-[#1E293B]">{t.sysPrep}</p>
            <p className="text-xs text-slate-500 font-medium">{t.sysWake}</p>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-2xl max-w-sm w-full relative">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold">✕</button>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F4F7FE] text-[#3E34FA] rounded-[20px] flex items-center justify-center text-xl md:text-2xl mb-6 shadow-inner">👋</div>
            <h2 className="text-xl md:text-2xl font-bold text-[#2B3674] mb-2">{t.welcome}</h2>
            <p className="text-xs text-[#A3AED0] font-bold mb-6">{t.profileDesc}</p>
            <div className="space-y-4 mb-8">
              <input value={tempName} onChange={e => setTempName(e.target.value)} placeholder={t.namePlaceholder} className="w-full bg-[#F8F9FB] border border-slate-200 p-3 md:p-4 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3E34FA] text-[#2B3674]" />
              <input value={tempTitle} onChange={e => setTempTitle(e.target.value)} placeholder={t.titlePlaceholder} className="w-full bg-[#F8F9FB] border border-slate-200 p-3 md:p-4 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3E34FA] text-[#2B3674]" />
            </div>
            <button onClick={handleProfileSave} className="w-full py-3 md:py-4 bg-[#3E34FA] text-white rounded-xl font-bold shadow-md hover:bg-[#2B24C0] transition-all mb-3 text-sm md:text-base">{t.saveStart}</button>
            <button onClick={() => { localStorage.setItem("psikosim_user", "skipped"); setShowProfileModal(false); }} className="w-full py-3 text-[#A3AED0] font-bold text-sm hover:text-slate-600 transition-all">{t.skip}</button>
          </div>
        </div>
      )}

      {activePage === 'chat-session' ? (
         <div className="flex w-full h-full bg-white relative">
            {chatPopup && (
                <div className="absolute inset-0 bg-white/95 z-40 flex flex-col p-6 md:p-12 animate-in fade-in">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#2B3674]">{chatPopup === 'dosya' ? t.patientFile : chatPopup === 'metrik' ? t.metrics : t.interventions}</h2>
                        <button onClick={() => setChatPopup(null)} className="text-2xl md:text-3xl font-bold text-slate-400 hover:text-red-500 transition-colors">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto text-base md:text-lg text-slate-600">
                        {chatPopup === 'dosya' && (
                            <div className="space-y-4">
                                <h3 className="text-lg md:text-xl font-bold text-[#3E34FA]">{t.summary}</h3>
                                <p className="leading-relaxed">{currentVaka?.ozet || t.notFound}</p>
                            </div>
                        )}
                        {chatPopup === 'metrik' && (
                            <div className="space-y-6">
                                <div className="bg-[#F8F9FB] p-6 rounded-2xl border border-slate-100">
                                   <p className="text-sm font-bold text-slate-400 uppercase mb-2">{t.totalInteraction}</p>
                                   <p className="text-2xl md:text-3xl font-bold text-[#2B3674]">{mesajlar.length} {t.msgCount}</p>
                                </div>
                                <div className="bg-[#F8F9FB] p-6 rounded-2xl border border-slate-100">
                                   <p className="text-sm font-bold text-slate-400 uppercase mb-2">{t.currentStatus}</p>
                                   <p className="text-lg md:text-xl font-bold text-[#3E34FA]">{mesajlar.length > 5 ? t.tensionRising : t.obsStage}</p>
                                </div>
                            </div>
                        )}
                        {chatPopup === 'mudahale' && (
                            <ul className="list-none space-y-4">
                                <li className="bg-[#F8F9FB] p-6 rounded-2xl border border-slate-100"><b className="text-[#3E34FA] block mb-2">{t.refListen}</b> {t.refListenDesc}</li>
                                <li className="bg-[#F8F9FB] p-6 rounded-2xl border border-slate-100"><b className="text-[#3E34FA] block mb-2">{t.openQ}</b> {t.openQDesc}</li>
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <aside className="hidden lg:flex w-[280px] bg-[#F8F9FB] border-r border-slate-200 flex flex-col p-6 shrink-0 z-10">
               <h2 className="text-[22px] font-bold text-[#3E34FA] tracking-tight mb-8 flex items-center gap-2">🧠 Psiko-Sim</h2>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-white">
                     <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${currentVaka?.vaka_adi || 'Selin'}&backgroundColor=b6e3f4`} alt="Danışan" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h3 className="font-bold text-[#2B3674] text-[15px] line-clamp-1">{currentVaka?.vaka_adi || t.unknown}</h3>
                     <p className="text-[10px] text-slate-500 font-bold mt-0.5">{t.clinicCase}</p>
                  </div>
               </div>
               <nav className="flex-1 space-y-2">
                  <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold bg-white text-[#3E34FA] shadow-sm border border-slate-100"><span className="text-lg">⚙️</span> {t.sessionHub}</button>
                  <button onClick={() => setChatPopup('dosya')} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-[#A3AED0] hover:bg-white/50 transition-all"><span className="text-lg">👤</span> {t.patientFile}</button>
                  <button onClick={() => setChatPopup('metrik')} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-[#A3AED0] hover:bg-white/50 transition-all"><span className="text-lg">📊</span> {t.metrics}</button>
                  <button onClick={() => setChatPopup('mudahale')} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-[#A3AED0] hover:bg-white/50 transition-all"><span className="text-lg">✨</span> {t.interventions}</button>
               </nav>
               <button onClick={handleSeansBitir} className="w-full py-4 bg-[#B91C1C] text-white rounded-xl font-bold text-sm shadow-md flex justify-center items-center gap-2 hover:bg-red-800 transition-all">{t.endSession}</button>
            </aside>

            <section className="flex-1 flex flex-col bg-[#F8FAFC] relative border-r border-slate-200">
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] text-[150px] md:text-[300px]">🧠</div>
               <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between border-b border-slate-100 bg-white/50 backdrop-blur-md z-10 shrink-0">
                  <div className="flex items-center gap-2 bg-[#E9E3FF] px-3 md:px-4 py-1.5 rounded-full"><div className="w-2 h-2 bg-[#3E34FA] rounded-full animate-pulse"></div><span className="text-[9px] md:text-[10px] font-bold text-[#3E34FA] uppercase tracking-widest">{isTestMode ? t.testMode : t.activeSession}</span></div>
                  <button onClick={handleSeansBitir} className="lg:hidden px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-bold text-[10px] uppercase tracking-widest border border-red-100 shadow-sm">{t.endBtn}</button>
                  <div className="hidden md:flex items-center gap-8">
                     <div className="text-center"><p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">{t.duration}</p><p className="text-xl font-black text-[#2B3674] leading-none mt-1">{formatTime(seansSuresi)}</p></div>
                     <div className="text-center"><p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">{t.patientStatus}</p><p className="text-sm font-bold text-[#3E34FA] leading-none mt-1">{t.clinicComm}</p></div>
                  </div>
               </header>
               <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-4 md:space-y-6 z-10">
                  <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
                     {mesajlar.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center opacity-60 mt-10 md:mt-20">
                           <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E9E3FF] text-[#3E34FA] rounded-full flex items-center justify-center text-2xl md:text-3xl mb-6 shadow-inner">🛋️</div>
                           <h3 className="text-base md:text-lg font-bold text-[#2B3674] mb-2">{isTestMode ? t.testStart : t.patientWait}</h3>
                           <p className="text-xs md:text-sm text-[#A3AED0] px-4">{t.firstQ}</p>
                        </div>
                     ) : (
                        mesajlar.map((m, i) => (
                           <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                              <div className={`p-4 md:p-6 rounded-[20px] md:rounded-[24px] text-[14px] md:text-[15px] leading-relaxed shadow-sm max-w-[90%] md:max-w-[85%] ${m.role === 'user' ? 'bg-[#2111E7] text-white rounded-br-sm' : 'bg-[#E2E8F0] text-[#2B3674] rounded-bl-sm font-medium'}`}>{m.content}</div>
                              <p className="text-[9px] md:text-[10px] font-bold text-[#A3AED0] uppercase mt-2 tracking-widest">{m.role === 'user' ? (userName ? userName.split(' ')[0] : t.you) : t.patientSpeaker} • {m.time}</p>
                           </div>
                        ))
                     )}
                     <div ref={scrollRef} />
                  </div>
               </div>
               <div className="p-4 md:p-8 z-10 relative">
                  <div className="max-w-3xl mx-auto relative bg-white rounded-full shadow-xl shadow-slate-200 flex items-center p-1.5 md:p-2 border border-slate-100">
                     <button onClick={toggleRecording} className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-1 md:mr-2 transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-50 text-[#3E34FA] hover:bg-indigo-100'}`}>🎙️</button>
                     <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && mesajIlet(input, false)} placeholder={isRecording ? t.listening : t.typeMsg} disabled={isRecording} className="flex-1 bg-transparent border-none py-3 px-2 md:px-4 text-[14px] md:text-[15px] font-medium text-slate-700 focus:outline-none placeholder:text-slate-400 disabled:opacity-50" />
                     <button onClick={() => mesajIlet(input, false)} disabled={isRecording} className="w-10 h-10 md:w-12 md:h-12 bg-[#2111E7] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#1A0CB0] transition-colors disabled:opacity-50"><span className="text-lg md:text-xl">➤</span></button>
                  </div>
               </div>
            </section>

            <aside className="hidden xl:flex w-[360px] bg-[#F8F9FB] p-6 flex-col gap-6 overflow-y-auto shrink-0 z-10 border-l border-slate-200">
               {isTestMode && (
                 <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-blue-500 flex-1 flex flex-col mb-6">
                    <h3 className="text-sm font-bold text-[#2B3674] mb-2 flex items-center gap-2"><span>🧪</span> {t.livePrompt}</h3>
                    <p className="text-[10px] text-slate-500 font-bold mb-4 uppercase tracking-widest">{t.sysRules}</p>
                    <textarea value={currentVaka?.kurallar || ""} onChange={(e) => setCurrentVaka({...currentVaka, kurallar: e.target.value})} className="flex-1 w-full bg-[#F8F9FB] border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner resize-none mb-4" />
                    <button onClick={handleTesttenKaydet} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">{t.saveDb}</button>
                 </div>
               )}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-[#3E34FA]">
                  <div className="flex justify-between items-center mb-6"><h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.stressLevel}</h4></div>
                  <div className="flex items-end justify-between h-24 gap-2 mb-4 opacity-50">
                     {[1,2,3,4,5,6,7].map(i => (<div key={i} className="w-full rounded-md bg-[#E9E3FF] transition-all duration-500" style={{height: `${Math.min(20 + (mesajlar.length * 8) + (Math.random() * 10), 100)}%`}}></div>))}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">{mesajlar.length > 0 ? t.liveMeasure : t.waiting}</p>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-4"><h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.empMatch}</h4></div>
                  <div className="w-full h-3 bg-slate-100 rounded-full mb-4 overflow-hidden"><div className="h-full bg-[#3E34FA] rounded-full transition-all duration-1000" style={{width: `${Math.min(mesajlar.length * 15, 100)}%`}}></div></div>
               </div>
               <div className="mt-auto"><h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">{t.quickNotes}</h4><textarea value={hizliNot} onChange={(e) => setHizliNot(e.target.value)} rows={4} placeholder={t.notesPlaceholder} className="w-full bg-white border border-slate-100 rounded-3xl p-5 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#3E34FA] shadow-sm resize-none"></textarea></div>
            </aside>
         </div>
      ) : (
      <>
        {isMobileMenuOpen && (<div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>)}
        <aside className={`fixed lg:static inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out w-[260px] bg-[#F8FAFC] border-r border-slate-200 flex flex-col shrink-0 z-50`}>
          <div className="flex items-center justify-between p-6 lg:p-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('dashboard')}>
              <div className="w-10 h-10 bg-[#3E34FA] rounded-xl flex items-center justify-center text-white shadow-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg></div>
              <div><h2 className="text-xl font-bold leading-none text-[#1E293B]">Psiko-Sim</h2><p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest mt-1">Laboratuvarı</p></div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg">✕</button>
          </div>
          <nav className="flex-1 flex flex-col px-4 space-y-1 mt-2">
            {[
              { id: 'dashboard', name: t.lab, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /> },
              { id: 'library', name: t.library, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
              { id: 'team', name: t.team, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
              { id: 'history', name: t.pastSessions, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
              { id: 'about', name: t.about, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> }
            ].map((item) => (
              <button key={item.id} onClick={() => setActivePage(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-full text-[14px] font-semibold transition-all ${activePage === item.id ? 'bg-[#3E34FA] text-white shadow-md' : 'text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]'}`}><svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>{item.name}</button>
            ))}
            <div className="mt-auto pt-6 lg:pt-10 pb-2"><button onClick={() => setActivePage('admin')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-full text-[14px] font-semibold transition-all ${activePage === 'admin' ? 'bg-slate-200 text-[#1E293B] shadow-sm' : 'text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]'}`}><svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>{t.admin}</button></div>
          </nav>
          <div className="p-4 lg:p-6 space-y-4"><button onClick={() => setActivePage('library')} className="w-full py-3.5 bg-[#3E34FA] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#2B24C0] transition-all flex items-center justify-center gap-2"><span className="text-lg">+</span> {t.newSim}</button></div>
        </aside>

         <section className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
           {headerJSX}
           <div className="flex-1 overflow-y-auto">
             {activePage === 'dashboard' && (
               <div className="flex flex-col lg:flex-row h-full animate-in fade-in duration-300">
                 <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8">
                   <div className="bg-gradient-to-r from-[#2111E7] to-[#4537F3] rounded-[24px] md:rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                     <div className="relative z-10 max-w-2xl"><h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 leading-snug">{t.heroTitle}</h1><p className="text-indigo-100 text-sm md:text-base mb-6 md:mb-8 opacity-90">{t.heroDesc}</p><button onClick={() => setActivePage('library')} className="w-full md:w-auto bg-white text-[#3E34FA] px-6 md:px-8 py-3.5 rounded-full font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-all">{t.startBtn}</button></div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
                      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                         <h3 className="text-lg font-bold text-[#2B3674] mb-2">{t.feature1Title}</h3>
                         <p className="text-sm text-slate-500 leading-relaxed">{t.feature1Desc}</p>
                      </div>
                      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                         <h3 className="text-lg font-bold text-[#2B3674] mb-2">{t.feature2Title}</h3>
                         <p className="text-sm text-slate-500 leading-relaxed">{t.feature2Desc}</p>
                      </div>
                      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                         <h3 className="text-lg font-bold text-[#2B3674] mb-2">{t.feature3Title}</h3>
                         <p className="text-sm text-slate-500 leading-relaxed">{t.feature3Desc}</p>
                      </div>
                   </div>

                   <div className="mt-10 mb-6">
                      <h2 className="text-2xl font-bold text-[#1E293B] mb-6">{t.howItWorks}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#E9E3FF] text-[#3E34FA] flex items-center justify-center font-bold shrink-0">1</div>
                            <div><h4 className="font-bold text-[#2B3674]">{t.step1}</h4><p className="text-xs text-slate-500 mt-1">{t.step1Desc}</p></div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#E9E3FF] text-[#3E34FA] flex items-center justify-center font-bold shrink-0">2</div>
                            <div><h4 className="font-bold text-[#2B3674]">{t.step2}</h4><p className="text-xs text-slate-500 mt-1">{t.step2Desc}</p></div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#E9E3FF] text-[#3E34FA] flex items-center justify-center font-bold shrink-0">3</div>
                            <div><h4 className="font-bold text-[#2B3674]">{t.step3}</h4><p className="text-xs text-slate-500 mt-1">{t.step3Desc}</p></div>
                         </div>
                      </div>
                   </div>

                 </div>
                 <div className="w-full lg:w-[340px] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-6 md:p-8 flex flex-col items-center shrink-0">
                    <div className="w-full flex justify-between items-center mb-6 md:mb-8"><span className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">{t.patientFile}</span><span className="text-slate-300">🔍</span></div>
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-200 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg"><img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${filteredVakalar[0]?.vaka_adi || 'Selin'}&backgroundColor=b6e3f4`} alt="Danışan" className="w-full h-full object-cover" /></div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#2B3674] line-clamp-1">{isLoading ? t.loading : (filteredVakalar[0]?.vaka_adi || t.notFound)}</h3>
                    <p className="text-xs md:text-sm text-[#A3AED0] font-medium mb-6 md:mb-8">{t.waitSim}</p>
                    <button onClick={() => {if(filteredVakalar[0]) startSession(filteredVakalar[0])}} className="w-full py-3 md:py-4 border-2 border-[#E9E3FF] text-[#3E34FA] rounded-xl md:rounded-2xl font-bold text-sm hover:bg-[#F4F7FE] transition-all flex justify-center items-center gap-2">{t.reviewFile}</button>
                    
                    <div className="w-full mt-10 space-y-4">
                       <h4 className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest text-center">{t.sysStatus}</h4>
                       <div className="flex justify-between items-center p-4 bg-[#F8F9FB] rounded-xl border border-slate-100">
                          <span className="text-sm font-bold text-slate-600">{t.regCases}</span>
                          <span className="text-sm font-bold text-[#3E34FA]">{isLoading ? "..." : filteredVakalar.length}</span>
                       </div>
                       <div className="flex justify-between items-center p-4 bg-[#F8F9FB] rounded-xl border border-slate-100">
                          <span className="text-sm font-bold text-slate-600">{t.clinicRoom}</span>
                          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">● {t.available}</span>
                       </div>
                    </div>
                 </div>
               </div>
             )}
             
             {/* YENİ: GEÇMİŞ SEANSLAR SAYFASI */}
             {activePage === 'history' && (
                <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-300 max-w-4xl">
                   <div className="max-w-3xl"><h1 className="text-2xl md:text-3xl font-bold text-[#2B3674] mb-3 md:mb-4">{t.pastSessions}</h1><p className="text-sm md:text-base text-[#A3AED0] font-medium leading-relaxed">Geçmiş klinik analizleriniz ve süpervizyon raporlarınız.</p></div>
                   <div className="space-y-4">
                     {seansGecmisi.length === 0 ? (
                        <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                            <p className="text-slate-400 font-bold">{t.noHistory}</p>
                        </div>
                     ) : (
                        seansGecmisi.map((sec, i) => (
                          <div key={i} className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#3E34FA] flex items-center justify-center font-black text-lg">#{seansGecmisi.length - i}</div>
                                <div>
                                   <h3 className="font-bold text-[#2B3674] text-lg">{sec.vaka}</h3>
                                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t.date}: {sec.tarih}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="text-right">
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.empScore}</p>
                                   <p className="text-2xl font-black text-[#3E34FA]">%{sec.skor}</p>
                                </div>
                             </div>
                          </div>
                        ))
                     )}
                   </div>
                </div>
             )}

             {activePage === 'library' && (
               <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-300">
                  <div className="max-w-3xl"><h1 className="text-2xl md:text-3xl font-bold text-[#2B3674] mb-3 md:mb-4">{t.simCases}</h1><p className="text-sm md:text-base text-[#A3AED0] font-medium leading-relaxed">{t.simCasesDesc}</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredVakalar.map((v, i) => (
                       <div key={i} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                          <div className="h-20 bg-indigo-50 p-4"><span className="bg-[#3E34FA] text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase">{t.clinicCase}</span></div>
                          <div className="p-6 flex flex-col flex-1"><h3 className="text-lg font-bold text-[#2B3674] mb-4 line-clamp-1">{v.vaka_adi}</h3><p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">{v.ozet}</p><button onClick={() => startSession(v)} className="w-full py-3 bg-[#3E34FA] text-white rounded-xl font-bold text-sm hover:bg-[#2B24C0]">{t.reviewStart}</button></div>
                       </div>
                    ))}
                    {isLoading && <div className="col-span-full p-10 text-center border-2 border-dashed border-indigo-100 bg-indigo-50/50 rounded-3xl flex flex-col items-center justify-center"><div className="w-8 h-8 border-4 border-[#3E34FA] border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-[#3E34FA] font-bold">{t.loadingCases}</p></div>}
                    {filteredVakalar.length === 0 && !isLoading && (
                        <div className="col-span-full p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                            <p className="text-slate-400 font-bold">{t.noCaseFound}</p>
                            <button onClick={() => setActivePage('admin')} className="mt-4 text-[#3E34FA] font-bold text-sm hover:underline">{t.addCaseAdmin}</button>
                        </div>
                    )}
                  </div>
               </div>
             )}
             {activePage === 'team' && (
               <div className="p-4 md:p-12 space-y-8 md:space-y-12 animate-in fade-in duration-500 max-w-7xl mx-auto">
                 <div className="max-w-3xl"><h1 className="text-2xl md:text-4xl font-bold text-[#1E293B] mb-3 md:mb-4">{t.teamTitle}</h1><p className="text-sm md:text-lg text-[#64748B] font-medium leading-relaxed">{t.teamDesc}</p></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                   {[
                     { n: "Emir Demir", r: "Geliştirici ve Kurucu", g: "Geliştirici ve Kurucu", d: "Yapay zeka ile üretime ve projelere yönelen Emir, platformun teknik altyapısını yönetiyor.", l: "https://www.linkedin.com/in/itsemirdemir/", img: "/emir.jpg" },
                     { n: "Ebru Demir", r: "Vaka Yazarı", g: "Vaka Yazarı", d: "Ebru, psikolojik teorileri simülasyon senaryolarına dönüştürerek gerçekçi vaka analizleri sağlıyor.", l: "https://www.linkedin.com/in/ebru-demir-81a531369/", img: "/ebru.jpg" }
                   ].map((u, i) => (
                     <div key={i} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative flex flex-col items-center text-center">
                       <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-[24px] md:rounded-[32px] mb-4 overflow-hidden border-4 border-white shadow-inner"><img src={u.img} alt={u.n} className="w-full h-full object-cover" onError={(e:any) => { e.target.src=`https://api.dicebear.com/7.x/notionists/svg?seed=${u.n}` }} /></div>
                       <h3 className="text-lg md:text-xl font-bold text-[#1E293B]">{u.n}</h3><p className="text-[10px] md:text-[11px] font-bold text-[#3E34FA] uppercase tracking-widest mt-1">{u.r}</p>
                       <p className="text-xs md:text-sm text-slate-500 mt-4 flex-1">{u.d}</p>
                       <a href={u.l} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-[#0A66C2] text-white rounded-xl font-bold text-sm hover:bg-[#004182] transition-all">
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                           LinkedIn
                       </a>
                     </div>
                   ))}
                 </div>
               </div>
             )}
             {activePage === 'about' && (
               <div className="p-4 md:p-12 space-y-6 md:space-y-8 animate-in fade-in duration-300">
                  <div className="bg-[#3E34FA] rounded-[24px] md:rounded-[32px] p-8 md:p-16 text-white relative overflow-hidden"><h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{t.aboutTitle}</h1><p className="text-sm md:text-xl text-indigo-100 font-medium max-w-2xl">{t.aboutDesc}</p></div>
                  <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-12 border-l-[6px] md:border-l-[8px] border-[#3E34FA] shadow-sm">
                    <div className="flex items-center gap-3 mb-6 md:mb-8"><div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center font-black shrink-0">!</div><h2 className="text-xl md:text-3xl font-bold text-[#2B3674]">{t.impNote}</h2></div>
                    <p className="text-sm md:text-base text-slate-700 font-bold mb-4">{t.impNoteDesc}</p>
                  </div>
               </div>
             )}
             {activePage === 'admin' && (
                <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
                   {!isAdminAuth ? (
                      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                         <div className="bg-white p-8 md:p-12 rounded-[24px] md:rounded-[32px] shadow-xl max-w-md w-full text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-[#3E34FA]"></div><div className="w-16 h-16 md:w-20 md:h-20 bg-[#F4F7FE] text-[#3E34FA] rounded-[20px] flex items-center justify-center text-2xl mx-auto mb-6 shadow-inner">🔒</div><h2 className="text-xl md:text-2xl font-bold text-[#2B3674] mb-2">{t.adminLogin}</h2><input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder={t.passPlaceholder} className="w-full bg-[#F8F9FB] border border-slate-200 p-3 md:p-4 rounded-xl text-center font-bold mb-6 focus:outline-none focus:ring-2 focus:ring-[#3E34FA]" onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} /><button onClick={handleAdminLogin} className="w-full py-3 md:py-4 bg-[#3E34FA] text-white rounded-xl font-bold shadow-md hover:bg-[#2B24C0] transition-all">{t.loginBtn}</button></div>
                      </div>
                   ) : (
                      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                         <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 w-full"><div><h1 className="text-xl md:text-2xl font-bold text-[#2B3674]">{t.caseMgmt}</h1></div><button onClick={handleLogoutAdmin} className="px-6 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-sm">{t.logout}</button></div>
                         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                            <form key={duzenlenenVaka ? duzenlenenVaka.vaka_adi : 'yeni'} onSubmit={handleVakaKaydet} className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-slate-100 space-y-4">
                               <h3 className="text-lg font-bold text-[#2B3674] mb-4">{duzenlenenVaka ? t.updateTitle : t.addTitle}</h3>
                               <input name="vaka_adi" defaultValue={duzenlenenVaka?.vaka_adi} placeholder={t.caseName} className="w-full bg-[#F8F9FB] border border-slate-200 p-3 rounded-lg text-sm" required />
                               <textarea name="ozet" defaultValue={duzenlenenVaka?.ozet} placeholder={t.summary} rows={3} className="w-full bg-[#F8F9FB] border border-slate-200 p-3 rounded-lg text-sm" required />
                               <textarea name="kurallar" defaultValue={duzenlenenVaka?.kurallar} placeholder={t.prompt} rows={5} className="w-full bg-[#F8F9FB] border border-slate-200 p-3 rounded-lg text-sm" required />
                               <button type="submit" className="w-full py-3 bg-[#3E34FA] text-white rounded-xl font-bold text-sm">{duzenlenenVaka ? t.updateBtn : t.saveBtn}</button>
                            </form>
                            <div className="xl:col-span-2 bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-slate-100 space-y-3">{vakalar.map((v, i) => (<div key={i} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-[#F8F9FB] rounded-xl border border-slate-100 gap-4"><h4 className="font-bold text-[#2B3674]">{v.vaka_adi}</h4><div className="flex gap-2"><button onClick={() => setDuzenlenenVaka(v)} className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold">{t.edit}</button><button onClick={() => startTestSession(v)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">{t.test}</button><button onClick={() => handleVakaSil(v.vaka_adi)} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold">{t.delete}</button></div></div>))}</div>
                         </div>
                      </div>
                   )}
                </div>
             )}
             {activePage === 'seans-raporu' && (
               <div className="p-4 md:p-12 max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in zoom-in-95 duration-500">
                 <div className="bg-[#3E34FA] rounded-[24px] md:rounded-[40px] p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
                   <div className="relative z-10"><h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{t.simComplete}</h1><p className="opacity-80 text-xs md:text-sm font-medium">{t.patient}: {currentVaka?.vaka_adi || t.unknown}</p></div>
                   <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-6xl md:text-8xl opacity-20 font-black">📋</div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="col-span-1 md:col-span-2 space-y-6">
                     <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm min-h-[250px]">
                       <h3 className="text-base md:text-lg font-bold text-[#1E293B] mb-4 md:mb-6 flex items-center gap-2"><span>📈</span> {t.clinicEval}</h3>
                       {isAnalyzing ? (<div className="flex flex-col items-center justify-center h-40 space-y-4 text-center"><div className="w-10 h-10 border-4 border-[#3E34FA] border-t-transparent rounded-full animate-spin"></div><p className="text-[#3E34FA] font-bold text-sm animate-pulse">{t.aiAnalyzing}</p></div>) : (<div className="space-y-4 md:space-y-6 text-slate-600 text-xs md:text-sm leading-relaxed"><p><b className="text-[#3E34FA]">{t.therapeutic}:</b> {analizSonucu?.terapotik_ittifak}</p><div className="bg-slate-50 p-4 md:p-6 rounded-xl md:rounded-2xl border-l-4 border-[#3E34FA]"><p className="font-bold text-[#1E293B] mb-1 md:mb-2">{t.suggestion}:</p>{analizSonucu?.oneri}</div></div>)}
                     </div>
                   </div>
                   <div className="space-y-6">
                     <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm text-center flex flex-col justify-center">
                       <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">{t.empScore}</p>
                       {isAnalyzing ? (<div className="text-4xl md:text-5xl font-black text-slate-200 mb-3 animate-pulse">--</div>) : (<><div className="text-4xl md:text-5xl font-black text-[#3E34FA] mb-3 md:mb-4">%{analizSonucu?.empati_skoru || 0}</div><div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-[#3E34FA] h-full transition-all duration-1000" style={{width: `${analizSonucu?.empati_skoru || 0}%`}}></div></div></>)}
                     </div>
                     <button onClick={() => setActivePage('dashboard')} disabled={isAnalyzing} className="w-full py-3 md:py-4 bg-[#1E293B] text-white rounded-xl md:rounded-2xl font-bold text-sm shadow-md hover:bg-black transition-all disabled:opacity-50">{t.backLab}</button>
                     <button onClick={() => window.print()} disabled={isAnalyzing} className="w-full py-3 md:py-4 bg-white border border-slate-200 text-[#1E293B] rounded-xl md:rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50 mt-4">{t.printRep}</button>
                   </div>
                 </div>
               </div>
             )}
           </div>
         </section>
      </>
      )}
    </main>
  );
}