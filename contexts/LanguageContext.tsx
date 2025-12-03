import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'pt';

interface Translations {
  [key: string]: {
    en: string;
    pt: string;
  };
}

const translations: Translations = {
  // App general
  'app.name': { en: 'Hand Mine Control', pt: 'Controle de Mineração' },
  'app.welcome': { en: 'Welcome', pt: 'Bem-vindo' },

  // Auth
  'auth.login': { en: 'Login', pt: 'Entrar' },
  'auth.logout': { en: 'Logout', pt: 'Sair' },
  'auth.email': { en: 'Email', pt: 'E-mail' },
  'auth.password': { en: 'Password', pt: 'Senha' },
  'auth.register': { en: 'Register', pt: 'Registrar' },
  'auth.createAccount': { en: 'Create Account', pt: 'Criar Conta' },
  'auth.signIn': { en: 'Sign In', pt: 'Entrar' },
  'auth.name': { en: 'Name', pt: 'Nome' },
  'auth.enterEmail': { en: 'Enter your email', pt: 'Digite seu e-mail' },
  'auth.enterPassword': { en: 'Enter your password', pt: 'Digite sua senha' },
  'auth.enterName': { en: 'Enter your name', pt: 'Digite seu nome' },
  'auth.alreadyHaveAccount': { en: 'Already have an account?', pt: 'Já tem uma conta?' },
  'auth.poweredBy': { en: 'Powered by SOLVEO Mining Technologies', pt: 'Desenvolvido por SOLVEO Mining Technologies' },

  // Navigation
  'nav.home': { en: 'Home', pt: 'Início' },
  'nav.equipment': { en: 'Equipment', pt: 'Equipamento' },
  'nav.operation': { en: 'Operation', pt: 'Operação' },
  'nav.reports': { en: 'Reports', pt: 'Relatórios' },
  'nav.admin': { en: 'Admin', pt: 'Administrador' },

  // Equipment
  'equipment.select': { en: 'Select Equipment', pt: 'Selecionar Equipamento' },
  'equipment.loading': { en: 'Loading Equipment', pt: 'Equipamento de Carregamento' },
  'equipment.transport': { en: 'Transport Equipment', pt: 'Equipamento de Transporte' },
  'equipment.all': { en: 'All', pt: 'Todos' },
  'equipment.name': { en: 'Equipment Name', pt: 'Nome do Equipamento' },
  'equipment.category': { en: 'Category', pt: 'Categoria' },
  'equipment.capacity': { en: 'Capacity', pt: 'Capacidade' },
  'equipment.status': { en: 'Status', pt: 'Estado' },
  'equipment.active': { en: 'Active', pt: 'Ativo' },
  'equipment.inactive': { en: 'Inactive', pt: 'Inativo' },
  'equipment.maintenance': { en: 'Maintenance', pt: 'Manutenção' },

  // Operations
  'operation.start': { en: 'Start Operation', pt: 'Iniciar Operação' },
  'operation.stop': { en: 'Stop Operation', pt: 'Parar Operação' },
  'operation.edit': { en: 'Edit Operation', pt: 'Editar Operação' },
  'operation.current': { en: 'Current Activity', pt: 'Atividade Atual' },
  'operation.recent': { en: 'Recent Activities', pt: 'Atividades Recentes' },
  'operation.activity': { en: 'Activity', pt: 'Atividade' },
  'operation.material': { en: 'Material', pt: 'Material' },
  'operation.truck': { en: 'Truck', pt: 'Caminhão' },
  'operation.miningFront': { en: 'Mining Front', pt: 'Frente de Lavra' },
  'operation.destination': { en: 'Destination', pt: 'Destino' },
  'operation.details': { en: 'Details', pt: 'Detalhes' },
  'operation.add': { en: 'Add Operation', pt: 'Adicionar Operação' },
  'operation.selectActivity': { en: 'Select Activity', pt: 'Selecionar Atividade' },
  'operation.selectMaterial': { en: 'Select Material', pt: 'Selecionar Material' },
  'operation.selectTruck': { en: 'Select Truck', pt: 'Selecionar Caminhão' },
  'operation.optional': { en: 'Optional', pt: 'Opcional' },
  'operation.truckBeingLoaded': { en: 'Truck Being Loaded', pt: 'Caminhão Sendo Carregado' },
  'operation.distance': { en: 'Distance', pt: 'Distância' },

  // Admin
  'admin.dashboard': { en: 'Admin Dashboard', pt: 'Painel Administrativo' },
  'admin.operators': { en: 'Operators', pt: 'Operadores' },
  'admin.activities': { en: 'Activity Types', pt: 'Tipos de Atividade' },
  'admin.equipment': { en: 'Equipment Management', pt: 'Gestão de Equipamento' },
  'admin.activeOps': { en: 'Active', pt: 'Ativo' },
  'admin.alerts': { en: 'Alerts', pt: 'Alertas' },
  'admin.working': { en: 'Working', pt: 'Trabalhando' },
  'admin.idle': { en: 'Idle', pt: 'Parado' },
  'admin.todaySummary': { en: "Today's Summary", pt: 'Resumo de Hoje' },
  'admin.totalOperations': { en: 'Total Operations', pt: 'Total de Operações' },
  'admin.operatorsStatus': { en: 'Operators Status', pt: 'Status dos Operadores' },
  'admin.performanceSummary': { en: 'Performance Summary', pt: 'Resumo de Desempenho' },
  'admin.tripsByEquipment': { en: 'Trips by Equipment', pt: 'Viagens por Equipamento' },
  'admin.inactiveFor': { en: 'Inactive for', pt: 'Inativo há' },
  'admin.active': { en: 'Active', pt: 'Ativo' },
  'admin.inactive': { en: 'Inactive', pt: 'Inativo' },
  'admin.newOperator': { en: 'New Operator', pt: 'Novo Operador' },
  'admin.newEquipment': { en: 'New Equipment', pt: 'Novo Equipamento' },
  'admin.newActivity': { en: 'New Activity', pt: 'Nova Atividade' },
  'admin.editOperator': { en: 'Edit Operator', pt: 'Editar Operador' },
  'admin.editEquipment': { en: 'Edit Equipment', pt: 'Editar Equipamento' },
  'admin.editActivity': { en: 'Edit Activity', pt: 'Editar Atividade' },
  'admin.operatorName': { en: 'Operator Name', pt: 'Nome do Operador' },
  'admin.operatorEmail': { en: 'Operator Email', pt: 'Email do Operador' },
  'admin.operatorRole': { en: 'Role', pt: 'Função' },
  'admin.administrator': { en: 'Administrator', pt: 'Administrador' },
  'admin.operator': { en: 'Operator', pt: 'Operador' },
  'admin.assignEquipment': { en: 'Assign Equipment', pt: 'Atribuir Equipamento' },
  'admin.activityType': { en: 'Activity Type', pt: 'Tipo de Atividade' },
  'admin.activityName': { en: 'Activity Name', pt: 'Nome da Atividade' },
  'admin.addReason': { en: 'Add Custom Reason', pt: 'Adicionar Motivo Personalizado' },
  'admin.customReason': { en: 'Custom Reason', pt: 'Motivo Personalizado' },

  // Reports
  'reports.title': { en: 'Reports', pt: 'Relatórios' },
  'reports.export': { en: 'Export', pt: 'Exportar' },
  'reports.daily': { en: 'Daily Summary', pt: 'Resumo Diário' },
  'reports.performance': { en: 'Performance Overview', pt: 'Visão de Desempenho' },
  'reports.selectDate': { en: 'Select Date', pt: 'Selecionar Data' },
  'reports.totalTrips': { en: 'Total Trips', pt: 'Total de Viagens' },
  'reports.totalDistance': { en: 'Total Distance', pt: 'Distância Total' },
  'reports.totalTime': { en: 'Total Time', pt: 'Tempo Total' },
  'reports.timePerActivity': { en: 'Time per Activity', pt: 'Tempo por Atividade' },
  'reports.tripsByEquipment': { en: 'Trips by Equipment', pt: 'Viagens por Equipamento' },
  'reports.equipmentAvailability': { en: 'Equipment Availability', pt: 'Disponibilidade de Equipamento' },
  'reports.materialMoved': { en: 'Material Moved', pt: 'Material Movido' },

  // Common
  'common.save': { en: 'Save', pt: 'Salvar' },
  'common.cancel': { en: 'Cancel', pt: 'Cancelar' },
  'common.delete': { en: 'Delete', pt: 'Excluir' },
  'common.edit': { en: 'Edit', pt: 'Editar' },
  'common.add': { en: 'Add', pt: 'Adicionar' },
  'common.search': { en: 'Search', pt: 'Buscar' },
  'common.loading': { en: 'Loading...', pt: 'Carregando...' },
  'common.success': { en: 'Success', pt: 'Sucesso' },
  'common.error': { en: 'Error', pt: 'Erro' },
  'common.confirm': { en: 'Confirm', pt: 'Confirmar' },
  'common.create': { en: 'Create', pt: 'Criar' },
  'common.update': { en: 'Update', pt: 'Atualizar' },
  'common.saveChanges': { en: 'Save Changes', pt: 'Salvar Alterações' },

  // Messages
  'msg.noData': { en: 'No data available', pt: 'Nenhum dado disponível' },
  'msg.noOperations': { en: 'No operations yet', pt: 'Ainda não há operações' },
  'msg.operationStarted': { en: 'Operation started', pt: 'Operação iniciada' },
  'msg.operationStopped': { en: 'Operation stopped', pt: 'Operação parada' },
  'msg.operationUpdated': { en: 'Operation updated successfully', pt: 'Operação atualizada com sucesso' },
  'msg.fillAllFields': { en: 'Please fill in all fields', pt: 'Por favor, preencha todos os campos' },
  'msg.selectActivity': { en: 'Please select an activity', pt: 'Por favor, selecione uma atividade' },
  'msg.activityNotFound': { en: 'Selected activity not found', pt: 'Atividade selecionada não encontrada' },
  'msg.loginFailed': { en: 'Failed to login. Please try again.', pt: 'Falha ao fazer login. Tente novamente.' },
  'msg.registerFailed': { en: 'Failed to register. Please try again.', pt: 'Falha ao registrar. Tente novamente.' },
  'msg.invalidCredentials': { en: 'Invalid credentials. Please check your email and password.', pt: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
  'msg.offline': { en: 'Offline', pt: 'Offline' },
  'msg.noCachedCredentials': { en: 'No cached credentials found. Please connect to the network for your first login.', pt: 'Nenhuma credencial em cache encontrada. Conecte-se à rede para o primeiro login.' },
  'msg.stopOperationConfirm': { en: 'Are you sure you want to stop this operation?', pt: 'Tem certeza de que deseja parar esta operação?' },
  'msg.equipmentAssigned': { en: 'Equipment assigned successfully', pt: 'Equipamento atribuído com sucesso' },
  'msg.equipmentAssignFailed': { en: 'Failed to assign equipment', pt: 'Falha ao atribuir equipamento' },
  'msg.operationStartFailed': { en: 'Failed to start operation', pt: 'Falha ao iniciar operação' },
  'msg.operationStopFailed': { en: 'Failed to stop operation', pt: 'Falha ao parar operação' },
  'msg.operationUpdateFailed': { en: 'Failed to update operation', pt: 'Falha ao atualizar operação' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('app_language');
      if (savedLang === 'en' || savedLang === 'pt') {
        setLanguageState(savedLang);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
