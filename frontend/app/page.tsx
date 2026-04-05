"use client";
import { useState, useEffect, useRef } from 'react';

export default function PsikoSimMaster() {
  const [activePage, setActivePage] = useState('dashboard');
  const [vakalar, setVakalar] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Yetkili Paneli State'leri
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [duzenlenenVaka, setDuzenlenenVaka] = useState<any>(null); // YENİ: Düzenleme Modu

  // Chat ve Seans State'leri
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mesajlar, setMesajlar] = useState<any[]>([]);
  const [seansSuresi, setSeansSuresi] = useState(0);
  const [currentVaka, setCurrentVaka] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [chatPopup, setChatPopup] = useState<string | null>(null);
  
  // YENİ: Test Modu State'i
  const [isTestMode, setIsTestMode] = useState(false);

  // Kullanıcı Profil State'leri
  const [showProfileModal, setShowProfileModal] = useState(true);
  const [userName, setUserName] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempTitle, setTempTitle] = useState("");

  // Backend'den vakaları çekme
  const vakaYukle = async () => {
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`https://psikosim-backend.onrender.com/vakalar?t=${timestamp}`, { 
        cache: 'no-store'
      });
      
      const data = await res.json();
      const gercekDizi = Array.isArray(data) ? data : data.vakalar;

      if (gercekDizi && Array.isArray(gercekDizi)) {
        setVakalar(gercekDizi);
      }
    } catch (err) { 
      console.error("Bağlantı koptu:", err); 
    }
  };

  // Tetikleyici: Sayfa değiştikçe vakaları tazele
  useEffect(() => {
    vakaYukle();
  }, [activePage]);

  // Seans Süresi Timer
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

  // Yeni mesaj geldiğinde en aşağı kaydır
  useEffect(() => {
    if (activePage === 'chat-session') {
       scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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
        const guncelVeri = {
          eski_vaka_adi: duzenlenenVaka.vaka_adi,
          yeni_vaka_adi: formData.get("vaka_adi"),
          ozet: formData.get("ozet"),
          kurallar: formData.get("kurallar")
        };

        await fetch(`https://psikosim-backend.onrender.com/vaka-guncelle`, { 
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(guncelVeri)
        });
        setDuzenlenenVaka(null);
      } else {
        const vakaVerisi = {
          vaka_adi: formData.get("vaka_adi"),
          ozet: formData.get("ozet"),
          kurallar: formData.get("kurallar")
        };
        await fetch("https://psikosim-backend.onrender.com/vaka-ekle", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vakaVerisi)
        });
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
        if(res.ok) {
            setVakalar(prev => prev.filter(v => v.vaka_adi !== adi));
            vakaYukle();
        }
      } catch (err) {
          console.error("Silme hatası:", err);
      }
    }
  };

  const handleTesttenKaydet = async () => {
    if(!currentVaka) return;
    try {
      const guncelVeri = {
        eski_vaka_adi: currentVaka.vaka_adi,
        yeni_vaka_adi: currentVaka.vaka_adi, 
        ozet: currentVaka.ozet, 
        kurallar: currentVaka.kurallar 
      };
      const res = await fetch(`https://psikosim-backend.onrender.com/vaka-guncelle`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(guncelVeri)
      });
      if(res.ok) {
        alert("Canlı test kuralları başarıyla veritabanına kaydedildi!");
        vakaYukle();
      } else { alert("Kaydetme hatası!"); }
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
                    if (data.text) {
                        mesajIlet(data.text, true); 
                    }
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
     
     const systemPrompt = `SENİN KİMLİĞİN: ${vakaKurallari}
     
     KESİN EMİRLER:
     1. Sen bir yapay zeka veya asistan DEĞİLSİN. Sen sadece ve sadece bu karakterin kendisisin.
     2. Karşındaki kişi senin TERAPİSTİN. Sen ona yardım etmeyeceksin, o SANA yardım edecek.
     3. ASLA "Size nasıl yardımcı olabilirim?", "Nasıl hissediyorsunuz?" gibi terapist cümleleri kurma.
     4. Kullanıcı "Merhaba" dediğinde, sen bir sekreter gibi cevap verme. Şöyle de: "Merhaba... Geldim ama yine çok kötüyüm, her yer üzerime geliyor gibi..."
     5. ASLA parantez, yıldız veya başka işaretler kullanarak mimik, hareket veya eylem belirtme (örnek: "*derin bir nefes alır*", "(gülümser)" YAZMA). Sadece konuşma metnini düz bir şekilde yaz.
     6. Cevapların kısa, duygusal ve sadece kendi yaşadığın sıkıntılar üzerine olsun.`;

     try {
        const response = await fetch("https://psikosim-backend.onrender.com/chat", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
              messages: [
                 { role: "system", content: systemPrompt },
                 ...apiGecmis,
                 { role: "user", content: text }
              ]
           })
        });

        const data = await response.json();

        if (data.answer) {
           setMesajlar(prev => [...prev, { 
              role: 'assistant', 
              content: data.answer, 
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
           }]);

           if (voiceMode && data.audio_base64) {
              const audio = new Audio(data.audio_base64);
              audio.play();
           }
        }
     } catch (err) {
        console.error("Chat bağlantı hatası:", err);
     }
  };

  const startSession = (vaka: any) => {
    setCurrentVaka(vaka);
    setMesajlar([]);
    setChatPopup(null);
    setIsTestMode(false); 
    setActivePage('chat-session');
  };

  const startTestSession = (vaka: any) => {
    setCurrentVaka(vaka);
    setMesajlar([]);
    setChatPopup(null);
    setIsTestMode(true); 
    setActivePage('chat-session');
  };

  const handleProfileSave = () => {
    if (tempName.trim() !== "" || tempTitle.trim() !== "") {
      setUserName(tempName);
      setUserTitle(tempTitle);
      const words = tempName.trim().split(" ").filter(w => w.length > 0);
      if (words.length >= 2) {
         setUserInitials((words[0][0] + words[words.length-1][0]).toUpperCase());
      } else if (words.length === 1) {
         setUserInitials(words[0].substring(0, 2).toUpperCase());
      }
    }
    setShowProfileModal(false);
  };

  const filteredVakalar = vakalar.filter(v => (v.vaka_adi || "").toLowerCase().includes(searchTerm.toLowerCase()));

  // --- ORTAK ÜST HEADER (YENİ SVG TASARIM) ---
  const TopHeader = () => (
    <header className="h-[90px] bg-[#F8FAFC] flex items-center justify-between px-10 shrink-0 sticky top-0 z-40 border-b border-slate-100">
      <div className="flex-1 flex items-center gap-6">
         {activePage !== 'chat-session' && (
           <div className="relative w-[400px] hidden md:block">
             <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             <input 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Simülasyon veya vaka ara..." 
               className="w-full bg-white border border-slate-200 rounded-full py-3 px-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3E34FA] text-slate-700 shadow-sm" 
             />
           </div>
         )}
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600 relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200"></div> 
        
        {userName ? (
            <div className="flex items-center gap-3 cursor-pointer">
               <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-[#1E293B] leading-tight">{userName}</p>
                  <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest">{userTitle}</p>
               </div>
               <div className="w-10 h-10 bg-[#1E293B] rounded-full flex items-center justify-center text-white font-bold shadow-md">{userInitials}</div>
            </div>
        ) : (
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowProfileModal(true)}>
               <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-[#1E293B] leading-tight">Ziyaretçi</p>
                  <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest">Klinik Psikolog</p>
               </div>
               <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
               </div>
            </div>
        )}
      </div>
    </header>
  );

  return (
    <main className="flex h-screen bg-[#F8FAFC] text-[#1E293B] font-sans overflow-hidden antialiased">
      
      {/* KARŞILAMA MODALI */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl max-w-sm w-full relative">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold">✕</button>
            <div className="w-16 h-16 bg-[#F4F7FE] text-[#3E34FA] rounded-[20px] flex items-center justify-center text-2xl mb-6 shadow-inner">👋</div>
            <h2 className="text-2xl font-bold text-[#2B3674] mb-2">Hoş Geldiniz!</h2>
            <p className="text-xs text-[#A3AED0] font-bold mb-6">Profilinizi kişiselleştirmek için bilgilerinizi girebilirsiniz. (Zorunlu değil)</p>
            <div className="space-y-4 mb-8">
              <input value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-[#F8F9FB] border border-slate-200 p-4 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3E34FA] text-[#2B3674]" />
              <input value={tempTitle} onChange={e => setTempTitle(e.target.value)} placeholder="Unvan (Örn: Klinik Psikolog)" className="w-full bg-[#F8F9FB] border border-slate-200 p-4 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3E34FA] text-[#2B3674]" />
            </div>
            <button onClick={handleProfileSave} className="w-full py-4 bg-[#3E34FA] text-white rounded-xl font-bold shadow-md hover:bg-[#2B24C0] transition-all mb-3">Kaydet ve Başla</button>
            <button onClick={() => setShowProfileModal(false)} className="w-full py-3 text-[#A3AED0] font-bold text-sm hover:text-slate-600 transition-all">Boş Bırak ve Devam Et</button>
          </div>
        </div>
      )}

      {/* CHAT SESSION (3 KOLONLU GÖRÜNÜM) */}
      {activePage === 'chat-session' ? (
         <div className="flex w-full h-full bg-white relative">
            
            {/* CHAT İÇİ POP-UP MENÜLERİ */}
            {chatPopup && (
                <div className="absolute inset-0 bg-white/95 z-30 flex flex-col p-12 animate-in fade-in">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <h2 className="text-3xl font-bold text-[#2B3674]">
                            {chatPopup === 'dosya' ? 'Hasta Dosyası' : chatPopup === 'metrik' ? 'Klinik Metrikler' : 'Müdahaleler'}
                        </h2>
                        <button onClick={() => setChatPopup(null)} className="text-3xl font-bold text-slate-400 hover:text-red-500 transition-colors">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto text-lg text-slate-600">
                        {chatPopup === 'dosya' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#3E34FA]">Vaka Özeti</h3>
                                <p className="leading-relaxed">{currentVaka?.ozet || "Bu vaka için özet bulunmuyor."}</p>
                            </div>
                        )}
                        {chatPopup === 'metrik' && (
                            <div className="space-y-6">
                                <div className="bg-[#F8F9FB] p-6 rounded-2xl border border-slate-100">
                                   <p className="text-sm font-bold text-slate-400 uppercase mb-2">Toplam Etkileşim</p>
                                   <p className="text-3xl font-bold text-[#2B3674]">{mesajlar.length} Mesaj</p>
                                </div>
                                <div className="bg-[#F8F9FB] p-6 rounded-2xl border border-slate-100">
                                   <p className="text-sm font-bold text-slate-400 uppercase mb-2">Mevcut Durum</p>
                                   <p className="text-xl font-bold text-[#3E34FA]">{mesajlar.length > 5 ? "Tansiyon Artıyor" : "Gözlem Aşaması"}</p>
                                </div>
                            </div>
                        )}
                        {chatPopup === 'mudahale' && (
                            <ul className="list-none space-y-4">
                                <li className="bg-[#F8F9FB] p-6 rounded-2xl border border-slate-100">
                                   <b className="text-[#3E34FA] block mb-2">Yansıtıcı Dinleme</b> 
                                   Danışanın son söylediği kelimeleri aynalayarak empatik bağ kurun.
                                </li>
                                <li className="bg-[#F8F9FB] p-6 rounded-2xl border border-slate-100">
                                   <b className="text-[#3E34FA] block mb-2">Açık Uçlu Soru</b> 
                                   "Bu hissettiğin duyguyu biraz daha açabilir misin?"
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <aside className="w-[280px] bg-[#F8F9FB] border-r border-slate-200 flex flex-col p-6 shrink-0 z-10">
               <h2 className="text-[22px] font-bold text-[#3E34FA] tracking-tight mb-8 flex items-center gap-2">🧠 Psiko-Sim</h2>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-white">
                     <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${currentVaka?.vaka_adi || 'Selin'}&backgroundColor=b6e3f4`} alt="Danışan" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h3 className="font-bold text-[#2B3674] text-[15px] line-clamp-1">{currentVaka?.vaka_adi || "Bilinmiyor"}</h3>
                     <p className="text-[10px] text-slate-500 font-bold mt-0.5">Klinik Vaka</p>
                  </div>
               </div>
               <nav className="flex-1 space-y-2">
                  <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold bg-white text-[#3E34FA] shadow-sm border border-slate-100">
                     <span className="text-lg">⚙️</span> Session Hub
                  </button>
                  <button onClick={() => setChatPopup('dosya')} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-[#A3AED0] hover:bg-white/50 transition-all">
                     <span className="text-lg">👤</span> Hasta Dosyası
                  </button>
                  <button onClick={() => setChatPopup('metrik')} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-[#A3AED0] hover:bg-white/50 transition-all">
                     <span className="text-lg">📊</span> Metrikler
                  </button>
                  <button onClick={() => setChatPopup('mudahale')} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-[#A3AED0] hover:bg-white/50 transition-all">
                     <span className="text-lg">✨</span> Müdahaleler
                  </button>
               </nav>
               <button onClick={() => setActivePage('admin')} className="w-full py-4 bg-[#B91C1C] text-white rounded-xl font-bold text-sm shadow-md flex justify-center items-center gap-2 hover:bg-red-800 transition-all">
                  ↪ Seansı Bitir
               </button>
            </aside>

            <section className="flex-1 flex flex-col bg-[#F8FAFC] relative border-r border-slate-200">
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] text-[300px]">🧠</div>
               <header className="h-20 px-8 flex items-center justify-between border-b border-slate-100 bg-white/50 backdrop-blur-md z-10 shrink-0">
                  <div className="flex items-center gap-2 bg-[#E9E3FF] px-4 py-1.5 rounded-full">
                     <div className="w-2 h-2 bg-[#3E34FA] rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-bold text-[#3E34FA] uppercase tracking-widest">{isTestMode ? "TEST SEANSI" : "AKTİF SEANS"}</span>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-center">
                        <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">SEANS SÜRESİ</p>
                        <p className="text-xl font-black text-[#2B3674] leading-none mt-1">{formatTime(seansSuresi)}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">HASTA DURUMU</p>
                        <p className="text-sm font-bold text-[#3E34FA] leading-none mt-1">Klinik İletişim</p>
                     </div>
                  </div>
               </header>

               <div className="flex-1 overflow-y-auto p-10 space-y-6 z-10">
                  <div className="max-w-3xl mx-auto space-y-6">
                     {mesajlar.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center opacity-60 mt-20">
                           <div className="w-20 h-20 bg-[#E9E3FF] text-[#3E34FA] rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner">🛋️</div>
                           <h3 className="text-lg font-bold text-[#2B3674] mb-2">{isTestMode ? 'Test Başlıyor...' : 'Danışan odada bekliyor.'}</h3>
                           <p className="text-sm text-[#A3AED0]">{isTestMode ? 'Promptunuzu sağdan güncelleyip anında test edebilirsiniz.' : 'Seansı başlatmak için ilk sorunuzu yazabilir veya sesli olarak iletebilirsiniz.'}</p>
                        </div>
                     ) : (
                        mesajlar.map((m, i) => (
                           <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                              <div className={`p-6 rounded-[24px] text-[15px] leading-relaxed shadow-sm max-w-[85%] ${
                                 m.role === 'user' 
                                 ? 'bg-[#2111E7] text-white rounded-br-sm' 
                                 : 'bg-[#E2E8F0] text-[#2B3674] rounded-bl-sm font-medium'
                              }`}>
                                 {m.content}
                              </div>
                              <p className="text-[10px] font-bold text-[#A3AED0] uppercase mt-2 tracking-widest">
                                 {m.role === 'user' ? (userName ? userName.split(' ')[0] : 'SEN') : 'DANIŞAN'} • {m.time}
                              </p>
                           </div>
                        ))
                     )}
                     <div ref={scrollRef} />
                  </div>
               </div>

               <div className="p-8 z-10 relative">
                  <div className="max-w-3xl mx-auto relative bg-white rounded-full shadow-xl shadow-slate-200 flex items-center p-2 border border-slate-100">
                     <button onClick={toggleRecording} className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-50 text-[#3E34FA] hover:bg-indigo-100'}`}>
                        🎙️
                     </button>
                     <input 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && mesajIlet(input, false)}
                        placeholder={isRecording ? "Sizi dinliyorum..." : "Mesajınızı yazın veya sesli iletin..."}
                        disabled={isRecording}
                        className="flex-1 bg-transparent border-none py-4 px-4 text-[15px] font-medium text-slate-700 focus:outline-none placeholder:text-slate-400 disabled:opacity-50"
                     />
                     <button onClick={() => mesajIlet(input, false)} disabled={isRecording} className="w-12 h-12 bg-[#2111E7] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#1A0CB0] transition-colors disabled:opacity-50">
                        <span className="text-xl">➤</span>
                     </button>
                  </div>
               </div>
            </section>

            {isTestMode ? (
               <aside className="w-[360px] bg-[#F8F9FB] p-6 flex flex-col gap-4 overflow-y-auto shrink-0 z-10 border-l border-slate-200">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-blue-500 flex-1 flex flex-col">
                     <h3 className="text-sm font-bold text-[#2B3674] mb-2 flex items-center gap-2"><span>🧪</span> Canlı Prompt Düzenleyici</h3>
                     <p className="text-[10px] text-slate-500 font-bold mb-4 uppercase tracking-widest">Sistem Kuralları</p>
                     
                     <textarea 
                        value={currentVaka?.kurallar || ""}
                        onChange={(e) => setCurrentVaka({...currentVaka, kurallar: e.target.value})}
                        className="flex-1 w-full bg-[#F8F9FB] border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner resize-none mb-4"
                     />
                     
                     <button onClick={handleTesttenKaydet} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
                        💾 Kalıcı Olarak Kaydet
                     </button>
                  </div>
               </aside>
            ) : (
               <aside className="w-[360px] bg-[#F8F9FB] p-6 flex flex-col gap-6 overflow-y-auto shrink-0 z-10">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-[#3E34FA]">
                     <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">STRES SEVİYESİ</h4>
                     </div>
                     <div className="flex items-end justify-between h-24 gap-2 mb-4 opacity-50">
                        {[1,2,3,4,5,6,7].map(i => (
                           <div key={i} className="w-full rounded-md bg-[#E9E3FF] transition-all duration-500" style={{height: `${Math.min(20 + (mesajlar.length * 8) + (Math.random() * 10), 100)}%`}}></div>
                        ))}
                     </div>
                     <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">{mesajlar.length > 0 ? "Canlı Ölçüm Aktif" : "Bekleniyor"}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                     <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">EMPATİ UYUMU</h4>
                     </div>
                     <div className="w-full h-3 bg-slate-100 rounded-full mb-4 overflow-hidden">
                        <div className="h-full bg-[#3E34FA] rounded-full transition-all duration-1000" style={{width: `${Math.min(mesajlar.length * 15, 100)}%`}}></div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-slate-100 text-[#3E34FA] rounded-full flex items-center justify-center text-[10px]">{mesajlar.length > 0 ? '📈' : '⌛'}</div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mesajlar.length > 0 ? "Analiz Ediliyor" : "SEANSIN BAŞLAMASI BEKLENİYOR"}</span>
                     </div>
                  </div>

                  <div className="mt-auto">
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">HIZLI NOTLAR</h4>
                     <textarea rows={4} placeholder="Seans notlarını buraya girin..." className="w-full bg-white border border-slate-100 rounded-3xl p-5 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#3E34FA] shadow-sm resize-none"></textarea>
                  </div>
               </aside>
            )}
         </div>
      ) : (
      /* CHAT DIŞINDAKİ SAYFALAR (YENİ SVG MENÜ) */
      <>
        <aside className="w-[260px] bg-[#F8FAFC] border-r border-slate-200 flex flex-col shrink-0 z-50">
          <div className="flex items-center gap-3 p-8 cursor-pointer" onClick={() => setActivePage('dashboard')}>
            <div className="w-10 h-10 bg-[#3E34FA] rounded-xl flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold leading-none text-[#1E293B]">Psiko-Sim</h2>
              <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest mt-1">Laboratuvarı</p>
            </div>
          </div>

          <nav className="flex-1 flex flex-col px-4 space-y-1 mt-4">
            {[
              { id: 'dashboard', name: 'Simülasyon Lab', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /> },
              { id: 'library', name: 'Vaka Kütüphanesi', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
              { id: 'team', name: 'Ekip', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
              { id: 'about', name: 'Proje Hakkında', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> }
            ].map((item) => (
              <button key={item.id} onClick={() => setActivePage(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-full text-[14px] font-semibold transition-all ${activePage === item.id ? 'bg-[#3E34FA] text-white shadow-md' : 'text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]'}`}>
                <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                {item.name}
              </button>
            ))}
            
            {/* YETKİLİ PANELİ (EN ALTTA, ESKİSİ GİBİ AYRI) */}
            <div className="mt-auto pt-10 pb-2">
               <button onClick={() => setActivePage('admin')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-full text-[14px] font-semibold transition-all ${activePage === 'admin' ? 'bg-slate-200 text-[#1E293B] shadow-sm' : 'text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]'}`}>
                 <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                 </svg>
                 Yetkili Paneli
               </button>
            </div>
          </nav>

          {/* ALT KISIM (YENİ SİMÜLASYON BUTONU VE DESTEK) */}
          <div className="p-6 space-y-4">
            <button onClick={() => setActivePage('library')} className="w-full py-3.5 bg-[#3E34FA] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#2B24C0] transition-all flex items-center justify-center gap-2">
              <span className="text-lg">+</span> Yeni Simülasyon
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-[#64748B] hover:text-[#1E293B] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Yardım Merkezi
            </button>
          </div>
        </aside>

         <section className="flex-1 flex flex-col min-w-0">
           <TopHeader />

           <div className="flex-1 overflow-y-auto">
             
             {/* 1. DASHBOARD */}
             {activePage === 'dashboard' && (
               <div className="flex h-full animate-in fade-in duration-300">
                 <div className="flex-1 p-8 space-y-8">
                   <div className="bg-gradient-to-r from-[#2111E7] to-[#4537F3] rounded-[32px] p-12 text-white shadow-xl relative overflow-hidden">
                     <div className="relative z-10 max-w-2xl">
                       <h1 className="text-4xl font-bold mb-4 leading-snug">Psikolog Adayları İçin Geliştirilmiş Sanal Danışan Simülasyonu</h1>
                       <p className="text-indigo-100 text-base mb-8 opacity-90">Teorik bilginizi pratikle buluşturun, güvenli bir ortamda gerçek vaka deneyimleri yaşayın.</p>
                       <div className="flex gap-4">
                          <button onClick={() => setActivePage('library')} className="bg-white text-[#3E34FA] px-8 py-3.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 hover:scale-105 transition-all">▶ Vaka Seç ve Başla</button>
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-3 gap-6">
                     {[
                       { t: 'SİSTEM DURUMU', v: 'Çevrimiçi', d: 'Bağlantı Hazır', icon: '🟢', c: 'text-emerald-500', bc: 'border-emerald-400' },
                       { t: 'KAYITLI VAKA', v: `${filteredVakalar.length} Danışan`, d: 'Seans Bekliyor', icon: '👤', c: 'text-[#3E34FA]', bc: 'border-[#3E34FA]' },
                       { t: 'KLİNİK ODA', v: 'Müsait', d: 'Görüşmeye Hazır', icon: '🚪', c: 'text-slate-400', bc: 'border-[#3E34FA]' }
                     ].map((card, i) => (
                       <div key={i} className={`bg-white p-6 rounded-[24px] shadow-sm border-l-4 ${card.bc}`}>
                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-xl">{card.icon}</div>
                         <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest mb-1">{card.t}</p>
                         <p className="text-2xl font-bold text-[#2B3674] mb-2">{card.v}</p>
                         <p className={`text-[10px] font-bold uppercase flex items-center gap-1 ${card.c}`}>● {card.d}</p>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="w-[340px] bg-white border-l border-slate-200 p-8 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-8">
                       <span className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">DANIŞAN DOSYASI</span>
                       <span className="text-slate-300">🔍</span>
                    </div>
                    <div className="w-28 h-28 bg-slate-200 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg">
                       <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${filteredVakalar[0]?.vaka_adi || 'Selin'}&backgroundColor=b6e3f4`} alt="Danışan" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#2B3674] line-clamp-1">{filteredVakalar[0]?.vaka_adi || "Vaka Bulunamadı"}</h3>
                    <p className="text-sm text-[#A3AED0] font-medium mb-8">Bekleyen Simülasyon</p>
                    
                    <button onClick={() => {if(filteredVakalar[0]) startSession(filteredVakalar[0])}} className="w-full py-4 border-2 border-[#E9E3FF] text-[#3E34FA] rounded-2xl font-bold text-sm hover:bg-[#F4F7FE] transition-all flex justify-center items-center gap-2">Dosyayı İncele ➔</button>
                 </div>
               </div>
             )}

             {/* 2. VAKA KÜTÜPHANESİ */}
             {activePage === 'library' && (
               <div className="p-8 space-y-8 animate-in fade-in duration-300">
                  <div className="max-w-3xl">
                     <h1 className="text-3xl font-bold text-[#2B3674] mb-4">Simülasyon Vakaları</h1>
                     <p className="text-[#A3AED0] font-medium leading-relaxed">Klinik deneyiminizi geliştirmek için titizlikle hazırlanmış gerçekçi vaka senaryolarını keşfedin.</p>
                  </div>
                  <div className="flex gap-8">
                     <div className="flex-1 grid grid-cols-2 gap-6">
                        {filteredVakalar.map((v, i) => (
                           <div key={i} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                              <div className="h-20 bg-indigo-50 relative flex items-end p-4">
                                 <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-[#3E34FA] text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase">KLİNİK VAKA</span>
                                 </div>
                              </div>
                              <div className="p-6 flex flex-col flex-1">
                                 <h3 className="text-lg font-bold text-[#2B3674] mb-4 line-clamp-1">{v.vaka_adi}</h3>
                                 <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">{v.ozet}</p>
                                 <button onClick={() => startSession(v)} className="w-full py-3 bg-[#3E34FA] text-white rounded-xl font-bold text-sm hover:bg-[#2B24C0]">İncele ve Başlat</button>
                              </div>
                           </div>
                        ))}
                        {filteredVakalar.length === 0 && (
                            <div className="col-span-2 p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                                <p className="text-slate-400 font-bold">Aradığınız kriterde veya sistemde kayıtlı vaka bulunamadı.</p>
                                <button onClick={() => setActivePage('admin')} className="mt-4 text-[#3E34FA] font-bold text-sm hover:underline">Yetkili Panelinden Vaka Ekle</button>
                            </div>
                        )}
                     </div>
                  </div>
               </div>
             )}

             {/* 3. EKİP ÜYELERİ */}
             {activePage === 'team' && (
               <div className="p-12 space-y-12 animate-in fade-in duration-300">
                 <div className="max-w-3xl">
                   <h1 className="text-4xl font-bold text-[#3E34FA] mb-4">Ekip Üyeleri</h1>
                   <p className="text-lg text-[#A3AED0] font-medium leading-relaxed">Psiko-Sim Laboratuvarı, teknolojiyi ve psikolojiyi bir araya getirerek yarının klinik eğitimini bugün inşa ediyor. Empati odaklı yaklaşımımızla dijital simülasyonların sınırlarını zorluyoruz.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                     { n: "Emir Demir", r: "Yeni Medya ve YBS Öğrencisi", g: "Geliştirici ve Kurucu", d: "Yapay zeka ile üretime ve projelere yönelen Emir, platformun teknik altyapısını ve interaktif simülasyon motorlarını yönetiyor.", l: "https://www.linkedin.com/in/itsemirdemir/", imgUrl: "/emir.jpg" },
                     { n: "Ebru Demir", r: "Psikoloji Mezunu", g: "Vaka Yazarı", d: "Ebru, psikolojik teorileri simülasyon senaryolarına dönüştürerek kullanıcıların gerçekçi vaka analizleri yapmasını sağlıyor.", l: "https://www.linkedin.com/in/ebru-demir-81a531369/", imgUrl: "/ebru.jpg" }
                   ].map((u, i) => (
                     <div key={i} className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-md border-t-[6px] border-t-[#3E34FA] flex flex-col hover:shadow-lg transition-all">
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xl text-slate-500 overflow-hidden shadow-inner">{u.n[0]}</div>
                          <div><h3 className="text-lg font-bold text-[#2B3674]">{u.n}</h3><p className="text-xs font-bold text-[#3E34FA]">{u.r}</p></div>
                       </div>
                       <div className="flex-1 mb-6">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">GÖREV</p>
                          <p className="text-sm font-bold text-slate-800 mb-4">{u.g}</p>
                          <p className="text-sm text-slate-500 leading-relaxed">{u.d}</p>
                       </div>
                       <a href={u.l} target="_blank" rel="noreferrer" className="w-full py-3 border-2 border-indigo-50 text-[#3E34FA] rounded-xl font-bold text-sm hover:bg-[#F4F7FE] transition-all flex justify-center items-center gap-2">🔗 LinkedIn Profili</a>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* 4. PROJE HAKKINDA */}
             {activePage === 'about' && (
               <div className="p-12 space-y-8 animate-in fade-in duration-300">
                  <div className="bg-[#3E34FA] rounded-[32px] p-16 text-white flex justify-between items-center shadow-xl relative overflow-hidden">
                     <div className="relative z-10">
                        <h1 className="text-5xl font-bold mb-4">Proje Hakkında</h1>
                        <p className="text-xl text-indigo-100 font-medium max-w-2xl">Psiko-Sim, klinik psikoloji eğitimini dijital bir laboratuvara dönüştüren, empatik analizi merkeze alan bir simülasyon platformudur.</p>
                     </div>
                     <div className="text-[160px] absolute right-10 top-1/2 -translate-y-1/2 opacity-20">⚙️</div>
                  </div>
                  <div className="flex gap-8">
                     <div className="flex-1 bg-white rounded-[32px] p-12 border-l-[8px] border-[#3E34FA] shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-xl font-black">!</div>
                           <h2 className="text-3xl font-bold text-[#2B3674]">Önemli Not</h2>
                        </div>
                        <p className="text-slate-700 font-bold leading-relaxed mb-6">Bu proje psikolog adaylarının kendilerini geliştirmeleri ve alıştırma yapmaları adına yapılmıştır. Vaka içerikleri eğitim ve simülasyon amacıyla hazırlanmıştır.</p>
                        <div className="bg-[#F8F9FB] p-8 rounded-2xl border border-slate-100 mb-8">
                           <p className="text-slate-500 font-medium italic">Her bireyin yaşantısı, psikolojik yapısı ve terapi sürecine verdiği tepkiler farklıdır. Burada sunulan vakalar genellenebilir kesin doğrular değildir.</p>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed mb-8">Uygulama içeriği, kullanıcıların klinik karar verme süreçlerinin yerini almaz. Tanı koyma ve tedavi süreçleri yalnızca yetkin ruh sağlığı profesyonelleri tarafından yürütülmelidir.</p>
                     </div>
                  </div>
               </div>
             )}

             {/* 5. YETKİLİ PANELİ (ADMIN) */}
             {activePage === 'admin' && (
                <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
                   {!isAdminAuth ? (
                      <div className="flex-1 flex items-center justify-center p-8">
                         <div className="bg-white p-12 rounded-[32px] shadow-xl max-w-md w-full border border-slate-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-[#3E34FA]"></div>
                            <div className="w-20 h-20 bg-[#F4F7FE] text-[#3E34FA] rounded-[24px] flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">🔒</div>
                            <h2 className="text-2xl font-bold text-[#2B3674] mb-2">Yetkili Girişi</h2>
                            <p className="text-sm text-[#A3AED0] font-bold mb-8">Vaka kütüphanesini yönetmek için uzman şifresini girin.</p>
                            <div className="space-y-6">
                               <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Şifre (admin)" className="w-full bg-[#F8F9FB] border border-slate-200 p-4 rounded-xl text-center font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[#3E34FA] text-[#2B3674]" onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} />
                               <button onClick={handleAdminLogin} className="w-full py-4 bg-[#3E34FA] text-white rounded-xl font-bold shadow-md hover:bg-[#2B24C0] transition-all">Sisteme Giriş Yap</button>
                            </div>
                         </div>
                      </div>
                   ) : (
                      <div className="p-8 space-y-8 animate-in fade-in duration-500">
                         <div className="flex justify-between items-center bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <div>
                               <h1 className="text-2xl font-bold text-[#2B3674]">Vaka Yönetim Paneli</h1>
                               <p className="text-sm text-[#A3AED0] font-bold mt-1">Sistemdeki vakaları ekleyin, düzenleyin veya silin.</p>
                            </div>
                            <button onClick={handleLogoutAdmin} className="px-6 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-all">Güvenli Çıkış</button>
                         </div>

                         <div className="grid grid-cols-3 gap-8">
                            <form key={duzenlenenVaka ? duzenlenenVaka.vaka_adi : 'yeni_vaka'} onSubmit={handleVakaKaydet} className="col-span-1 bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 space-y-4 h-fit">
                               <h3 className="text-lg font-bold text-[#2B3674] mb-6 flex items-center justify-between">
                                  <span>{duzenlenenVaka ? "🔄 Vaka Güncelle" : "📝 Yeni Vaka Ekle"}</span>
                                  {duzenlenenVaka && <button type="button" onClick={() => setDuzenlenenVaka(null)} className="text-xs text-red-500 hover:underline">İptal Et</button>}
                               </h3>
                               
                               <div><label className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest block mb-2">Vaka Adı / Tanı</label>
                               <input name="vaka_adi" defaultValue={duzenlenenVaka?.vaka_adi} className="w-full bg-[#F8F9FB] border border-slate-200 p-3 rounded-lg text-sm font-bold text-[#2B3674] focus:outline-none focus:border-[#3E34FA]" required /></div>
                               
                               <div><label className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest block mb-2">Vaka Özeti</label>
                               <textarea name="ozet" defaultValue={duzenlenenVaka?.ozet} rows={3} className="w-full bg-[#F8F9FB] border border-slate-200 p-3 rounded-lg text-sm font-bold text-[#2B3674] focus:outline-none focus:border-[#3E34FA]" required /></div>
                               
                               <div><label className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest block mb-2">Sistem Kuralları (Prompt)</label>
                               <textarea name="kurallar" defaultValue={duzenlenenVaka?.kurallar} rows={5} className="w-full bg-[#F8F9FB] border border-slate-200 p-3 rounded-lg text-sm font-bold text-[#2B3674] focus:outline-none focus:border-[#3E34FA]" required /></div>
                               
                               <button type="submit" className={`w-full py-4 text-white rounded-xl font-bold text-sm shadow-md transition-all ${duzenlenenVaka ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#3E34FA] hover:bg-[#2B24C0]'}`}>
                                  {duzenlenenVaka ? "Vakayı Güncelle" : "Vakayı Veritabanına Kaydet"}
                               </button>
                            </form>

                            <div className="col-span-2 bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
                               <h3 className="text-lg font-bold text-[#2B3674] mb-6 flex items-center gap-2"><span>🗂️</span> Kayıtlı Vakalar ({vakalar.length})</h3>
                               <div className="space-y-4">
                                  {vakalar.map((v, i) => (
                                     <div key={i} className={`flex justify-between items-center p-5 rounded-xl border transition-all ${duzenlenenVaka?.vaka_adi === v.vaka_adi ? 'bg-amber-50 border-amber-300' : 'bg-[#F8F9FB] border-slate-100 hover:border-[#3E34FA]'}`}>
                                        <div className="flex items-center gap-4">
                                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${duzenlenenVaka?.vaka_adi === v.vaka_adi ? 'bg-amber-200 text-amber-700' : 'bg-indigo-50 text-[#3E34FA]'}`}>V{i+1}</div>
                                           <div><h4 className="font-bold text-[#2B3674]">{v.vaka_adi}</h4><p className="text-[10px] text-[#A3AED0] font-bold uppercase tracking-widest mt-1">Sistemde Kayıtlı</p></div>
                                        </div>
                                        <div className="flex gap-2">
                                           <button onClick={() => setDuzenlenenVaka(v)} className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100">Düzenle</button>
                                           <button onClick={() => startTestSession(v)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">Test Et</button>
                                           <button onClick={() => handleVakaSil(v.vaka_adi)} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100">Sil</button>
                                        </div>
                                     </div>
                                  ))}
                                  {vakalar.length === 0 && <p className="text-slate-400 italic font-bold">Sistemde hiç vaka bulunmuyor.</p>}
                               </div>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             )}
           </div>
         </section>
      </>
      )}
    </main>
  );
}