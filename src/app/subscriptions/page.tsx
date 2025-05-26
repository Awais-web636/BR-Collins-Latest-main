"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import SubscriptionCards from "../components/pricing/SubscriptionCards";
const faqs = [
  {
    question: "What's included in the Corporate Subscription plans?",
    answer:
      "Corporate subscriptions provide shared access to our entire course library for your team. Plans are available for 10, 20, or 50 users, and include custom learning dashboards, centralized team management, and progress tracking.",
  },
  {
    question: "Can we upgrade or downgrade our Corporate Plan later?",
    answer:
      "Currently, upgrading or downgrading your Corporate Plan is not possible. Please choose the plan that best fits your team's needs.",
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer: "No, certificates are not provided upon course completion at this time.",
  },
  {
    question: "Is there a free trial available before I buy?",
    answer: "We do not offer a free trial for our subscriptions at this time.",
  },
  {
    question: "How do I manage users or seats in my team plan?",
    answer:
      "Team administrators can easily add or remove users, assign courses, and monitor progress through the centralized dashboard included with every corporate subscription.",
  },
];

const Subcription = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <section className="bg-[#E3F4FC] text-gray-900">
        <div className="w-full px-[10px] xl:px-[1px] lg:px-[10px] md:px-[20px] mx-auto max-w-[1326px] py-10 md:py-14 ">
          <div className="flex flex-col justify-center items-center text-center mb-6 ">
            <h1 className="text-gray-900 font-hanken md:text-5xl text-3xl font-bold lg:mt-8">
              Flexible Pricing for Individuals and Teams
            </h1>
            <p className="my-4 text-gray-600 text-lg md:text-xl max-w-[795px] mx-auto leading-normal">
              Whether you're an individual looking to upskill or a company building stronger teams — we've got you
              covered.
            </p>
          </div>
          <SubscriptionCards />
        </div>
      </section>
      {/* FAQ Section */}
      <div className="contanier px-[10px] xl:px-[100px] lg:px-[50px] md:px-[20px]">
        <div className="w-full px-4 md:px-16 py-16 bg-white text-black">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <p className="text-lg text-orange-600 font-semibold uppercase mb-2">Have a question with B.R Collins?</p>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                A Few Frequently <br /> Asked Questions
              </h1>
              <h3 className="text-lg font-medium mb-2">
                Didn't find the answer you're <br /> looking for?
              </h3>
              <p className="text-base">
                email us directly at{" "}
                <a href="mailto:b.r.collins@example.com" className="text-blue-600 underline">
                  b.r.collins@example.com
                </a>
              </p>
            </div>

            {/* Right Section */}
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="border-b border-gray-300 pb-4 cursor-pointer"
                    onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-base md:text-xl font-semibold">{faq.question}</h3>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    {isOpen && faq.answer && <p className="text-lg text-gray-700 mt-3">{faq.answer}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      \
    </>
  );
};

export default Subcription;
