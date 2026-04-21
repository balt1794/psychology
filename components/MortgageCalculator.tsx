"use client";

import { useMemo, useState } from "react";
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
    return {
      month: i + 1,
      principal,
      interest,
      balance,
    };
  });
};

export default function MortgageCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>("breakdown");
  const [homePrice, setHomePrice] = useState(225000);
  const [downPayment, setDownPayment] = useState(45000);
  const [zipCode, setZipCode] = useState("");
  const [loanProgram, setLoanProgram] = useState<"30-year fixed" | "15-year fixed" | "5-year ARM">("30-year fixed");
  const [interestRate, setInterestRate] = useState(7.059);
  const [includePMI, setIncludePMI] = useState(true);
  const [includeTaxesInsurance, setIncludeTaxesInsurance] = useState(true);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(3600);
  const [annualInsurance, setAnnualInsurance] = useState(945);
  const [hoaDuesMonthly, setHoaDuesMonthly] = useState(0);

  const termYears = loanProgram === "15-year fixed" ? 15 : 30;
  const loanAmount = Math.max(0, homePrice - downPayment);
  const downPaymentPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const monthlyPI = calcPrincipalAndInterest(loanAmount, interestRate, termYears);
  const monthlyPMI = includePMI && downPaymentPct < 20 ? (loanAmount * 0.008) / 12 : 0;
  const monthlyTaxes = includeTaxesInsurance ? annualPropertyTax / 12 : 0;
  const monthlyInsurance = includeTaxesInsurance ? annualInsurance / 12 : 0;
  const monthlyPayment = monthlyPI + monthlyPMI + monthlyTaxes + monthlyInsurance + hoaDuesMonthly;

  const schedule = useMemo(
    () => buildAmortizationSchedule(loanAmount, interestRate, termYears).slice(0, 24),
    [loanAmount, interestRate, termYears],
  );

  return (
    <ToolPageShell
      titleBefore="Mortgage"
      titleAccent="Calculator"
      subtitle="Estimate monthly mortgage payments with principal and interest, taxes, insurance, PMI, and HOA."
      mainVariant="stack"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-sm lg:col-span-2">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-800">
              Home price
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-gray-800">
              Down payment
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-gray-800">
              ZIP code
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="90210"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-gray-800">
              Loan program
              <select
                value={loanProgram}
                onChange={(e) => setLoanProgram(e.target.value as "30-year fixed" | "15-year fixed" | "5-year ARM")}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                <option>30-year fixed</option>
                <option>15-year fixed</option>
                <option>5-year ARM</option>
              </select>
            </label>
            <label className="text-sm font-medium text-gray-800">
              Interest rate (%)
              <input
                type="number"
                step="0.001"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-gray-800">
              Property tax (annual)
              <input
                type="number"
                value={annualPropertyTax}
                onChange={(e) => setAnnualPropertyTax(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-gray-800">
              Home insurance (annual)
              <input
                type="number"
                value={annualInsurance}
                onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-gray-800">
              HOA dues (monthly)
              <input
                type="number"
                value={hoaDuesMonthly}
                onChange={(e) => setHoaDuesMonthly(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={includePMI}
                onChange={(e) => setIncludePMI(e.target.checked)}
              />
              Include PMI
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeTaxesInsurance}
                onChange={(e) => setIncludeTaxesInsurance(e.target.checked)}
              />
              Include taxes/insurance
            </label>
          </div>

          <div className="mb-4 inline-flex rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("breakdown")}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "breakdown" ? "bg-[#FF385C] text-white" : "text-black"}`}
            >
              Breakdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "schedule" ? "bg-[#FF385C] text-white" : "text-black"}`}
            >
              Schedule
            </button>
          </div>

          {activeTab === "breakdown" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">P &amp; I: {currency(monthlyPI)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">Taxes: {currency(monthlyTaxes)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">Insurance: {currency(monthlyInsurance)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">PMI: {currency(monthlyPMI)}</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:col-span-2">
                HOA dues: {currency(hoaDuesMonthly)}
              </div>
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
          <p className="text-sm font-medium text-gray-500">Estimated monthly payment</p>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">{currency(monthlyPayment)}</p>
          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <p>Loan amount: {currency(loanAmount)}</p>
            <p>Down payment: {currency(downPayment)} ({downPaymentPct.toFixed(1)}%)</p>
            <p>ZIP code: {zipCode || "-"}</p>
            <p>Term: {termYears} years</p>
            <p>Rate: {interestRate.toFixed(3)}%</p>
          </div>
          <p className="mt-6 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs text-gray-700">
            Calculator disclaimer: This estimate is for educational planning only and does not represent a loan offer or approval.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">How much is a mortgage on a house?</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          Monthly mortgage payments depend on home price, down payment, loan term, interest rate, taxes, insurance, and
          PMI. A larger down payment can reduce monthly cost and may remove PMI at 20% down.
        </p>
        <h4 className="mt-5 text-lg font-semibold text-gray-900">Mortgage payment equation</h4>
        <p className="mt-2 text-sm text-gray-700">
          Principal + Interest + Mortgage Insurance (if applicable) + Escrow (taxes, insurance, HOA) = Total monthly payment
        </p>
        <h4 className="mt-5 text-lg font-semibold text-gray-900">Explore more mortgage calculators</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
          <li>FHA mortgage calculator</li>
          <li>Refinance calculator</li>
          <li>VA mortgage calculator</li>
          <li>Affordability calculator</li>
        </ul>
      </div>
    </ToolPageShell>
  );
}
