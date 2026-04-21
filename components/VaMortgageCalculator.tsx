"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";

type Tab = "breakdown" | "schedule";
type VaUseType = "first-use" | "subsequent-use";
type LoanProgram = "30-year fixed" | "15-year fixed";

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

const getVaFundingFeeRate = (useType: VaUseType, downPaymentPct: number, exempt: boolean) => {
  if (exempt) return 0;
  if (downPaymentPct >= 10) return 0.014;
  if (downPaymentPct >= 5) return 0.015;
  return useType === "first-use" ? 0.0215 : 0.033;
};

export default function VaMortgageCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>("breakdown");
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(0);
  const [loanProgram, setLoanProgram] = useState<LoanProgram>("30-year fixed");
  const [interestRate, setInterestRate] = useState(6.25);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(4200);
  const [annualInsurance, setAnnualInsurance] = useState(1320);
  const [hoaDuesMonthly, setHoaDuesMonthly] = useState(0);
  const [vaUseType, setVaUseType] = useState<VaUseType>("first-use");
  const [fundingFeeExempt, setFundingFeeExempt] = useState(false);

  const termYears = loanProgram === "15-year fixed" ? 15 : 30;
  const baseLoanAmount = Math.max(0, homePrice - downPayment);
  const downPaymentPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const fundingFeeRate = getVaFundingFeeRate(vaUseType, downPaymentPct, fundingFeeExempt);
  const fundingFeeAmount = baseLoanAmount * fundingFeeRate;
  const financedLoanAmount = baseLoanAmount + fundingFeeAmount;

  const monthlyPI = calcPrincipalAndInterest(financedLoanAmount, interestRate, termYears);
  const monthlyTaxes = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurance + hoaDuesMonthly;

  const schedule = useMemo(
    () => buildAmortizationSchedule(financedLoanAmount, interestRate, termYears).slice(0, 24),
    [financedLoanAmount, interestRate, termYears],
  );

  return (
    <ToolPageShell
      titleBefore="VA Mortgage"
      titleAccent="Calculator"
      subtitle="Estimate your VA monthly payment with principal, interest, taxes, insurance, HOA, and VA funding fee."
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
              <select value={loanProgram} onChange={(e) => setLoanProgram(e.target.value as LoanProgram)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2">
                <option>30-year fixed</option>
                <option>15-year fixed</option>
              </select>
            </label>
            <label className="text-sm font-medium text-gray-800">
              Interest rate (%)
              <input type="number" step="0.001" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
            </label>
            <label className="text-sm font-medium text-gray-800">
              VA loan usage
              <select value={vaUseType} onChange={(e) => setVaUseType(e.target.value as VaUseType)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2">
                <option value="first-use">First use</option>
                <option value="subsequent-use">Subsequent use</option>
              </select>
            </label>
            <label className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-gray-800">
              <input type="checkbox" checked={fundingFeeExempt} onChange={(e) => setFundingFeeExempt(e.target.checked)} />
              Funding fee exempt
            </label>
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

          <div className="mb-4 inline-flex rounded-lg border border-gray-200 p-1">
            <button type="button" onClick={() => setActiveTab("breakdown")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "breakdown" ? "bg-[#FF385C] text-white" : "text-black"}`}>Breakdown</button>
            <button type="button" onClick={() => setActiveTab("schedule")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "schedule" ? "bg-[#FF385C] text-white" : "text-black"}`}>Schedule</button>
          </div>

          {activeTab === "breakdown" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">P &amp; I: {currency(monthlyPI)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">Taxes: {currency(monthlyTaxes)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">Insurance: {currency(monthlyInsurance)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">HOA: {currency(hoaDuesMonthly)}</div>
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
            <p>Base loan amount: {currency(baseLoanAmount)}</p>
            <p>VA funding fee rate: {(fundingFeeRate * 100).toFixed(2)}%</p>
            <p>VA funding fee: {currency(fundingFeeAmount)}</p>
            <p>Financed loan amount: {currency(financedLoanAmount)}</p>
            <p>Down payment: {currency(downPayment)} ({downPaymentPct.toFixed(1)}%)</p>
          </div>
          <p className="mt-6 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs text-gray-700">
            Calculator disclaimer: This estimate is educational only. Final VA rates, fees, and eligibility vary by lender.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">How to calculate a VA mortgage payment</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          VA monthly payments are based on principal and interest, property taxes, homeowners insurance, HOA dues,
          and VA funding fee financing (when applicable). Most VA loans do not require PMI.
        </p>
        <h4 className="mt-6 text-lg font-semibold text-gray-900">VA loan highlights</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
          <li>Potential zero down payment for eligible borrowers</li>
          <li>No monthly PMI requirement in most scenarios</li>
          <li>Funding fee may apply unless exempt</li>
          <li>Competitive rates for qualifying veterans and service members</li>
        </ul>
        <h4 className="mt-6 text-lg font-semibold text-gray-900">Explore more mortgage calculators</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
          <li><Link href="/mortgage-calculator" className="text-[#E31C5F] hover:underline">Mortgage calculator</Link></li>
          <li><Link href="/fha-mortgage-calculator" className="text-[#E31C5F] hover:underline">FHA mortgage calculator</Link></li>
          <li>Refinance calculator</li>
          <li>Affordability calculator</li>
        </ul>
      </div>
    </ToolPageShell>
  );
}
