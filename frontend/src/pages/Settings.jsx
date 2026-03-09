import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../lib/axios';
import { MadLibInput } from '../components/forms/MadLibInput';

export default function Settings() {
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {

        setServerError('');
        try {

            const payload = {
            carb_ratio: parseFloat(data.carb_ratio),
            correction_start: parseInt(data.correction_start),
            correction_step: parseInt(data.correction_step),
            correction_units: parseFloat(data.correction_units)
        };

        await axios.post('/medical-settings', payload);
        navigate('/dashboard'); 
        
        } catch (err) {
            console.error(err);
            if (err.response?.data?.errors) {
                const [[primerError] = ['Revisa los datos introducidos']] = Object.values(err.response.data.errors);
                setServerError(primerError);
            } else {
                setServerError('Error al guardar la configuración.');
            }
        }
    };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-2xl">
        
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Configuración inicial</h2>
        <p className="text-gray-500 mb-10 text-lg">Completa las frases para configurar tu perfil metabólico.</p>
        
        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
            <div className="text-2xl text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900 block mb-2 text-lg">Para las comidas:</span>
                1 unidad de insulina me cubre 
                <MadLibInput 
                    name="carb_ratio" 
                    register={register} 
                    errors={errors} 
                    placeholder="10" 
                    step="0.1" 
                    rules={{ required: true, min: 0.1 }} 
                />
                gramos (ej. 10 gramos = 1 Ración).
            </div>

            <div className="text-2xl text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900 block mb-2 text-lg">Para corregir hiperglucemias:</span>
                Corrijo a partir de 
                <MadLibInput 
                    name="correction_start" 
                    register={register} 
                    errors={errors} 
                    placeholder="150" 
                    rules={{ required: true, min: 50 }} 
                /> 
                mg/dL.
                <br className="hidden md:block" />

                Por cada 
                <MadLibInput 
                    name="correction_step" 
                    register={register} 
                    errors={errors} 
                    placeholder="50" 
                    rules={{ required: true, min: 1 }} 
                />

                mg/dL extra, sumo 
                <MadLibInput 
                    name="correction_units" 
                    register={register} 
                    errors={errors} 
                    placeholder="1" 
                    step="0.1" 
                    rules={{ required: true, min: 0.1 }} 
                />
                unidades de insulina.
            </div>

            <div className="pt-6">
                <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-bold py-4 px-8 rounded-xl text-xl transition duration-200 shadow-lg
                    ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
                >
                {isSubmitting ? 'Guardando...' : 'Comenzar a descifrar'}
                </button>
            </div>
        </form>

      </div>
    </div>
  )
}