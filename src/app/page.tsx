"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AOS from "aos"
import Image from "next/image"
import { FaMusic, FaPause, FaEnvelope, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCamera } from "react-icons/fa"

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
    const targetDate = new Date("2025-12-12T09:00:00").getTime()
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
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(err => console.log("Autoplay blocked:", err))
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
    <main className="font-[Poppins]">
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
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 space-y-4 sm:space-y-6 text-white px-4" data-aos="fade-up">
              <p className="text-base sm:text-lg">Dear,</p>
              <h2 className="text-xl sm:text-2xl font-bold">{guestName}</h2>
              <p className="text-xs sm:text-sm">You Are Invited!</p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-[GreatVibes]">Faqih & Nia</h1>

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
            style={{ backgroundImage: "url('/foto.jpeg')" }}
            data-aos="fade-up"
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 space-y-6 px-4">
              <p className="text-base sm:text-lg" data-aos="fade-down">Kepada Bapak/Ibu/Saudara/i,</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-[GreatVibes]" data-aos="fade-up">Faqih & Nia</h1>
              <p className="text-lg sm:text-xl" data-aos="fade-right">Akan melangsungkan resepsi dalam:</p>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6">
                {[{ label: "Hari", value: timeLeft.days },
                  { label: "Jam", value: timeLeft.hours },
                  { label: "Menit", value: timeLeft.minutes },
                  { label: "Detik", value: timeLeft.seconds }].map((item, i) => (
                    <div
                      key={i}
                      className="bg-pink-600 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center shadow-lg"
                      data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
                    >
                      <p className="text-lg sm:text-2xl font-bold">{item.value}</p>
                      <span className="text-xs sm:text-sm">{item.label}</span>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          {/* Ayat QS Ar-Rum 21 */}
          <section
            className="py-12 sm:py-16 px-4 text-center bg-gradient-to-b from-pink-50 to-white"
            data-aos="fade-up"
          >
            <p className="max-w-3xl mx-auto text-base sm:text-lg italic text-gray-700 leading-relaxed">
              "Dan di antara tanda-tanda kekuasaan Allah ialah diciptakan-Nya untukmu pasangan hidup
              dari jenismu sendiri supaya kamu merasa tenteram di samping-Nya dan dijadikan-Nya rasa
              kasih sayang di antara kamu. Sesungguhnya yang demikian itu menjadi bukti kekuasaan Allah
              bagi kaum yang berfikir." <br />
              <span className="font-semibold">(QS. Ar-Rum 21)</span>
            </p>
          </section>

          {/* ================= MEMPELAI ================= */}
          <section
            className="py-16 sm:py-20 px-4 text-center bg-gradient-to-b from-pink-50 to-white"
            data-aos="fade-up"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-[GreatVibes] text-pink-600 mb-8 sm:mb-10">Mempelai</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
              <div data-aos="fade-right">
                <Image
                  src="/mempelai1.jpg"
                  alt="Mempelai Wanita"
                  width={600}
                  height={800}
                  loading="lazy"
                  className="rounded-xl shadow-lg mb-4 w-full object-cover"
                />
                <h3 className="text-xl sm:text-2xl font-semibold">kurnia tri</h3>
                <p className="text-gray-600">Putri dari Bpk. Prasetyo & Ibu Siti juwariyah</p>
              </div>
              <div data-aos="fade-left">
                <Image
                  src="/mempelai2.jpg"
                  alt="Mempelai Pria"
                  width={600}
                  height={800}
                  loading="lazy"
                  className="rounded-xl shadow-lg mb-4 w-full object-cover"
                />
                <h3 className="text-xl sm:text-2xl font-semibold">Muhammad faqih hidayatullah</h3>
                <p className="text-gray-600">Putra dari Bpk. Khusnul abidin & Ibu Uswatun</p>
              </div>
            </div>
          </section>

          {/* ================= ACARA ================= */}
          <section
            className="relative flex flex-col items-center justify-center min-h-screen text-center text-white bg-cover bg-center"
            style={{ backgroundImage: "url('/acraa.jpg')" }}
            data-aos="fade-up"
          >
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 space-y-4 sm:space-y-6 max-w-xl px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-pink-300" data-aos="fade-down">Acara</h2>
              <p className="text-lg sm:text-xl flex items-center gap-2 justify-center" data-aos="fade-right"><FaCalendarAlt /> Minggu, 11 Juni 2024</p>
              <p className="text-lg sm:text-xl flex items-center gap-2 justify-center" data-aos="fade-left"><FaClock /> 10:30 WIB</p>
              <p className="text-base sm:text-lg" data-aos="fade-up">
                <b>Hotel Grand Orchard</b> <br /> Gunung Sahari – Kemayoran, Jakarta Pusat
              </p>
              <a
  href="https://maps.app.goo.gl/GZL1C5F8uAebmKCY8"
  target="_blank"
  className="inline-flex items-center justify-center gap-2 mt-4 sm:mt-6 
             bg-pink-600 px-5 sm:px-6 py-2 sm:py-3 rounded-full shadow 
             hover:bg-pink-700 transition leading-none"
  data-aos="fade-up"
>
  <FaMapMarkerAlt className="text-lg -mt-0.5" />
  <span className="inline-block">Lihat Lokasi</span>
</a>

            </div>
          </section>

          {/* ================= GALLERY ================= */}
          <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-pink-50 to-white" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-pink-700 mb-6 sm:mb-8 flex items-center gap-2 justify-center">
              <FaCamera /> Wedding Gallery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {[ "/gallery/photo1.JPG", "/gallery/photo2.JPG", "/gallery/photo3.JPG",
                 "/gallery/photo4.JPG", "/gallery/photo5.JPG", "/gallery/photo6.JPG"]
                .map((src, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-xl shadow-lg group"
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
                      <p className="text-white text-base sm:text-lg font-semibold">Kenangan {i + 1}</p>
                    </div>
                  </div>
              ))}
            </div>
          </section>

          {/* ================= WEDDING WISH ================= */}
          <section id="rsvp" className="py-12 sm:py-16 px-4 bg-black text-white" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Wedding Wish</h2>
            <p className="text-center text-gray-300 mb-6 sm:mb-8">Beri Do'a & Ucapan Terbaikmu</p>

            {/* Counter */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-green-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold" data-aos="fade-right">{hadir} Hadir</div>
              <div className="bg-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold" data-aos="fade-left">{tidakHadir} Tidak Hadir</div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900 p-4 sm:p-6 rounded-lg max-w-xl mx-auto space-y-3 sm:space-y-4 shadow-lg"
              data-aos="fade-up"
            >
              <input
                className="w-full p-2 sm:p-3 rounded text-black"
                placeholder="Nama"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                className="w-full p-2 sm:p-3 rounded text-black"
                placeholder="Ucapan"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
              <select
                className="w-full p-2 sm:p-3 rounded text-black"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="attending">Hadir</option>
                <option value="not_attending">Tidak Hadir</option>
              </select>
              <button className="w-full bg-pink-600 py-2 sm:py-3 rounded-lg font-bold hover:bg-pink-700 transition">
                KIRIM
              </button>
            </form>

            {/* List ucapan */}
            <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-4 max-w-2xl mx-auto">
              {wishes.length > 0 ? (
                wishes.map((w, i) => (
                  <div
                    key={i}
                    className="bg-gray-800 p-3 sm:p-4 rounded-lg"
                    data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
                  >
                    <p className="font-bold text-pink-400">{w.guest?.name ?? w.name ?? "Anonim"}</p>
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

          {/* ================= FOOTER ================= */}
          <footer className="py-4 sm:py-6 text-center bg-pink-700 text-white px-2" data-aos="fade-up">
            <p className="text-xs sm:text-sm md:text-base">© 2025 Faqih & Nia. All rights reserved.</p>
          </footer>
        </>
      )}
    </main>
  )
}
