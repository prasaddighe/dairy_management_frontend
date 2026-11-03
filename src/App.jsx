import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { DairyProvider, useDairy } from './context/DairyContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';

import { AdminDashboardView } from './views/AdminDashboardView';
import { MilkCollectionView } from './views/MilkCollectionView';
import { FarmersView } from './views/FarmersView';
import { CustomersView } from './views/CustomersView';
import { MilkProductsView } from './views/MilkProductsView';
import { MilkSalesView } from './views/MilkSalesView';
import { OrdersDeliveriesView } from './views/OrdersDeliveriesView';
import { PaymentsView } from './views/PaymentsView';
import { InventoryView } from './views/InventoryView';
import { ExpensesView } from './views/ExpensesView';
import { ReportsView } from './views/ReportsView';
import { EmployeesView } from './views/EmployeesView';
import { UserRolesView } from './views/UserRolesView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';

import { FarmerPortalView } from './views/roles/FarmerPortalView';
import { CustomerPortalView } from './views/roles/CustomerPortalView';
import { DeliveryStaffView } from './views/roles/DeliveryStaffView';
import { OperatorPortalView } from './views/roles/OperatorPortalView';
import { AccountantPortalView } from './views/roles/AccountantPortalView';

const MainApplication = () => {
  const { currentUser, activeTab } = useDairy();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  if (!currentUser) {
    return (
      <>
        {authMode === 'register' ? (
          <RegisterView onNavigateLogin={() => setAuthMode('login')} />
        ) : (
          <LoginView onNavigateRegister={() => setAuthMode('register')} />
        )}
        <Toast />
      </>
    );
  }

  const renderCurrentView = () => {
    const role = currentUser.id;

    if (activeTab === 'dashboard') {
      if (role === 'farmer') return <FarmerPortalView />;
      if (role === 'customer') return <CustomerPortalView />;
      if (role === 'delivery') return <DeliveryStaffView />;
      if (role === 'operator') return <OperatorPortalView />;
      if (role === 'accountant') return <AccountantPortalView />;
      return <AdminDashboardView />;
    }

    if (activeTab === 'farmer-records') return <FarmerPortalView />;
    if (activeTab === 'farmer-payments') return <FarmerPortalView />;
    if (activeTab === 'farmer-rates') return <SettingsView />;

    if (activeTab === 'customer-store') return <CustomerPortalView />;
    if (activeTab === 'customer-deliveries') return <CustomerPortalView />;
    if (activeTab === 'customer-invoices') return <CustomerPortalView />;

    switch (activeTab) {
      case 'milk-collection':
        return <MilkCollectionView />;
      case 'farmers':
        return <FarmersView />;
      case 'customers':
        return <CustomersView />;
      case 'products':
        return <MilkProductsView />;
      case 'sales':
        return <MilkSalesView />;
      case 'orders':
        return <OrdersDeliveriesView />;
      case 'payments':
        return <PaymentsView />;
      case 'inventory':
        return <InventoryView />;
      case 'expenses':
        return <ExpensesView />;
      case 'reports':
        return <ReportsView />;
      case 'employees':
        return <EmployeesView />;
      case 'roles':
        return <UserRolesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <AdminDashboardView />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        closeMobile={() => setMobileSidebarOpen(false)}
      />

      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Navbar
          toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          sidebarOpen={mobileSidebarOpen}
        />

        <main className="content-body">
          {renderCurrentView()}
        </main>
      </div>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <DairyProvider>
        <MainApplication />
      </DairyProvider>
    </LanguageProvider>
  );
}
