// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, Activity, Users, Map, CloudLightning, Home as HomeIcon,
  Phone, ArrowRight, Flame, Waves, Wind, Mountain, Building2, Car, FlaskConical,
  BarChart3, Globe, HeartHandshake, Bot, Shield, MapPin, CheckCircle2, Siren
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Home = () => {
  return (
    <div className="w-full bg-[#0f172a] text-slate-50 font-sans selection:bg-primary/30">
      
      {/* 1. Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="flex flex-col items-start"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Next-Gen Disaster Management
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Respond Faster. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Save More Lives.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 mb-8 max-w-xl leading-relaxed">
              ADRRAS is the ultimate intelligent emergency coordination platform. We empower governments, NGOs, and citizens to seamlessly report, track, and mitigate disasters in real-time.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
              <Link to="/report" className="px-8 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center gap-2">
                <ShieldAlert size={20} />
                Report Emergency
              </Link>
              <button className="px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm text-white font-semibold border border-slate-700 transition-all flex items-center gap-2">
                <Siren size={20} className="text-red-400" />
                Emergency SOS
              </button>
              <Link to="/auth/login" className="px-8 py-4 rounded-xl text-slate-300 hover:text-white font-semibold transition-all flex items-center gap-2">
                Login
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center lg:justify-end"
          >
            {/* Dashboard UI mockup */}
            <div className="relative w-full max-w-[600px] aspect-[4/3] bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden transform md:-rotate-2 transition-transform duration-500 hover:rotate-0">
              {/* Fake header */}
              <div className="h-12 border-b border-slate-700/50 flex items-center px-4 gap-2 bg-slate-900">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto w-32 h-4 bg-slate-800 rounded-md"></div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4 h-full">
                <div className="col-span-2 h-40 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px]"></div>
                  <div className="flex justify-between relative z-10">
                     <div className="w-24 h-4 bg-slate-700 rounded"></div>
                     <div className="w-8 h-4 bg-red-500/50 rounded"></div>
                  </div>
                  <div className="w-full h-24 bg-gradient-to-t from-blue-500/20 to-transparent rounded border-b-2 border-blue-500/50 relative z-10 flex items-end px-2 pb-2 gap-2">
                     <div className="w-1/6 h-1/3 bg-blue-500/40 rounded-t-sm"></div>
                     <div className="w-1/6 h-2/3 bg-blue-500/40 rounded-t-sm"></div>
                     <div className="w-1/6 h-1/2 bg-blue-500/40 rounded-t-sm"></div>
                     <div className="w-1/6 h-full bg-blue-500/60 rounded-t-sm"></div>
                     <div className="w-1/6 h-4/5 bg-blue-500/40 rounded-t-sm"></div>
                     <div className="w-1/6 h-2/5 bg-blue-500/40 rounded-t-sm"></div>
                  </div>
                </div>
                <div className="h-28 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
                    <Flame size={16} className="text-red-400" />
                  </div>
                  <div>
                    <div className="w-16 h-3 bg-slate-700 rounded mb-2"></div>
                    <div className="w-10 h-5 bg-slate-500 rounded"></div>
                  </div>
                </div>
                <div className="h-28 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="w-16 h-3 bg-slate-700 rounded mb-2"></div>
                    <div className="w-10 h-5 bg-slate-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-4 md:-left-12 top-24 p-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <Siren size={24} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Active Alert</div>
                <div className="text-sm md:text-base font-bold text-white">Category 4 Cyclone</div>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -right-4 md:-right-8 bottom-24 p-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Resources Allocated</div>
                <div className="text-sm md:text-base font-bold text-white">12 Teams Deployed</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Live Command Center Preview */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Command Center</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Real-time situational awareness across all operational regions.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Active Floods", val: "12", icon: Waves, color: "text-blue-400", bg: "bg-blue-400/10" },
              { label: "Fire Incidents", val: "8", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
              { label: "Cyclones", val: "2", icon: Wind, color: "text-teal-400", bg: "bg-teal-400/10" },
              { label: "Rescue Teams", val: "145", icon: ShieldAlert, color: "text-indigo-400", bg: "bg-indigo-400/10" },
              { label: "Relief Camps", val: "34", icon: MapPin, color: "text-green-400", bg: "bg-green-400/10" },
              { label: "People Rescued", val: "8,240", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.val}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Disaster Categories */}
      <section id="guide" className="py-24 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Emergency Categories</h2>
            <p className="text-slate-400 max-w-2xl">Select an emergency type to view specific action plans and rapid response protocols.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Flood", icon: Waves, color: "hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]", text: "group-hover:text-blue-400" },
              { title: "Fire", icon: Flame, color: "hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]", text: "group-hover:text-red-400" },
              { title: "Earthquake", icon: Activity, color: "hover:border-amber-500/50 hover:bg-amber-500/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]", text: "group-hover:text-amber-400" },
              { title: "Cyclone", icon: Wind, color: "hover:border-teal-500/50 hover:bg-teal-500/10 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]", text: "group-hover:text-teal-400" },
              { title: "Landslide", icon: Mountain, color: "hover:border-orange-700/50 hover:bg-orange-700/10 hover:shadow-[0_0_20px_rgba(194,65,12,0.15)]", text: "group-hover:text-orange-500" },
              { title: "Building Collapse", icon: Building2, color: "hover:border-slate-400/50 hover:bg-slate-600/20 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]", text: "group-hover:text-slate-300" },
              { title: "Road Accident", icon: Car, color: "hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]", text: "group-hover:text-indigo-400" },
              { title: "Chemical Leak", icon: FlaskConical, color: "hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]", text: "group-hover:text-green-400" }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`group cursor-pointer bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 transition-all duration-300 ${cat.color} flex flex-col items-center justify-center text-center gap-4`}
              >
                <cat.icon size={36} className={`text-slate-400 transition-colors ${cat.text}`} />
                <span className={`font-semibold text-slate-300 transition-colors ${cat.text}`}>{cat.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How ADRRAS Works */}
      <section id="about" className="py-24 bg-slate-900 border-y border-slate-800 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A seamless, AI-driven lifecycle from incident reporting to resolution.</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-slate-800 z-0"></div>
            <div className="hidden md:block absolute top-10 left-[10%] w-[60%] h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 z-0 opacity-80 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-4 relative z-10">
              {[
                { step: 1, title: "Report", desc: "Citizen reports emergency via app or SOS.", icon: Phone },
                { step: 2, title: "Verify", desc: "Command center validates incident severity.", icon: Shield },
                { step: 3, title: "Allocate", desc: "AI dispatches nearest rescue teams.", icon: Map },
                { step: 4, title: "Rescue", desc: "Teams execute on-ground operations.", icon: HeartHandshake },
                { step: 5, title: "Resolve", desc: "Incident marked safe & resources freed.", icon: CheckCircle2 }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-slate-700 group-hover:border-primary group-hover:bg-primary/10 flex items-center justify-center mb-6 transition-all shadow-lg relative z-10">
                    <item.icon size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary border-4 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed px-2">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Feature Showcase */}
      <section id="features" className="py-24 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise Features</h2>
            <p className="text-slate-400 max-w-2xl">Everything you need to orchestrate disaster response at scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Emergency Reporting", desc: "Multi-channel reporting system with geo-tagging and media uploads.", icon: Siren, tag: "Core" },
              { title: "Live Disaster Map", desc: "Interactive GIS mapping showing active incidents and resource locations.", icon: Globe, tag: "Core" },
              { title: "Resource Allocation", desc: "Smart dispatching logic based on proximity, urgency, and capability.", icon: Users, tag: "Pro" },
              { title: "Relief Camp Locator", desc: "Real-time capacity tracking for shelters, hospitals, and relief camps.", icon: HomeIcon, tag: "Pro" },
              { title: "Weather Intelligence", desc: "Integration with meteorological data for predictive alerts and routing.", icon: CloudLightning, tag: "API" },
              { title: "Analytics Dashboard", desc: "Comprehensive reporting and historical data analysis for governments.", icon: BarChart3, tag: "Enterprise" },
              { title: "Volunteer Coordination", desc: "Onboard, verify, and deploy civilian volunteers efficiently.", icon: HeartHandshake, tag: "Core" },
              { title: "AI Damage Assessment", desc: "Automated analysis of drone footage for rapid damage estimation.", icon: Bot, tag: "Coming Soon" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                    <feature.icon size={26} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 shadow-inner">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Emergency Numbers */}
      <section id="contact" className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Emergency Hotlines</h2>
            <p className="text-slate-400">Available 24/7. Save these numbers or tap to call immediately.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "National Emergency", number: "112", color: "bg-red-500", text: "text-red-400", hover: "hover:bg-red-600" },
              { name: "Police", number: "100", color: "bg-blue-500", text: "text-blue-400", hover: "hover:bg-blue-600" },
              { name: "Ambulance", number: "108", color: "bg-green-500", text: "text-green-400", hover: "hover:bg-green-600" },
              { name: "Fire Department", number: "101", color: "bg-orange-500", text: "text-orange-400", hover: "hover:bg-orange-600" },
              { name: "Disaster Helpline", number: "1078", color: "bg-purple-500", text: "text-purple-400", hover: "hover:bg-purple-600" },
              { name: "Women Helpline", number: "1091", color: "bg-pink-500", text: "text-pink-400", hover: "hover:bg-pink-600" },
              { name: "Child Helpline", number: "1098", color: "bg-teal-500", text: "text-teal-400", hover: "hover:bg-teal-600" },
              { name: "Cyber Crime", number: "1930", color: "bg-indigo-500", text: "text-indigo-400", hover: "hover:bg-indigo-600" }
            ].map((contact, i) => (
              <a 
                key={i} 
                href={`tel:${contact.number}`}
                className="group flex items-center justify-between p-6 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50"
              >
                <div>
                  <div className={`text-sm font-semibold mb-1 uppercase tracking-wider ${contact.text}`}>{contact.name}</div>
                  <div className="text-3xl font-bold text-white tracking-tight">{contact.number}</div>
                </div>
                <div className={`w-14 h-14 rounded-full ${contact.color} bg-opacity-20 flex items-center justify-center ${contact.hover} transition-colors group-hover:bg-opacity-100`}>
                  <Phone size={24} className={`${contact.text} group-hover:text-white transition-colors`} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
