import Image from "next/image";

export default function ContactHero() {
  return (
    <section className="relative bg-slate-900 text-white py-16 min-h-screen flex items-center">
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-30"
      />
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-wider mb-4">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Talk to a Real Agent — Not an Inbox
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Every enquiry at Meridian Properties is handled by a named,
            experienced agent. Fill in the form and we will reach you within 2
            hours during office hours — or WhatsApp us now for an instant
            response.
          </p>
        </div>
      </div>
    </section>
  );
}
