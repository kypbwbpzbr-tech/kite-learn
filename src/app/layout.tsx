import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '风筝学堂',
  description: '智能学习平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="min-h-screen pb-20" id="main-content">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 glass-nav z-50 no-print" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex justify-around items-center max-w-lg mx-auto h-[68px]">
            <a href="/" className="nav-tab flex flex-col items-center gap-1 w-14" data-tab="home">
              <div className="relative">
                <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="text-[10px] font-medium">首页</span>
            </a>
            <a href="/graph" className="nav-tab flex flex-col items-center gap-1 w-14" data-tab="graph">
              <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/>
                <line x1="12" y1="7.5" x2="5" y2="16.5"/><line x1="12" y1="7.5" x2="19" y2="16.5"/>
              </svg>
              <span className="text-[10px] font-medium">图谱</span>
            </a>
            <a href="/practice" className="flex flex-col items-center justify-center w-14 -mt-5" data-tab="practice">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-orange-400 opacity-20 animate-[pulse-ring_2s_ease-out_infinite]" />
                <div className="w-[54px] h-[54px] rounded-full bg-gradient-to-br from-[#FFB878] via-[#FF8A4C] to-[#F97316] flex items-center justify-center shadow-[0_4px_20px_rgba(249,115,22,0.35),0_8px_32px_rgba(249,115,22,0.15)] active:scale-90 transition-transform duration-300 relative z-10">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </div>
              </div>
              <span className="text-[10px] font-medium text-gray-400 mt-1">练习</span>
            </a>
            <a href="/memorize" className="nav-tab flex flex-col items-center gap-1 w-14" data-tab="memorize">
              <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="13" y2="11"/>
              </svg>
              <span className="text-[10px] font-medium">必背</span>
            </a>
            <a href="/me" className="nav-tab flex flex-col items-center gap-1 w-14" data-tab="me">
              <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="text-[10px] font-medium">我的</span>
            </a>
          </div>
        </nav>

        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            // 导航高亮
            var p=window.location.pathname;
            document.querySelectorAll('.nav-tab').forEach(function(i){
              var t=i.getAttribute('data-tab');
              var a=(t==='home'&&p==='/')||(t==='graph'&&p.startsWith('/graph'))||(t==='practice'&&p.startsWith('/practice'))||(t==='memorize'&&p.startsWith('/memorize'))||(t==='me'&&(p.startsWith('/me')||p.startsWith('/points')||p.startsWith('/favorites')||p.startsWith('/calendar')||p.startsWith('/plan')));
              if(a){i.classList.add('text-orange-500')}else{i.classList.add('text-gray-400')}
            });

            // 涟漪效果
            document.addEventListener('pointerdown',function(e){
              var t=e.target.closest('.card,button,a[href]');
              if(!t||t.closest('.bottom-sheet,.overlay'))return;
              var r=document.createElement('span');
              r.className='ripple-effect';
              var rect=t.getBoundingClientRect();
              var size=Math.max(rect.width,rect.height)*2;
              r.style.cssText='width:'+size+'px;height:'+size+'px;left:'+(e.clientX-rect.left-size/2)+'px;top:'+(e.clientY-rect.top-size/2)+'px';
              t.style.position=t.style.position||'relative';
              t.style.overflow='hidden';
              t.appendChild(r);
              setTimeout(function(){r.remove()},700);
            });

            // 页面切换平滑过渡
            document.querySelectorAll('a[href^="/"]').forEach(function(link){
              link.addEventListener('click',function(e){
                var href=link.getAttribute('href');
                if(!href||href===p)return;
                e.preventDefault();
                var main=document.getElementById('main-content');
                main.style.transition='opacity 0.2s ease, transform 0.2s ease';
                main.style.opacity='0';
                main.style.transform='translateY(6px)';
                setTimeout(function(){window.location.href=href},180);
              });
            });

            // 页面加载动画
            window.addEventListener('load',function(){
              var main=document.getElementById('main-content');
              main.style.transition='opacity 0.35s ease, transform 0.35s ease';
              main.style.opacity='1';
              main.style.transform='translateY(0)';
            });
          })();
        `}} />
      </body>
    </html>
  )
}
