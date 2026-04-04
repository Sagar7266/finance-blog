import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { formatCurrency } from '../utils/helpers';

// ── EMI Calculator ────────────────────────────────
function EMICalculator() {
  const [principal, setPrincipal] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const r = rate / 12 / 100;
  const n = tenure * 12;
  const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  const pct = (principal / totalPayment * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <SliderField label="Loan Amount" value={principal} setValue={setPrincipal}
        min={100000} max={10000000} step={50000} display={formatCurrency(principal)} />
      <SliderField label="Interest Rate (% p.a.)" value={rate} setValue={setRate}
        min={5} max={20} step={0.1} display={`${rate}%`} />
      <SliderField label="Loan Tenure (Years)" value={tenure} setValue={setTenure}
        min={1} max={30} step={1} display={`${tenure} yrs`} />

      <ResultBox rows={[
        { label: 'Monthly EMI', value: formatCurrency(emi), highlight: true },
        { label: 'Total Interest', value: formatCurrency(totalInterest), color: 'text-red-500' },
        { label: 'Total Payment', value: formatCurrency(totalPayment) },
        { label: 'Principal %', value: `${pct}%` },
      ]} />
    </div>
  );
}

// ── SIP Calculator ────────────────────────────────
function SIPCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(15);

  const n = years * 12;
  const r = expectedReturn / 12 / 100;
  const futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthly * n;
  const gains = futureValue - invested;
  const returnMultiple = (futureValue / invested).toFixed(2);

  return (
    <div className="space-y-6">
      <SliderField label="Monthly SIP Amount" value={monthly} setValue={setMonthly}
        min={500} max={100000} step={500} display={formatCurrency(monthly)} />
      <SliderField label="Expected Annual Return (%)" value={expectedReturn} setValue={setExpectedReturn}
        min={6} max={30} step={0.5} display={`${expectedReturn}%`} />
      <SliderField label="Investment Period (Years)" value={years} setValue={setYears}
        min={1} max={40} step={1} display={`${years} yrs`} />

      <ResultBox rows={[
        { label: 'Estimated Returns', value: formatCurrency(futureValue), highlight: true },
        { label: 'Total Invested', value: formatCurrency(invested) },
        { label: 'Total Gains', value: formatCurrency(gains), color: 'text-green-500' },
        { label: 'Return Multiple', value: `${returnMultiple}x` },
      ]} />
    </div>
  );
}

