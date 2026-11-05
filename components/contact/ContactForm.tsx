"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
}

type FormStatus = "idle" | "success" | "error";

const interests = [
  { value: "buy", label: "I want to buy a property" },
  { value: "rent", label: "I want to rent a property" },
  { value: "shortlet", label: "I need a short-let apartment" },
  { value: "sell", label: "I want to sell my property" },
  { value: "invest", label: "I want to invest in property" },
  { value: "diaspora", label: "I am a diaspora buyer" },
  { value: "other", label: "Other enquiry" },
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  // Kept so the error state can offer the exact link that failed to open.
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (value: string) => {
    setFormData((prev) => ({ ...prev, interest: value }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.interest !== "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    const selectedInterest =
      interests.find((i) => i.value === formData.interest)?.label ??
      formData.interest;

    const whatsappMessage = encodeURIComponent(
      `Hello Meridian Properties, my name is ${formData.name}.\n\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email || "Not provided"}\n` +
        `Enquiry: ${selectedInterest}\n\n` +
        `Message: ${formData.message || "No additional message"}`,
    );

    const url = `https://wa.me/2340000000000?text=${whatsappMessage}`;
    setWhatsappUrl(url);

    // Opened synchronously inside the submit handler so the browser still
    // treats this as a user gesture. Deferring it (previously behind a 1s
    // timer) is exactly what causes popup blockers to reject the window.
    const handoff = window.open(url, "_blank", "noopener,noreferrer");

    // Only claim success once the handoff actually happened. Otherwise the
    // enquiry never reached anyone and the user needs a way to recover.
    setStatus(handoff ? "success" : "error");
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      interest: "",
      message: "",
    });
    setWhatsappUrl("");
    setStatus("idle");
  };

  if (status === "error") {
    return (
      <div className="bg-white rounded-2xl border border-amber-200 p-10 text-center" role="alert">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          WhatsApp didn&apos;t open
        </h3>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Your browser blocked the WhatsApp window, so your enquiry has
          <span className="font-semibold"> not been sent yet</span>. Your
          details are still filled in — use the button below to send it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" />
              Open WhatsApp Manually
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="tel:+2340000000000">
              <Phone className="w-4 h-4 mr-2" />
              Call 0800 000 0000
            </a>
          </Button>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-slate-500 text-sm hover:underline mt-6"
        >
          Back to the form
        </button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center" role="status" aria-live="polite">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Enquiry Sent Successfully
        </h3>
        <p className="text-slate-600 mb-2 leading-relaxed">
          Your enquiry has been sent to our WhatsApp. An agent will respond
          within 2 hours during office hours.
        </p>
        <p className="text-slate-500 text-sm mb-8">
          If WhatsApp did not open automatically, message us directly on{" "}
          <span className="font-semibold text-slate-700">0800 000 0000</span>.
        </p>
        <Button onClick={handleReset} variant="outline">
          Send Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Send Us an Enquiry
      </h2>
      <p className="text-slate-500 text-sm mb-8">
        Fill in the form below and we will route your enquiry directly to the
        right agent via WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              Full Name <span className="text-red-600" aria-hidden="true">*</span><span className="sr-only">(required)</span>
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-slate-700"
            >
              Phone / WhatsApp <span className="text-red-600" aria-hidden="true">*</span><span className="sr-only">(required)</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. 0800 000 0000"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email Address{" "}
            <span className="text-slate-600 font-normal">(optional)</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        {/* Interest.
            The label previously had no htmlFor and the trigger no id, so
            clicking the label did nothing and screen readers announced an
            unlabelled combobox — on a required field. WCAG 1.3.1 / 3.3.2. */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="interest"
            className="text-sm font-medium text-slate-700"
          >
            What are you looking for?{" "}
            <span className="text-red-600" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <Select
            value={formData.interest}
            onValueChange={handleInterestChange}
          >
            <SelectTrigger id="interest">
              <SelectValue placeholder="Select your enquiry type" />
            </SelectTrigger>
            <SelectContent>
              {interests.map((interest) => (
                <SelectItem key={interest.value} value={interest.value}>
                  {interest.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="message"
            className="text-sm font-medium text-slate-700"
          >
            Additional Message{" "}
            <span className="text-slate-600 font-normal">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us more about what you are looking for — budget, preferred area, timeline, number of bedrooms..."
            value={formData.message}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={!isFormValid}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
        >
          <Send className="w-4 h-4" />
          Send Enquiry via WhatsApp
        </Button>

        <p className="text-xs text-slate-600">
          <span className="text-red-600" aria-hidden="true">*</span><span className="sr-only">(required)</span> Required fields. Your enquiry
          will be sent directly to our WhatsApp for the fastest response.
        </p>
      </form>
    </div>
  );
}
