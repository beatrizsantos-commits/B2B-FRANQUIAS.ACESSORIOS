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
  Upload,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Utilitários de formatação
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatPercent = (value) => {
  return `${value.toFixed(2).replace('.', ',')}%`;
};

// Gerador de dados baseado na tabela fornecida
const generateStoreData = (franquia, sellIn, investR) => {
  const limiteR = sellIn * 0.014; // Limite de 1,4%
  const saldoR = limiteR - investR;
  return {
    franquia,
    sellIn,
    limiteR,
    limitePct: 1.4, // Fixo 1.4%
    investPct: sellIn > 0 ? (investR / sellIn) * 100 : 0,
    investR,
    saldoPct: sellIn > 0 ? (saldoR / sellIn) * 100 : 0,
    saldoR
  };
};

// TODO: Substituir mockPainelGeral pela leitura real do arquivo "DASHBOARD DE B2B FRANQUIAS - ACESSÓRIOS - PAINEL (2).csv"
const mockPainelGeral = [
  generateStoreData("ATIBAIA", 308960, 0),
  generateStoreData("ATLANTIDA", 367820, 0),
  generateStoreData("BELEM", 931102, 2465.5),
  generateStoreData("BH CARMO", 814628, 0),
  generateStoreData("BLUMENAU", 419821.2, 0),
  generateStoreData("CHAPECO", 569960, 0),
  generateStoreData("CURITIBA", 334382, 775.4),
  generateStoreData("FRANCA", 91758, 0),
  generateStoreData("ITU", 516453.8, 3677.34),
  generateStoreData("JD GUEDALA", 310276, 1241.93),
  generateStoreData("LONDRINA", 638632, 0),
  generateStoreData("MACEIO", 555633, 0),
  generateStoreData("MARESIAS", 191833.8, 2180.45),
  generateStoreData("NATAL", 866855, 5165.98),
  generateStoreData("TERESINA", 2208876, 0),
  generateStoreData("VILA VELHA", 328355, 0),
  generateStoreData("VITORIA", 783947.56, 2789.2),
];

// TODO: Substituir mockBaseSellIn pela leitura real do arquivo "DASHBOARD DE B2B FRANQUIAS - ACESSÓRIOS - BASE SELL IN_2.csv"
const mockBaseSellIn = [
  { franquia: "ATIBAIA", jan: 55612.80, fev: 49433.60, mar: 61792.00, abr: 64881.60, mai: 77240.00, ytd: 308960 },
  { franquia: "ATLANTIDA", jan: 66207.60, fev: 58851.20, mar: 73564.00, abr: 77242.20, mai: 91955.00, ytd: 367820 },
  { franquia: "BELEM", jan: 167598.36, fev: 148976.32, mar: 186220.40, abr: 195531.42, mai: 232775.50, ytd: 931102 },
  { franquia: "BH CARMO", jan: 146633.04, fev: 130340.48, mar: 162925.60, abr: 171071.88, mai: 203657.00, ytd: 814628 },
  { franquia: "BLUMENAU", jan: 75567.81, fev: 67171.39, mar: 83964.24, abr: 88162.45, mai: 104955.31, ytd: 419821.20 },
  { franquia: "CHAPECO", jan: 102592.80, fev: 91193.60, mar: 113992.00, abr: 119691.60, mai: 142490.00, ytd: 569960 },
  { franquia: "CURITIBA", jan: 60188.76, fev: 53501.12, mar: 66876.40, abr: 70220.22, mai: 83595.50, ytd: 334382 },
  { franquia: "FRANCA", jan: 16516.44, fev: 14681.28, mar: 18351.60, abr: 19269.18, mai: 22939.50, ytd: 91758 },
  { franquia: "ITU", jan: 92961.68, fev: 82632.61, mar: 103290.76, abr: 108455.30, mai: 129113.45, ytd: 516453.80 },
  { franquia: "JD GUEDALA", jan: 55849.68, fev: 49644.16, mar: 62055.20, abr: 65157.96, mai: 77569.00, ytd: 310276 },
  { franquia: "LONDRINA", jan: 114953.76, fev: 102181.12, mar: 127726.40, abr: 134112.72, mai: 159658.00, ytd: 638632 },
  { franquia: "MACEIO", jan: 100013.94, fev: 88901.28, mar: 111126.60, abr: 116682.93, mai: 138908.25, ytd: 555633 },
  { franquia: "MARESIAS", jan: 34530.08, fev: 30693.41, mar: 38366.76, abr: 40285.10, mai: 47958.45, ytd: 191833.80 },
  { franquia: "NATAL", jan: 156033.90, fev: 138696.80, mar: 173371.00, abr: 182039.55, mai: 216713.75, ytd: 866855 },
  { franquia: "TERESINA", jan: 397597.68, fev: 353420.16, mar: 441775.20, abr: 463863.96, mai: 552219.00, ytd: 2208876 },
  { franquia: "VILA VELHA", jan: 59103.90, fev: 52536.80, mar: 65671.00, abr: 68954.55, mai: 82088.75, ytd: 328355 },
  { franquia: "VITORIA", jan: 141110.56, fev: 125431.61, mar: 156789.51, abr: 164628.99, mai: 195986.89, ytd: 783947.56 },
];

