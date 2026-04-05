'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  User, 
  AtSign, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ContactViewModel } from '@/src/presentation/presenters/contact/ContactPresenter';
import { useContactPresenter } from '@/src/presentation/presenters/contact/useContactPresenter';
import { useChatStore } from '@/src/presentation/stores/chat-store';
import { GlowButton } from '../ui/GlowButton';
import { toast } from 'sonner';

// Form Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  subject: z.string().min(5, 'กรุณากรอกหัวข้ออย่างน้อย 5 ตัวอักษร'),
  message: z.string().min(10, 'กรุณากรอกข้อความอย่างน้อย 10 ตัวอักษร'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactViewProps {
  initialViewModel?: ContactViewModel;
}

export function ContactView({ initialViewModel }: ContactViewProps) {
  const { viewModel, state, actions } = useContactPresenter(initialViewModel);
  const { openChat, registerCustomer, sendMessage } = useChatStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // 1. Register for Chat
      const registered = await registerCustomer(data.name, data.email);

      if (registered) {
        // 3. Format context message
        const chatContext = `[Contact Form Submission]\n` +
                          `ชื่อ: ${data.name}\n` +
                          `อีเมล: ${data.email}\n` +
                          `หัวข้อ: ${data.subject}\n` +
                          `ข้อความ: ${data.message}`;

        // 4. Open chat and send message
        openChat();
        await sendMessage(chatContext);

        toast.success('ส่งข้อความสำเร็จแล้ว! กำลังเชื่อมต่อแชทให้คุณ...', {
          icon: <CheckCircle2 className="w-5 h-5 text-success" />,
        });
        reset();
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหมีกครั้ง', {
        icon: <AlertCircle className="w-5 h-5 text-error" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!viewModel) return null;

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
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary tracking-tight mb-6 gradient-text">
              {viewModel.title}
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-medium">
              {viewModel.description}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Info Sidebar */}
          <motion.div 
            className="lg:col-span-4 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Contact Cards */}
            <div className="grid gap-6">
              {[
                {
                  icon: Mail,
                  title: 'Email',
                  value: 'support@livelearning.co.th',
                  desc: 'ทีมงานตอบกลับภายใน 24 ชม.',
                  color: 'primary'
                },
                {
                  icon: Phone,
                  title: 'Phone',
                  value: '02-123-4567',
                  desc: 'จันทร์ - ศุกร์, 09:00 - 18:00',
                  color: 'secondary'
                },
                {
                  icon: MapPin,
                  title: 'Office',
                  value: 'Bangkok, Thailand',
                  desc: '88/8 อาคารไวท์ทาวเวอร์ ชั้น 12',
                  color: 'accent'
                }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="glass card-hover p-6 rounded-2xl relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${item.color}/5 rounded-full blur-2xl group-hover:bg-${item.color}/10 transition-colors pointer-events-none`} />
                  <div className="flex items-start">
                    <div className={`p-3 rounded-xl bg-${item.color}/10 text-${item.color} mr-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        {item.title}
                      </h3>
                      <p className="font-semibold text-text-secondary">
                        {item.value}
                      </p>
                      <p className="text-sm text-text-muted mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Proof / Call to Action */}
            <div className="glass p-8 rounded-3xl relative overflow-hidden group border-primary/20 shadow-[0_8px_32px_rgba(var(--color-primary),0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3 flex items-center text-text-primary">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Live Chat ทันใจ
                </h3>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                  ต้องการคำตอบด่วน? ลองคุยกับทีมงานผ่าน LINE OA ของเราเพื่อรับบริการที่รวดเร็วยิ่งขึ้น
                </p>
                <button 
                  onClick={openChat}
                  className="flex items-center text-sm font-bold bg-primary text-white px-6 py-2.5 rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
                >
                  เริ่มแชททันที
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass rounded-3xl p-8 md:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary flex items-center">
                      <User className="w-4 h-4 mr-2 text-primary" />
                      ชื่อผู้ติดต่อ
                    </label>
                    <div className="relative">
                      <input
                        {...register('name')}
                        placeholder="ชื่อ-นามสกุล ของคุณ"
                        className={`w-full px-4 py-3.5 bg-surface/30 border ${errors.name ? 'border-error' : 'border-white/10'} rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-muted backdrop-blur-sm`}
                      />
                      {errors.name && (
                        <p className="text-xs font-bold text-error mt-1 ml-1 animate-fadeIn">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary flex items-center">
                      <AtSign className="w-4 h-4 mr-2 text-primary" />
                      อีเมล
                    </label>
                    <div className="relative">
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="example@mail.com"
                        className={`w-full px-4 py-3.5 bg-surface/30 border ${errors.email ? 'border-error' : 'border-white/10'} rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-muted backdrop-blur-sm`}
                      />
                      {errors.email && (
                        <p className="text-xs font-bold text-error mt-1 ml-1 animate-fadeIn">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                    หัวข้อเรื่อง
                  </label>
                  <div className="relative">
                    <input
                      {...register('subject')}
                      placeholder="เช่น สอบถามเรื่องคอร์สเรียน, ปัญหาการเข้าใช้งาน"
                      className={`w-full px-4 py-3.5 bg-surface/30 border ${errors.subject ? 'border-error' : 'border-white/10'} rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-muted backdrop-blur-sm`}
                    />
                    {errors.subject && (
                      <p className="text-xs font-bold text-error mt-1 ml-1 animate-fadeIn">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                    ข้อความของคุณ
                  </label>
                  <div className="relative">
                    <textarea
                      {...register('message')}
                      rows={6}
                      placeholder="พิมพ์ข้อความที่คุณต้องการติดต่อเราที่นี่..."
                      className={`w-full px-4 py-4 bg-surface/30 border ${errors.message ? 'border-error' : 'border-white/10'} rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-muted backdrop-blur-sm resize-none`}
                    />
                    {errors.message && (
                      <p className="text-xs font-bold text-error mt-1 ml-1 animate-fadeIn">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || state.loading}
                    className="btn-game w-full flex items-center justify-center space-x-2 group h-14 text-white rounded-xl shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all"
                  >
                    {isSubmitting || state.loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>กำลังส่งข้อความ...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span>ส่งข้อความ</span>
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
