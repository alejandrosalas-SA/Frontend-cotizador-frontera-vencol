import { useNavigate } from 'react-router-dom';
import { CreatePasswordForm } from '@/features/auth/components/create-password-form';
import { Button } from '@/components/ui/button';
import "beautiful-backgrounds";
import altamiraLogoBlanco from '@/assets/Logos-Seguros-Altamira/logo-blanco.webp';
import altamiraLogoMobile from '@/assets/Logos-Seguros-Altamira/logo1.webp';
import iconoCotizador from '@/assets/Logos-Seguros-Altamira/icono-cotizador.webp';

export const CreatePasswordRoute = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen">
            {/* Panel Izquierdo - Azul con información */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#003366] via-[#0047AB] to-[#4169E1] overflow-hidden sticky top-0 h-screen">
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

                        <div className="space-y-4  text-center flex flex-col items-center">
                            <h1 className="text-5xl leading-tight font-size-50px line-height-50px">
                                Cotizador de la Póliza de Transportistas Binacionales
                            </h1>

                            <p className="text-xl text-blue-100 leading-relaxed max-w-xl mx-auto opacity-90">
                                Configura tu contraseña para acceder al sistema de gestión de cotizaciones.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-blue-100 text-sm">
                        © 2026 Seguros Altamira. Todos los derechos reservados.
                    </div>
                </div>
            </div>

            {/* Panel Derecho - Formulario */}
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

                    {/* Tarjeta */}
                    <div className="bg-card rounded-xl shadow-xl border border-border p-8 text-card-foreground">
                        <div className="mb-8 text-center text-foreground">
                            <div className="flex justify-center">
                                <img src={iconoCotizador} alt="Seguros Altamira" className="w-[80px] h-[80px] object-contain" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">
                                Crear Contraseña
                            </h2>

                            <p className="text-muted-foreground">
                                Ingresa tu nueva contraseña para acceder a tu cuenta
                            </p>
                        </div>

                        {/* Formulario */}
                        <CreatePasswordForm />

                        {/* Botón Volver */}
                        <div className="mt-6 pt-6 border-t border-border">
                            <Button
                                variant="ghost"
                                className="w-full h-10 text-muted-foreground hover:text-primary hover:bg-secondary transition-colors text-[16px]"
                                onClick={() => navigate('/auth/login')}
                            >
                                Volver al Inicio de Sesión
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
