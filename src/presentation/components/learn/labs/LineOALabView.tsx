"use client";

import { LabSidebarItem, LabViewProps } from "@/src/domain/types/learn-content";
import { useEffect, useMemo, useState } from "react";

export function LineOALabView({ lesson, onSidebarUpdate, activeSidebarItemId, onExit }: LabViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: LabSidebarItem[] = useMemo(() => [
    { id: "slide-0", title: "แนะนำหลักสูตร LINE OA", icon: "💬", group: "บทนำ" },
    { id: "slide-1", title: "ภาพรวม 10 โมดูล", icon: "📋", group: "บทนำ" },
    { id: "slide-2", title: "ทำไมต้องใช้ LINE OA?", icon: "💡", group: "บทนำ" },
    { id: "slide-3", title: "สร้างบัญชี LINE OA", icon: "🔧", group: "การตั้งค่าบัญชี" },
    { id: "slide-4", title: "ตั้งค่าโปรไฟล์และแอดมิน", icon: "⚙️", group: "การตั้งค่าบัญชี" },
    { id: "slide-5", title: "ออกแบบ Rich Menu", icon: "🗂️", group: "การออกแบบและสื่อสาร" },
    { id: "slide-6", title: "Greeting & Auto-reply", icon: "🤖", group: "การออกแบบและสื่อสาร" },
    { id: "slide-7", title: "Broadcast & Content", icon: "📢", group: "การบริหารคอนเทนต์" },
    { id: "slide-8", title: "การสื่อสารและจัดการแชท", icon: "💬", group: "การบริหารคอนเทนต์" },
    { id: "slide-9", title: "Online to Offline (O2O)", icon: "🔗", group: "กลยุทธ์บริการ" },
    { id: "slide-10", title: "วิเคราะห์ผล (KPI)", icon: "📊", group: "การประเมินผล" },
    { id: "slide-11", title: "ความลับและจริยธรรม", icon: "⚖️", group: "ข้อควรระวัง" },
    { id: "slide-12", title: "บทสรุป", icon: "✓", group: "ข้อควรระวัง" },
  ], []);

  const totalSlides = slides.length;

  // Broadcast sidebar items on mount
  useEffect(() => {
    if (onSidebarUpdate) {
      onSidebarUpdate(slides, slides[currentSlide]?.id);
    }
  }, [onSidebarUpdate, slides, currentSlide]);

  // Listen to sidebar clicks
  useEffect(() => {
    if (activeSidebarItemId) {
      const index = slides.findIndex(s => s.id === activeSidebarItemId);
      if (index !== -1) {
        setCurrentSlide(prev => prev !== index ? index : prev);
      }
    }
  }, [activeSidebarItemId, slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we are focusing on input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextSlide();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevSlide();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center p-4 lg:p-8 bg-[#111] overflow-hidden" 
         style={{ fontFamily: "'Sarabun', 'IBM Plex Sans Thai', sans-serif" }}>

      {/* Embedded CSS variables for the slides */}
      <style dangerouslySetInnerHTML={{__html: `
        .line-slide-container {
          --green-deep: #00703C;
          --green-mid:  #00A550;
          --green-light:#4DC18A;
          --green-pale: #E6F7EF;
          --slate:      #1A2E22;
          --white:      #FFFFFF;
          --off-white:  #F5FAF7;
          --muted:      #6B8C78;
          --accent:     #FFD166;
          --accent2:    #06D6A0;
        }
        
        .slide-frame {
          width: 100%;
          max-width: 900px;
          min-height: 506px;
          position: relative;
          border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5);
          overflow: hidden;
          background: var(--slate);
          animation: fadeIn 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }

        .slide-tag {
          position: absolute;
          top: 24px; right: 28px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.5;
          color: rgba(255,255,255,0.4);
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 30px;
          padding: 8px 18px;
          font-size: 14px;
          font-weight: 600;
        }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
        .heading small {
          display: block;
          font-size: 11px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .heading h2 { font-size: 32px; font-weight: 700; margin-bottom: 28px; }

        .slide-nav {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 40px;
          padding: 10px 20px;
          color: #fff;
          font-size: 14px;
        }
        .slide-nav button {
          background: rgba(255,255,255,0.15);
          border: none;
          color: #fff;
          width: 36px; height: 36px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .slide-nav button:hover:not(:disabled) { background: var(--green-mid); }
        .slide-nav button:disabled { opacity: 0.3; cursor: default; }
      `}} />

      <div className="line-slide-container w-full max-w-[900px] relative flex-1 flex flex-col items-center justify-center">
        
        {/* SLIDE 1 */}
        {currentSlide === 0 && (
          <div className="slide-frame bg-[var(--slate)]! justify-center">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(0,165,80,0.25) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(77,193,138,0.15) 0%, transparent 50%)'
            }}></div>
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}></div>
            <div className="relative z-10 px-16 py-14 text-white">
              <div className="w-14 h-14 bg-[var(--green-mid)] rounded-2xl flex items-center justify-center text-3xl mb-7 shadow-[0_8px_24px_rgba(0,165,80,0.4)]">💬</div>
              <h1 className="text-5xl font-bold leading-tight mb-4 text-white">LINE <span className="text-[var(--green-light)]">Official</span><br/>Account</h1>
              <p className="text-lg text-white/65 font-light mb-10 max-w-[500px] leading-relaxed">
                คู่มือการอบรม: สร้าง ตั้งค่า และบริหาร LINE OA<br/>เพื่องานดูแลผู้รับบริการ จ.สงขลา
              </p>
              <div className="flex gap-2.5 flex-wrap">
                <div className="pill">📅 10 โมดูล</div>
                <div className="pill">🎯 กลุ่มเป้าหมาย 4 คน</div>
                <div className="pill">🔐 ปลอดภัย &amp; เป็นความลับ</div>
              </div>
            </div>
            <div className="slide-tag">LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 2 - MODULE OVERVIEW */}
        {currentSlide === 1 && (
          <div className="slide-frame bg-[var(--off-white)]! p-14 text-[var(--slate)]">
            <div className="heading mb-8">
              <small className="text-[var(--green-mid)]">ภาพรวม</small>
              <h2 className="text-[var(--slate)]!">10 โมดูล ที่คุณจะได้เรียนวันนี้</h2>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[
                { n: "01", icon: "💡", title: "รู้จัก LINE OA" },
                { n: "02", icon: "🔧", title: "สร้างบัญชี" },
                { n: "03", icon: "⚙️", title: "ตั้งค่าบัญชี & แอดมิน" },
                { n: "04", icon: "🗂️", title: "ออกแบบ Rich Menu" },
                { n: "05", icon: "👋", title: "Greeting Message" },
                { n: "06", icon: "🤖", title: "Auto-reply" },
                { n: "07", icon: "📢", title: "Broadcast & Content" },
                { n: "08", icon: "💬", title: "จัดการแชท" },
                { n: "09", icon: "🔗", title: "Online to Offline" },
                { n: "10", icon: "📊", title: "วิเคราะห์ผล & KPI" }
              ].map(m => (
                <div key={m.n} className="bg-white rounded-xl p-3.5 border border-[rgba(0,112,60,0.1)] flex flex-col gap-2 transition-transform hover:-translate-y-0.5">
                  <div className="text-[11px] font-bold text-[var(--green-mid)] tracking-[1.5px]">{m.n}</div>
                  <div className="text-[22px]">{m.icon}</div>
                  <div className="text-[13px] font-semibold text-[var(--slate)] leading-tight">{m.title}</div>
                </div>
              ))}
            </div>
            <div className="slide-tag">LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 3 - WHY LINE OA */}
        {currentSlide === 2 && (
          <div className="slide-frame bg-[var(--slate)]! p-14">
            <div className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full" style={{background: 'radial-gradient(circle, rgba(0,165,80,0.3), transparent 70%)'}}></div>
            <div className="heading relative z-10 text-white">
              <small className="text-[var(--green-light)]">โมดูล 01</small>
              <h2 className="text-white!">ทำไมต้องใช้ LINE OA ในงานนี้?</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {[
                { icon: "📡", title: "Broadcast — ส่งข้อมูลพร้อมกัน", desc: "แจ้งความรู้ HIV/HCV/HBV และกิจกรรมบริการถึงกลุ่มเป้าหมายได้พร้อมกันทีเดียว" },
                { icon: "🗂️", title: "Rich Menu — เมนูเข้าถึงบริการ", desc: "ผู้รับบริการกดเมนูเพื่อนัดหมาย ขอรับอุปกรณ์ หรือดูข้อมูลได้ทันที ไม่ต้องพิมพ์" },
                { icon: "🤖", title: "Auto-reply — ตอบ 24 ชั่วโมง", desc: "ตั้ง keyword ตอบข้อมูลบริการอัตโนมัติ ลดภาระทีมและไม่ทิ้งผู้รับบริการ" },
                { icon: "🔒", title: "Chat — สนทนาส่วนตัว ปลอดภัย", desc: "คัดกรองและส่งต่อบริการแบบตัวต่อตัว รักษาความลับตามมาตรฐานงานสุขภาพ" }
              ].map((f, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4 items-start">
                  <div className="w-11 h-11 shrink-0 bg-[var(--green-mid)] rounded-xl flex items-center justify-center text-xl">{f.icon}</div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-[13px] text-white/60 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="slide-tag">LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 4 - CREATE ACCOUNT */}
        {currentSlide === 3 && (
          <div className="slide-frame bg-white! p-14 text-[var(--slate)]">
            <div className="heading">
              <small className="text-[var(--green-mid)]">โมดูล 02</small>
              <h2 className="text-[var(--slate)]!">สร้างบัญชี LINE OA</h2>
            </div>
            <div className="two-col" style={{gridTemplateColumns: '1fr 1fr'}}>
              <div>
                <div className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--green-mid)] mb-3">วิธีที่ 1 — แนะนำสำหรับองค์กร</div>
                {[
                  { n: "1", title: "เปิด LINE Manager", desc: "manager.line.biz", isLink: true },
                  { n: "2", title: "กด \"สร้างบัญชี\"", desc: "ใช้ LINE Account ส่วนตัว หรือ Email" },
                  { n: "3", title: "กรอกข้อมูลองค์กร", desc: "ชื่อบัญชี → ประเภท \"บริการสุขภาพ\" → อีเมล" },
                  { n: "4", title: "กด \"สร้าง\" และรอการยืนยัน", desc: "" }
                ].map((s, i) => (
                  <div key={i} className="flex gap-3.5 mb-4 items-start">
                    <div className="w-8 h-8 shrink-0 bg-[var(--green-mid)] text-white rounded-full flex items-center justify-center text-sm font-bold">{s.n}</div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--slate)] mb-1">{s.title}</h4>
                      {s.isLink ? (
                        <div className="inline-block bg-[var(--green-pale)] text-[var(--green-deep)] text-[11px] font-semibold px-2.5 py-1 rounded-md font-mono mt-1">{s.desc}</div>
                      ) : (
                        s.desc && <p className="text-[13px] text-[var(--muted)] leading-relaxed">{s.desc}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--green-mid)] mb-3">วิธีที่ 2 — สำหรับเชื่อมต่อ API</div>
                {[
                  { n: "1", title: "เปิด LINE Developers Console", desc: "developers.line.biz/console", isLink: true },
                  { n: "2", title: "สร้าง Provider", desc: "ตั้งชื่อองค์กรของคุณ" },
                  { n: "3", title: "สร้าง Channel ประเภท Messaging API", desc: "ระบบจะสร้าง LINE OA ให้อัตโนมัติ" },
                  { n: "4", title: "จัดการที่ manager.line.biz", desc: "" }
                ].map((s, i) => (
                  <div key={i} className="flex gap-3.5 mb-4 items-start">
                    <div className="w-8 h-8 shrink-0 bg-[var(--green-mid)] text-white rounded-full flex items-center justify-center text-sm font-bold">{s.n}</div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--slate)] mb-1">{s.title}</h4>
                      {s.isLink ? (
                        <div className="inline-block bg-[var(--green-pale)] text-[var(--green-deep)] text-[11px] font-semibold px-2.5 py-1 rounded-md font-mono mt-1">{s.desc}</div>
                      ) : (
                        s.desc && <p className="text-[13px] text-[var(--muted)] leading-relaxed">{s.desc}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="slide-tag" style={{color: 'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 5 - PROFILE & ADMIN */}
        {currentSlide === 4 && (
          <div className="slide-frame bg-[var(--green-deep)]! p-14 text-white">
            <div className="heading">
              <small className="text-[var(--green-light)]">โมดูล 03</small>
              <h2 className="text-white!">ตั้งค่าโปรไฟล์ และจัดการสิทธิ์แอดมิน</h2>
            </div>
            <div className="grid grid-cols-2 gap-7">
              <div className="bg-white/10 border border-white/15 rounded-xl p-6">
                <h3 className="text-base font-bold text-[var(--accent)] mb-4">✏️ โปรไฟล์ที่ควรตั้งค่า</h3>
                {[
                  "รูปโปรไฟล์ (โลโก้องค์กร 640×640 px)",
                  "ชื่อบัญชีภาษาไทยที่จดจำได้ง่าย",
                  "คำอธิบาย: บริการอะไร เปิดเวลาใด",
                  "ปุ่ม CTA เช่น \"นัดหมาย\" หรือ \"ติดต่อเรา\"",
                  "เบอร์โทรศัพท์ (ถ้าเหมาะสม)"
                ].map((c, i) => (
                  <div key={i} className="flex gap-2.5 mb-2.5 text-sm text-white/85">
                    <span className="text-[var(--green-light)] text-base shrink-0">✓</span>
                    <span>{c}</span>
                  </div>
                ))}
                <div className="mt-3.5 text-xs text-white/50">📍 เส้นทาง: manager.line.biz → โปรไฟล์ธุรกิจ</div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl p-6">
                <h3 className="text-base font-bold text-[var(--accent)] mb-4">🔑 ระดับสิทธิ์แอดมิน</h3>
                {[
                  { name: "Admin", desc: "จัดการทุกอย่าง + เพิ่ม/ลบแอดมิน", badge: "ADMIN", bClass: "bg-[var(--accent)] text-[var(--slate)]" },
                  { name: "Operator", desc: "ส่งข้อความ ตอบแชท สร้างคอนเทนต์", badge: "OP", bClass: "bg-[var(--green-light)] text-[var(--slate)]" },
                  { name: "Viewer", desc: "ดูสถิติและข้อมูลเท่านั้น", badge: "VIEW", bClass: "bg-white/20 text-white" }
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/20 rounded-lg py-3 px-4 mb-2">
                    <div>
                      <div className="text-sm font-bold text-white">{r.name}</div>
                      <div className="text-xs text-white/60 mt-0.5">{r.desc}</div>
                    </div>
                    <div className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide ${r.bClass}`}>{r.badge}</div>
                  </div>
                ))}
                <div className="mt-3.5 text-xs text-white/50">📍 ตั้งค่า → การจัดการสิทธิ์</div>
              </div>
            </div>
            <div className="slide-tag">LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 6 - RICH MENU */}
        {currentSlide === 5 && (
          <div className="slide-frame bg-[var(--off-white)]! p-14 text-[var(--slate)]">
            <div className="heading">
              <small className="text-[var(--green-mid)]">โมดูล 04</small>
              <h2 className="text-[var(--slate)]! mb-2">ออกแบบ Rich Menu</h2>
              <p className="text-sm text-[var(--muted)] mb-6">เมนูที่ปรากฏด้านล่างหน้าแชท ให้ผู้รับบริการกดเข้าถึงบริการได้ทันที</p>
            </div>
            <div className="grid grid-cols-[1.1fr_0.9fr] gap-8">
              <div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/5">
                  <div className="bg-[var(--slate)] px-4 py-3.5 flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[var(--green-mid)] rounded-full flex items-center justify-center text-base">💚</div>
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">กลุ่มสงขลา [ชื่อองค์กร]</div>
                      <div className="text-[11px] text-white/50">บริการด้านสุขภาพ</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-0.5 bg-[#e0e8e3] p-0.5">
                    <div className="bg-white p-4 text-center text-xs font-semibold text-[var(--slate)] flex flex-col items-center gap-1 cursor-pointer hover:bg-[var(--green-pale)] transition-colors"><span className="text-xl">🩺</span>นัดรับบริการ</div>
                    <div className="bg-white p-4 text-center text-xs font-semibold text-[var(--slate)] flex flex-col items-center gap-1 cursor-pointer hover:bg-[var(--green-pale)] transition-colors"><span className="text-xl">📦</span>ขอรับอุปกรณ์</div>
                    <div className="bg-white p-4 text-center text-xs font-semibold text-[var(--slate)] flex flex-col items-center gap-1 cursor-pointer hover:bg-[var(--green-pale)] transition-colors"><span className="text-xl">🧪</span>ตรวจด้วยตนเอง</div>
                    <div className="bg-white p-4 text-center text-xs font-semibold text-[var(--slate)] flex flex-col items-center gap-1 cursor-pointer hover:bg-[var(--green-pale)] transition-colors"><span className="text-xl">📞</span>ติดต่อทีมงาน</div>
                    <div className="bg-white p-4 text-center text-xs font-semibold text-[var(--slate)] flex flex-col items-center gap-1 cursor-pointer hover:bg-[var(--green-pale)] transition-colors col-span-2 border-t border-[#e0e8e3]"><span className="text-xl">ℹ️</span>ข้อมูลบริการ / FAQ</div>
                  </div>
                </div>
                <p className="text-[12px] text-[var(--muted)] mt-2.5 text-center">ตัวอย่าง Rich Menu สำหรับองค์กร</p>
              </div>
              <div>
                {[
                  { n: "1", title: "กด \"สร้างริชเมนู\"", desc: "ริชเมนู → ใน manager.line.biz" },
                  { n: "2", title: "เลือก Layout", desc: "2-6 ปุ่ม ตามความต้องการ" },
                  { n: "3", title: "อัปโหลดรูป Background", desc: "ขนาด 2500×1686 px แนะนำ" },
                  { n: "4", title: "กำหนด Action แต่ละปุ่ม", desc: "ข้อความ / ลิงก์ / โทรศัพท์" },
                  { n: "5", title: "กด \"เผยแพร่\"", desc: "" }
                ].map((s, i) => (
                  <div key={i} className="flex gap-3.5 mb-3.5 items-start">
                    <div className="w-8 h-8 shrink-0 bg-[var(--green-mid)] text-white rounded-full flex items-center justify-center text-sm font-bold">{s.n}</div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--slate)] mb-1">{s.title}</h4>
                      {s.desc && <p className="text-[13px] text-[var(--muted)] leading-relaxed">{s.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="slide-tag" style={{color: 'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 7 - GREETING & AUTO-REPLY */}
        {currentSlide === 6 && (
          <div className="slide-frame bg-[var(--slate)]! p-14 text-white">
            <div className="heading">
              <small className="text-[var(--green-light)]">โมดูล 05 — 06</small>
              <h2 className="text-white!">Greeting Message & Auto-reply</h2>
            </div>
            <div className="grid grid-cols-2 gap-7">
              <div className="bg-white/10 border border-white/10 rounded-xl p-5">
                <h3 className="text-[13px] font-bold text-[var(--accent)] tracking-[1px] uppercase mb-3.5">👋 ตัวอย่างข้อความทักทาย</h3>
                <div className="bg-[var(--green-mid)] text-white rounded-[16px_16px_16px_4px] p-3.5 text-[13px] leading-relaxed">
                  สวัสดีครับ/ค่ะ 👋<br/><br/>
                  ยินดีต้อนรับสู่ [ชื่อองค์กร]<br/>
                  เราให้บริการด้าน:<br/>
                  • ตรวจคัดกรอง HIV / HCV / HBV<br/>
                  • ชุดอุปกรณ์สะอาดและป้องกัน<br/>
                  • คำปรึกษาและส่งต่อบริการ<br/><br/>
                  ข้อมูลทุกอย่าง <strong>เป็นความลับ 🔒</strong><br/><br/>
                  กดเมนูด้านล่างเพื่อเริ่มต้นได้เลยครับ/ค่ะ
                </div>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-xl p-5">
                <h3 className="text-[13px] font-bold text-[var(--accent)] tracking-[1px] uppercase mb-3.5">🤖 Keyword Auto-reply</h3>
                <table className="w-full">
                  <tbody>
                    {[
                      { k: "\"นัดหมาย\"", r: "→ ส่งลิงก์ Google Form" },
                      { k: "\"ตรวจ HIV\"", r: "→ ข้อมูลชุดตรวจที่บ้าน" },
                      { k: "\"ฟรี\"", r: "→ บริการทุกอย่างไม่มีค่าใช้จ่าย 💚" },
                      { k: "\"เวลาทำการ\"", r: "→ จ-ศ เวลา 9:00-17:00 น." },
                      { k: "\"อุปกรณ์\"", r: "→ ข้อมูลการรับชุดอุปกรณ์" }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/10 last:border-0">
                        <td className="py-2.5 text-[12px] font-bold font-mono text-[var(--accent)] whitespace-nowrap pr-4">{row.k}</td>
                        <td className="py-2.5 text-[13px] text-white/75 leading-relaxed">{row.r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="slide-tag">LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 8 - BROADCAST & CONTENT */}
        {currentSlide === 7 && (
          <div className="slide-frame bg-white! p-14 text-[var(--slate)]">
            <div className="heading">
              <small className="text-[var(--green-mid)]">โมดูล 07</small>
              <h2 className="text-[var(--slate)]!">Broadcast & Content Calendar</h2>
            </div>
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-8">
              <div>
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {[
                    { icon: "📝", title: "ข้อความธรรมดา", desc: "แจ้งข่าวทั่วไป" },
                    { icon: "🖼️", title: "รูปภาพ / อินโฟกราฟิก", desc: "ให้ความรู้ด้วยภาพ" },
                    { icon: "🃏", title: "Flex Message", desc: "การ์ดสวยงาม มีปุ่มกด" },
                    { icon: "🎬", title: "วิดีโอ", desc: "ไม่เกิน 200 MB" }
                  ].map((t, i) => (
                    <div key={i} className="bg-[var(--off-white)] border border-[rgba(0,112,60,0.08)] rounded-lg p-3.5 flex gap-2.5 items-start">
                      <div className="text-[22px]">{t.icon}</div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[var(--slate)] mb-0.5">{t.title}</h4>
                        <p className="text-[12px] text-[var(--muted)]">{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#FFF8E6] border-l-4 border-[var(--accent)] rounded-lg p-3 text-[13px] text-[#7A5C00] flex gap-2">
                  <span>⚠️</span>
                  <span>ส่ง Broadcast ไม่เกิน <strong>2-3 ครั้งต่อสัปดาห์</strong> เพื่อไม่ให้ผู้ติดตามรู้สึกรบกวน</span>
                </div>
              </div>
              <div className="bg-[var(--off-white)] border border-[rgba(0,112,60,0.08)] rounded-xl p-5">
                <h3 className="text-[14px] font-bold text-[var(--slate)] mb-3.5">📅 ตัวอย่าง Content Calendar</h3>
                {[
                  { d: "ต้นสัปดาห์", c: "ให้ความรู้ — อินโฟกราฟิก HIV/HCV" },
                  { d: "กลางสัปดาห์", c: "บริการ — แจ้งวันบริการ ขอรับอุปกรณ์" },
                  { d: "ปลายสัปดาห์", c: "Engagement — ถาม-ตอบ ความต้องการ" }
                ].map((c, i) => (
                  <div key={i} className="flex gap-2.5 items-center py-2.5 border-b border-black/5 last:border-0 text-[13px]">
                    <div className="w-[68px] shrink-0 font-bold text-[var(--green-mid)]">{c.d}</div>
                    <div className="text-[var(--muted)]">{c.c}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="slide-tag" style={{color: 'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 9 - CHAT & COMMUNICATION */}
        {currentSlide === 8 && (
          <div className="slide-frame bg-[var(--off-white)]! p-14 text-[var(--slate)]">
            <div className="heading">
              <small className="text-[var(--green-mid)]">โมดูล 08</small>
              <h2 className="text-[var(--slate)]!">การสื่อสารและจัดการแชทอย่างมืออาชีพ</h2>
            </div>
            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-3.5">
                <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="bg-[var(--green-mid)] text-white px-5 py-3.5 text-[13px] font-bold tracking-[1.5px] uppercase">✅ ควรทำ</div>
                  <div className="py-1.5">
                    {[
                      "ใช้ภาษาที่เป็นมิตร ไม่ตัดสิน (Non-judgmental)",
                      "ตอบภายใน 24 ชั่วโมง (เร็วกว่าดีกว่า)",
                      "ยืนยันความลับก่อนให้ข้อมูลสำคัญ",
                      "ใช้ชื่อ/สรรพนามที่ผู้รับบริการต้องการ"
                    ].map((item, i) => (
                      <div key={i} className="flex gap-2.5 px-4 py-2.5 text-[13px] text-[var(--slate)] leading-relaxed border-b border-black/5 last:border-0">
                        <span className="shrink-0">💚</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="bg-[#FF6B6B] text-white px-5 py-3.5 text-[13px] font-bold tracking-[1.5px] uppercase">❌ ไม่ควรทำ</div>
                  <div className="py-1.5">
                    {[
                      "ถามข้อมูลส่วนตัวที่ไม่จำเป็น",
                      "แชร์ข้อมูลผู้รับบริการโดยไม่เข้ารหัส",
                      "ใช้ภาษาที่ตัดสินหรือดูถูก"
                    ].map((item, i) => (
                      <div key={i} className="flex gap-2.5 px-4 py-2.5 text-[13px] text-[var(--slate)] leading-relaxed border-b border-black/5 last:border-0">
                        <span className="shrink-0">🔴</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
                <h3 className="text-[14px] font-bold text-[var(--slate)] mb-3.5">🔄 Flow การคัดกรองและส่งต่อ</h3>
                {[
                  "รับข้อมูลเบื้องต้น (อาการ/ความต้องการ)",
                  "ประเมินบริการที่เหมาะสม<br><strong>ตรวจเบื้องต้น → ชุดตรวจที่บ้าน</strong>",
                  "<strong>ผลบวก</strong> → นัดส่งต่อโรงพยาบาลตามสิทธิ์",
                  "ส่งข้อมูลช่องทาง <strong>CTS / C-Free</strong>",
                  "ยืนยันนัดหมาย / การส่งต่อ",
                  "ติดตามผลหลัง <strong>1-2 สัปดาห์</strong>"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 mb-2.5 items-start">
                    <div className="w-6 h-6 shrink-0 bg-[var(--green-pale)] text-[var(--green-deep)] rounded-full flex items-center justify-center text-[12px] font-bold">{i + 1}</div>
                    <p className="text-[13px] text-[var(--slate)] leading-relaxed pt-0.5" dangerouslySetInnerHTML={{__html: item}}></p>
                  </div>
                ))}
              </div>
            </div>
            <div className="slide-tag" style={{color: 'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 10 - O2O FLOW */}
        {currentSlide === 9 && (
          <div className="slide-frame bg-[var(--slate)]! p-14 text-white">
            <div className="heading">
              <small className="text-[var(--green-light)]">โมดูล 09</small>
              <h2 className="text-white!">Online to Offline — จาก LINE สู่บริการจริง</h2>
            </div>
            <div className="flex items-center flex-wrap mb-7 justify-between w-full">
              {[
                { icon: "👥", t: "เพิ่มเพื่อน LINE OA" },
                { icon: "👋", t: "ได้รับ Greeting & Rich Menu" },
                { icon: "📋", t: "กรอก Google Form" },
                { icon: "✅", t: "ยืนยันนัดทาง LINE" },
                { icon: "🏥", t: "รับบริการ" },
                { icon: "📲", t: "ติดตามผล" }
              ].map((s, i, arr) => (
                <div key={i} className="flex items-center">
                  <div className="bg-white/10 border border-white/10 rounded-xl p-3 text-center min-w-[90px] text-[12px] text-white/80 font-semibold">
                    <span className="block text-[22px] mb-1.5">{s.icon}</span>
                    <div style={{maxWidth: '80px', margin: '0 auto', lineHeight: '1.2'}}>{s.t}</div>
                  </div>
                  {i < arr.length - 1 && <div className="text-[var(--green-light)] text-xl mx-2">→</div>}
                </div>
              ))}
            </div>
            <div className="text-[14px] font-bold text-white/60 tracking-[2px] uppercase mb-4">เครื่องมือที่ใช้ร่วมกัน</div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: "📝", title: "Google Forms", desc: "ฟอร์มนัดหมาย / ลงทะเบียน" },
                { icon: "📊", title: "Google Sheets", desc: "ติดตามข้อมูลผู้รับบริการ" },
                { icon: "🎨", title: "Canva", desc: "ออกแบบอินโฟกราฟิก Rich Menu" },
                { icon: "📷", title: "QR Code", desc: "สร้าง QR เพิ่มเพื่อน LINE OA" }
              ].map((t, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1.5">
                  <div className="text-xl">{t.icon}</div>
                  <h4 className="text-[13px] font-bold text-white">{t.title}</h4>
                  <p className="text-[12px] text-white/55 leading-snug">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="slide-tag">LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 11 - KPI & ANALYTICS */}
        {currentSlide === 10 && (
          <div className="slide-frame bg-white! p-14 text-[var(--slate)]">
            <div className="heading">
              <small className="text-[var(--green-mid)]">โมดูล 10</small>
              <h2 className="text-[var(--slate)]!">วิเคราะห์ผลและตัวชี้วัด (KPI)</h2>
            </div>
            <div className="grid grid-cols-2 gap-7">
              <div>
                <div className="text-[13px] font-bold text-[var(--muted)] tracking-[1.5px] uppercase mb-3">ตัวชี้วัดหลักที่ควรติดตาม</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Followers", val: "↑", unit: "เพิ่มขึ้นทุกเดือน" },
                    { label: "Block Rate", val: "<5%", unit: "ยิ่งต่ำยิ่งดี" },
                    { label: "Open Rate", val: ">20%", unit: "อัตราเปิดอ่าน" },
                    { label: "Click Rate", val: ">5%", unit: "อัตราคลิกลิงก์" }
                  ].map((k, i) => (
                    <div key={i} className="bg-[var(--off-white)] border border-[rgba(0,112,60,0.1)] rounded-xl p-4">
                      <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[1.5px] mb-1">{k.label}</div>
                      <div className="text-[28px] font-bold text-[var(--green-deep)] leading-tight">{k.val}</div>
                      <div className="text-[13px] text-[var(--muted)]">{k.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[13px] font-bold text-[var(--muted)] tracking-[1.5px] uppercase mb-3">วิเคราะห์และปรับกลยุทธ์</div>
                <div>
                  {[
                    { icon: "📭", title: "Open Rate ต่ำ", desc: "ปรับเวลาส่ง หรือเปลี่ยนหัวข้อให้น่าสนใจขึ้น" },
                    { icon: "🚫", title: "Block Rate สูง", desc: "ส่ง Broadcast บ่อยเกินไป หรือเนื้อหาไม่ตรงความต้องการ" },
                    { icon: "👆", title: "Click Rate ต่ำ", desc: "ปุ่ม CTA ไม่ชัดเจน หรือลิงก์ปลายทางไม่น่าสนใจ" }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 py-3.5 border-b border-black/5 last:border-0 items-start">
                      <div className="w-9 h-9 shrink-0 rounded-[10px] bg-[var(--green-pale)] flex items-center justify-center text-[17px]">{item.icon}</div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[var(--slate)] mb-1">{item.title}</h4>
                        <p className="text-[12px] text-[var(--muted)] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="slide-tag" style={{color: 'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 12 - SECURITY & ETHICS */}
        {currentSlide === 11 && (
          <div className="slide-frame bg-[var(--green-deep)]! p-14 text-white">
            <div className="heading">
              <small className="text-[var(--green-light)]">สำคัญมาก</small>
              <h2 className="text-white!">ความลับและจริยธรรมในการใช้งาน</h2>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {[
                { icon: "🔕", title: "ห้ามระบุตัวตนในกลุ่ม", desc: "ไม่ระบุชื่อหรือข้อมูลผู้รับบริการในการสนทนากลุ่มหรือพื้นที่สาธารณะ" },
                { icon: "📵", title: "ห้ามแชร์ Screenshot แชท", desc: "ไม่ถ่ายภาพหน้าจอแชทแล้วแชร์ต่อโดยไม่ได้รับอนุญาต" },
                { icon: "👤", title: "ใช้บัญชีแยกจากส่วนตัว", desc: "แต่ละคนในทีมมีบัญชีแอดมินแยกต่างหาก เพื่อความรับผิดชอบ" },
                { icon: "🔑", title: "เปลี่ยนรหัสผ่านทุก 3 เดือน", desc: "และลบสิทธิ์แอดมินที่ออกจากทีมทันที" },
                { icon: "⚖️", title: "ข้อมูลที่ได้รับทาง LINE คือข้อมูลสุขภาพ", desc: "ถือเป็นข้อมูลที่ต้องปกปิดตามกฎหมาย ห้ามเปิดเผยหรือนำไปใช้นอกเหนือวัตถุประสงค์บริการ", full: true }
              ].map((item, i) => (
                <div key={i} className={`bg-white/10 border border-white/10 rounded-xl p-4 flex gap-3.5 items-start ${item.full ? 'col-span-2' : ''}`}>
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-[18px]">{item.icon}</div>
                  <div>
                    <h4 className="text-[14px] font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-[12px] text-white/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="slide-tag">LINE OA Training 2025</div>
          </div>
        )}

        {/* SLIDE 13 - CLOSING */}
        {currentSlide === 12 && (
          <div className="slide-frame bg-[var(--slate)]! items-center justify-center text-center p-14">
            <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at center, rgba(0,165,80,0.25) 0%, transparent 65%)'}}></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-[var(--green-mid)] rounded-full flex items-center justify-center text-[40px] mb-6 shadow-[0_12px_40px_rgba(0,165,80,0.4)] text-white">✓</div>
              <h2 className="text-[40px] font-bold text-white mb-3">พร้อมแล้ว!</h2>
              <p className="text-[18px] text-white/65 max-w-[500px] leading-relaxed mb-8">
                ขอบคุณทุกท่านที่เข้าร่วมการอบรม<br/>
                ให้ LINE OA เป็นสะพานเชื่อมบริการสู่กลุ่มเป้าหมายของเรา
              </p>
              <div className="flex gap-3 flex-wrap justify-center mt-6">
                <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-[13px] text-white font-bold flex flex-col gap-0.5 min-w-[160px]">
                  manager.line.biz
                  <span className="text-[11px] font-normal text-[var(--green-light)]">จัดการบัญชี LINE OA</span>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-[13px] text-white font-bold flex flex-col gap-0.5 min-w-[160px]">
                  developers.line.biz
                  <span className="text-[11px] font-normal text-[var(--green-light)]">สำหรับเชื่อมต่อ API</span>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-[13px] text-white font-bold flex flex-col gap-0.5 min-w-[160px]">
                  entry.line.biz
                  <span className="text-[11px] font-normal text-[var(--green-light)]">สมัครบัญชีใหม่</span>
                </div>
              </div>
            </div>
            <div className="slide-tag">LINE OA Training 2025</div>
          </div>
        )}

        {/* NAVIGATION OVERLAY INSIDE THE IFRAME-LIKE CONTAINER */}
        <div className="slide-nav">
          <button onClick={prevSlide} disabled={currentSlide === 0}>‹</button>
          <span className="min-w-[70px] text-center opacity-80 whitespace-nowrap">
            {currentSlide + 1} / {totalSlides}
          </span>
          <button onClick={nextSlide} disabled={currentSlide === totalSlides - 1}>›</button>
          <span className="ml-2 opacity-50 text-xs hidden sm:inline whitespace-nowrap">← → หรือกดปุ่ม</span>
        </div>
      </div>
    </div>
  );
}