// TODO: Substituir mockInvestimento pela leitura real do arquivo "DASHBOARD DE B2B FRANQUIAS - ACESSÓRIOS - VALOR GASTO DO INVESTIMENTO (1).csv"
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

// COMPONENTE: Card Base
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

// COMPONENTE: KpiCard
const KpiCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <Card className="p-6 transition-all hover:shadow-md">
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

// COMPONENTE: Filters
const Filters = ({ selectedStore, setSelectedStore, availableStores }) => (
  <div className="flex items-center gap-3">
    <label htmlFor="loja-select" className="text-sm font-semibold text-rose-900 hidden sm:flex items-center gap-2">
      <Filter size={16} /> Filtro por Loja:
    </label>
    <select
      id="loja-select"
      value={selectedStore}
      onChange={(e) => setSelectedStore(e.target.value)}
      className="bg-rose-50 border border-rose-200 text-rose-900 text-sm font-medium rounded-lg focus:ring-rose-800 focus:border-rose-800 block p-2 cursor-pointer outline-none transition-shadow"
    >
      {availableStores.map(loja => (
        <option key={loja} value={loja}>{loja}</option>
      ))}
    </select>
  </div>
);

// COMPONENTE: SalesLineChart
const SalesLineChart = ({ data, isSingleStore }) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {isSingleStore ? (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#881337', fontWeight: 500}} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b'}}
              tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(159 18 57 / 0.1)' }}
            />
            <Line type="monotone" dataKey="valor" name="Sell In" stroke="#9f1239" strokeWidth={4} dot={{r: 6, fill: '#9f1239', stroke: '#fff', strokeWidth: 2}} activeDot={{r: 8}} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="franquia" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} angle={-45} textAnchor="end" height={60} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b'}}
              tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(159 18 57 / 0.1)' }}
              cursor={{fill: '#fff1f2'}}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="jan" name="Jan" fill="#ffe4e6" stackId="a" />
            <Bar dataKey="fev" name="Fev" fill="#fecdd3" stackId="a" />
            <Bar dataKey="mar" name="Mar" fill="#fda4af" stackId="a" />
            <Bar dataKey="abr" name="Abr" fill="#fb7185" stackId="a" />
            <Bar dataKey="mai" name="Mai" fill="#e11d48" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// VIEW: Painel Geral
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Sell In Total (YTD)" 
          value={formatCurrency(totais.sellIn)} 
          icon={TrendingUp} 
          colorClass="bg-rose-900" 
        />
        <KpiCard 
          title="Limite Total (1,4%)" 
          value={formatCurrency(totais.limiteR)} 
          icon={PieChart} 
          colorClass="bg-rose-800" 
        />
        <KpiCard 
          title="Investimento Total" 
          value={formatCurrency(totais.investR)} 
          subtitle={`${investGeralPct.toFixed(2)}% do Sell In`}
          icon={DollarSign} 
          colorClass="bg-rose-700" 
        />
        <KpiCard 
          title="Saldo Disponível" 
          value={formatCurrency(totais.saldoR)} 
          icon={Wallet} 
          colorClass="bg-rose-600" 
        />
      </div>

      <Card>
        <div className="p-6 border-b border-rose-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-rose-950">
            Resumo de Franquias - Limites e Investimentos
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-rose-50 text-rose-900">
              <tr>
                <th className="p-4 font-bold">FRANQUIAS</th>
                <th className="p-4 font-bold text-right">SELL IN</th>
                <th className="p-4 font-bold text-right">LIMITE 1,4% R$</th>
                <th className="p-4 font-bold text-right">LIMITE %</th>
                <th className="p-4 font-bold text-right">INVEST. %</th>
                <th className="p-4 font-bold text-right">INVEST. R$</th>
                <th className="p-4 font-bold text-right">SALDO %</th>
                <th className="p-4 font-bold text-right">SALDO R$</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-rose-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">{row.franquia}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.sellIn)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.limiteR)}</td>
                  <td className="p-4 text-right text-slate-600">{formatPercent(row.limitePct)}</td>
                  <td className="p-4 text-right text-rose-700 font-medium">{formatPercent(row.investPct)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.investR)}</td>
                  <td className="p-4 text-right text-rose-900 font-bold">{formatPercent(row.saldoPct)}</td>
                  <td className="p-4 text-right text-slate-800 font-bold">{formatCurrency(row.saldoR)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// VIEW: Base Sell In
const BaseSellInView = ({ selectedStore }) => {
  const filteredData = useMemo(() => {
    if (selectedStore === 'Todas') return mockBaseSellIn;
    return mockBaseSellIn.filter(item => item.franquia === selectedStore);
  }, [selectedStore]);

  const chartData = useMemo(() => {
    if (selectedStore === 'Todas') return filteredData;
    const d = filteredData[0];
    if (!d) return [];
    return [
      { mes: 'Janeiro', valor: d.jan },
      { mes: 'Fevereiro', valor: d.fev },
      { mes: 'Março', valor: d.mar },
      { mes: 'Abril', valor: d.abr },
      { mes: 'Maio', valor: d.mai },
    ];
  }, [selectedStore, filteredData]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6 border-b border-rose-100">
          <h2 className="text-lg font-bold text-rose-950">
            {selectedStore === 'Todas' ? 'Composição de Sell In Mensal (YTD)' : `Evolução de Sell In - ${selectedStore}`}
          </h2>
        </div>
        <div className="p-6">
          <SalesLineChart data={chartData} isSingleStore={selectedStore !== 'Todas'} />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-rose-50 text-rose-900">
              <tr>
                <th className="p-4 font-bold">FRANQUIA</th>
                <th className="p-4 font-bold text-right">JANEIRO</th>
                <th className="p-4 font-bold text-right">FEVEREIRO</th>
                <th className="p-4 font-bold text-right">MARÇO</th>
                <th className="p-4 font-bold text-right">ABRIL</th>
                <th className="p-4 font-bold text-right">MAIO</th>
                <th className="p-4 font-bold text-right bg-rose-100">YTD (TOTAL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-rose-50/50">
                  <td className="p-4 font-semibold text-slate-800">{row.franquia}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.jan)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.fev)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.mar)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.abr)}</td>
                  <td className="p-4 text-right text-slate-600">{formatCurrency(row.mai)}</td>
                  <td className="p-4 text-right font-bold text-rose-900 bg-rose-50/30">{formatCurrency(row.ytd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// VIEW: Valor Gasto Investimento
const InvestimentoView = ({ selectedStore }) => {
  const filteredData = useMemo(() => {
    if (selectedStore === 'Todas') return mockInvestimento;
    return mockInvestimento.filter(item => item.loja === selectedStore);
  }, [selectedStore]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6 border-b border-rose-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-rose-950">
            Detalhamento de Lançamentos e Envios
            {selectedStore !== 'Todas' && ` - ${selectedStore}`}
          </h2>
          <span className="text-sm font-semibold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
            Total: {formatCurrency(filteredData.reduce((a, b) => a + b.valorEnviado, 0))}
          </span>
        </div>
        <div className="overflow-x-auto">
          {filteredData.length > 0 ? (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-rose-50 text-rose-900">
                <tr>
                  <th className="p-4 font-bold">LOJA (FRANQUIA)</th>
                  <th className="p-4 font-bold">DATA</th>
                  <th className="p-4 font-bold">LANÇAMENTO / DESCRIÇÃO</th>
                  <th className="p-4 font-bold">STATUS</th>
                  <th className="p-4 font-bold text-right">VALOR ENVIADO (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-rose-50/50">
                    <td className="p-4 font-semibold text-slate-800">{row.loja}</td>
                    <td className="p-4 text-slate-500">{row.data}</td>
                    <td className="p-4 text-slate-700">{row.lancamento}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        row.status === 'Entregue' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        row.status === 'Em Trânsito' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-800">{formatCurrency(row.valorEnviado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <PackageSearch size={48} className="text-rose-200 mb-4" />
              <p className="text-lg font-medium">Nenhum investimento registrado para esta loja.</p>
              <p className="text-sm">A franquia ainda possui 100% do saldo limite disponível.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('painel');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Todas');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Lista exata das 17 lojas solicitadas + "Todas"
  const lojasDisponiveis = [
    'Todas', 'ATIBAIA', 'ATLANTIDA', 'BELEM', 'BH CARMO', 'BLUMENAU', 
    'CHAPECO', 'CURITIBA', 'FRANCA', 'ITU', 'JD GUEDALA', 'LONDRINA', 
    'MACEIO', 'MARESIAS', 'NATAL', 'TERESINA', 'VILA VELHA', 'VITORIA'
  ];

  const navigation = [
    { id: 'painel', name: 'Painel Geral', icon: LayoutDashboard },
    { id: 'sellin', name: 'Base Sell In', icon: Store },
    { id: 'investimento', name: 'Investimento Gasto', icon: Wallet },
  ];

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      // TODO: Aqui deverá ser implementado o parsing dos arquivos com bibliotecas como papaparse.
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-rose-950/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-rose-950 text-rose-100 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-rose-900/50">
          <div className="flex items-center gap-3 text-white font-bold text-xl">
            <div className="bg-rose-800 p-2 rounded-lg">
              <TrendingUp size={20} className="text-rose-100" />
            </div>
            <span>B2B Acessórios</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-rose-900 rounded">
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-1.5">
          <p className="text-xs font-bold text-rose-400/70 uppercase tracking-widest mb-4 px-3 mt-4">
            Visualizações
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
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-rose-800 text-white shadow-md shadow-rose-950/20' 
                    : 'text-rose-200 hover:bg-rose-900 hover:text-white'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-rose-200' : 'text-rose-400'} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-rose-100 h-16 flex items-center px-4 sm:px-6 lg:px-8 justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-rose-800 hover:bg-rose-50 transition-colors"
            >
              <Menu size={24} />
            </button>
            
            {/* Componente de Filtro Isolado */}
            <Filters 
              selectedStore={selectedStore} 
              setSelectedStore={setSelectedStore} 
              availableStores={lojasDisponiveis} 
            />
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            {uploadSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-pulse">
                Base Atualizada!
              </span>
            )}
            
            {/* Botão de Importação */}
            <label className="flex items-center gap-2 bg-rose-50 text-rose-800 px-4 py-2 rounded-lg border border-rose-200 hover:bg-rose-100 hover:border-rose-300 cursor-pointer transition-all text-sm font-bold shadow-sm">
              <Upload size={16} />
              <span className="hidden sm:inline">Importar Bases CSV</span>
              <input 
                type="file" 
                accept=".csv"
                className="hidden" 
                onChange={handleFileUpload}
                multiple
              />
            </label>

            <div className="h-9 w-9 rounded-full bg-rose-900 text-rose-50 flex items-center justify-center font-bold text-sm shadow-md border-2 border-white ring-2 ring-rose-100">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafc]">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-rose-950 flex items-center gap-2">
                {navigation.find(n => n.id === activeTab)?.name}
                {selectedStore !== 'Todas' && (
                  <span className="text-rose-600 bg-rose-100 px-3 py-1 rounded-lg text-xl ml-2 font-semibold">
                    {selectedStore}
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Análise de performance, limites e investimentos da rede B2B.
              </p>
            </div>
            
            {/* Renderização Condicional de Views */}
            {activeTab === 'painel' && <PainelGeralView selectedStore={selectedStore} />}
            {activeTab === 'sellin' && <BaseSellInView selectedStore={selectedStore} />}
            {activeTab === 'investimento' && <InvestimentoView selectedStore={selectedStore} />}
          </div>
        </div>
      </main>
    </div>
  );
}
