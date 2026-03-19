import Link from 'next/link';

interface UnauthorizedAccessViewProps {
  title?: string;
  message?: string;
  returnPath?: string;
  returnLabel?: string;
}

export function UnauthorizedAccessView({
  title = 'ไม่มีสิทธิ์เข้าถึง',
  message = 'หน้านี้สงวนสิทธิ์เฉพาะผู้ใช้ที่มีบทบาทที่กำหนดเท่านั้น',
  returnPath = '/',
  returnLabel = 'กลับสู่หน้าหลัก',
}: UnauthorizedAccessViewProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        
        <p className="text-error font-medium mb-2 text-xl">
          {title}
        </p>
        
        <p className="text-text-secondary mb-6">
          {message}
        </p>
        
        <Link 
          href={returnPath} 
          className="btn-game px-6 py-2 text-white rounded-xl inline-block"
        >
          {returnLabel}
        </Link>
      </div>
    </div>
  );
}
