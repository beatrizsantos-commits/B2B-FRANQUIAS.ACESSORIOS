//cole o código do gemini aqui
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  Wallet,
  Menu,
  X,
  Store,
  PackageSearch,
  PieChart,
  Upload
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatPercent = (value) => {
  return `${value.toFixed(2).replace('.', ',')}%`;
};

const generatePainelData = (franquia, sellIn, investR) => {
  const limiteR = sellIn * 0.014; // Limite de 1,4%
  const saldoR = limiteR - investR;
  return {
    franquia,
    sellIn,
    limiteR,
    limitePct: 1.4,
    investPct: (investR / sellIn) * 100,
    investR,
    saldoPct: (saldoR / sellIn) * 100,
    saldoR
  };
};

// Reflete: DASHBOARD DE B2B FRANQUIAS - ACESSÓRIOS - PAINEL.csv
const mockPainelGeral = [
  generatePainelData("ATIBAIA", 308960, 0),
  generatePainelData("ATLANTIDA", 367820, 0),
  generatePainelData("BELEM", 931102, 2465.5),
  generatePainelData("BH CARMO", 814628, 0),
  generatePainelData("BLUMENAU", 419821.2, 0),
  generatePainelData("CHAPECO", 569960, 0),
  generatePainelData("CURITIBA", 334382, 775.4),
  generatePainelData("FRANCA", 91758, 0),
  generatePainelData("ITU", 516453.8, 3677.34),
  generatePainelData("JD GUEDALA", 310276, 1241.93),
  generatePainelData("LONDRINA", 638632, 0),
  generatePainelData("MACEIO", 555633, 0),
  generatePainelData("MARESIAS", 191833.8, 2180.45),
  generatePainelData("NATAL", 866855, 5165.98),
  generatePainelData("TERESINA", 2208876, 0),
  generatePainelData("VILA VELHA", 328355, 0),
  generatePainelData("VITORIA", 783947.56, 2789.2),
];

const generateBaseSellIn = (franquia, ytd) => {
  const jan = ytd * 0.18;
  const fev = ytd * 0.16;
  const mar = ytd * 0.20;
  const abr = ytd * 0.21;
  const mai = ytd - (jan + fev + mar + abr); // Garante que a soma é exatamente o total YTD
  return { franquia, jan, fev, mar, abr, mai, ytd };
};

// Reflete: DASHBOARD DE B2B FRANQUIAS - ACESSÓRIOS - BASE SELL IN.csv
const mockBaseSellIn = [
  generateBaseSellIn("ATIBAIA", 308960),
  generateBaseSellIn("ATLANTIDA", 367820),
  generateBaseSellIn("BELEM", 931102),
  generateBaseSellIn("BH CARMO", 814628),
  generateBaseSellIn("BLUMENAU", 419821.2),
  generateBaseSellIn("CHAPECO", 569960),
  generateBaseSellIn("CURITIBA", 334382),
  generateBaseSellIn("FRANCA", 91758),
  generateBaseSellIn("ITU", 516453.8),
  generateBaseSellIn("JD GUEDALA", 310276),
  generateBaseSellIn("LONDRINA", 638632),
  generateBaseSellIn("MACEIO", 555633),
  generateBaseSellIn("MARESIAS", 191833.8),
  generateBaseSellIn("NATAL", 866855),
  generateBaseSellIn("TERESINA", 2208876),
  generateBaseSellIn("VILA VELHA", 328355),
  generateBaseSellIn("VITORIA", 783947.56),
];

// Reflete: DASHBOARD DE B2B FRANQUIAS - ACESSÓRIOS - VALOR GASTO DO INVESTIMENTO.csv
const mockInvestimento = [
  { loja: "BELEM", lancamento: "Kit Iluminação LED", data: "12/03/2026", valorEnviado: 2465.5, status: "Entregue" },
  { loja: "CURITIBA", lancamento: "Material Básico PDV", data: "10/03/2026", valorEnviado: 775.4, status: "Em Trânsito" },
  { loja: "ITU", lancamento: "Kit Iluminação LED", data: "12/03/2026", valorEnviado: 2000, status: "Entregue" },
  { loja: "ITU", lancamento: "Expositores Acrílico", data: "05/04/2026", valorEnviado: 1677.34, status: "Processando" },
  { loja: "JD GUEDALA", lancamento: "Renovação Mostruário", data: "05/02/2026", valorEnviado: 1241.93, status: "Entregue" },
  { loja: "MARESIAS", lancamento: "Ação Especial Litoral", data: "10/01/2026", valorEnviado: 2180.45, status: "Entregue" },
  { loja: "NATAL", lancamento: "Kit Verão + Iluminação", data: "25/01/2026", valorEnviado: 3000, status: "Entregue" },
  { loja: "NATAL", lancamento: "Displays de Balcão", data: "15/03/2026", valorEnviado: 2165.98, status: "Em Trânsito" },
  { loja: "VITORIA", lancamento: "Expositores Premium", data: "22/03/2026", valorEnviado: 2789.2, status: "Em Trânsito" }
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </Card>
);

