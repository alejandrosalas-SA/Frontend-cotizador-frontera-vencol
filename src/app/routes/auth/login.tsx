import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/login-form';
import { useAuthStore } from '@/stores/auth';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import "beautiful-backgrounds";
import altamiraLogoBlanco from '@/assets/Logos-Seguros-Altamira/logo-blanco.webp';
import altamiraLogoMobile from '@/assets/Logos-Seguros-Altamira/logo1.webp';
import iconoCotizador from '@/assets/Logos-Seguros-Altamira/icono-cotizador.webp';
export const LoginRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Si ya está logueado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Panel Izquierdo - Azul con información */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#003366] via-primary to-blue-600 overflow-hidden sticky top-0 h-screen">
        {/* Patrón de fondo decorativo */}
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

        {/* Contenido */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo y título */}
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

          {/* Footer */}
          <div className="text-blue-100 text-sm">
            © 2026 Seguros Altamira. Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario de Login */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">

        <div className="w-full max-w-md space-y-8">
          {/* Header móvil - solo visible en pantallas pequeñas */}
          <div className="lg:hidden text-center mb-4">
            <div className="flex justify-center mb-4">
              <div className=" flex items-center justify-center">
                <img
                  src={altamiraLogoMobile}
                  alt="Seguros Altamira"
                  className="w-[90px] h-[90px] object-contain"

                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-primary">Cotizador de la Póliza de Transportistas Binacionales</h2>
          </div>

          {/* Tarjeta de Login */}
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
                Bienvenido
              </h2>

              <p className="text-muted-foreground">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            {/* Formulario de Login */}
            <LoginForm />

            {/* Botón de Cambio de Contraseña */}
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full h-10 border-primary text-primary hover:bg-primary/10 transition-colors text-[16px]"
                onClick={() => navigate('/auth/cambiar-contrasena')}
              >
                Cambiar Contraseña
              </Button>

              <Button
                variant="ghost"
                className="w-full h-10 text-muted-foreground hover:text-primary hover:bg-secondary transition-colors text-[16px]"
                onClick={() => navigate('/auth/crear-contrasena')}
              >
                ¿Primera vez aquí? Crea tu contraseña
              </Button>
            </div>
          </div>

          {/* Información adicional */}
          <p className="text-center text-sm text-muted-foreground">
            ¿Necesitas ayuda? Contacta al administrador del sistema
          </p>
        </div>
      </div>
    </div>
  );
};