import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../lib/axios';

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

    const inputStyle = "inline-block w-20 mx-2 text-center border-b-2 border-gray-400 focus:border-blue-600 focus:outline-none bg-transparent text-blue-600 font-bold text-xl";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Configuración inicial</h2>
        <p className="text-gray-500 mb-10 text-lg">Completa las oraciones para configurar tu perfil metabólico.</p>
        
        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          <div className="text-2xl text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900 block mb-2 text-lg">Para las comidas:</span>
            1 unidad de insulina me cubre 
            <input
              type="number"
              step="0.1"
              className={`${inputStyle} ${errors.carb_ratio ? 'border-red-500' : ''}`}
              placeholder="10"
              {...register('carb_ratio', { required: true, min: 0.1 })}
            />
            gramos de carbohidratos.
          </div>


          <div className="text-2xl text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900 block mb-2 text-lg">Para corregir hiperglucemias:</span>
            Corrijo a partir de 
            <input
              type="number"
              className={`${inputStyle} ${errors.correction_start ? 'border-red-500' : ''}`}
              placeholder="150"
              {...register('correction_start', { required: true, min: 50 })}
            /> 
            mg/dL.
            <br className="hidden md:block" />
            Por cada 
            <input
              type="number"
              className={`${inputStyle} ${errors.correction_step ? 'border-red-500' : ''}`}
              placeholder="50"
              {...register('correction_step', { required: true, min: 1 })}
            />
            mg/dL extra, sumo 
            <input
              type="number"
              step="0.1"
              className={`${inputStyle} ${errors.correction_units ? 'border-red-500' : ''}`}
              placeholder="1"
              {...register('correction_units', { required: true, min: 0.1 })}
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