// ── Tax Calculator ─────────────────────────────────
function TaxCalculator() {
  const [income, setIncome] = useState(1200000);
  const [regime, setRegime] = useState('new');
  const [deductions80c, setDeductions80c] = useState(150000);
  const [hra, setHra] = useState(120000);
  const [homeLoanInt, setHomeLoanInt] = useState(0);

  const calcOldRegime = (inc) => {
    let taxable = inc - Math.min(deductions80c, 150000) - Math.min(hra, 100000) - Math.min(homeLoanInt, 200000) - 50000; // std deduction
    taxable = Math.max(0, taxable);
    let tax = 0;
    if (taxable > 1000000) tax += (taxable - 1000000) * 0.30;
    if (taxable > 500000)  tax += (Math.min(taxable, 1000000) - 500000) * 0.20;
    if (taxable > 250000)  tax += (Math.min(taxable, 500000) - 250000) * 0.05;
    const cess = tax * 0.04;
    return { taxable, tax: tax + cess, cess };
  };

  const calcNewRegime = (inc) => {
    let taxable = inc - 75000; // std deduction FY24-25
    taxable = Math.max(0, taxable);
    let tax = 0;
    if (taxable > 1500000) tax += (taxable - 1500000) * 0.30;
    if (taxable > 1200000) tax += (Math.min(taxable, 1500000) - 1200000) * 0.20;
    if (taxable > 900000)  tax += (Math.min(taxable, 1200000) - 900000) * 0.15;
    if (taxable > 600000)  tax += (Math.min(taxable, 900000) - 600000) * 0.10;
    if (taxable > 300000)  tax += (Math.min(taxable, 600000) - 300000) * 0.05;
    if (taxable <= 700000) tax = 0; // rebate u/s 87A
    const cess = tax * 0.04;
    return { taxable, tax: tax + cess, cess };
  };

  const result = regime === 'new' ? calcNewRegime(income) : calcOldRegime(income);
  const effective = income > 0 ? ((result.tax / income) * 100).toFixed(1) : 0;
  const monthly = result.tax / 12;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setRegime('new')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${regime === 'new' ? 'bg-primary-600 text-white' : 'btn-secondary'}`}>
          New Regime
        </button>
        <button onClick={() => setRegime('old')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${regime === 'old' ? 'bg-primary-600 text-white' : 'btn-secondary'}`}>
          Old Regime
        </button>
      </div>

      <SliderField label="Annual Income" value={income} setValue={setIncome}
        min={300000} max={5000000} step={50000} display={formatCurrency(income)} />

      {regime === 'old' && <>
        <SliderField label="80C Deductions" value={deductions80c} setValue={setDeductions80c}
          min={0} max={150000} step={5000} display={formatCurrency(deductions80c)} />
        <SliderField label="HRA Exemption" value={hra} setValue={setHra}
          min={0} max={500000} step={5000} display={formatCurrency(hra)} />
        <SliderField label="Home Loan Interest (24b)" value={homeLoanInt} setValue={setHomeLoanInt}
          min={0} max={200000} step={5000} display={formatCurrency(homeLoanInt)} />
      </>}

      <ResultBox rows={[
        { label: 'Tax Payable', value: formatCurrency(result.tax), highlight: true },
        { label: 'Taxable Income', value: formatCurrency(result.taxable) },
        { label: 'Tax + Cess (4%)', value: formatCurrency(result.cess) },
        { label: 'Effective Rate', value: `${effective}%` },
        { label: 'Monthly TDS', value: formatCurrency(monthly) },
      ]} />
    </div>
  );
}

// ── FD Calculator ─────────────────────────────────
function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(5);
  const [quarterly, setQuarterly] = useState(true);

  const n = quarterly ? years * 4 : years;
  const r = quarterly ? rate / 4 / 100 : rate / 100;
  const maturity = principal * Math.pow(1 + r, n);
  const interest = maturity - principal;

  return (
    <div className="space-y-6">
      <SliderField label="Principal Amount" value={principal} setValue={setPrincipal}
        min={10000} max={5000000} step={10000} display={formatCurrency(principal)} />
      <SliderField label="Interest Rate (% p.a.)" value={rate} setValue={setRate}
        min={3} max={10} step={0.1} display={`${rate}%`} />
      <SliderField label="Tenure (Years)" value={years} setValue={setYears}
        min={1} max={10} step={1} display={`${years} yrs`} />
      <div className="flex items-center gap-3">
        <button onClick={() => setQuarterly(true)}
          className={`flex-1 py-2 rounded-xl text-sm font-bold ${quarterly ? 'bg-primary-600 text-white' : 'btn-secondary'}`}>
          Quarterly
        </button>
        <button onClick={() => setQuarterly(false)}
          className={`flex-1 py-2 rounded-xl text-sm font-bold ${!quarterly ? 'bg-primary-600 text-white' : 'btn-secondary'}`}>
          Annually
        </button>
      </div>
      <ResultBox rows={[
        { label: 'Maturity Amount', value: formatCurrency(maturity), highlight: true },
        { label: 'Interest Earned', value: formatCurrency(interest), color: 'text-green-500' },
        { label: 'Principal', value: formatCurrency(principal) },
      ]} />
    </div>
  );
}

