import React from 'react';

interface LandingPageProps {
  onSignInClick: () => void;
  onStartFreeClick: () => void;
}

type PageType = 'home' | 'docs' | 'support';

const LandingPage: React.FC<LandingPageProps> = ({ onSignInClick, onStartFreeClick }) => {
  const [currentPage, setCurrentPage] = React.useState<PageType>('home');
  const [activeSection, setActiveSection] = React.useState('Overview');
  const [scrolled, setScrolled] = React.useState(false);

  // Sub-navigation items for the sticky bar
  const subNavItems = [
    { label: 'Overview', id: 'overview' },
    { label: 'Capabilities', id: 'solutions' },
    { label: 'LeadSarv CRM', id: 'crm-detail' },
    { label: 'FinanceSarv', id: 'finance-detail' },
    { label: 'Pricing', id: 'pricing' },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Track active section based on scroll position
      const scrollPosition = window.scrollY + 120;
      for (const item of subNavItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.label);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [subNavItems]);

  const scrollToSection = (id: string, label: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 112,
            behavior: 'smooth'
          });
          setActiveSection(label);
        }
      }, 50);
    } else {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 112,
          behavior: 'smooth'
        });
        setActiveSection(label);
      }
    }
  };

  return (
    <div className="w-full h-full bg-white font-sans text-[#202124] selection:bg-[#e8f0fe] selection:text-[#1a73e8] overflow-y-auto custom-scrollbar scroll-smooth">
      {/* Global Header */}
      <header className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 ${scrolled ? 'bg-white shadow-sm h-14' : 'bg-white h-16 border-b border-[#dadce0]'}`}>
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-8 h-full">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-7 h-7 bg-[#1a73e8] rounded-sm flex items-center justify-center text-white shadow-sm">
                <i className="fas fa-cube text-[10px]"></i>
              </div>
              <span className="text-xl font-medium tracking-tight text-[#5f6368]">
                Realty<span className="text-[#202124] font-bold">Sarv</span>
              </span>
            </div>
            
            <nav className="hidden lg:flex items-center gap-6 h-full text-[14px] font-medium text-[#5f6368]">
              <button onClick={() => scrollToSection('crm-detail', 'LeadSarv CRM')} className="hover:text-[#1a73e8] transition-colors">CRM</button>
              <button onClick={() => scrollToSection('finance-detail', 'FinanceSarv')} className="hover:text-[#1a73e8] transition-colors">Accounting</button>
              <button onClick={() => scrollToSection('pricing', 'Pricing')} className="hover:text-[#1a73e8] transition-colors">Pricing</button>
              <button onClick={() => setCurrentPage('docs')} className={`transition-colors ${currentPage === 'docs' ? 'text-[#1a73e8]' : 'hover:text-[#1a73e8]'}`}>Docs</button>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={onSignInClick} className="hidden sm:block text-sm font-bold text-[#1a73e8] hover:bg-blue-50 px-4 py-2 rounded transition-colors">Sign in</button>
            <button onClick={onStartFreeClick} className="bg-[#1a73e8] text-white px-5 py-2 rounded font-bold text-sm shadow-sm hover:shadow-md hover:bg-[#174ea6] transition-all active:scale-95">Get started for free</button>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Bar */}
      {currentPage === 'home' && (
        <div className={`fixed left-0 right-0 z-[100] bg-white border-b border-[#dadce0] transition-all duration-300 ${scrolled ? 'top-14' : 'top-16'}`}>
            <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between">
                <nav className="flex items-center h-full overflow-x-auto no-scrollbar gap-2">
                    {subNavItems.map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => scrollToSection(item.id, item.label)}
                            className={`h-full px-4 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeSection === item.label ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-[#5f6368] hover:text-[#202124]'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
      )}

      {currentPage === 'home' ? (
        <main className="pt-[112px]">
          {/* Hero Section */}
          <section id="overview" className="relative py-24 md:py-32 overflow-hidden bg-[#f8f9fa] scroll-mt-[112px]">
            <div className="max-w-[1440px] mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1a73e8] text-[10px] font-bold uppercase tracking-wider mb-6">
                        <i className="fas fa-sparkles"></i> THE UNIFIED OPERATING SYSTEM
                    </div>
                    <h1 className="text-5xl md:text-[64px] font-medium text-[#202124] leading-[1.1] tracking-tight mb-8">
                        The real estate <br className="hidden md:block" /> cockpit for leaders
                    </h1>
                    <p className="text-xl text-[#5f6368] mb-10 leading-relaxed font-light">
                        From the first lead click to the final balance sheet. RealitySarv integrates CRM, ERP, and Finance into one compliant ecosystem.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button onClick={onStartFreeClick} className="w-full sm:w-auto bg-[#1a73e8] text-white px-8 py-3.5 rounded font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-[#174ea6] transition-all transform active:scale-95">Start for free</button>
                        <button onClick={() => scrollToSection('solutions', 'Capabilities')} className="w-full sm:w-auto px-8 py-3.5 rounded border border-[#dadce0] font-bold text-sm bg-white hover:bg-gray-50 transition-all">Explore Platform</button>
                    </div>
                </div>
                
                <div className="relative">
                    <div className="bg-white rounded-2xl border border-[#dadce0] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transform perspective-1000 rotate-y-[-5deg]">
                        <div className="bg-[#f1f3f4] rounded-xl aspect-[4/3] flex flex-col p-6 overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ea4335]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#fbbc04]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#34a853]"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                                    <div className="w-16 h-2 bg-indigo-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="w-full h-12 bg-white rounded-lg shadow-sm border border-black/5 animate-pulse"></div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-24 bg-white rounded-lg shadow-sm border border-black/5 animate-pulse delay-75"></div>
                                    <div className="h-24 bg-white rounded-lg shadow-sm border border-black/5 animate-pulse delay-150"></div>
                                    <div className="h-24 bg-white rounded-lg shadow-sm border border-black/5 animate-pulse delay-200"></div>
                                </div>
                                <div className="w-2/3 h-4 bg-white/50 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* Capabilities Grid */}
          <section id="solutions" className="py-24 bg-white scroll-mt-[112px]">
            <div className="max-w-[1440px] mx-auto px-6">
              <div className="max-w-3xl mb-16">
                <h2 className="text-4xl md:text-5xl font-medium text-[#202124] mb-6">Built to eliminate silos</h2>
                <p className="text-lg text-[#5f6368] leading-relaxed">Three distinct systems working in perfect harmony to drive your development's growth.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  <FeatureCard 
                    title="LeadSarv CRM" 
                    desc="Omnichannel lead capture, AI nurturing, and RERA-compliant booking engine for sales teams."
                    icon="fas fa-users-rays"
                    color="#1e8e3e"
                    bgColor="bg-[#e6f4ea]"
                    onClick={() => scrollToSection('crm-detail', 'LeadSarv CRM')}
                  />
                  <FeatureCard 
                    title="ProjectSarv ERP" 
                    desc="Master site logistics, material procurement, contractor work orders, and site DPRs."
                    icon="fas fa-hard-hat"
                    color="#1a73e8"
                    bgColor="bg-[#e8f0fe]"
                    onClick={() => scrollToSection('products', 'Core Modules')}
                  />
                  <FeatureCard 
                    title="FinanceSarv" 
                    desc="Automated GST returns, TDS filing, and General Ledger with seamless Tally integration."
                    icon="fas fa-coins"
                    color="#4f46e5"
                    bgColor="bg-[#f5f3ff]"
                    onClick={() => scrollToSection('finance-detail', 'FinanceSarv')}
                  />
              </div>
            </div>
          </section>

          {/* NEW: LeadSarv CRM Detailed Section */}
          <section id="crm-detail" className="py-24 bg-[#e6f4ea]/30 scroll-mt-[112px] border-y border-[#e6f4ea]">
             <div className="max-w-[1440px] mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-[#1e8e3e] text-[10px] font-bold uppercase tracking-wider mb-6">
                            SALES VELOCITY ENGINE
                        </div>
                        <h2 className="text-4xl font-medium text-[#202124] mb-8">LeadSarv CRM: <br /> From Prospect to Possession</h2>
                        <div className="space-y-8">
                            <FeatureListItem icon="fas fa-magnet" title="Omnichannel Ingestion" desc="Automatically sync leads from Facebook, MagicBricks, 99Acres, and your website into one unified inbox." />
                            <FeatureListItem icon="fas fa-route" title="Lifecycle Tracking" desc="Monitor leads through custom pipeline stages: Qualified, Site Visit, Token Paid, and Confirmed Booking." />
                            <FeatureListItem icon="fas fa-file-invoice" title="Booking Engine" desc="Generate RERA-compliant booking forms, allotment letters, and payment receipts with one click." />
                        </div>
                        <button onClick={onStartFreeClick} className="mt-12 bg-[#1e8e3e] text-white px-8 py-3 rounded font-bold text-sm shadow-lg hover:bg-[#1b7a35] transition-all">Start 14-Day CRM Trial</button>
                    </div>
                    <div className="order-1 lg:order-2 bg-white p-2 rounded-3xl shadow-2xl border border-green-200/50">
                        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" alt="CRM Interface" className="rounded-2xl w-full h-auto" />
                    </div>
                </div>
             </div>
          </section>

          {/* ProjectSarv Detailed Features Section */}
          <section id="products" className="py-24 bg-[#f8f9fa] scroll-mt-[112px]">
            <div className="max-w-[1440px] mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <img src="https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=1200" alt="ERP Platform" className="rounded-3xl shadow-2xl border border-[#dadce0]" />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1a73e8] text-[10px] font-bold uppercase tracking-wider mb-6">
                            SITE OPERATIONS CONTROL
                        </div>
                        <h2 className="text-4xl font-medium text-[#202124] mb-8">ProjectSarv ERP: <br /> Precision Logistics</h2>
                        <div className="space-y-8">
                            <FeatureListItem icon="fas fa-chart-pie" title="BOQ-Based Planning" desc="Define granular bill of quantities for materials and services before work begins." />
                            <FeatureListItem icon="fas fa-receipt" title="Automated PR/PO Workflow" desc="Streamline site indents and procurement with multi-stage approval matrices." />
                            <FeatureListItem icon="fas fa-boxes-stacked" title="Store Inventory Tracking" desc="Monitor stock levels in real-time with automatic GRN and low-stock alerts." />
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* NEW: FinanceSarv Detailed Section */}
          <section id="finance-detail" className="py-24 bg-[#f5f3ff] scroll-mt-[112px] border-y border-indigo-100">
             <div className="max-w-[1440px] mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-[#4f46e5] text-[10px] font-bold uppercase tracking-wider mb-6">
                            STATUTORY COMPLIANCE HUB
                        </div>
                        <h2 className="text-4xl font-medium text-[#202124] mb-8">FinanceSarv: <br /> Institutional-Grade Accounting</h2>
                        <div className="space-y-8">
                            <FeatureListItem icon="fas fa-book" title="General Ledger" desc="Double-entry accounting built for complex project-level financials and inter-company transactions." />
                            <FeatureListItem icon="fas fa-shield-halved" title="GST & TDS Filing" desc="Automated computation of GSTR-1, 3B, and TDS reports with integrated validation." />
                            <FeatureListItem icon="fas fa-sync" title="ERP ↔ Tally Bridge" desc="Native sync with Tally Prime/ERP 9 for seamless data exchange with your external auditors." />
                        </div>
                        <button onClick={() => scrollToSection('pricing', 'Pricing')} className="mt-12 border-2 border-[#4f46e5] text-[#4f46e5] px-8 py-3 rounded font-bold text-sm hover:bg-indigo-50 transition-all">Explore Financial Modules</button>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100">
                        <div className="space-y-6">
                             <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">GSTR-1 PROVISIONAL REPORT</span>
                                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">READY</span>
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                 <div className="p-4 bg-indigo-50 rounded-xl">
                                     <p className="text-[10px] font-bold text-indigo-400 uppercase">Input Tax Credit</p>
                                     <p className="text-xl font-bold text-indigo-900">₹4.25L</p>
                                 </div>
                                 <div className="p-4 bg-orange-50 rounded-xl">
                                     <p className="text-[10px] font-bold text-orange-400 uppercase">TDS Payable</p>
                                     <p className="text-xl font-bold text-orange-900">₹1.12L</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-24 bg-white scroll-mt-[112px]">
            <div className="max-w-[1440px] mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-medium text-[#202124] mb-6">Transparent pricing</h2>
              <p className="text-lg text-[#5f6368] mb-16 max-w-2xl mx-auto">Scalable plans for growing developers. All statutory updates included.</p>
              
              <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8 text-left">
                  <div className="p-10 rounded-3xl border border-[#dadce0] hover:shadow-xl transition-all flex flex-col">
                      <h3 className="text-2xl font-bold text-[#202124] mb-2">Growth Hub</h3>
                      <p className="text-sm text-[#5f6368] mb-8">For Sales & CRM Focus</p>
                      <div className="mb-10">
                          <span className="text-5xl font-medium text-[#202124]">₹3,999</span>
                          <span className="text-gray-500 font-medium">/mo</span>
                      </div>
                      <ul className="space-y-4 mb-10 flex-1">
                          {['LeadSarv CRM Core', 'WhatsApp Business API', 'RERA Booking Engine', 'Financial Dashboard'].map(f => (
                              <li key={f} className="flex items-center gap-3 text-sm text-[#5f6368]"><i className="fas fa-check text-blue-500"></i> {f}</li>
                          ))}
                      </ul>
                      <button onClick={onStartFreeClick} className="w-full py-3 rounded-lg border-2 border-[#1a73e8] text-[#1a73e8] font-bold hover:bg-blue-50 transition-all">Start CRM Trial</button>
                  </div>
                  
                  <div className="p-10 rounded-3xl bg-[#202124] text-white shadow-2xl relative flex flex-col">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1a73e8] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">ENTERPRISE OS</div>
                      <h3 className="text-2xl font-bold mb-2">Ultimate Stack</h3>
                      <p className="text-sm text-gray-400 mb-8">Full CRM + ERP + Finance</p>
                      <div className="mb-10">
                          <span className="text-5xl font-medium">₹6,999</span>
                          <span className="text-gray-400 font-medium">/mo</span>
                      </div>
                      <ul className="space-y-4 mb-10 flex-1">
                          {['LeadSarv + ProjectSarv', 'FinanceSarv Compliance Hub', 'Tally Sync Bridge', 'Advanced ERP Workflows'].map(f => (
                              <li key={f} className="flex items-center gap-3 text-sm text-gray-300"><i className="fas fa-check text-[#34a853]"></i> {f}</li>
                          ))}
                      </ul>
                      <button onClick={onStartFreeClick} className="w-full py-3 rounded-lg bg-[#1a73e8] font-bold hover:bg-[#174ea6] transition-all">Deploy Full Stack</button>
                  </div>
              </div>
            </div>
          </section>

          {/* Global Footer */}
          <footer className="bg-[#202124] text-white pt-20 pb-10">
            <div className="max-w-[1440px] mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
                <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-[#1a73e8] rounded-sm flex items-center justify-center text-white shadow-sm"><i className="fas fa-cube text-[10px]"></i></div>
                        <span className="text-2xl font-bold tracking-tight text-white">RealtySarv</span>
                    </div>
                    <p className="text-sm text-gray-400 max-w-xs leading-relaxed">The unified operational system for Indian real estate developers. Designed for RERA and scale.</p>
                </div>
                <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-widest mb-6">Systems</h5>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li onClick={() => scrollToSection('crm-detail', 'LeadSarv CRM')} className="hover:text-white cursor-pointer">LeadSarv CRM</li>
                        <li onClick={() => scrollToSection('products', 'Core Modules')} className="hover:text-white cursor-pointer">ProjectSarv ERP</li>
                        <li onClick={() => scrollToSection('finance-detail', 'FinanceSarv')} className="hover:text-white cursor-pointer">FinanceSarv</li>
                    </ul>
                </div>
              </div>
              <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500">
                <p>© 2024 MultiSarv Pvt.Ltd. All rights reserved.</p>
                <div className="flex gap-6 uppercase font-bold tracking-widest">
                  <button className="hover:text-white">Privacy</button>
                  <button className="hover:text-white">Terms</button>
                  <button className="hover:text-white">Cookies</button>
                </div>
              </div>
            </div>
          </footer>
        </main>
      ) : (
        <div className="pt-32 px-6 pb-20 text-center animate-fadeIn min-h-screen bg-white flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 text-[#1a73e8] rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-inner">
                <i className="fas fa-book-open"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-[#202124] mb-4">Documentation & Support</h1>
            <p className="text-xl text-[#5f6368] max-w-2xl mx-auto mb-12">Learn how to deploy and scale your operations with RealtySarv.</p>
            <button onClick={() => setCurrentPage('home')} className="mt-16 text-[#1a73e8] font-bold flex items-center gap-2 hover:underline">
                <i className="fas fa-arrow-left text-xs"></i> Back to Overview
            </button>
        </div>
      )}
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; desc: string; icon: string; color: string; bgColor: string; onClick: () => void }> = ({ title, desc, icon, color, bgColor, onClick }) => (
    <div onClick={onClick} className="p-10 rounded-3xl bg-white border border-[#dadce0] hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
        <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform`} style={{ color }}>
            <i className={icon}></i>
        </div>
        <h3 className="text-2xl font-bold text-[#202124] mb-4">{title}</h3>
        <p className="text-[#5f6368] leading-relaxed mb-8">{desc}</p>
        <button className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 group-hover:underline" style={{ color }}>
            Learn more <i className="fas fa-chevron-right text-[10px]"></i>
        </button>
    </div>
);

const FeatureListItem: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
    <div className="flex gap-6 items-start">
        <div className="w-10 h-10 rounded-lg bg-white border border-[#dadce0] flex flex-shrink-0 items-center justify-center text-[#1a73e8] shadow-sm">
            <i className={icon}></i>
        </div>
        <div>
            <h4 className="font-bold text-[#202124] text-lg mb-1">{title}</h4>
            <p className="text-sm text-[#5f6368] leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default LandingPage;