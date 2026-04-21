"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";

type Tab = "breakdown" | "schedule";

const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const toMonthlyRate = (annualRatePercent: number) => annualRatePercent / 100 / 12;

const calcPrincipalAndInterest = (loanAmount: number, annualRate: number, years: number) => {
  const n = years * 12;
  const r = toMonthlyRate(annualRate);
  if (loanAmount <= 0 || n <= 0) return 0;
  if (r === 0) return loanAmount / n;
  return (loanAmount * r * (1 + r) ** n) / ((1 + r) ** n - 1);
};

const buildAmortizationSchedule = (loanAmount: number, annualRate: number, years: number) => {
  const payment = calcPrincipalAndInterest(loanAmount, annualRate, years);
  const monthlyRate = toMonthlyRate(annualRate);
  const months = years * 12;
  let balance = loanAmount;

  return Array.from({ length: months }, (_, i) => {
    const interest = balance * monthlyRate;
    const principal = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principal);
    return { month: i + 1, principal, interest, balance };
  });
};

export default function FhaMortgageCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>("breakdown");
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [loanProgram, setLoanProgram] = useState<"30-year fixed" | "15-year fixed">("30-year fixed");
  const [interestRate, setInterestRate] = useState(5.375);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(3600);
  const [annualInsurance, setAnnualInsurance] = useState(1260);
  const [hoaDuesMonthly, setHoaDuesMonthly] = useState(0);

  const termYears = loanProgram === "15-year fixed" ? 15 : 30;
  const baseLoanAmount = Math.max(0, homePrice - downPayment);
  const downPaymentPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;

  // Typical FHA assumptions: 1.75% upfront MIP + 0.55% annual MIP.
  const upfrontMip = baseLoanAmount * 0.0175;
  const financedLoanAmount = baseLoanAmount + upfrontMip;
  const annualMipRate = 0.0055;
  const monthlyMip = (financedLoanAmount * annualMipRate) / 12;

  const monthlyPI = calcPrincipalAndInterest(financedLoanAmount, interestRate, termYears);
  const monthlyTaxes = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurance + hoaDuesMonthly + monthlyMip;

  const schedule = useMemo(
    () => buildAmortizationSchedule(financedLoanAmount, interestRate, termYears).slice(0, 24),
    [financedLoanAmount, interestRate, termYears],
  );

  return (
    <ToolPageShell
      titleBefore="FHA Mortgage Loan"
      titleAccent="Calculator"
      subtitle="Estimate your FHA payment with principal, interest, taxes, homeowners insurance, HOA, and FHA mortgage insurance premium (MIP)."
      mainVariant="stack"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-sm lg:col-span-2">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-800">
              Home price
              <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
            </label>
            <label className="text-sm font-medium text-gray-800">
              Down payment
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
            </label>
            <label className="text-sm font-medium text-gray-800">
              Loan program
              <select value={loanProgram} onChange={(e) => setLoanProgram(e.target.value as "30-year fixed" | "15-year fixed")} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2">
                <option>30-year fixed</option>
                <option>15-year fixed</option>
              </select>
            </label>
            <label className="text-sm font-medium text-gray-800">
              Interest rate (%)
              <input type="number" step="0.001" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
            </label>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="mb-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-black"
          >
            {showAdvanced ? "Hide Advanced" : "Advanced"}
          </button>

          {showAdvanced ? (
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <label className="text-sm font-medium text-gray-800">
                Property tax (annual)
                <input type="number" value={annualPropertyTax} onChange={(e) => setAnnualPropertyTax(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
              </label>
              <label className="text-sm font-medium text-gray-800">
                Home insurance (annual)
                <input type="number" value={annualInsurance} onChange={(e) => setAnnualInsurance(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
              </label>
              <label className="text-sm font-medium text-gray-800">
                HOA dues (monthly)
                <input type="number" value={hoaDuesMonthly} onChange={(e) => setHoaDuesMonthly(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
              </label>
            </div>
          ) : null}

          <div className="mb-4 inline-flex rounded-lg border border-gray-200 p-1">
            <button type="button" onClick={() => setActiveTab("breakdown")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "breakdown" ? "bg-[#FF385C] text-white" : "text-black"}`}>Breakdown</button>
            <button type="button" onClick={() => setActiveTab("schedule")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "schedule" ? "bg-[#FF385C] text-white" : "text-black"}`}>Schedule</button>
          </div>

          {activeTab === "breakdown" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">P &amp; I: {currency(monthlyPI)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">Taxes: {currency(monthlyTaxes)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">Insurance: {currency(monthlyInsurance)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">FHA MIP: {currency(monthlyMip)}</div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-sm text-black">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-black">Month</th>
                    <th className="px-3 py-2 text-left text-black">Principal</th>
                    <th className="px-3 py-2 text-left text-black">Interest</th>
                    <th className="px-3 py-2 text-left text-black">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.month} className="border-t border-gray-100">
                      <td className="px-3 py-2 text-black">{row.month}</td>
                      <td className="px-3 py-2 text-black">{currency(row.principal)}</td>
                      <td className="px-3 py-2 text-black">{currency(row.interest)}</td>
                      <td className="px-3 py-2 text-black">{currency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-sm">
          <p className="text-sm font-medium text-gray-500">Your payment</p>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">{currency(monthlyPayment)}</p>
          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <p>P &amp; I: {currency(monthlyPI)}</p>
            <p>Taxes: {currency(monthlyTaxes)}</p>
            <p>Insurance: {currency(monthlyInsurance)}</p>
            <p>FHA MIP: {currency(monthlyMip)}</p>
            <p>Down payment: {currency(downPayment)} ({downPaymentPct.toFixed(1)}%)</p>
          </div>
          <p className="mt-6 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs text-gray-700">
            Calculator disclaimer: This estimate is not a loan offer and may differ from lender-provided FHA quotes.
          </p>
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
            Buy your next home with a brand you can trust. Get pre-qualified with a licensed lender for a more accurate estimate.
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">Explore more mortgage calculators</h3>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
          <li><Link href="/mortgage-calculator" className="text-[#E31C5F] hover:underline">Mortgage calculator</Link></li>
          <li>Refinance calculator</li>
          <li>VA mortgage calculator</li>
          <li>Affordability calculator</li>
        </ul>

        <h3 className="mt-8 text-xl font-bold text-gray-900">How to calculate your FHA mortgage payment</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          FHA mortgage payments are based on loan amount, interest rate, and term, plus required FHA mortgage insurance premium (MIP),
          property taxes, homeowners insurance, and any HOA dues.
        </p>

        <h4 className="mt-6 text-lg font-semibold text-gray-900">FHA loan requirements</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
          <li>Minimum down payment typically 3.5% to 10%</li>
          <li>Credit score minimum usually between 500 and 580</li>
          <li>Upfront and annual MIP required on most FHA loans</li>
          <li>Primary residence and FHA-eligible property standards</li>
          <li>Debt-to-income and loan limits apply</li>
        </ul>

        <h4 className="mt-6 text-lg font-semibold text-gray-900">FHA loan benefits</h4>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          FHA loans can be a strong option for first-time buyers and borrowers with lower down payments or moderate credit scores.
          They provide more flexible qualification rules than many conventional programs.
        </p>
      </div>
    </ToolPageShell>
  );
}
