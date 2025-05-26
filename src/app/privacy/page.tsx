"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("important-information");
  const sectionsRef = useRef<HTMLElement[]>([]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const pageYOffset = window.pageYOffset;
      let currentSection = "important-information";

      sectionsRef.current.forEach((section) => {
        const sectionOffsetTop = section.offsetTop - 100;
        if (pageYOffset >= sectionOffsetTop) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen md:px-[150px]">
      <Head>
        <title>Privacy Policy | BR Collins</title>
        <meta name="description" content="BR Collins Privacy Policy" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className=" md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Index</h2>
              <nav className="">
                <button
                  onClick={() => scrollToSection("important-information")}
                  className={`relative block w-full text-left py-2 pl-5 transition-all duration-200 ${
                    activeSection === "important-information"
                      ? "text-blue-600 font-semibold underline before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[6px] before:h-7 before:bg-primary"
                      : "text-gray-700 hover:bg-gray-100 underline"
                  }`}
                >
                  Important Information About Using Our Services
                </button>

                <button
                  onClick={() => scrollToSection("information-we-collect")}
                  className={`relative block w-full text-left py-2 pl-5 transition-all duration-200 ${
                    activeSection === "information-we-collect"
                      ? "text-blue-600 font-semibold underline before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[6px] before:h-7 before:bg-primary"
                      : "text-gray-700 hover:bg-gray-100 underline"
                  }`}
                >
                  Information We Collect
                </button>
                <button
                  onClick={() => scrollToSection("how-we-share-information")}
                  className={`relative block w-full text-left py-2 pl-5 transition-all duration-200 ${
                    activeSection === "how-we-share-information"
                      ? "text-blue-600 font-semibold underline before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[6px] before:h-7 before:bg-primary"
                      : "text-gray-700 hover:bg-gray-100 underline"
                  }`}
                >
                  How We Share Information
                </button>
                <button
                  onClick={() => scrollToSection("third-party-links")}
                  className={`relative block w-full text-left py-2 pl-5 transition-all duration-200 ${
                    activeSection === "third-party-links"
                      ? "text-blue-600 font-semibold underline before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[6px] before:h-7 before:bg-primary"
                      : "text-gray-700 hover:bg-gray-100 underline"
                  }`}
                >
                  Third Party Links
                </button>
                <button
                  onClick={() => scrollToSection("children-privacy")}
                  className={`relative block w-full text-left py-2 pl-5 transition-all duration-200 ${
                    activeSection === "children-privacy"
                      ? "text-blue-600 font-semibold underline before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[6px] before:h-7 before:bg-primary"
                      : "text-gray-700 hover:bg-gray-100 underline"
                  }`}
                >
                  Children&#39;s Privacy
                </button>
                <button
                  onClick={() => scrollToSection("how-we-protect-information")}
                  className={`relative block w-full text-left py-2 pl-5 transition-all duration-200 ${
                    activeSection === "how-we-protect-information"
                      ? "text-blue-600 font-semibold underline before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[6px] before:h-7 before:bg-primary"
                      : "text-gray-700 hover:bg-gray-100 underline"
                  }`}
                >
                  How We Protect Information
                </button>
                <button
                  onClick={() => scrollToSection("policy-changes")}
                  className={`relative block w-full text-left py-2 pl-5 transition-all duration-200 ${
                    activeSection === "policy-changes"
                      ? "text-blue-600 font-semibold underline before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[6px] before:h-7 before:bg-primary"
                      : "text-gray-700 hover:bg-gray-100 underline"
                  }`}
                >
                  Policy Changes
                </button>
              </nav>
            </div>
          </div>
          <div className="flex-1 bg-white shadow-sm rounded-lg p-6 md:p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-blue-600 mb-8">
              Last Updated: <span className="text-gray-700">April 22, 2025</span>
            </p>

            <section id="important-information" ref={addToRefs} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Important Information About Using Our Services
              </h2>
              <p className="text-gray-700 mb-4">
                At BR Collins (&quot;BR Collins&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), we respect your
                privacy rights. We have created this privacy policy (&quot;Privacy Policy&quot;) to explain how we treat
                the information collected and received from your use of our services (&quot;Services&quot;) provided
                through our website, [insert website URL], and any other websites or applications we own, operate, or
                control (the &quot;Websink(s)&quot;). This Privacy Policy applies only to the Services, and we are not
                responsible for the practices of persons, companies, institutions, or websites that BR Collins does not
                control, manage, or employ.
              </p>
              <p className="text-gray-700 mb-4">
                Please read this Privacy Policy carefully, as it governs your use of BR Collins. If you do not agree to
                this Privacy Policy, please do not use our Services.
              </p>
              <p className="text-gray-700 mb-4">
                BR Collins is the data controller of your information. Please see the &quot;Contact Information&quot;
                section below for additional details.
              </p>
              <p className="text-gray-700">
                By submitting any information to us, you acknowledge that we may collect, use, disclose, and retain such
                information in accordance with this Privacy Policy and as permitted or required by law. If you do not
                agree with these terms, please do not provide any information to us.
              </p>
              <p className="text-gray-700 mt-4">
                BR Collins may offer social sharing features as part of its Services, allowing you to make your profile
                public and share details, including progress in courses or activities, with others outside of the BR
                Collins Websinks Social Sharing. By choosing to participate in Social Sharing, you acknowledge that any
                information or materials you include in your profile can be viewed by other users, including potential
                employers or third parties, and that information shared may remain accessible even after you make your
                profile private. BR Collins has no control over the access or use of information provided to third
                parties via Social Sharing outside its Websink(s).
              </p>
            </section>

            <section id="information-we-collect" ref={addToRefs} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Information We Collect</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <span className="font-medium">Personal information:</span> Name, email address, phone number, and any
                  other information you voluntarily provide.
                </li>
                <li>
                  <span className="font-medium">Usage Data:</span> Information automatically collected when you visit
                  our website, such as IP address, browser type, and pages visited.
                </li>
                <li>
                  <span className="font-medium">Cookies and Tracking Technologies:</span> We use cookies to enhance user
                  experience and analyze website traffic.
                </li>
              </ul>
            </section>

            <section id="how-we-share-information" ref={addToRefs} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Share and Disclose Your Information</h2>
              <p className="text-gray-700">
                At BR Collins (&quot;BR Collins&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), we respect your
                privacy rights. We have created this privacy policy (&quot;Privacy Policy&quot;) to explain how we treat
                the information collected and received from your use of our services (&quot;Services&quot;) provided
                through our website, [insert website URL], and any other websites or applications we own, operate, or
                control (the &quot;Websink(s)&quot;). This Privacy Policy applies only to the Services, and we are not
                responsible for the practices of persons, companies, institutions, or websites that BR Collins does not
                control, manage, or employ.
              </p>
              <p className="text-gray-700 mt-4">
                Please read this Privacy Policy carefully, as it governs your use of BR Collins. If you do not agree to
                this Privacy Policy, please do not use our Services.
              </p>
              <p className="text-gray-700 mt-4">
                BR Collins is the data controller of your information. Please see the &quot;Contact Information&quot;
                section below for additional details.
              </p>
            </section>

            <section id="third-party-links" ref={addToRefs} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third Party Links and Features</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <span className="font-medium">Personal Information:</span> Name, email address, phone number, and any
                  other information you voluntarily provide.
                </li>
                <li>
                  <span className="font-medium">Usage Data:</span> Information automatically collected when you visit
                  our website, such as IP address, browser type, and pages visited.
                </li>
                <li>
                  <span className="font-medium">Cookies and Tracking Technologies:</span> We use cookies to enhance user
                  experience and analyze website traffic.
                </li>
              </ul>
            </section>

            <section id="children-privacy" ref={addToRefs} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children&#39;s Privacy</h2>
              <p className="text-gray-700">
                At BR Collins (&quot;BR Collins&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), we respect your
                privacy rights. We have created this privacy policy (&quot;Privacy Policy&quot;) to explain how we treat
                the information collected and received from your use of our services (&quot;Services&quot;) provided
                through our website, [insert website URL], and any other websites or applications we own, operate, or
                control (the &quot;Websink(s)&quot;). This Privacy Policy applies only to the Services, and we are not
                responsible for the practices of persons, companies, institutions, or websites that BR Collins does not
                control, manage, or employ.
              </p>
            </section>

            <section id="how-we-protect-information" ref={addToRefs} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Protect Your Information</h2>
              <p className="text-gray-700">
                At BR Collins (&quot;BR Collins&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), we respect your
                privacy rights. We have created this privacy policy (&quot;Privacy Policy&quot;) to explain how we treat
                the information collected and received from your use of our services (&quot;Services&quot;) provided
                through our website, [insert website URL], and any other websites or applications we own, operate, or
                control (the &quot;Websink(s)&quot;). This Privacy Policy applies only to the Services, and we are not
                responsible for the practices of persons, companies, institutions, or websites that BR Collins does not
                control, manage, or employ.
              </p>
              <p className="text-gray-700 mt-4">
                Please read this Privacy Policy carefully, as it governs your use of BR Collins. If you do not agree to
                this Privacy Policy, please do not use our Services.
              </p>
              <p className="text-gray-700 mt-4">
                BR Collins is the data controller of your information. Please see the &quot;Contact Information&quot;
                section below for additional details.
              </p>
            </section>

            <section id="policy-changes" ref={addToRefs} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Our Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the Last Updated date at the top of this Privacy Policy.
                You are responsible for checking this Privacy Policy periodically to stay informed about our practices.
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the Last Updated date at the top of this Privacy Policy.
                You are responsible for checking this Privacy Policy periodically to stay informed about our practices.
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the Last Updated date at the top of this Privacy Policy.
                You are responsible for checking this Privacy Policy periodically to stay informed about our practices.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