// ── PPF Calculator ─────────────────────────────────
function PPFCalculator() {
  const [annual, setAnnual] = useState(150000);
  const [years, setYears] = useState(15);
  const RATE = 7.1;

  let balance = 0;
  for (let i = 0; i < years; i++) {
    balance = (balance + annual) * (1 + RATE / 100);
  }
  const invested = annual * years;
  const gain = balance - invested;

  return (
    <div className="space-y-6">
      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-sm text-amber-700 dark:text-amber-400">
        💡 PPF interest rate: <strong>{RATE}% p.a.</strong> (FY 2024-25, government notified)
      </div>
      <SliderField label="Annual Investment" value={annual} setValue={setAnnual}
        min={500} max={150000} step={500} display={formatCurrency(annual)} />
      <SliderField label="Tenure (Years)" value={years} setValue={setYears}
        min={15} max={50} step={1} display={`${years} yrs`} />
      <ResultBox rows={[
        { label: 'Maturity Value', value: formatCurrency(balance), highlight: true },
        { label: 'Total Invested', value: formatCurrency(invested) },
        { label: 'Total Gain', value: formatCurrency(gain), color: 'text-green-500' },
      ]} />
    </div>
  );
}

// ── Shared sub-components ────────────────────────
function SliderField({ label, value, setValue, min, max, step, display }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #16a34a ${pct}%, #e2e8f0 ${pct}%)` }} />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{typeof min === 'number' && min >= 10000 ? formatCurrency(min) : min}</span>
        <span>{typeof max === 'number' && max >= 10000 ? formatCurrency(max) : max}</span>
      </div>
    </div>
  );
}

function ResultBox({ rows }) {
  return (
    <div className="bg-gray-50 dark:bg-dark-900 rounded-2xl p-5 space-y-3">
      {rows.map(row => (
        <div key={row.label} className={`flex justify-between items-center ${row.highlight ? 'pt-3 border-t border-gray-200 dark:border-dark-700 first:border-0 first:pt-0' : ''}`}>
          <span className="text-sm text-gray-600 dark:text-gray-400">{row.label}</span>
          <span className={`font-bold ${row.highlight ? 'text-xl text-primary-600 dark:text-primary-400' : row.color || 'text-gray-900 dark:text-white'}`}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main ToolsPage ────────────────────────────────
const TOOLS = [
  { id: 'emi',  label: 'EMI Calculator',  icon: '🏠', desc: 'Calculate your loan EMI', component: EMICalculator },
  { id: 'sip',  label: 'SIP Calculator',  icon: '📈', desc: 'Plan your SIP investment', component: SIPCalculator },
  { id: 'tax',  label: 'Tax Calculator',  icon: '📋', desc: 'Estimate income tax', component: TaxCalculator },
  { id: 'fd',   label: 'FD Calculator',   icon: '🏦', desc: 'Fixed deposit returns', component: FDCalculator },
  { id: 'ppf',  label: 'PPF Calculator',  icon: '💰', desc: 'PPF maturity value', component: PPFCalculator },
];

export default function ToolsPage() {
  const { tool } = useParams();
  const navigate = useNavigate();
  const activeTool = TOOLS.find(t => t.id === tool) || TOOLS[0];
  const ActiveComponent = activeTool.component;

  return (
    <>
      <Helmet>
        <title>{activeTool.label} - FinanceWise India</title>
        <meta name="description" content={`Free ${activeTool.label} for Indian investors. ${activeTool.desc}.`} />
      </Helmet>

      <div className="page-container py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Finance Calculators</h1>
          <p className="text-gray-500">Free tools to help you make smarter financial decisions</p>
        </div>

        {/* Tool tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TOOLS.map(t => (
            <button key={t.id} onClick={() => navigate(`/tools/${t.id}`)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTool.id === t.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-700 hover:border-primary-300'
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Calculator */}
        <div className="max-w-xl mx-auto">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{activeTool.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeTool.label}</h2>
                <p className="text-sm text-gray-500">{activeTool.desc}</p>
              </div>
            </div>
            <ActiveComponent />
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
            ⚠️ Results are indicative only. Actual returns may vary. Consult a financial advisor before investing.
          </p>
        </div>
      </div>
    </>
  );
}
