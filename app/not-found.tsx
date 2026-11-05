import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export default function NotFound() {
  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-3">
            Error 404
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            We couldn&apos;t find that page
          </h1>

          <p className="text-slate-600 leading-relaxed mb-8">
            The page or property you were looking for may have been let, sold,
            or moved. Our full list of verified listings is still right here.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/properties">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto gap-2"
              >
                <Search className="w-4 h-4" />
                Browse All Properties
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">
              Looking for something specific? Tell us what you need and an agent
              will find it.
            </p>
            <WhatsAppButton
              phone="2340000000000"
              message="Hello, I was browsing your website and could not find the property I was looking for. Can you help me?"
              label="WhatsApp an Agent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
