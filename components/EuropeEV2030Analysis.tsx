import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Line, Area, ComposedChart
} from 'recharts';
import type { ProductionData, ElectricityDemandData, EnergyMixData, ChargingInfraData } from '../types';

// DATA CONSTANTS
const productionData: ProductionData[] = [
  {
    category: 'Fabricantes Europeus',
    domestic: 2800000,
    imported: 0,
    share: 45.2,
    companies: ['Volkswagen Group', 'Stellantis', 'BMW', 'Mercedes-Benz', 'Volvo']
  },
  {
    category: 'Chineses na Europa',
    domestic: 1650000,
    imported: 0,
    share: 26.6,
    companies: ['BYD (Hungria)', 'Geely/Volvo', 'SAIC', 'CATL partnerships']
  },
  {
    category: 'Tesla na Europa',
    domestic: 350000,
    imported: 0,
    share: 5.6,
    companies: ['Tesla Berlin']
  },
  {
    category: 'Importações da China',
    domestic: 0,
    imported: 1400000,
    share: 22.6,
    companies: ['BYD', 'NIO', 'XPeng', 'MG Motor', 'Outros']
  }
];

const electricityDemandData: ElectricityDemandData[] = [
  { year: 2024, current: 35, projected: 35, percentage: 1.4 },
  { year: 2025, current: 50, projected: 50, percentage: 1.9 },
  { year: 2026, current: 68, projected: 68, percentage: 2.6 },
  { year: 2027, current: 85, projected: 85, percentage: 3.3 },
  { year: 2028, current: 105, projected: 105, percentage: 4.1 },
  { year: 2029, current: 125, projected: 125, percentage: 4.9 },
  { year: 2030, current: 145, projected: 145, percentage: 5.6 }
];

const energyMixData: EnergyMixData[] = [
    { source: 'Eólica', current2024: 476, projected2030: 750, internal2030: 750, external2030: 0, color: '#22C55E' },
    { source: 'Solar', current2024: 234, projected2030: 400, internal2030: 400, external2030: 0, color: '#FACC15' },
    { source: 'Nuclear', current2024: 586, projected2030: 620, internal2030: 620, external2030: 0, color: '#3B82F6' },
    { source: 'Hidro', current2024: 347, projected2030: 380, internal2030: 380, external2030: 0, color: '#06B6D4' },
    { source: 'Biomassa/Outros', current2024: 116, projected2030: 155, internal2030: 155, external2030: 0, color: '#8B5CF6' },
    { 
      source: 'Gás Natural', current2024: 437, projected2030: 280, internal2030: 42, external2030: 238, color: '#F59E0B',
      externalProviders: [
        { name: 'Noruega', twh: 82, color: '#003893' },
        { name: 'EUA (GNL)', twh: 47, color: '#BF0A30' },
        { name: 'Qatar (GNL)', twh: 40, color: '#8A1538' },
        { name: 'Argélia', twh: 35, color: '#006233' },
        { name: 'Rússia', twh: 24, color: '#D52B1E' },
        { name: 'Outros GNL', twh: 10, color: '#808080' },
      ]
    },
    { source: 'Carvão', current2024: 301, projected2030: 120, internal2030: 20, external2030: 100, color: '#6B7280' },
    { source: 'Outros Fósseis', current2024: 75, projected2030: 45, internal2030: 5, external2030: 40, color: '#EF4444' },
];

