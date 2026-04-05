'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  AtSign, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Hash,
  FileText,
  Send
} from 'lucide-react';
import { useChatStore } from '@/src/presentation/stores/chat-store';
import { useState } from 'react';
import { toast } from 'sonner';

export function FeedbackView() {
  const { openChat, registerCustomer, sendMessage } = useChatStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    email: '',
    message: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Register for Chat
      const customerName = formData.email ? formData.email.split('@')[0] : 'ผู้แจ้งปัญหา';
      const registered = await registerCustomer(customerName, formData.email || 'N/A');

      if (registered) {
        const categoryMap: Record<string, string> = {
          bug: 'แจ้งปัญหาการใช้งาน (Bug)',
          feature: 'เสนอแนะฟีเจอร์ใหม่',
          content: 'เนื้อหาคอร์สเรียน',
          other: 'อื่นๆ'
        };
        const categoryLabel = categoryMap[formData.category] || formData.category;

        const chatContext = `[Feedback Submission]\n` +
                          `หัวข้อ: ${formData.topic}\n` +
                          `หมวดหมู่: ${categoryLabel}\n` +
                          `อีเมล: ${formData.email || 'ไม่ได้ระบุ'}\n` +
                          `รายละเอียด: ${formData.message}`;

        // 2. Open chat and send message
        openChat();
        await sendMessage(chatContext);

        toast.success('ขอบคุณสำหรับความคิดเห็น! กำลังเชื่อมต่อแชทให้คุณ...', {
          icon: <CheckCircle2 className="w-5 h-5 text-success" />,
        });
        
        setIsSuccess(true);
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden py-16 sm:py-24 px-4 flex items-center justify-center">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 text-center glass rounded-3xl p-12 max-w-xl w-full border border-primary/20 shadow-2xl animate-fadeIn">
          <div className="text-6xl mb-6">📝✨</div>
          <h1 className="text-3xl font-bold text-text-primary mb-4 gradient-text">
            ส่งความคิดเห็นสำเร็จ!
          </h1>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            ขอบคุณที่ร่วมพัฒนา Live Learning เราได้รับข้อมูลของคุณแล้วและกำลังเชื่อมต่อคุณกับทีมงานในช่องแชท
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsSuccess(false)}
              className="btn-game px-8 py-3 rounded-xl text-white font-bold hover:scale-105 transition-transform"
            >
              ส่งอีกฉบับ
            </button>
            <a
              href="/"
              className="px-8 py-3 rounded-xl bg-surface border border-border text-text-primary font-bold hover:bg-surface-elevated transition-colors"
            >
              กลับหน้าแรก
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary/10 text-primary mb-4 border border-primary/20 animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              Help us Improve
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary tracking-tight mb-6 gradient-text">
              แจ้งปัญหา / แนะนำบริการ
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-medium">
              ความคิดเห็นของคุณมีค่าสำหรับเรา ช่วยให้เราพัฒนา Live Learning ให้ดียิ่งขึ้น
            </p>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <motion.div 
            className="w-full max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary flex items-center">
                      <Hash className="w-4 h-4 mr-2 text-primary" />
                      หมวดหมู่
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 bg-surface/30 border border-white/10 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-primary appearance-none backdrop-blur-sm`}
                        required
                      >
                        <option value="" disabled className="bg-slate-900">เลือกหมวดหมู่...</option>
                        <option value="bug" className="bg-slate-900">แจ้งปัญหาการใช้งาน (Bug)</option>
                        <option value="feature" className="bg-slate-900">เสนอแนะฟีเจอร์ใหม่</option>
                        <option value="content" className="bg-slate-900">เนื้อหาคอร์สเรียน</option>
                        <option value="other" className="bg-slate-900">อื่นๆ</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary flex items-center">
                      <AtSign className="w-4 h-4 mr-2 text-primary" />
                      อีเมลติดต่อกลับ
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@mail.com (ไม่บังคับ)"
                        className={`w-full px-4 py-3.5 bg-surface/30 border border-white/10 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-muted backdrop-blur-sm`}
                      />
                    </div>
                  </div>
                </div>

                {/* Topic Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-primary" />
                    สรุปหัวข้อปัญหา
                  </label>
                  <div className="relative">
                    <input
                      id="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="เช่น เข้าหน้าคอร์สเรียนไม่ได้ หรือมีข้อเสนอแนะเพิ่มเติม"
                      className={`w-full px-4 py-3.5 bg-surface/30 border border-white/10 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-muted backdrop-blur-sm`}
                      required
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                    รายละเอียด
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="พิมพ์ข้อความที่คุณต้องการแจ้งให้เราทราบที่นี่..."
                      className={`w-full px-4 py-4 bg-surface/30 border border-white/10 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-muted backdrop-blur-sm resize-none`}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-game w-full flex items-center justify-center space-x-2 group h-14 text-white rounded-xl shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>กำลังส่งความคิดเห็น...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span>ส่งความคิดเห็นและเริ่มแชท 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
