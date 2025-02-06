
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Mail, Phone, MapPin } from "lucide-react";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { FooterUser } from "@/components/user/layouts/FooterUser";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const Section = ({ children, className }) => (
  <motion.section
    className={`mb-16 ${className}`}
    variants={fadeInUp}
    initial="initial"
    animate="animate"
  >
    {children}
  </motion.section>
);

export const AboutPage = () => {
  const location = useLocation();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("scrollTo") === "contact") {
      const contactSection = document.getElementById("contact");

      if (contactSection) {
        const yOffset = -200; 
        const yPosition = contactSection.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({ top: yPosition, behavior: "smooth" });
      }
    }
  }, [location]);


  const faqItems = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all items in their original condition.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 50 countries worldwide.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <NavbarUser />
      <SecondNavbarUser />

      <main className="container mx-auto px-4 mt-5">
        <motion.h2
          className="text-5xl font-bold mb-5 text-center text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Us
        </motion.h2>

        <Section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <img
              src="/logo/IMG_20250127_121203.jpg"
              alt="TrendyMart Team"
              width={700}
              height={500}
              className="rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <h3 className="text-3xl font-semibold mb-6 text-gray-800">
              Our Story
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              At Dune Audio, we're passionate about delivering the ultimate
              audio experience. Our journey began with a simple vision: to
              provide high-quality, innovative, and affordable audio devices
              that elevate the way people listen to music, take calls, and enjoy
              immersive sound.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We understand that great sound can transform moments, whether it's
              the rhythm that powers your workouts, the clarity that enhances
              your meetings, or the beats that fuel your adventures. That's why
              we carefully curate a collection of top-tier headphones, earbuds,
              neckbands, and speakers—ensuring each product offers exceptional
              performance, comfort, and style.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Driven by technology and a love for sound, we are committed to
              bringing you the best in audio gear, making premium sound
              accessible to everyone. Join us on this journey and experience the
              future of audio with Dune Audio
            </p>
          </div>
        </Section>

        <Section>
          <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Our Mission
          </h3>
          <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto leading-relaxed">
            At Dune Audio, our mission is to revolutionize the way people
            experience sound by providing premium-quality audio devices at
            accessible prices. We believe that great sound should be available
            to everyone, whether you're a music enthusiast, a gamer, or someone
            who simply loves immersive audio.
          </p>
        </Section>

        <Section className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality Assurance",
              description:
                "We partner with ethical manufacturers and rigorously test our products to ensure the highest standards of quality and durability.",
            },
            {
              title: "Sustainability Commitment",
              description:
                "From eco-friendly packaging to partnering with sustainable brands, we're dedicated to reducing our environmental footprint.",
            },
            {
              title: "Customer-Centric Approach",
              description:
                "Our responsive support team and hassle-free return policy ensure a smooth and satisfying shopping experience for every customer.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h4 className="text-xl font-semibold mb-3 text-gray-800">
                {item.title}
              </h4>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </Section>

        <Section>
          <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="text-lg font-medium text-gray-800">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      activeAccordion === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === index && (
                  <p className="mt-2 text-gray-700">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Get in Touch
          </h3>
          <div id="contact" className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 mb-6 text-center">
              We'd love to hear from you! Whether you have a question about our
              products, need assistance with an order, or just want to say
              hello, our team is here for you.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-gray-700">duneaudio@gmail.com</span>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-gray-700">+91 7025 399 314</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-gray-700">Ernakulam, Pallikkara</span>
              </div>
            </div>
            <div className="text-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105">
                Contact Us
              </button>
            </div>
          </div>
        </Section>
      </main>

      <FooterUser />
    </div>
  );
};