const PainelGeralView = ({ selectedStore }) => {
  const filteredData = useMemo(() => {
    if (selectedStore === 'Todas') return mockPainelGeral;
    return mockPainelGeral.filter(item => item.franquia === selectedStore);
  }, [selectedStore]);

  const totais = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      sellIn: acc.sellIn + curr.sellIn,
      investR: acc.investR + curr.investR,
      saldoR: acc.saldoR + curr.saldoR,
      limiteR: acc.limiteR + curr.limiteR,
    }), { sellIn: 0, investR: 0, saldoR: 0, limiteR: 0 });
  }, [filteredData]);

  const investGeralPct = totais.sellIn > 0 ? (totais.investR / totais.sellIn) * 100 : 0;

  const storeSellIn = useMemo(() => {
    if (selectedStore === 'Todas') return null;
    return mockBaseSellIn.find(item => item.franquia === selectedStore);
  }, [selectedStore]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Sell In Total (YTD)" 
          value={formatCurrency(totais.sellIn)} 
          icon={TrendingUp} 
          colorClass="bg-rose-900" 
        />
        <MetricCard 
          title="Limite Total (1,4%)" 
          value={formatCurrency(totais.limiteR)} 
          icon={PieChart} 
          colorClass="bg-rose-800" 
        />
        <MetricCard 
          title="Investimento Total" 
          value={formatCurrency(totais.investR)} 
          subtitle={`${investGeralPct.toFixed(2)}% do Sell In`}
          icon={DollarSign} 
          colorClass="bg-rose-700" 
        />
        <MetricCard 
          title="Saldo Disponível" 
          value={formatCurrency(totais.saldoR)} 
          icon={Wallet} 
          colorClass="bg-rose-600" 
        />
      </div>

      {selectedStore !== 'Todas' && storeSellIn && (
        <>
          <Card>
            <div className="p-4 border-b border-slate-200 bg-rose-50/50">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Detalhamento Mensal de Sell In - {selectedStore}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="p-4 flex flex-col justify-center">
                <span className="text-xs text-slate-500 font-semibold mb-1 uppercase">Janeiro</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(storeSellIn.jan)}</span>
              </div>
              <div className="p-4 flex flex-col justify-center">
                <span className="text-xs text-slate-500 font-semibold mb-1 uppercase">Fevereiro</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(storeSellIn.fev)}</span>
              </div>
              <div className="p-4 flex flex-col justify-center">
                <span className="text-xs text-slate-500 font-semibold mb-1 uppercase">Março</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(storeSellIn.mar)}</span>
              </div>
              <div className="p-4 flex flex-col justify-center">
                <span className="text-xs text-slate-500 font-semibold mb-1 uppercase">Abril</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(storeSellIn.abr)}</span>
              </div>
              <div className="p-4 flex flex-col justify-center">
                <span className="text-xs text-slate-500 font-semibold mb-1 uppercase">Maio</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(storeSellIn.mai)}</span>
              </div>
              <div className="p-4 flex flex-col justify-center bg-rose-50/50">
                <span className="text-xs text-rose-800 font-bold mb-1 uppercase">YTD (Total)</span>
                <span className="text-lg font-bold text-rose-900">{formatCurrency(storeSellIn.ytd)}</span>
              </div>
            </div>
          </Card>
          
          {/* Novo gráfico de colunas na aba principal */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Gráfico Mensal - {selectedStore}
              </h3>
            </div>
            <div className="p-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { mes: 'Jan', valor: storeSellIn.jan },
                  { mes: 'Fev', valor: storeSellIn.fev },
                  { mes: 'Mar', valor: storeSellIn.mar },
                  { mes: 'Abr', valor: storeSellIn.abr },
                  { mes: 'Mai', valor: storeSellIn.mai },
                ]} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b'}}
                    tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="valor" name="Sell In" fill="#9f1239" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      <Card>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            Resumo de Franquias - Limites e Investimentos
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">FRANQUIAS</th>
                <th className="p-4 font-semibold text-right">SELL IN</th>
                <th className="p-4 font-semibold text-right">LIMITE 1,4% R$</th>
                <th className="p-4 font-semibold text-right">LIMITE %</th>
                <th className="p-4 font-semibold text-right">INVEST. %</th>
                <th className="p-4 font-semibold text-right">INVEST. R$</th>
                <th className="p-4 font-semibold text-right">SALDO %</th>
                <th className="p-4 font-semibold text-right">SALDO R$</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{row.franquia}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.sellIn)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.limiteR)}</td>
                  <td className="p-4 text-right text-slate-600">{formatPercent(row.limitePct)}</td>
                  <td className="p-4 text-right text-rose-700 font-medium">{formatPercent(row.investPct)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.investR)}</td>
                  <td className="p-4 text-right text-rose-900 font-medium">{formatPercent(row.saldoPct)}</td>
                  <td className="p-4 text-right text-slate-600 font-medium">{formatCurrency(row.saldoR)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const BaseSellInView = ({ selectedStore }) => {
  const filteredData = useMemo(() => {
    if (selectedStore === 'Todas') return mockBaseSellIn;
    return mockBaseSellIn.filter(item => item.franquia === selectedStore);
  }, [selectedStore]);

  // Se apenas uma loja for selecionada, adaptamos o gráfico para uma linha do tempo (tendência mensal)
  const singleStoreChartData = useMemo(() => {
    if (selectedStore === 'Todas' || filteredData.length === 0) return [];
    const d = filteredData[0];
    return [
      { mes: 'Jan', valor: d.jan },
      { mes: 'Fev', valor: d.fev },
      { mes: 'Mar', valor: d.mar },
      { mes: 'Abr', valor: d.abr },
      { mes: 'Mai', valor: d.mai },
    ];
  }, [selectedStore, filteredData]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">
            {selectedStore === 'Todas' ? 'Comparativo de Sell In Mensal' : `Evolução de Sell In - ${selectedStore}`}
          </h2>
        </div>
        <div className="p-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {selectedStore === 'Todas' ? (
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="franquia" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b'}}
                  tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f8fafc'}}
                />
                <Legend />
                <Bar dataKey="jan" name="Jan" fill="#fecdd3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fev" name="Fev" fill="#fda4af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mar" name="Mar" fill="#fb7185" radius={[4, 4, 0, 0]} />
                <Bar dataKey="abr" name="Abr" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mai" name="Mai" fill="#9f1239" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={singleStoreChartData} margin={{ top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b'}}
                  tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="valor" name="Sell In" fill="#9f1239" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">FRANQUIA</th>
                <th className="p-4 font-semibold text-right">JANEIRO</th>
                <th className="p-4 font-semibold text-right">FEVEREIRO</th>
                <th className="p-4 font-semibold text-right">MARÇO</th>
                <th className="p-4 font-semibold text-right">ABRIL</th>
                <th className="p-4 font-semibold text-right">MAIO</th>
                <th className="p-4 font-semibold text-right bg-rose-50 text-rose-900">YTD (TOTAL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{row.franquia}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.jan)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.fev)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.mar)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.abr)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.mai)}</td>
                  <td className="p-4 text-right font-bold text-rose-800 bg-rose-50/50">{formatCurrency(row.ytd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const InvestimentoView = ({ selectedStore }) => {
  const filteredData = useMemo(() => {
    if (selectedStore === 'Todas') return mockInvestimento;
    return mockInvestimento.filter(item => item.loja === selectedStore);
  }, [selectedStore]);

  const chartData = useMemo(() => {
    // Se há uma loja selecionada, agrupa por lançamento para dar visibilidade
    if (selectedStore !== 'Todas') {
      return filteredData.map(item => ({
        name: item.lancamento,
        totalEnviado: item.valorEnviado
      })).sort((a, b) => b.totalEnviado - a.totalEnviado);
    }
    
    // Se "Todas", agrupa por loja
    const agrupado = filteredData.reduce((acc, curr) => {
      acc[curr.loja] = (acc[curr.loja] || 0) + curr.valorEnviado;
      return acc;
    }, {});
    
    return Object.keys(agrupado).map(key => ({
      name: key,
      totalEnviado: agrupado[key]
    })).sort((a, b) => b.totalEnviado - a.totalEnviado);
  }, [filteredData, selectedStore]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            {selectedStore === 'Todas' ? 'Investimento Enviado por Loja' : 'Investimento por Lançamento'}
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(v) => `R$${v/1000}k`} tick={{fill: '#64748b'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} width={120} />
                <Tooltip formatter={(value) => formatCurrency(value)} cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="totalEnviado" fill="#9f1239" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <MetricCard 
          title="Total Geral Enviado" 
          value={formatCurrency(filteredData.reduce((a, b) => a + b.valorEnviado, 0))}
          subtitle={`${filteredData.length} lançamentos processados`}
          icon={PackageSearch} 
          colorClass="bg-rose-800" 
        />
      </div>

      <Card>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Detalhamento de Lançamentos e Envios</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">LOJA (FRANQUIA)</th>
                <th className="p-4 font-semibold">DATA</th>
                <th className="p-4 font-semibold">LANÇAMENTO / DESCRIÇÃO</th>
                <th className="p-4 font-semibold">STATUS</th>
                <th className="p-4 font-semibold text-right">O QUANTO JÁ ENVIAMOS (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{row.loja}</td>
                  <td className="p-4 text-slate-500">{row.data}</td>
                  <td className="p-4 text-slate-700">{row.lancamento}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      row.status === 'Entregue' ? 'bg-emerald-100 text-emerald-700' :
                      row.status === 'Em Trânsito' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-slate-800">{formatCurrency(row.valorEnviado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default function DashboardB2B() {
  const [activeTab, setActiveTab] = useState('painel');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Todas');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simula a leitura e aciona o aviso visual
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const navigation = [
    { id: 'painel', name: 'Painel Geral', icon: LayoutDashboard },
    { id: 'sellin', name: 'Base Sell In', icon: Store },
    { id: 'investimento', name: 'Valor Gasto Invest.', icon: Wallet },
  ];

  // Extrai as lojas únicas da base de dados mockada
  const lojasDisponiveis = useMemo(() => {
    const lojas = mockPainelGeral.map(item => item.franquia);
    return ['Todas', ...new Set(lojas)];
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <TrendingUp className="text-rose-600" />
            <span>B2B Acessórios</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Menu Principal
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-rose-800 text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 sm:px-6 lg:px-8 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
            >
              <Menu size={24} />
            </button>
            
            {/* Store Picker */}
            <div className="flex items-center gap-3 ml-2 lg:ml-0">
              <label htmlFor="loja-select" className="text-sm font-semibold text-slate-600 hidden sm:block">
                Filtro por Loja:
              </label>
              <select
                id="loja-select"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-rose-800 focus:border-rose-800 block p-2 cursor-pointer outline-none transition-shadow"
              >
                {lojasDisponiveis.map(loja => (
                  <option key={loja} value={loja}>{loja}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="text-sm text-slate-500 hidden sm:block">
              Última atualização: <span className="font-medium text-slate-700">Hoje, 09:30</span>
            </div>
            
            {/* Aviso visual temporário de sucesso */}
            {uploadSuccess && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 animate-pulse">
                Arquivo(s) lido(s)!
              </span>
            )}
            
            {/* Botão de Upload */}
            <label className="flex items-center gap-2 bg-rose-50 text-rose-800 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-100 cursor-pointer transition-colors text-sm font-medium">
              <Upload size={16} />
              <span className="hidden sm:inline">Importar CSV</span>
              <input 
                type="file" 
                accept=".csv"
                className="hidden" 
                onChange={handleFileUpload}
                multiple
              />
            </label>

            <div className="h-8 w-8 rounded-full bg-rose-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic View Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                {navigation.find(n => n.id === activeTab)?.name}
                {selectedStore !== 'Todas' && <span className="text-rose-800 ml-2">— {selectedStore}</span>}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Dashboard consolidado de franquias de acessórios.
              </p>
            </div>
            
            {activeTab === 'painel' && <PainelGeralView selectedStore={selectedStore} />}
            {activeTab === 'sellin' && <BaseSellInView selectedStore={selectedStore} />}
            {activeTab === 'investimento' && <InvestimentoView selectedStore={selectedStore} />}
          </div>
        </div>
      </main>
    </div>
  );
}
