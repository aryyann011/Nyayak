import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MapPin,
  Phone,
  Scale,
  ShieldAlert,
  FileText,
  Map,
  Send,
  Search,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

// Snappy Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "linear-gradient(135deg, #FDF8F3 0%, #F4EAE0 100%)",
        padding: "30px 60px",
        color: "#1A1A1A",
      }}
    >
      {/* 1. HEADER - Glassmorphism with Slide Down */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          padding: "15px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          border: "1px solid rgba(255,255,255,0.3)",
          position: "sticky",
          top: "20px",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <motion.div 
            whileHover={{ rotate: 15 }}
            style={{ background: "#E85D04", padding: "8px", borderRadius: "10px" }}
          >
            <Scale color="white" size={20} />
          </motion.div>
          <h2 style={{ fontWeight: 800, fontSize: "22px", margin: 0, letterSpacing: "-0.5px" }}>
            Nyaya<span style={{ color: "#E85D04" }}>Sahayak</span>
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <div style={{ display: "flex", gap: "25px", fontWeight: 500, fontSize: "14px", color: "#666" }}>
            <span style={{ cursor: "pointer", color: "#1A1A1A" }}>Dashboard</span>
            <span style={{ cursor: "pointer" }}>My Cases</span>
            <span style={{ cursor: "pointer" }}>Safety Map</span>
          </div>
          <div style={{ height: "24px", width: "1px", background: "#DDD" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
             <div style={{ position: "relative" }}>
                <Bell size={20} color="#666" />
                <div style={{ position: "absolute", top: -2, right: -2, width: "8px", height: "8px", background: "#E85D04", borderRadius: "50%", border: "2px solid white" }} />
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f0f0f0", padding: "5px 15px 5px 5px", borderRadius: "30px" }}>
                <img src="https://i.pravatar.cc/35" alt="profile" style={{ borderRadius: "50%" }} />
                <span style={{ fontSize: "13px", fontWeight: 600 }}>Rahul V.</span>
             </div>
          </div>
        </div>
      </motion.nav>

      {/* 2. HERO SECTION */}
      <div style={{ marginTop: "60px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", alignItems: "center" }}>
        <motion.div variants={fadeInUp}>
          <h1 style={{ fontSize: "52px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1px" }}>
            Welcome back, <br />
            <span style={{ color: "#E85D04" }}>Rahul Verma</span>
          </h1>
          <p style={{ marginTop: "20px", fontSize: "18px", color: "#666", maxWidth: "500px" }}>
            Your digital legal companion. Track your FIRs, access emergency support, and stay informed.
          </p>
          
          <motion.div 
            whileFocus={{ scale: 1.02 }}
            style={{ 
              marginTop: "35px", 
              background: "white", 
              padding: "8px 10px 8px 25px", 
              borderRadius: "40px", 
              display: "flex", 
              alignItems: "center", 
              boxShadow: "0 10px 40px rgba(232, 93, 4, 0.1)",
              width: "fit-content",
              border: "1px solid #F3E8DC"
            }}
          >
            <Search size={20} color="#AAA" />
            <input
              placeholder="Ask your legal question..."
              style={{ border: "none", outline: "none", padding: "10px 15px", width: "350px", fontSize: "16px" }}
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: "#E85D04", border: "none", borderRadius: "30px", padding: "12px 25px", color: "white", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}
            >
              Consult AI <Send size={16} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* AI Assistant Floating Card */}
        <motion.div 
          animate={{ y: [0, -12, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative" }}
        >
            <div style={{ 
                background: "white", 
                padding: "20px", 
                borderRadius: "24px", 
                boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
                border: "1px solid rgba(232, 93, 4, 0.1)",
                position: "relative",
                zIndex: 2
            }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                    <div style={{ background: "#FFF0E6", padding: "10px", borderRadius: "12px" }}>
                        <MessageSquare color="#E85D04" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>NyayaSahayak AI</p>
                        <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#777", lineHeight: 1.4 }}>
                            "I've updated your case status. Click to see the next hearing details."
                        </p>
                    </div>
                </div>
            </div>
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: "#FFD200", filter: "blur(60px)", opacity: 0.3 }} />
        </motion.div>
      </div>

      {/* 3. FEATURE CARDS - Staggered Appearance */}
      <motion.div 
        variants={staggerContainer}
        style={{ marginTop: "60px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "25px" }}
      >
        {[
          { icon: <ShieldAlert />, title: "SOS Emergency", desc: "Instant alert to police", btn: "Send SOS", color: "#FF512F", grad: "linear-gradient(135deg, #FF512F, #DD2476)", urgent: true },
          { icon: <FileText />, title: "Case Tracking", desc: "Real-time FIR updates", btn: "View Timeline", color: "#F7971E", grad: "linear-gradient(135deg, #F7971E, #FFD200)" },
          { icon: <MapPin />, title: "Police Stations", desc: "Find nearest help", btn: "Locate Now", color: "#4E73DF", grad: "linear-gradient(135deg, #4E73DF, #224ABE)" },
          { icon: <Map />, title: "Crime Heatmap", desc: "Analyze safety zones", btn: "View Heatmap", color: "#11998E", grad: "linear-gradient(135deg, #11998E, #38EF7D)" },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -10 }}
            style={{
              background: "white",
              borderRadius: "28px",
              padding: "30px",
              boxShadow: hoveredCard === i ? "0 20px 40px rgba(0,0,0,0.08)" : "0 10px 20px rgba(0,0,0,0.02)",
              border: "1px solid #F0F0F0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div>
              <div style={{ 
                width: "56px", height: "56px", borderRadius: "16px", 
                background: card.grad, display: "flex", justifyContent: "center", 
                alignItems: "center", color: "white", boxShadow: `0 10px 20px ${card.color}33`
              }}>
                {card.icon}
              </div>
              <h3 style={{ marginTop: "20px", fontWeight: 700, fontSize: "18px" }}>{card.title}</h3>
              <p style={{ color: "#888", fontSize: "13px", marginTop: "5px" }}>{card.desc}</p>
            </div>

            <motion.button 
              animate={card.urgent ? { scale: [1, 1.05, 1] } : {}}
              transition={card.urgent ? { duration: 1, repeat: Infinity } : {}}
              style={{
                marginTop: "25px", padding: "12px", borderRadius: "14px", border: "none",
                background: hoveredCard === i ? card.grad : "#F8F9FA",
                color: hoveredCard === i ? "white" : card.color,
                fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", gap: "5px"
              }}
            >
              {card.btn} <ChevronRight size={14} />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* 4. LOWER DASHBOARD AREA */}
      <div style={{ marginTop: "50px", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px" }}>
        {/* CASE TRACKING */}
        <motion.div 
          variants={fadeInUp}
          style={{ background: "white", padding: "30px", borderRadius: "32px", border: "1px solid #F0F0F0" }}
        >
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Ongoing Cases</h3>
              <button style={{ background: "none", border: "none", color: "#E85D04", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>See all</button>
           </div>
           <div style={{ background: "#FAFAFA", padding: "20px", borderRadius: "20px", border: "1px solid #F0F0F0" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                 <span style={{ fontWeight: 700, fontSize: "14px" }}>FIR #0123456</span>
                 <span style={{ fontSize: "12px", background: "#FFF0E6", color: "#E85D04", padding: "4px 10px", borderRadius: "8px", fontWeight: 700 }}>Investigation</span>
              </div>
              <p style={{ fontSize: "12px", color: "#888", margin: "10px 0" }}>Property Dispute - Section 420</p>
              <div style={{ height: "6px", background: "#EEE", borderRadius: "10px", overflow: "hidden" }}>
                 <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 1 }} style={{ height: "100%", background: "linear-gradient(90deg, #E85D04, #FFB703)" }} />
              </div>
           </div>
        </motion.div>

        {/* LIVE MAP */}
        <motion.div 
          variants={fadeInUp}
          style={{ background: "white", padding: "30px", borderRadius: "32px", border: "1px solid #F0F0F0", position: "relative", overflow: "hidden" }}
        >
            <h3 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: 700 }}>Live Safety Map</h3>
            <div style={{ height: "220px", borderRadius: "24px", background: "#E5E5E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  style={{ background: "rgba(255,255,255,0.9)", padding: "10px 20px", borderRadius: "15px", fontWeight: 600, fontSize: "14px", backdropFilter: "blur(5px)", display: "flex", gap: "5px" }}
                >
                    <MapPin size={16} color="#E85D04" /> High Activity Near Sector V
                </motion.div>
            </div>
        </motion.div>
      </div>

      {/* 5. FOOTER SOS SECTION */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        style={{ 
          marginTop: "50px", background: "linear-gradient(90deg, #1A1A1A 0%, #333 100%)", 
          padding: "30px 40px", borderRadius: "32px", display: "flex", 
          justifyContent: "space-between", alignItems: "center", color: "white"
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "50%" }}>
                <Phone color="#FFD200" />
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>24/7 Legal Emergency Support</h3>
                <p style={{ margin: "5px 0 0 0", color: "#AAA", fontSize: "14px" }}>Direct connection to local authorities.</p>
            </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
            <button style={{ padding: "15px 35px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "white", fontWeight: 600, cursor: "pointer" }}>Helpline: 1091</button>
            <motion.button 
              whileHover={{ scale: 1.05, background: "linear-gradient(135deg, #FF0000, #990000)" }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                padding: "15px 50px", borderRadius: "18px", border: "none", 
                background: "linear-gradient(135deg, #FF512F, #DD2476)", 
                color: "white", fontWeight: 800, fontSize: "18px", cursor: "pointer",
                boxShadow: "0 10px 30px rgba(221, 36, 118, 0.4)"
              }}
            >
                ACTIVATE SOS
            </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;