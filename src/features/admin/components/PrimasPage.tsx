import { Percent } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TarifasTab } from './TarifasTab';
import { SumasAseguradasTab } from './SumasAseguradasTab';

export const PrimasPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[#003366] flex items-center gap-2">
        <Percent className="w-6 h-6" />
        Primas y Sumas Aseguradas
      </h1>
      <p className="text-sm text-slate-400 mt-1">
        Administración de tarifas y valores asegurados del sistema
      </p>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-6">
      <Tabs defaultValue="tarifas">
        <TabsList className="mb-4">
          <TabsTrigger value="tarifas">Tarifas (Primas)</TabsTrigger>
          <TabsTrigger value="sumas">Sumas Aseguradas</TabsTrigger>
        </TabsList>
        <TabsContent value="tarifas">
          <TarifasTab />
        </TabsContent>
        <TabsContent value="sumas">
          <SumasAseguradasTab />
        </TabsContent>
      </Tabs>
    </div>
  </div>
);