const chargingInfraData: ChargingInfraData[] = [
  { country: 'Alemanha', points2024: 120000, points2030: 2200000, publicPoints: 220000 },
  { country: 'França', points2024: 85000, points2030: 1800000, publicPoints: 220000 },
  { country: 'Reino Unido', points2024: 65000, points2030: 1500000, publicPoints: 150000 },
  { country: 'Países Baixos', points2024: 140000, points2030: 900000, publicPoints: 90000 },
  { country: 'Itália', points2024: 45000, points2030: 1200000, publicPoints: 120000 },
  { country: 'Espanha', points2024: 25000, points2030: 800000, publicPoints: 80000 },
  { country: 'Outros UE27', points2024: 95000, points2030: 1400000, publicPoints: 140000 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// HELPER COMPONENTS
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

const GeneralTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ProductionTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProductionData;
    const totalVehicles = data.domestic + data.imported;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
        <p className="font-bold mb-1">{data.category}</p>
        <p style={{ color: payload[0].fill }}>
          {`Share: ${data.share.toFixed(1)}%`}
        </p>
        <p style={{ color: payload[0].fill }}>
          {`Veículos: ${totalVehicles.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

const EnergyMixTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EnergyMixData;
    const total = data.internal2030 + data.external2030;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm max-w-xs">
        <p className="font-bold mb-2">{label}</p>
        <p><strong>Total 2030:</strong> {total.toLocaleString()} TWh</p>
        <div className="mt-2 space-y-1">
          {payload.map(p => (
             <p key={p.dataKey} style={{ color: p.fill }}>{`${p.name}: ${p.value.toLocaleString()} TWh`}</p>
          ))}
        </div>
        {data.externalProviders && data.externalProviders.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-200">
             <p className="font-semibold mb-1">Provedores Externos:</p>
             <ul className="list-disc list-inside text-gray-700">
              {data.externalProviders.map(provider => (
                <li key={provider.name}>{`${provider.name}: ${provider.twh} TWh`}</li>
              ))}
             </ul>
          </div>
        )}
      </div>
    );
  }
  return null;
};


// MAIN COMPONENT
const EuropeEV2030Analysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState('production');
  
  const tabs = [
    { key: 'production', label: '🏭 Produção' },
    { key: 'demand', label: '⚡ Demanda' },
    { key: 'mix', label: '🔋 Matriz Energética' },
    { key: 'infrastructure', label: '🔌 Infraestrutura' },
    { key: 'analysis', label: '📋 Análise' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'production':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">🏭 Produção de Veículos Elétricos na Europa - Projeção 2030</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-3 text-center">Distribuição da Produção (6,2 milhões VEs/ano)</h4>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={productionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="share"
                      nameKey="category"
                      labelLine={false}
                      // FIX: The `recharts` type for the Pie label prop is incorrect. Using `any` here to bypass the type error
                      // as the `percent` property is available on the object at runtime.
                      label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {productionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ProductionTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-center">Capacidade Produtiva por Categoria</h4>
                <div className="space-y-4">
                  {productionData.map((item, index) => (
                    <div key={item.category} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{item.category}</span>
                        <span className="text-blue-600 font-bold">
                          {(item.domestic + item.imported).toLocaleString()} VEs
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className="h-3 rounded-full"
                          style={{
                            width: `${item.share}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p><strong>Principais players:</strong> {item.companies.join(', ')}</p>
                        {item.category === 'Chineses na Europa' && (
                          <p className="text-green-600 mt-1 font-semibold">✅ BYD: Planta na Hungria com 300k VEs/ano até 2030</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold mb-4 text-center text-gray-700">Volume de Produção por Categoria e Origem (VEs)</h4>
               <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={productionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 90 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} interval={0} />
                  <YAxis 
                    label={{ value: 'Número de Veículos', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(tick) => new Intl.NumberFormat('de-DE').format(tick)}
                  />
                  <Tooltip content={<GeneralTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                  <Legend wrapperStyle={{paddingTop: '70px'}}/>
                  <Bar dataKey="domestic" name="Produção Doméstica (UE)" stackId="a" fill="#0088FE" />
                  <Bar dataKey="imported" name="Importado" stackId="a" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'demand':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">⚡ Demanda Elétrica da Mobilidade Elétrica (2024-2030)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <h4 className="font-semibold mb-3 text-center">Evolução da Demanda (TWh)</h4>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={electricityDemandData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" label={{ value: 'TWh', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: '% do Total', angle: 90, position: 'insideRight' }} />
                    <Tooltip content={<GeneralTooltip />} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="current" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.6} name="Demanda VEs (TWh)" />
                    <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#F59E0B" strokeWidth={3} name="% da Demanda Total" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="lg:col-span-2">
                 <div className="bg-yellow-50 p-4 rounded-lg mt-4 border border-yellow-200">
                  <h5 className="font-semibold text-yellow-800 mb-2">🔢 Cálculos Base (2030):</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 30M VEs × 15.000 km/ano × 0.18 kWh/km = <strong>81 TWh</strong></li>
                    <li>• + 3M comerciais × 25k km/ano × 0.35 kWh/km = <strong>26 TWh</strong></li>
                    <li>• + Perdas de carregamento (~30%) = <strong>32 TWh</strong></li>
                    <li>• + Auxiliares (~10%) = <strong>14 TWh</strong></li>
                    <li className="font-bold pt-1 border-t border-yellow-300 mt-1">Total: ~145 TWh</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case 'mix':
        const gasProviders = energyMixData.find(d => d.source === 'Gás Natural')?.externalProviders || [];
        return (
           <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">🔋 Matriz Energética 2030: Origem Interna vs. Externa</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={energyMixData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" angle={-45} textAnchor="end" height={100} interval={0} />
                <YAxis label={{ value: 'TWh', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<EnergyMixTooltip />} />
                <Legend wrapperStyle={{paddingTop: '60px'}} />
                <Bar dataKey="internal2030" stackId="a" fill="#4ade80" name="Produção Interna (UE)" />
                <Bar dataKey="external2030" stackId="a" fill="#fb923c" name="Importado (Externo)" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-8 bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3">🔍 Detalhe dos Provedores Externos (Gás Natural - 2030)</h4>
              <p className="text-sm text-orange-700 mb-4">
                Dos <strong>{gasProviders.reduce((acc, p) => acc + p.twh, 0)} TWh</strong> de gás natural importado, a projeção de fornecimento é diversificada para garantir a segurança energética:
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={gasProviders} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={90} />
                  <Tooltip cursor={{fill: 'rgba(251, 146, 60, 0.2)'}} content={<GeneralTooltip />} />
                  <Bar dataKey="twh" name="Fornecimento (TWh)">
                    {gasProviders.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
             <div className="mt-8 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3">📈 Análise: Volatilidade do Preço do Gás Europeu (Pós-2022)</h4>
                <p className="text-sm text-blue-700 mb-2">
                    O gráfico de preços do gás (Dutch TTF) reflete a extrema volatilidade após 2022. Os picos históricos foram causados por uma combinação de fatores locais e geopolíticos:
                </p>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li><strong>Redução do Gás Russo:</strong> A principal causa foi a drástica diminuição do fornecimento via gasodutos da Rússia após a invasão da Ucrânia, que era a maior fonte da UE.</li>
                    <li><strong>Corrida pelo GNL:</strong> A Europa teve que competir agressivamente no mercado global por Gás Natural Liquefeito (GNL) para substituir o volume perdido, elevando os preços mundialmente.</li>
                    <li><strong>Segurança Energética:</strong> Uma corrida para encher os reservatórios de gás antes do inverno 2022-2023, por medo de desabastecimento, gerou uma demanda artificialmente alta e pânico no mercado.</li>
                    <li><strong>Fatores Climáticos e Operacionais:</strong> Ondas de calor (aumentando a demanda por ar condicionado) e manutenções em infraestruturas críticas (terminais de GNL, usinas nucleares na França) também contribuíram para a pressão nos preços.</li>
                </ul>
            </div>
          </div>
        );
      case 'infrastructure':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">🔌 Infraestrutura de Carregamento por País</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chargingInfraData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} interval={0} />
                <YAxis label={{ value: 'Pontos de Carregamento', angle: -90, position: 'insideLeft' }} tickFormatter={(tick) => `${tick/1000000}M`} />
                <Tooltip content={<GeneralTooltip />} />
                <Legend />
                <Bar dataKey="points2024" fill="#94A3B8" name="2024 Atual" />
                <Bar dataKey="points2030" fill="#22C55E" name="2030 Total Projetado" />
                <Bar dataKey="publicPoints" fill="#F59E0B" name="2030 Públicos Projetado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'analysis':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">📋 Análise Crítica & Fontes</h3>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-3">📊 Fontes Principais:</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div><strong>Parlamento Europeu (2024):</strong> Ban de ICE em 2035, metas de redução 55% até 2030</div>
                <div><strong>Fortune (Ago 2024):</strong> BYD planta Hungria 150k→300k VEs/ano</div>
                <div><strong>IEA Global EV Outlook 2025:</strong> Projeções demanda elétrica e infraestrutura</div>
                <div><strong>Oeko Institute:</strong> VEs = 4-5% demanda elétrica UE em 2030</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">🔗 Links das Fontes:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <a href="https://www.europarl.europa.eu/news/en/press-room/20230210IPR74715/fit-for-55-new-co2-standards-for-cars-and-vans-to-tackle-road-transport-emissions" target="_blank" rel="noopener noreferrer" className="underline text-indigo-600 hover:text-indigo-800">Parlamento Europeu - Ban ICE 2035</a></li>
                <li>• <a href="https://fortune.com/" target="_blank" rel="noopener noreferrer" className="underline text-indigo-600 hover:text-indigo-800">Fortune - BYD Hungria 300k/ano</a></li>
                <li>• <a href="https://www.iea.org/reports/global-ev-outlook-2024" target="_blank" rel="noopener noreferrer" className="underline text-indigo-600 hover:text-indigo-800">IEA Global EV Outlook 2025</a></li>
                <li>• <a href="https://www.oeko.de/" target="_blank" rel="noopener noreferrer" className="underline text-indigo-600 hover:text-indigo-800">Oeko Institute - VEs 4-5% demanda elétrica</a></li>
                <li>• <a href="https://gridx.ai/" target="_blank" rel="noopener noreferrer" className="underline text-indigo-600 hover:text-indigo-800">GridX - 8.8M carregadores até 2030</a></li>
              </ul>
            </div>
             <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 mb-3">⚠️ Riscos Atuais e Futuros no Fornecimento de Gás</h4>
                <div className="space-y-4 text-sm text-yellow-700">
                    <div>
                        <h5 className="font-semibold mb-1">1. Dependência do Catar e Risco Regulatório (Presente)</h5>
                        <p>Após 2022, a UE aumentou drasticamente sua dependência do GNL do Catar para substituir o gás russo. No entanto, o Ministro da Energia do Catar ameaçou <strong className="text-red-600">interromper todo o fornecimento</strong> se a nova "Diretiva de Due Diligence" da UE for aplicada, que impõe multas por violações de direitos humanos ou ambientais na cadeia de suprimentos. Isso cria uma enorme incerteza sobre a confiabilidade deste fornecedor estratégico.</p>
                    </div>
                    <div>
                        <h5 className="font-semibold mb-1">2. Competição de Mercado e Política dos EUA (Projeção 2030)</h5>
                        <p>O Catar está expandindo sua capacidade de produção de GNL para 142 milhões de toneladas/ano até 2027 para dominar o mercado. Contudo, uma potencial mudança na política dos EUA (ex: suspensão de limites de exportação) poderia inundar o mercado global com GNL americano. Isso aumentaria a competição, dando à Europa mais poder de barganha, mas também introduzindo uma nova camada de volatilidade de preços e dinâmica geopolítica.</p>
                    </div>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Europa 2030: Revolução dos Veículos Elétricos e Impacto Energético
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Análise da produção européia vs importações chinesas e demanda elétrica resultante
        </p>

        <div className="flex flex-wrap justify-center border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors duration-200 ease-in-out
                ${activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              aria-current={activeTab === tab.key ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {renderContent()}
        </div>
        
      </div>
    </div>
  );
};

export default EuropeEV2030Analysis;
