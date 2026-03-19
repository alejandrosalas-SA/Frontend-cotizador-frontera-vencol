import { ChangePasswordForm } from '@/features/auth/components/change-password-form';
import "beautiful-backgrounds";
import altamiraLogoBlanco from '@/assets/Logos-Seguros-Altamira/logo-blanco.webp';
import altamiraLogoMobile from '@/assets/Logos-Seguros-Altamira/logo1.webp';
import iconoCotizador from '@/assets/Logos-Seguros-Altamira/icono-cotizador.webp';

export const ChangePasswordRoute = () => {
  return (
    <div className="flex min-h-screen">
      {/* Panel Izquierdo - Azul con información */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#003366] via-primary to-blue-600 overflow-hidden sticky top-0 h-screen">
        {/* @ts-ignore */}
        <bb-hexagon-wave
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.8, zIndex: 0, display: 'block' }}
          bg-colors="#003366, #1e40af"
          bg-angle="0"
          hex-size="52"
          wave-amplitude="0"
          wave-speed="2"
          wave-x-factor="-0.007"
          wave-y-factor="-0.005"
          base-lightness="45"
          lightness-range="10"
          hex-hue-start="220"
          hex-hue-end="235"
          hex-saturation="100"
          hex-scale="1"
          trail-opacity="0"
          hex-colors=""
        />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="space-y-6">
            <div className="flex items-center justify-center w-32 h-32 rounded-2xl">
              <img
                src={altamiraLogoBlanco}
                alt="Seguros Altamira"
                className="w-28 h-28 object-contain form-shadow"
              />
            </div>

            <div className="space-y-4 text-center flex flex-col items-center">
              <h1 className="text-5xl leading-tight font-size-50px line-height-50px">
                Cotizador de la Póliza de Transportistas Binacionales
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed max-w-xl mx-auto opacity-90">
                Sistema especializado para la gestión automatizada de cotizaciones
                y coberturas para vehículos de carga en rutas internacionales.
              </p>
            </div>
          </div>

          <div className="text-blue-100 text-sm">
            © 2026 Seguros Altamira. Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header móvil */}
          <div className="lg:hidden text-center mb-4">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center">
                <img
                  src={altamiraLogoMobile}
                  alt="Seguros Altamira"
                  className="w-[90px] h-[90px] object-contain"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-primary">Cotizador de la Póliza de Transportistas Binacionales</h2>
          </div>

          {/* Tarjeta */}
          <div className="bg-card rounded-xl shadow-xl border border-border p-8 text-card-foreground">
            <div className="mb-8">
              <div className="flex justify-center">
                <img
                  src={iconoCotizador}
                  alt="Icono Cotizador"
                  className="w-20 h-20 object-contain drop-shadow-md"
                />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Cambiar Contraseña
              </h2>
              <p className="text-muted-foreground">
                Ingresa tus credenciales para actualizar tu acceso al sistema.
              </p>
            </div>

            <ChangePasswordForm />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            ¿Necesitas ayuda? Contacta al administrador del sistema
          </p>
        </div>
      </div>
    </div>
  );
};
