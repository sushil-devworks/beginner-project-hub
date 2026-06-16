import React from 'react'
import { useState } from 'react';

const Calc = () => {
    const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const normalizeNumberString = (value) => {
    let str = String(value).trim();

    if (str === '' || str === 'NaN' || str === 'Infinity' || str === '-Infinity') {
      return '0';
    }

    if (str.startsWith('+')) {
      str = str.slice(1);
    }

    if (str.includes('e')) {
      return String(Number(str));
    }

    return str;
  };

  const toSignedDecimal = (value) => {
    const str = normalizeNumberString(value);
    const negative = str.startsWith('-');
    const normalized = negative ? str.slice(1) : str;
    const [whole, fraction = ''] = normalized.split('.');
    const digits = `${whole || '0'}${fraction}`;

    return {
      int: BigInt(digits || '0') * (negative ? -1n : 1n),
      decimals: fraction.length,
    };
  };

  const formatResult = (value, decimals) => {
    if (decimals === 0) {
      return String(value);
    }

    const negative = value < 0n;
    const absValue = negative ? -value : value;
    const scale = 10n ** BigInt(decimals);
    const whole = absValue / scale;
    let fraction = String(absValue % scale).padStart(decimals, '0');
    fraction = fraction.replace(/0+$/, '');

    return `${negative ? '-' : ''}${whole}${fraction ? `.${fraction}` : ''}`;
  };

  const calculate = (prevValue, currentValue, op) => {
    const prev = toSignedDecimal(prevValue);
    const current = toSignedDecimal(currentValue);

    if (op === '/') {
      if (current.int === 0n) {
        return 'Infinity';
      }

      const precision = 15;
      const numerator = prev.int * 10n ** BigInt(precision + current.decimals);
      const denominator = current.int * 10n ** BigInt(prev.decimals);
      const result = numerator / denominator;

      return formatResult(result, precision);
    }

    const maxDecimals = Math.max(prev.decimals, current.decimals);
    const scaledPrev = prev.int * 10n ** BigInt(maxDecimals - prev.decimals);
    const scaledCurrent = current.int * 10n ** BigInt(maxDecimals - current.decimals);

    switch (op) {
      case '+':
        return formatResult(scaledPrev + scaledCurrent, maxDecimals);
      case '-':
        return formatResult(scaledPrev - scaledCurrent, maxDecimals);
      case '*': {
        const result = prev.int * current.int;
        return formatResult(result, prev.decimals + current.decimals);
      }
      case '%':
        if (scaledCurrent === 0n) {
          return '0';
        }
        return formatResult(scaledPrev % scaledCurrent, maxDecimals);
      default:
        return normalizeNumberString(currentValue);
    }
  };

  const handleNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op) => {
    if (operation && !waitingForNewValue) {
      const result = calculate(previousValue ?? display, display, operation);
      setDisplay(result);
      setPreviousValue(result);
    } else if (previousValue === null) {
      setPreviousValue(display);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, display, operation);
      setDisplay(result);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    if (waitingForNewValue) {
      setDisplay('0');
      setWaitingForNewValue(false);
      return;
    }

    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const Button = ({ children, onClick, variant = 'default', className = '' }) => {
    const baseClasses = 'w-full py-4 rounded-3xl font-semibold text-lg transition-all duration-200 transform-gpu active:-translate-y-0.5 active:scale-[0.98] shadow-[0_18px_60px_rgba(0,0,0,0.22)]';
    const variants = {
      default: 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.08)] hover:from-slate-600 hover:to-slate-800 active:shadow-[inset_0_4px_0_rgba(0,0,0,0.28)]',
      operation: 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 text-white shadow-cyan-500/30 hover:from-cyan-400 hover:to-cyan-600 active:shadow-[inset_0_4px_0_rgba(0,0,0,0.25)]',
      equals: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-600 active:shadow-[inset_0_4px_0_rgba(0,0,0,0.25)]',
      clear: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-red-500/30 hover:from-red-400 hover:to-red-600 active:shadow-[inset_0_4px_0_rgba(0,0,0,0.25)]',
    };

    return (
      <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
        {children}
      </button>
    );
  };
  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="w-full max-w-sm p-8 rounded-[40px] bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
        <div className="mb-8 p-6 rounded-[34px] bg-slate-950/85 border border-white/10 shadow-[inset_0_10px_30px_rgba(255,255,255,0.05),_0_20px_40px_rgba(0,0,0,0.4)]">
          <input
            type="text"
            value={display}
            readOnly
            className="w-full bg-transparent text-right text-5xl font-bold text-white outline-none overflow-hidden caret-transparent select-none"
          />
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Button onClick={handleClear} variant="clear">
            AC
          </Button>
          <Button onClick={handleBackspace} variant="clear">
            ⌫
          </Button>
          <Button onClick={() => handleOperation('%')} variant="operation">
            %
          </Button>
          <Button onClick={() => handleOperation('/')} variant="operation">
            ÷
          </Button>

          <Button onClick={() => handleNumber(7)}>7</Button>
          <Button onClick={() => handleNumber(8)}>8</Button>
          <Button onClick={() => handleNumber(9)}>9</Button>
          <Button onClick={() => handleOperation('*')} variant="operation">
            ×
          </Button>

          <Button onClick={() => handleNumber(4)}>4</Button>
          <Button onClick={() => handleNumber(5)}>5</Button>
          <Button onClick={() => handleNumber(6)}>6</Button>
          <Button onClick={() => handleOperation('-')} variant="operation">
            −
          </Button>

          <Button onClick={() => handleNumber(1)}>1</Button>
          <Button onClick={() => handleNumber(2)}>2</Button>
          <Button onClick={() => handleNumber(3)}>3</Button>
          <Button onClick={() => handleOperation('+')} variant="operation">
            +
          </Button>

          <Button onClick={() => handleNumber(0)} className="col-span-2">
            0
          </Button>
          <Button onClick={handleDecimal}>
            .
          </Button>
          <Button onClick={handleEquals} variant="equals">
            =
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Calc
