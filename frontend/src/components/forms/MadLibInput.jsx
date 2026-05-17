/**
 * MadLibInput — Campo numérico inline para frases configurables (react-hook-form)
 *
 * Props:
 *  name, register, errors, placeholder, step, rules — misma API que register().
 *  inputWidth  — clase Tailwind de anchura (default: "w-20")
 *  textSize    — clase Tailwind de tamaño de texto (default: "text-xl")
 */
export const MadLibInput = ({
  name,
  register,
  errors,
  placeholder,
  step,
  rules,
  inputWidth = 'w-20',
  textSize = 'text-xl',
}) => (
  <input
    type="number"
    step={step}
    placeholder={placeholder}
    className={`inline-block ${inputWidth} mx-2 text-center border-b-2
      border-border-strong focus:border-primary focus:outline-none
      bg-transparent text-primary font-bold ${textSize} transition-colors
      min-h-[44px]
      ${errors[name] ? 'border-danger-strong bg-danger-subtle' : ''}`}
    {...register(name, rules)}
  />
);