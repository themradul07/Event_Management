import React from "react";
import Background from "../components/ui/Background";

const policy = [
  {
    category:"privacy",
    title: "Privacy Policy",
    effectiveDate: "[Insert Date]",
    content:
      "Welcome to BIET Hub. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website.",
    sections: [
      {
        heading: "Information We Collect",
        details: [
          "Personal Information: We may collect personal details such as name, email address, and phone number when you register or interact with our services.",
          "Usage Data: We collect data on how you interact with our website, including IP address, browser type, and pages visited."
        ]
      },
      {
        heading: "How We Use Your Information",
        details: [
          "To provide and maintain our services.",
          "To improve user experience.",
          "To communicate updates, promotions, or important notices."
        ]
      }
    ]
  },
  {
    category:"terms",
    title: "Terms and Conditions",
    effectiveDate: "[Insert Date]",
    content: "By accessing BIET Hub, you agree to be bound by these Terms and Conditions.",
    sections: [
      {
        heading: "Use of Website",
        details: [
          "BIET Hub is a user trial platform and does not operate in real-time.",
          "Users must not misuse the platform for unlawful activities."
        ]
      },
      {
        heading: "Limitation of Liability",
        details: ["We are not responsible for any losses or damages resulting from the use of our platform."]
      }
    ]
  },
  {
    category:"refund",
    title: "Refund and Cancellation Policy",
    effectiveDate: "[Insert Date]",
    content: "BIET Hub does not provide any refunds or cancellations under any circumstances.",
    sections: [
      {
        heading: "No Refunds",
        details: ["BIET Hub does not provide any refunds under any circumstances."]
      },
      {
        heading: "No Cancellations",
        details: ["Once a service is requested, it cannot be canceled."]
      }
    ]
  }
];

const Policies = ({q}) => {
  const policies = policy.filter((e)=>{ return e.category==q})
  return (
    

    <div className="p-6 max-w-3xl mx-auto min-h-screen flex justify-center items-center text-center md:text-left">
      {policies.map((policy, index) => (
        <div key={index} className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold mb-2">{policy.title}</h2>
          
          <p className="mb-4">{policy.content}</p>
          {policy.sections?.map((section, secIndex) => (
            <div key={secIndex} className="mb-3">
              <h3 className="text-xl font-semibold mb-1">{section.heading}</h3>
              <ul className="list-disc ml-6">
                {section.details.map((detail, detIndex) => (
                  <li key={detIndex}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
     
  );
};

export default Policies;
