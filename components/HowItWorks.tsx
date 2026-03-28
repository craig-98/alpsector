"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  ShieldCheck,
  DollarSign,
  BarChart3,
  ArrowLeftRight,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="w-12 h-12 text-emerald-600" />,
      title: "Register Account",
      desc: "By registering on the website you will be able to start your operation.",
    },
    {
      icon: <Mail className="w-12 h-12 text-blue-600" />,
      title: "Verify Email",
      desc: "After creating the account the user needs to verify the email.",
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-purple-600" />,
      title: "Verify KYC",
      desc: "Users must complete KYC verification before withdrawals.",
    },
    {
      icon: <DollarSign className="w-12 h-12 text-green-600" />,
      title: "Deposit Money",
      desc: "Users can deposit funds using automatic or manual gateways.",
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-orange-600" />,
      title: "Invest in a Plan",
      desc: "Select a plan and start earning profits from the platform.",
    },
    {
      icon: <ArrowLeftRight className="w-12 h-12 text-indigo-600" />,
      title: "Transfer Money",
      desc: "Transfer funds instantly to other users.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            It is a very simple process to start with us and earn money.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step
          , index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-2xl group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center group-hover:text-emerald-600 transition">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
