"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AOS from "aos"
import "aos/dist/aos.css"
import Image from "next/image"
import { Quicksand, Playfair_Display, Montserrat } from "next/font/google"
import {
  FaInstagram,
  FaMusic,
  FaPause,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCamera,
} from "react-icons/fa"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
})

interface Wish {
  id: number
  name?: string
  message: string
  status: string
  createdAt: string
  guest?: {
    id: number
    name: string
  }
}

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ name: "", message: "", status: "attending" })
  const [wishes, setWishes] = useState<Wish[]>([])
  const [hadir, setHadir] = useState(0)
  const [tidakHadir, setTidakHadir] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const [guestName, setGuestName] = useState("Calon Tamu Undangan")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // ambil nama tamu dari query param ?to=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const to = params.get("to")
    if (to) setGuestName(to)
  }, [])

  // init AOS
  useEffect(() => {
    AOS.init({ duration: 1200, once: true })
  }, [])

  // lock scroll sebelum dibuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? "auto" : "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // ambil data rsvp
  const loadData = async () => {
    try {
      const res = await fetch("/api/rsvp")
      const data = await res.json()
      setWishes(data.wishes)
      setHadir(data.hadir)
      setTidakHadir(data.tidakHadir)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // countdown
  useEffect(() => {
    const targetDate = new Date("2030-01-25 09:00:00").getTime()
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // play music ketika open invitation
  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => console.log("Autoplay blocked:", err))
    }
  }, [isOpen])

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setForm({ name: "", message: "", status: "attending" })
    loadData()
  }

  return (
    <main
      className={`${montserrat.variable} ${playfair.variable} ${quicksand.variable} font-[Montserrat]`}
      style={{
        backgroundImage: "url('/tutu.webp')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* ================= HERO OVERLAY ================= */}
      <AnimatePresence>
  {!isOpen && (
    <motion.section
      className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/tutu.webp')" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Konten utama */}
      <div
        className="relative z-10 space-y-4 sm:space-y-6 text-white px-4"
        data-aos="fade-up"
      >
        {/* Salam pembuka */}
        <p className="text-base sm:text-lg">Dear,</p>
        <h2 className="text-xl sm:text-2xl font-bold">{guestName}</h2>
        <p className="text-xs sm:text-sm">You Are Invited!</p>

        {/* Nama mempelai */}
        <h1 className="text-accent text-3xl sm:text-4xl md:text-5xl font-playfair">
          Faqih &amp; Nia
        </h1>

        {/* Tombol buka undangan */}
        <button
          onClick={() => setIsOpen(true)}
          className="mt-4 sm:mt-6 bg-white text-black px-5 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:bg-gray-200 transition flex items-center justify-center gap-2 leading-none"
        >
          <FaEnvelope className="text-lg" />
          <span className="inline-block">Open Invitation</span>
        </button>
      </div>
    </motion.section>
  )}
</AnimatePresence>



      {/* ================= ISI UNDANGAN ================= */}
      {isOpen && (
        <>
          {/* ========== BACKSOUND AUDIO ========== */}
          <audio ref={audioRef} src="/backsound.mp3" loop />

          {/* tombol kontrol musik */}
          <button
            onClick={toggleMusic}
            className="fixed bottom-4 right-4 z-50 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition"
          >
            {isPlaying ? <FaPause /> : <FaMusic />}
          </button>

          {/* Section Hero Countdown */}
          <section
  className="relative flex flex-col items-center justify-center min-h-screen text-center text-white bg-cover bg-center"
  style={{ backgroundImage: "url('/cover.jpg')" }}
>
  <div className="absolute inset-0 bg-black/50" />
  <div className="relative z-10 space-y-6 px-4">
    <p className="text-lg" data-aos="fade-down">Kepada Bapak/Ibu/Saudara/i,</p>
    <h1 className="text-5xl sm:text-6xl font-playfair text-accent" data-aos="fade-up">Faqih & Nia</h1>
    <p className="text-lg" data-aos="fade-right">Akan melangsungkan resepsi dalam:</p>

    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {[
        { label: "Hari", value: timeLeft.days },
        { label: "Jam", value: timeLeft.hours },
        { label: "Menit", value: timeLeft.minutes },
        { label: "Detik", value: timeLeft.seconds },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white/20 border border-accent/30 rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg"
        >
          <p className="text-2xl font-bold">{item.value}</p>
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
</section>

          {/* Ayat QS Ar-Rum 21 */}
          <section className="py-16 px-4 text-center bg-[#fdf8f4]/90 backdrop-blur-sm" data-aos="fade-up">
  <p className="max-w-3xl mx-auto text-lg italic text-accent leading-relaxed">
              &quot;Dan di antara tanda-tanda kekuasaan Allah ialah diciptakan-Nya untukmu pasangan hidup dari
              jenismu sendiri supaya kamu merasa tenteram di samping-Nya dan dijadikan-Nya rasa kasih sayang di
              antara kamu. Sesungguhnya yang demikian itu menjadi bukti kekuasaan Allah bagi kaum yang
              berfikir.&quot; <br />
              <span className="font-semibold">(QS. Ar-Rum 21)</span>
            </p>
          </section>

          {/* ================= MEMPELAI ================= */}
         {/* ================= MEMPELAI ================= */}
<section
  className="py-16 sm:py-20 px-4 text-center bg-white/70 backdrop-blur-sm"
  data-aos="fade-up"
>
  {/* Judul Section */}
  <h2 className="text-3xl sm:text-4xl font-bold font-[GreatVibes] text-black mb-8 sm:mb-10">
    Mempelai
  </h2>

  {/* Grid Mempelai */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
    {/* ================= Mempelai Wanita ================= */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center"
    >
      {/* Tambahkan animasi zoom-in-up hanya di foto */}
      <div data-aos="zoom-in-up" data-aos-duration="1200">
        <Image
          src="/mempelai1.jpg"
          alt="Mempelai Wanita"
          width={400}
          height={500}
          loading="lazy"
          className="rounded-2xl shadow-xl w-full object-cover"
        />
      </div>
      <h3 className="text-black text-2xl font-playfair mt-4">Kurnia Tri</h3>
      <p className="text-gray-600 font-montserrat">
        Putri dari Bpk. Prasetyo &amp; Ibu Siti Juwariyah
      </p>
      <a
        href="https://instagram.com/niaaatry_"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors"
      >
        <FaInstagram size={20} />
        <span className="font-montserrat text-sm">Instagram</span>
      </a>
    </motion.div>

    {/* ================= Mempelai Pria ================= */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center"
    >
      <div data-aos="zoom-in-up" data-aos-duration="1200">
        <Image
          src="/mempelai2.jpg"
          alt="Mempelai Pria"
          width={400}
          height={500}
          loading="lazy"
          className="rounded-2xl shadow-xl w-full object-cover"
        />
      </div>
      <h3 className="text-black text-2xl font-playfair mt-4">
        Muhammad Faqih Hidayatullah
      </h3>
      <p className="text-gray-600 font-montserrat">
        Putra dari Bpk. Khusnul Abidin &amp; Ibu Uswatun
      </p>
      <a
        href="https://instagram.com/hdayytutu"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors"
      >
        <FaInstagram size={20} />
        <span className="font-montserrat text-sm">Instagram</span>
      </a>
    </motion.div>
  </div>
</section>



          {/* ================= ACARA ================= */}
          <section
  className="relative flex flex-col items-center justify-center min-h-screen text-center text-white bg-black/60 backdrop-blur-sm"
  data-aos="fade-up"
>
  <div className="relative z-10 max-w-5xl px-6 sm:px-8">
    <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-10 font-playfair" data-aos="fade-down">
      ACARA
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Akad */}
      <div
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center border border-accent/30"
        data-aos="fade-right"
      >
        <h3 className="text-2xl font-semibold text-accent mb-4 font-montserrat">Akad Nikah</h3>
        <p className="flex items-center gap-2 text-base sm:text-lg mb-2 text-primary">
          <FaCalendarAlt className="text-accent" /> Jumat, 25 Januari 2030
        </p>
        <p className="flex items-center gap-2 text-base sm:text-lg mb-2 text-primary">
          <FaClock className="text-accent" /> 08:00 WIB
        </p>
        <p className="text-sm sm:text-base text-secondary mb-4">
          <b>Hotel Tentrem mall</b> <br /> Jl. Gajahmada No.123, Pekunden, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah
        </p>
        <a
          href="https://maps.app.goo.gl/Q7sMiNnRNuQDWgNf9"
          target="_blank"
          className="inline-flex items-center gap-2 bg-accent/80 px-4 py-2 rounded-full shadow hover:bg-accent transition text-black font-semibold"
        >
          <FaMapMarkerAlt /> <span>Lihat Lokasi</span>
        </a>
      </div>

      {/* Resepsi */}
      <div
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center border border-accent/30"
        data-aos="fade-left"
      >
        <h3 className="text-2xl font-semibold text-accent mb-4 font-montserrat">Resepsi</h3>
        <p className="flex items-center gap-2 text-base sm:text-lg mb-2 text-primary">
          <FaCalendarAlt className="text-accent" /> Jumat, 25 Januari 2030
        </p>
        <p className="flex items-center gap-2 text-base sm:text-lg mb-2 text-primary">
          <FaClock className="text-accent" /> 10:30 WIB
        </p>
        <p className="text-sm sm:text-base text-secondary mb-4">
          <b>Hotel Tentrem mall</b> <br /> Jl. Gajahmada No.123, Pekunden, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah
        </p>
        <a
          href="https://maps.app.goo.gl/Q7sMiNnRNuQDWgNf9"
          target="_blank"
          className="inline-flex items-center gap-2 bg-accent/80 px-4 py-2 rounded-full shadow hover:bg-accent transition text-black font-semibold"
        >
          <FaMapMarkerAlt /> <span>Lihat Lokasi</span>
        </a>
      </div>
    </div>
  </div>
</section>


          {/* ================= GALLERY ================= */}
         <section
  className="py-12 sm:py-16 px-4 bg-[#fdf8f4]/90 backdrop-blur-sm"
  data-aos="fade-up"
>
  <h2
    className="font-nickainley text-3xl sm:text-4xl text-center text-accent mb-6 sm:mb-10 flex items-center gap-2 justify-center"
    data-aos="fade-down"
  >
    <FaCamera className="text-accent" /> WEDDING GALERY
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
    {[
      "/gallery/photo1.JPG",
      "/gallery/photo2.JPG",
      "/gallery/photo3.JPG",
      "/gallery/photo4.JPG",
      "/gallery/photo5.JPG",
      "/gallery/photo6.JPG",
    ].map((src, i) => (
      <div
        key={i}
        className="relative overflow-hidden rounded-2xl shadow-md border border-accent/30 group"
        data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
      >
        <Image
          src={src}
          alt={`Foto ${i + 1}`}
          width={600}
          height={400}
          loading="lazy"
          className="w-full h-60 sm:h-72 object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
          <p className="text-white text-lg sm:text-xl font-semibold font-poppins tracking-wide">
            Kenangan {i + 1}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>


          {/* ================= WEDDING WISH ================= */}
         <section
  id="rsvp"
  className="py-12 sm:py-16 px-4 bg-black/80 text-white backdrop-blur-sm"
  data-aos="fade-up"
>
  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-accent font-playfair">
    Wedding Wish
  </h2>
  <p className="text-center text-gray-300 mb-6 sm:mb-8">
    Beri Doa &amp; Ucapan Terbaikmu
  </p>

  {/* Counter */}
  <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
    <div className="bg-green-600/80 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold shadow">
      {hadir} Hadir
    </div>
    <div className="bg-red-600/80 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold shadow">
      {tidakHadir} Tidak Hadir
    </div>
  </div>

  {/* Form */}
  <form
    onSubmit={handleSubmit}
    className="bg-gray-900/80 p-4 sm:p-6 rounded-lg max-w-xl mx-auto space-y-3 sm:space-y-4 shadow-lg border border-gray-700"
    data-aos="fade-up"
  >
    <input
      className="w-full p-2 sm:p-3 rounded text-white focus:ring-2 focus:ring-accent"
      placeholder="Nama"
      value={form.name}
      onChange={e => setForm({ ...form, name: e.target.value })}
    />
    <textarea
      className="w-full p-2 sm:p-3 rounded text-white focus:ring-2 focus:ring-accent"
      placeholder="Ucapan"
      value={form.message}
      onChange={e => setForm({ ...form, message: e.target.value })}
    />
    <select
      className="w-full p-2 sm:p-3 rounded text-black focus:ring-2 focus:ring-accent"
      value={form.status}
      onChange={e => setForm({ ...form, status: e.target.value })}
    >
      <option value="attending">Hadir</option>
      <option value="not_attending">Tidak Hadir</option>
    </select>
    <button className="w-full bg-accent/90 py-2 sm:py-3 rounded-lg font-bold text-black hover:bg-accent transition">
      KIRIM
    </button>
  </form>

  {/* List ucapan */}
  <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-4 max-w-2xl mx-auto">
    {wishes.length > 0 ? (
      wishes.map((w, i) => (
        <div
          key={i}
          className="bg-gray-800/80 p-3 sm:p-4 rounded-lg border border-gray-700"
          data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
        >
          <p className="font-bold text-accent">{w.guest?.name ?? w.name ?? "Anonim"}</p>
          <p>{w.message}</p>
          <p className="text-xs text-gray-400">
            {new Date(w.createdAt).toLocaleString()}
          </p>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-400">Belum ada ucapan 😊</p>
    )}
  </div>
</section>
{/* ================= AMBLOP DIGITAL ================= */}
{/* ================= AMBLOP DIGITAL ================= */}
<section
  className="py-12 sm:py-16 px-4 text-center"
  style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
  data-aos="fade-up"
>
  <h2
    className="text-3xl sm:text-4xl font-bold mb-6 font-[GreatVibes]"
    style={{ color: "var(--accent)" }}
  >
    Amplop Digital
  </h2>

  <p
    className="mb-8 max-w-md mx-auto font-montserrat"
    style={{ color: "var(--muted)" }}
  >
    Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
    Namun, jika memberi adalah bentuk kasih, kami menerima kado digital melalui rekening berikut:
  </p>

  {/* Kartu 1 */}
  <div
    className="max-w-md mx-auto p-6 rounded-2xl shadow-md mb-6"
    style={{
      backgroundColor: "var(--background)",
      border: "1px solid var(--accent)",
    }}
  >
    <h3
      className="text-lg font-semibold font-playfair"
      style={{ color: "var(--foreground)" }}
    >
      Bank BCA
    </h3>
    <p
      className="text-2xl font-bold my-2 select-all font-montserrat"
      style={{ color: "var(--accent)" }}
    >
      1234567890
    </p>
    <p
      className="mb-4 font-montserrat"
      style={{ color: "var(--muted)" }}
    >
      a.n. Muhammad Faqih Hidayatullah
    </p>
    <button
      onClick={() => {
        navigator.clipboard.writeText("1234567890")
        alert("Nomor rekening disalin!")
      }}
      className="px-6 py-2 rounded-full shadow-md transition-all font-montserrat"
      style={{
        backgroundColor: "var(--accent)",
        color: "#fff",
      }}
    >
      Salin Nomor Rekening
    </button>
  </div>

  {/* Kartu 2 */}
  <div
    className="max-w-md mx-auto p-6 rounded-2xl shadow-md"
    style={{
      backgroundColor: "var(--background)",
      border: "1px solid var(--accent)",
    }}
  >
    <h3
      className="text-lg font-semibold font-playfair"
      style={{ color: "var(--foreground)" }}
    >
      Bank BNI
    </h3>
    <p
      className="text-2xl font-bold my-2 select-all font-montserrat"
      style={{ color: "var(--accent)" }}
    >
      9876543210
    </p>
    <p
      className="mb-4 font-montserrat"
      style={{ color: "var(--muted)" }}
    >
      a.n. Kurnia Tri
    </p>
    <button
      onClick={() => {
        navigator.clipboard.writeText("9876543210")
        alert("Nomor rekening disalin!")
      }}
      className="px-6 py-2 rounded-full shadow-md transition-all font-montserrat"
      style={{
        backgroundColor: "var(--accent)",
        color: "#fff",
      }}
    >
      Salin Nomor Rekening
    </button>
  </div>
</section>




{/* FOOTER */}
<footer className="py-4 sm:py-6 text-center bg-accent text-black font-semibold px-2" data-aos="fade-up">
  <p className="text-xs sm:text-sm md:text-base">
    © 2025 Faqih &amp; Nia. All rights reserved.
  </p>
</footer>

        </>
      )}
    </main>
  )
}
