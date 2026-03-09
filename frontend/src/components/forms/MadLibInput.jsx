
export const MadLibInput = ({ name, register, errors, placeholder, step, rules }) => {
  return (
    <input
      type="number"
      step={step}
      placeholder={placeholder}
      className={`inline-block w-20 mx-2 text-center border-b-2 border-gray-400 focus:border-blue-600 focus:outline-none bg-transparent text-blue-600 font-bold text-xl transition-colors
        ${errors[name] ? 'border-red-500 bg-red-50' : ''}`}
      {...register(name, rules)}
    />
  );
};