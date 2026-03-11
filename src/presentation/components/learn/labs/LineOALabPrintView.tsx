"use client";

import { forwardRef } from "react";

/**
 * Print-friendly view of all LINE OA Lab slides.
 * Renders every slide at once with page-break-after between them.
 * Used inside PrintPreviewModal with react-to-print.
 */
export const LineOALabPrintView = forwardRef<HTMLDivElement>(
  function LineOALabPrintView(_props, ref) {
    return (
      <div ref={ref} className="line-lab-print-root">
        {/* Shared CSS variables & print styles */}
        <style dangerouslySetInnerHTML={{__html: `
          .line-lab-print-root {
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
            font-family: 'Sarabun', 'IBM Plex Sans Thai', sans-serif;
          }
          .print-slide {
            width: 100%;
            max-width: 900px;
            min-height: 506px;
            margin: 0 auto 32px;
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 4px 24px rgba(0,0,0,0.12);
            page-break-after: always;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-slide:last-child {
            page-break-after: auto;
            margin-bottom: 0;
          }
          .print-slide .slide-tag {
            position: absolute;
            top: 24px; right: 28px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0.5;
            color: rgba(255,255,255,0.4);
          }
          .print-slide .pill {
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
          .print-slide .heading small {
            display: block;
            font-size: 11px; font-weight: 700;
            letter-spacing: 3px; text-transform: uppercase;
            margin-bottom: 8px;
          }
          .print-slide .heading h2 { font-size: 32px; font-weight: 700; margin-bottom: 28px; }
          @media print {
            .print-slide {
              box-shadow: none;
              border: 1px solid #ddd;
              border-radius: 0;
              margin-bottom: 0;
            }
          }
        `}} />

        {/* SLIDE 1 — แนะนำหลักสูตร */}
        <div className="print-slide" style={{background: 'var(--slate)'}}>
          <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 70% 30%, rgba(0,165,80,0.25) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(77,193,138,0.15) 0%, transparent 50%)'}} />
          <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',backgroundSize:'40px 40px'}} />
          <div style={{position:'relative',zIndex:10,padding:'56px 64px',color:'#fff'}}>
            <div style={{width:56,height:56,background:'var(--green-mid)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,marginBottom:28,boxShadow:'0 8px 24px rgba(0,165,80,0.4)'}}>💬</div>
            <h1 style={{fontSize:48,fontWeight:700,lineHeight:1.15,marginBottom:16,color:'#fff'}}>LINE <span style={{color:'var(--green-light)'}}>Official</span><br/>Account</h1>
            <p style={{fontSize:18,color:'rgba(255,255,255,0.65)',fontWeight:300,marginBottom:40,maxWidth:500,lineHeight:1.6}}>
              คู่มือการอบรม: สร้าง ตั้งค่า และบริหาร LINE OA<br/>เพื่องานดูแลผู้รับบริการ จ.สงขลา
            </p>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <div className="pill">📅 10 โมดูล</div>
              <div className="pill">🎯 กลุ่มเป้าหมาย 4 คน</div>
              <div className="pill">🔐 ปลอดภัย &amp; เป็นความลับ</div>
            </div>
          </div>
          <div className="slide-tag">LINE OA Training 2025</div>
        </div>

        {/* SLIDE 2 — ภาพรวม 10 โมดูล */}
        <div className="print-slide" style={{background:'var(--off-white)',padding:56,color:'var(--slate)'}}>
          <div className="heading" style={{marginBottom:32}}>
            <small style={{color:'var(--green-mid)'}}>ภาพรวม</small>
            <h2 style={{color:'var(--slate)'}}>10 โมดูล ที่คุณจะได้เรียนวันนี้</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
            {[
              {n:"01",icon:"💡",title:"รู้จัก LINE OA"},{n:"02",icon:"🔧",title:"สร้างบัญชี"},
              {n:"03",icon:"⚙️",title:"ตั้งค่าบัญชี & แอดมิน"},{n:"04",icon:"🗂️",title:"ออกแบบ Rich Menu"},
              {n:"05",icon:"👋",title:"Greeting Message"},{n:"06",icon:"🤖",title:"Auto-reply"},
              {n:"07",icon:"📢",title:"Broadcast & Content"},{n:"08",icon:"💬",title:"จัดการแชท"},
              {n:"09",icon:"🔗",title:"Online to Offline"},{n:"10",icon:"📊",title:"วิเคราะห์ผล & KPI"}
            ].map(m=>(
              <div key={m.n} style={{background:'#fff',borderRadius:12,padding:14,border:'1px solid rgba(0,112,60,0.1)',display:'flex',flexDirection:'column',gap:8}}>
                <div style={{fontSize:11,fontWeight:700,color:'var(--green-mid)',letterSpacing:1.5}}>{m.n}</div>
                <div style={{fontSize:22}}>{m.icon}</div>
                <div style={{fontSize:13,fontWeight:600,color:'var(--slate)',lineHeight:1.3}}>{m.title}</div>
              </div>
            ))}
          </div>
          <div className="slide-tag" style={{color:'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
        </div>

        {/* SLIDE 3 — ทำไมต้องใช้ LINE OA */}
        <div className="print-slide" style={{background:'var(--slate)',padding:56}}>
          <div style={{position:'absolute',top:-64,right:-64,width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle, rgba(0,165,80,0.3), transparent 70%)'}} />
          <div className="heading" style={{position:'relative',zIndex:10,color:'#fff'}}>
            <small style={{color:'var(--green-light)'}}>โมดูล 01</small>
            <h2 style={{color:'#fff'}}>ทำไมต้องใช้ LINE OA ในงานนี้?</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,position:'relative',zIndex:10}}>
            {[
              {icon:"📡",title:"Broadcast — ส่งข้อมูลพร้อมกัน",desc:"แจ้งความรู้ HIV/HCV/HBV และกิจกรรมบริการถึงกลุ่มเป้าหมายได้พร้อมกันทีเดียว"},
              {icon:"🗂️",title:"Rich Menu — เมนูเข้าถึงบริการ",desc:"ผู้รับบริการกดเมนูเพื่อนัดหมาย ขอรับอุปกรณ์ หรือดูข้อมูลได้ทันที ไม่ต้องพิมพ์"},
              {icon:"🤖",title:"Auto-reply — ตอบ 24 ชั่วโมง",desc:"ตั้ง keyword ตอบข้อมูลบริการอัตโนมัติ ลดภาระทีมและไม่ทิ้งผู้รับบริการ"},
              {icon:"🔒",title:"Chat — สนทนาส่วนตัว ปลอดภัย",desc:"คัดกรองและส่งต่อบริการแบบตัวต่อตัว รักษาความลับตามมาตรฐานงานสุขภาพ"}
            ].map((f,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:20,display:'flex',gap:16,alignItems:'flex-start'}}>
                <div style={{width:44,height:44,flexShrink:0,background:'var(--green-mid)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{f.icon}</div>
                <div>
                  <h3 style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:4}}>{f.title}</h3>
                  <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.5}}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="slide-tag">LINE OA Training 2025</div>
        </div>

        {/* SLIDE 4 — สร้างบัญชี */}
        <div className="print-slide" style={{background:'#fff',padding:56,color:'var(--slate)'}}>
          <div className="heading">
            <small style={{color:'var(--green-mid)'}}>โมดูล 02</small>
            <h2 style={{color:'var(--slate)'}}>สร้างบัญชี LINE OA</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'var(--green-mid)',marginBottom:12}}>วิธีที่ 1 — แนะนำสำหรับองค์กร</div>
              {[{n:"1",title:"เปิด LINE Manager",desc:"manager.line.biz",isLink:true},{n:"2",title:'กด "สร้างบัญชี"',desc:"ใช้ LINE Account ส่วนตัว หรือ Email"},{n:"3",title:"กรอกข้อมูลองค์กร",desc:'ชื่อบัญชี → ประเภท "บริการสุขภาพ" → อีเมล'},{n:"4",title:'กด "สร้าง" และรอการยืนยัน',desc:""}].map((s,i)=>(
                <div key={i} style={{display:'flex',gap:14,marginBottom:16,alignItems:'flex-start'}}>
                  <div style={{width:32,height:32,flexShrink:0,background:'var(--green-mid)',color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700}}>{s.n}</div>
                  <div>
                    <h4 style={{fontSize:14,fontWeight:700,color:'var(--slate)',marginBottom:4}}>{s.title}</h4>
                    {s.isLink ? <div style={{display:'inline-block',background:'var(--green-pale)',color:'var(--green-deep)',fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:6,fontFamily:'monospace',marginTop:4}}>{s.desc}</div> : s.desc && <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.5}}>{s.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'var(--green-mid)',marginBottom:12}}>วิธีที่ 2 — สำหรับเชื่อมต่อ API</div>
              {[{n:"1",title:"เปิด LINE Developers Console",desc:"developers.line.biz/console",isLink:true},{n:"2",title:"สร้าง Provider",desc:"ตั้งชื่อองค์กรของคุณ"},{n:"3",title:"สร้าง Channel ประเภท Messaging API",desc:"ระบบจะสร้าง LINE OA ให้อัตโนมัติ"},{n:"4",title:"จัดการที่ manager.line.biz",desc:""}].map((s,i)=>(
                <div key={i} style={{display:'flex',gap:14,marginBottom:16,alignItems:'flex-start'}}>
                  <div style={{width:32,height:32,flexShrink:0,background:'var(--green-mid)',color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700}}>{s.n}</div>
                  <div>
                    <h4 style={{fontSize:14,fontWeight:700,color:'var(--slate)',marginBottom:4}}>{s.title}</h4>
                    {s.isLink ? <div style={{display:'inline-block',background:'var(--green-pale)',color:'var(--green-deep)',fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:6,fontFamily:'monospace',marginTop:4}}>{s.desc}</div> : s.desc && <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.5}}>{s.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="slide-tag" style={{color:'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
        </div>

        {/* SLIDE 5 — โปรไฟล์ & แอดมิน */}
        <div className="print-slide" style={{background:'var(--green-deep)',padding:56,color:'#fff'}}>
          <div className="heading">
            <small style={{color:'var(--green-light)'}}>โมดูล 03</small>
            <h2 style={{color:'#fff'}}>ตั้งค่าโปรไฟล์ และจัดการสิทธิ์แอดมิน</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
            <div style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:12,padding:24}}>
              <h3 style={{fontSize:16,fontWeight:700,color:'var(--accent)',marginBottom:16}}>✏️ โปรไฟล์ที่ควรตั้งค่า</h3>
              {["รูปโปรไฟล์ (โลโก้องค์กร 640×640 px)","ชื่อบัญชีภาษาไทยที่จดจำได้ง่าย","คำอธิบาย: บริการอะไร เปิดเวลาใด",'ปุ่ม CTA เช่น "นัดหมาย" หรือ "ติดต่อเรา"',"เบอร์โทรศัพท์ (ถ้าเหมาะสม)"].map((c,i)=>(
                <div key={i} style={{display:'flex',gap:10,marginBottom:10,fontSize:14,color:'rgba(255,255,255,0.85)'}}>
                  <span style={{color:'var(--green-light)',fontSize:16,flexShrink:0}}>✓</span><span>{c}</span>
                </div>
              ))}
              <div style={{marginTop:14,fontSize:12,color:'rgba(255,255,255,0.5)'}}>📍 เส้นทาง: manager.line.biz → โปรไฟล์ธุรกิจ</div>
            </div>
            <div style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:12,padding:24}}>
              <h3 style={{fontSize:16,fontWeight:700,color:'var(--accent)',marginBottom:16}}>🔑 ระดับสิทธิ์แอดมิน</h3>
              {[{name:"Admin",desc:"จัดการทุกอย่าง + เพิ่ม/ลบแอดมิน",badge:"ADMIN",bg:"var(--accent)",tc:"var(--slate)"},{name:"Operator",desc:"ส่งข้อความ ตอบแชท สร้างคอนเทนต์",badge:"OP",bg:"var(--green-light)",tc:"var(--slate)"},{name:"Viewer",desc:"ดูสถิติและข้อมูลเท่านั้น",badge:"VIEW",bg:"rgba(255,255,255,0.2)",tc:"#fff"}].map((r,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(0,0,0,0.2)',borderRadius:8,padding:'12px 16px',marginBottom:8}}>
                  <div><div style={{fontSize:14,fontWeight:700,color:'#fff'}}>{r.name}</div><div style={{fontSize:12,color:'rgba(255,255,255,0.6)',marginTop:2}}>{r.desc}</div></div>
                  <div style={{fontSize:10,fontWeight:700,padding:'2px 10px',borderRadius:20,letterSpacing:1,background:r.bg,color:r.tc}}>{r.badge}</div>
                </div>
              ))}
              <div style={{marginTop:14,fontSize:12,color:'rgba(255,255,255,0.5)'}}>📍 ตั้งค่า → การจัดการสิทธิ์</div>
            </div>
          </div>
          <div className="slide-tag">LINE OA Training 2025</div>
        </div>

        {/* SLIDE 6 — Rich Menu */}
        <div className="print-slide" style={{background:'var(--off-white)',padding:56,color:'var(--slate)'}}>
          <div className="heading">
            <small style={{color:'var(--green-mid)'}}>โมดูล 04</small>
            <h2 style={{color:'var(--slate)',marginBottom:8}}>ออกแบบ Rich Menu</h2>
            <p style={{fontSize:14,color:'var(--muted)',marginBottom:24}}>เมนูที่ปรากฏด้านล่างหน้าแชท ให้ผู้รับบริการกดเข้าถึงบริการได้ทันที</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.1fr 0.9fr',gap:32}}>
            <div>
              <div style={{background:'#fff',borderRadius:16,overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.12)',border:'1px solid rgba(0,0,0,0.05)'}}>
                <div style={{background:'var(--slate)',padding:'14px 16px',display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:36,height:36,background:'var(--green-mid)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>💚</div>
                  <div><div style={{fontSize:14,fontWeight:700,color:'#fff',lineHeight:1.2}}>กลุ่มสงขลา [ชื่อองค์กร]</div><div style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>บริการด้านสุขภาพ</div></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,background:'#e0e8e3',padding:2}}>
                  {[{icon:"🩺",t:"นัดรับบริการ"},{icon:"📦",t:"ขอรับอุปกรณ์"},{icon:"🧪",t:"ตรวจด้วยตนเอง"},{icon:"📞",t:"ติดต่อทีมงาน"}].map((b,i)=>(
                    <div key={i} style={{background:'#fff',padding:16,textAlign:'center',fontSize:12,fontWeight:600,color:'var(--slate)',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><span style={{fontSize:20}}>{b.icon}</span>{b.t}</div>
                  ))}
                  <div style={{gridColumn:'span 2',background:'#fff',padding:16,textAlign:'center',fontSize:12,fontWeight:600,color:'var(--slate)',display:'flex',flexDirection:'column',alignItems:'center',gap:4,borderTop:'1px solid #e0e8e3'}}><span style={{fontSize:20}}>ℹ️</span>ข้อมูลบริการ / FAQ</div>
                </div>
              </div>
              <p style={{fontSize:12,color:'var(--muted)',marginTop:10,textAlign:'center'}}>ตัวอย่าง Rich Menu สำหรับองค์กร</p>
            </div>
            <div>
              {[{n:"1",title:'กด "สร้างริชเมนู"',desc:"ริชเมนู → ใน manager.line.biz"},{n:"2",title:"เลือก Layout",desc:"2-6 ปุ่ม ตามความต้องการ"},{n:"3",title:"อัปโหลดรูป Background",desc:"ขนาด 2500×1686 px แนะนำ"},{n:"4",title:"กำหนด Action แต่ละปุ่ม",desc:"ข้อความ / ลิงก์ / โทรศัพท์"},{n:"5",title:'กด "เผยแพร่"',desc:""}].map((s,i)=>(
                <div key={i} style={{display:'flex',gap:14,marginBottom:14,alignItems:'flex-start'}}>
                  <div style={{width:32,height:32,flexShrink:0,background:'var(--green-mid)',color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700}}>{s.n}</div>
                  <div>
                    <h4 style={{fontSize:14,fontWeight:700,color:'var(--slate)',marginBottom:4}}>{s.title}</h4>
                    {s.desc && <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.5}}>{s.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="slide-tag" style={{color:'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
        </div>

        {/* SLIDE 7 — Greeting & Auto-reply */}
        <div className="print-slide" style={{background:'var(--slate)',padding:56,color:'#fff'}}>
          <div className="heading">
            <small style={{color:'var(--green-light)'}}>โมดูล 05 — 06</small>
            <h2 style={{color:'#fff'}}>Greeting Message & Auto-reply</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
            <div style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:20}}>
              <h3 style={{fontSize:13,fontWeight:700,color:'var(--accent)',letterSpacing:1,textTransform:'uppercase',marginBottom:14}}>👋 ตัวอย่างข้อความทักทาย</h3>
              <div style={{background:'var(--green-mid)',color:'#fff',borderRadius:'16px 16px 16px 4px',padding:14,fontSize:13,lineHeight:1.6}}>
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
            <div style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:20}}>
              <h3 style={{fontSize:13,fontWeight:700,color:'var(--accent)',letterSpacing:1,textTransform:'uppercase',marginBottom:14}}>🤖 Keyword Auto-reply</h3>
              <table style={{width:'100%'}}>
                <tbody>
                  {[{k:'"นัดหมาย"',r:"→ ส่งลิงก์ Google Form"},{k:'"ตรวจ HIV"',r:"→ ข้อมูลชุดตรวจที่บ้าน"},{k:'"ฟรี"',r:"→ บริการทุกอย่างไม่มีค่าใช้จ่าย 💚"},{k:'"เวลาทำการ"',r:"→ จ-ศ เวลา 9:00-17:00 น."},{k:'"อุปกรณ์"',r:"→ ข้อมูลการรับชุดอุปกรณ์"}].map((row,i)=>(
                    <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                      <td style={{padding:'10px 16px 10px 0',fontSize:12,fontWeight:700,fontFamily:'monospace',color:'var(--accent)',whiteSpace:'nowrap'}}>{row.k}</td>
                      <td style={{padding:10,fontSize:13,color:'rgba(255,255,255,0.75)',lineHeight:1.5}}>{row.r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="slide-tag">LINE OA Training 2025</div>
        </div>

        {/* SLIDE 8 — Broadcast & Content */}
        <div className="print-slide" style={{background:'#fff',padding:56,color:'var(--slate)'}}>
          <div className="heading">
            <small style={{color:'var(--green-mid)'}}>โมดูล 07</small>
            <h2 style={{color:'var(--slate)'}}>Broadcast & Content Calendar</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.2fr 0.8fr',gap:32}}>
            <div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:24}}>
                {[{icon:"📝",title:"ข้อความธรรมดา",desc:"แจ้งข่าวทั่วไป"},{icon:"🖼️",title:"รูปภาพ / อินโฟกราฟิก",desc:"ให้ความรู้ด้วยภาพ"},{icon:"🃏",title:"Flex Message",desc:"การ์ดสวยงาม มีปุ่มกด"},{icon:"🎬",title:"วิดีโอ",desc:"ไม่เกิน 200 MB"}].map((t,i)=>(
                  <div key={i} style={{background:'var(--off-white)',border:'1px solid rgba(0,112,60,0.08)',borderRadius:8,padding:14,display:'flex',gap:10,alignItems:'flex-start'}}>
                    <div style={{fontSize:22}}>{t.icon}</div>
                    <div><h4 style={{fontSize:13,fontWeight:700,color:'var(--slate)',marginBottom:2}}>{t.title}</h4><p style={{fontSize:12,color:'var(--muted)'}}>{t.desc}</p></div>
                  </div>
                ))}
              </div>
              <div style={{background:'#FFF8E6',borderLeft:'4px solid var(--accent)',borderRadius:8,padding:12,fontSize:13,color:'#7A5C00',display:'flex',gap:8}}>
                <span>⚠️</span><span>ส่ง Broadcast ไม่เกิน <strong>2-3 ครั้งต่อสัปดาห์</strong> เพื่อไม่ให้ผู้ติดตามรู้สึกรบกวน</span>
              </div>
            </div>
            <div style={{background:'var(--off-white)',border:'1px solid rgba(0,112,60,0.08)',borderRadius:12,padding:20}}>
              <h3 style={{fontSize:14,fontWeight:700,color:'var(--slate)',marginBottom:14}}>📅 ตัวอย่าง Content Calendar</h3>
              {[{d:"ต้นสัปดาห์",c:"ให้ความรู้ — อินโฟกราฟิก HIV/HCV"},{d:"กลางสัปดาห์",c:"บริการ — แจ้งวันบริการ ขอรับอุปกรณ์"},{d:"ปลายสัปดาห์",c:"Engagement — ถาม-ตอบ ความต้องการ"}].map((c,i)=>(
                <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(0,0,0,0.05)',fontSize:13}}>
                  <div style={{width:68,flexShrink:0,fontWeight:700,color:'var(--green-mid)'}}>{c.d}</div>
                  <div style={{color:'var(--muted)'}}>{c.c}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="slide-tag" style={{color:'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
        </div>

        {/* SLIDE 9 — การสื่อสารและจัดการแชท */}
        <div className="print-slide" style={{background:'var(--off-white)',padding:56,color:'var(--slate)'}}>
          <div className="heading">
            <small style={{color:'var(--green-mid)'}}>โมดูล 08</small>
            <h2 style={{color:'var(--slate)'}}>การสื่อสารและจัดการแชทอย่างมืออาชีพ</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',overflow:'hidden'}}>
                <div style={{background:'var(--green-mid)',color:'#fff',padding:'14px 20px',fontSize:13,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase'}}>✅ ควรทำ</div>
                <div style={{padding:'6px 0'}}>
                  {["ใช้ภาษาที่เป็นมิตร ไม่ตัดสิน (Non-judgmental)","ตอบภายใน 24 ชั่วโมง (เร็วกว่าดีกว่า)","ยืนยันความลับก่อนให้ข้อมูลสำคัญ","ใช้ชื่อ/สรรพนามที่ผู้รับบริการต้องการ"].map((item,i)=>(
                    <div key={i} style={{display:'flex',gap:10,padding:'10px 16px',fontSize:13,color:'var(--slate)',lineHeight:1.5,borderBottom:'1px solid rgba(0,0,0,0.05)'}}><span style={{flexShrink:0}}>💚</span><span>{item}</span></div>
                  ))}
                </div>
              </div>
              <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',overflow:'hidden'}}>
                <div style={{background:'#FF6B6B',color:'#fff',padding:'14px 20px',fontSize:13,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase'}}>❌ ไม่ควรทำ</div>
                <div style={{padding:'6px 0'}}>
                  {["ถามข้อมูลส่วนตัวที่ไม่จำเป็น","แชร์ข้อมูลผู้รับบริการโดยไม่เข้ารหัส","ใช้ภาษาที่ตัดสินหรือดูถูก"].map((item,i)=>(
                    <div key={i} style={{display:'flex',gap:10,padding:'10px 16px',fontSize:13,color:'var(--slate)',lineHeight:1.5,borderBottom:'1px solid rgba(0,0,0,0.05)'}}><span style={{flexShrink:0}}>🔴</span><span>{item}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',padding:20}}>
              <h3 style={{fontSize:14,fontWeight:700,color:'var(--slate)',marginBottom:14}}>🔄 Flow การคัดกรองและส่งต่อ</h3>
              {["รับข้อมูลเบื้องต้น (อาการ/ความต้องการ)","ประเมินบริการที่เหมาะสม","ผลบวก → นัดส่งต่อโรงพยาบาลตามสิทธิ์","ส่งข้อมูลช่องทาง CTS / C-Free","ยืนยันนัดหมาย / การส่งต่อ","ติดตามผลหลัง 1-2 สัปดาห์"].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:12,marginBottom:10,alignItems:'flex-start'}}>
                  <div style={{width:24,height:24,flexShrink:0,background:'var(--green-pale)',color:'var(--green-deep)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700}}>{i+1}</div>
                  <p style={{fontSize:13,color:'var(--slate)',lineHeight:1.5,paddingTop:2}}>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="slide-tag" style={{color:'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
        </div>

        {/* SLIDE 10 — O2O */}
        <div className="print-slide" style={{background:'var(--slate)',padding:56,color:'#fff'}}>
          <div className="heading">
            <small style={{color:'var(--green-light)'}}>โมดูล 09</small>
            <h2 style={{color:'#fff'}}>Online to Offline — จาก LINE สู่บริการจริง</h2>
          </div>
          <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',marginBottom:28,justifyContent:'space-between',width:'100%'}}>
            {[{icon:"👥",t:"เพิ่มเพื่อน LINE OA"},{icon:"👋",t:"ได้รับ Greeting & Rich Menu"},{icon:"📋",t:"กรอก Google Form"},{icon:"✅",t:"ยืนยันนัดทาง LINE"},{icon:"🏥",t:"รับบริการ"},{icon:"📲",t:"ติดตามผล"}].map((s,i,arr)=>(
              <div key={i} style={{display:'flex',alignItems:'center'}}>
                <div style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:12,textAlign:'center',minWidth:90,fontSize:12,color:'rgba(255,255,255,0.8)',fontWeight:600}}>
                  <span style={{display:'block',fontSize:22,marginBottom:6}}>{s.icon}</span>
                  <div style={{maxWidth:80,margin:'0 auto',lineHeight:1.2}}>{s.t}</div>
                </div>
                {i < arr.length - 1 && <div style={{color:'var(--green-light)',fontSize:20,margin:'0 8px'}}>→</div>}
              </div>
            ))}
          </div>
          <div style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.6)',letterSpacing:2,textTransform:'uppercase',marginBottom:16}}>เครื่องมือที่ใช้ร่วมกัน</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            {[{icon:"📝",title:"Google Forms",desc:"ฟอร์มนัดหมาย / ลงทะเบียน"},{icon:"📊",title:"Google Sheets",desc:"ติดตามข้อมูลผู้รับบริการ"},{icon:"🎨",title:"Canva",desc:"ออกแบบอินโฟกราฟิก Rich Menu"},{icon:"📷",title:"QR Code",desc:"สร้าง QR เพิ่มเพื่อน LINE OA"}].map((t,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:16,display:'flex',flexDirection:'column',gap:6}}>
                <div style={{fontSize:20}}>{t.icon}</div>
                <h4 style={{fontSize:13,fontWeight:700,color:'#fff'}}>{t.title}</h4>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.55)',lineHeight:1.3}}>{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="slide-tag">LINE OA Training 2025</div>
        </div>

        {/* SLIDE 11 — KPI */}
        <div className="print-slide" style={{background:'#fff',padding:56,color:'var(--slate)'}}>
          <div className="heading">
            <small style={{color:'var(--green-mid)'}}>โมดูล 10</small>
            <h2 style={{color:'var(--slate)'}}>วิเคราะห์ผลและตัวชี้วัด (KPI)</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--muted)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:12}}>ตัวชี้วัดหลักที่ควรติดตาม</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                {[{label:"Followers",val:"↑",unit:"เพิ่มขึ้นทุกเดือน"},{label:"Block Rate",val:"<5%",unit:"ยิ่งต่ำยิ่งดี"},{label:"Open Rate",val:">20%",unit:"อัตราเปิดอ่าน"},{label:"Click Rate",val:">5%",unit:"อัตราคลิกลิงก์"}].map((k,i)=>(
                  <div key={i} style={{background:'var(--off-white)',border:'1px solid rgba(0,112,60,0.1)',borderRadius:12,padding:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1.5,marginBottom:4}}>{k.label}</div>
                    <div style={{fontSize:28,fontWeight:700,color:'var(--green-deep)',lineHeight:1.2}}>{k.val}</div>
                    <div style={{fontSize:13,color:'var(--muted)'}}>{k.unit}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--muted)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:12}}>วิเคราะห์และปรับกลยุทธ์</div>
              {[{icon:"📭",title:"Open Rate ต่ำ",desc:"ปรับเวลาส่ง หรือเปลี่ยนหัวข้อให้น่าสนใจขึ้น"},{icon:"🚫",title:"Block Rate สูง",desc:"ส่ง Broadcast บ่อยเกินไป หรือเนื้อหาไม่ตรงความต้องการ"},{icon:"👆",title:"Click Rate ต่ำ",desc:"ปุ่ม CTA ไม่ชัดเจน หรือลิงก์ปลายทางไม่น่าสนใจ"}].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:12,padding:'14px 0',borderBottom:'1px solid rgba(0,0,0,0.05)',alignItems:'flex-start'}}>
                  <div style={{width:36,height:36,flexShrink:0,borderRadius:10,background:'var(--green-pale)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>{item.icon}</div>
                  <div><h4 style={{fontSize:13,fontWeight:700,color:'var(--slate)',marginBottom:4}}>{item.title}</h4><p style={{fontSize:12,color:'var(--muted)',lineHeight:1.5}}>{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="slide-tag" style={{color:'rgba(0,0,0,0.2)'}}>LINE OA Training 2025</div>
        </div>

        {/* SLIDE 12 — ความลับและจริยธรรม */}
        <div className="print-slide" style={{background:'var(--green-deep)',padding:56,color:'#fff'}}>
          <div className="heading">
            <small style={{color:'var(--green-light)'}}>สำคัญมาก</small>
            <h2 style={{color:'#fff'}}>ความลับและจริยธรรมในการใช้งาน</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {[
              {icon:"🔕",title:"ห้ามระบุตัวตนในกลุ่ม",desc:"ไม่ระบุชื่อหรือข้อมูลผู้รับบริการในการสนทนากลุ่มหรือพื้นที่สาธารณะ"},
              {icon:"📵",title:"ห้ามแชร์ Screenshot แชท",desc:"ไม่ถ่ายภาพหน้าจอแชทแล้วแชร์ต่อโดยไม่ได้รับอนุญาต"},
              {icon:"👤",title:"ใช้บัญชีแยกจากส่วนตัว",desc:"แต่ละคนในทีมมีบัญชีแอดมินแยกต่างหาก เพื่อความรับผิดชอบ"},
              {icon:"🔑",title:"เปลี่ยนรหัสผ่านทุก 3 เดือน",desc:"และลบสิทธิ์แอดมินที่ออกจากทีมทันที"},
            ].map((item,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:16,display:'flex',gap:14,alignItems:'flex-start'}}>
                <div style={{width:40,height:40,flexShrink:0,borderRadius:8,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{item.icon}</div>
                <div><h4 style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:4}}>{item.title}</h4><p style={{fontSize:12,color:'rgba(255,255,255,0.6)',lineHeight:1.5}}>{item.desc}</p></div>
              </div>
            ))}
            <div style={{gridColumn:'span 2',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:16,display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{width:40,height:40,flexShrink:0,borderRadius:8,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>⚖️</div>
              <div><h4 style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:4}}>ข้อมูลที่ได้รับทาง LINE คือข้อมูลสุขภาพ</h4><p style={{fontSize:12,color:'rgba(255,255,255,0.6)',lineHeight:1.5}}>ถือเป็นข้อมูลที่ต้องปกปิดตามกฎหมาย ห้ามเปิดเผยหรือนำไปใช้นอกเหนือวัตถุประสงค์บริการ</p></div>
            </div>
          </div>
          <div className="slide-tag">LINE OA Training 2025</div>
        </div>

        {/* SLIDE 13 — บทสรุป */}
        <div className="print-slide" style={{background:'var(--slate)',textAlign:'center',padding:56,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, rgba(0,165,80,0.25) 0%, transparent 65%)'}} />
          <div style={{position:'relative',zIndex:10,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{width:80,height:80,background:'var(--green-mid)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,marginBottom:24,boxShadow:'0 12px 40px rgba(0,165,80,0.4)',color:'#fff'}}>✓</div>
            <h2 style={{fontSize:40,fontWeight:700,color:'#fff',marginBottom:12}}>พร้อมแล้ว!</h2>
            <p style={{fontSize:18,color:'rgba(255,255,255,0.65)',maxWidth:500,lineHeight:1.6,marginBottom:32}}>
              ขอบคุณทุกท่านที่เข้าร่วมการอบรม<br/>
              ให้ LINE OA เป็นสะพานเชื่อมบริการสู่กลุ่มเป้าหมายของเรา
            </p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center',marginTop:24}}>
              {[{url:"manager.line.biz",desc:"จัดการบัญชี LINE OA"},{url:"developers.line.biz",desc:"สำหรับเชื่อมต่อ API"},{url:"entry.line.biz",desc:"สมัครบัญชีใหม่"}].map((link,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:12,padding:'12px 16px',fontSize:13,color:'#fff',fontWeight:700,display:'flex',flexDirection:'column',gap:2,minWidth:160}}>
                  {link.url}
                  <span style={{fontSize:11,fontWeight:400,color:'var(--green-light)'}}>{link.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="slide-tag">LINE OA Training 2025</div>
        </div>
      </div>
    );
  }
);
