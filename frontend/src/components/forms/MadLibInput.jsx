
export const MadLibInput = ({ name, register, errors, placeholder, step, rules }) => {
  return (
    <input
      type="number"
      step={step}
      placeholder={placeholder}
      className={`inline-block w-20 mx-2 text-center border-b-2 border-border-strong focus:border-primary focus:outline-none bg-transparent text-primary font-bold text-xl transition-colors
        ${errors[name] ? 'border-danger-strong bg-danger-subtle' : ''}`}
      {...register(name, rules)}
    />
  );
};