import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Engr. Bright Tamuno",
    location: "GRA Phase 2, Port Harcourt",
    quote:
      "Meridian Properties made my property search completely stress-free. Emeka showed me three properties in GRA and I found my dream home in two weeks. The title verification gave me full confidence.",
    rating: 5,
  },
  {
    id: 2,
    name: "Mrs. Chioma Okafor",
    location: "UK-based Diaspora Buyer",
    quote:
      "As a diaspora buyer I was terrified of being defrauded. Meridian sent me video walkthroughs, verified the C of O, and connected me with a lawyer. I bought my duplex in Eliozu without stepping foot in Nigeria.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mr. Femi Adeyemi",
    location: "Woji, Port Harcourt",
    quote:
      "Ada was incredibly professional and honest throughout the entire rental process. No hidden fees, no surprises. The price breakdown was clear from day one. I will recommend Meridian to everyone.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-1">
            Client Experiences
          </p>
          <h2 className="text-3xl font-bold text-slate-900">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col"
            >
              {/* Star Rating */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 text-sm leading-relaxed mb-6 flex-1 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
