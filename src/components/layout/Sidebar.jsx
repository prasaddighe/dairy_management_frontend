import React from 'react';
import {
  LayoutDashboard,
  Milk,
  Users,
  UserCheck,
  ShoppingBag,
  Package,
  Truck,
  CreditCard,
  UserCog,
  Warehouse,
  Receipt,
  BarChart3,
  Bell,
  ShieldAlert,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  FileSpreadsheet,
  Coins,
  MapPin
} from 'lucide-react';
import { useDairy } from '../../context/DairyContext';

export const Sidebar = ({ isCollapsed, toggleCollapse, mobileOpen, closeMobile }) => {
  const { currentUser, activeTab, setActiveTab, logoutUser, milkRecords, deliveries, notifications, t } = useDairy();

  const role = currentUser?.id || 'super_admin';

  const getNavSections = () => {
    if (role === 'farmer') {
      return [
        {
          title: 'Farmer Self-Service',
          items: [
            { id: 'dashboard', label: 'Farmer Dashboard', icon: LayoutDashboard },
            { id: 'farmer-records', label: 'My Milk Records', icon: Milk },
            { id: 'farmer-payments', label: 'My Payment Slips', icon: CreditCard },
            { id: 'farmer-rates', label: 'Rate Chart & Fat Calc', icon: Coins }
          ]
        }
      ];
    }

    if (role === 'customer') {
      return [
        {
          title: 'Customer Self-Service',
          items: [
            { id: 'dashboard', label: 'My Subscription', icon: LayoutDashboard },
            { id: 'customer-store', label: 'Order Dairy Products', icon: ShoppingBag },
            { id: 'customer-deliveries', label: 'Delivery Schedule', icon: CalendarDays },
            { id: 'customer-invoices', label: 'My Invoices & Dues', icon: Receipt }
          ]
        }
      ];
    }

    if (role === 'delivery') {
      return [
        {
          title: 'Logistics & Route',
          items: [
            { id: 'dashboard', label: 'Delivery Board', icon: LayoutDashboard, badge: deliveries.filter(d => d.status === 'Pending').length },
            { id: 'orders', label: 'All Customer Routes', icon: Truck },
            { id: 'customers', label: 'Customer Addresses', icon: MapPin }
          ]
        }
      ];
    }

    if (role === 'operator') {
      return [
        {
          title: 'Collection Desk',
          items: [
            { id: 'dashboard', label: 'Operator Counter', icon: LayoutDashboard },
            { id: 'milk-collection', label: 'Milk Collection Desk', icon: Milk, badge: milkRecords.length },
            { id: 'farmers', label: 'Farmers Directory', icon: Users },
            { id: 'reports', label: 'Shift Summary Report', icon: FileSpreadsheet }
          ]
        }
      ];
    }

    if (role === 'accountant') {
      return [
        {
          title: 'Finance & Accounts',
          items: [
            { id: 'dashboard', label: 'Financial Cockpit', icon: LayoutDashboard },
            { id: 'payments', label: 'Farmer Milk Payouts', icon: CreditCard },
            { id: 'customers', label: 'Customer Dues & Ledger', icon: Users },
            { id: 'sales', label: 'Milk Sales & Invoices', icon: Receipt },
            { id: 'expenses', label: 'Expenses Register', icon: Receipt },
            { id: 'reports', label: 'Audit & P&L Reports', icon: BarChart3 }
          ]
        }
      ];
    }

    return [
      {
        title: 'Core Operations',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'milk-collection', label: 'Milk Collection', icon: Milk, badge: milkRecords.length },
          { id: 'farmers', label: 'Farmers Management', icon: Users },
          { id: 'customers', label: 'Customers Management', icon: UserCheck }
        ]
      },
      {
        title: 'Sales & Logistics',
        items: [
          { id: 'sales', label: 'Milk Sales & Billing', icon: ShoppingBag },
          { id: 'products', label: 'Milk Products Catalog', icon: Package },
          { id: 'orders', label: 'Orders & Deliveries', icon: Truck, badge: deliveries.filter(d => d.status === 'Pending').length }
        ]
      },
      {
        title: 'Accounts & Stock',
        items: [
          { id: 'payments', label: 'Payments & Accounts', icon: CreditCard },
          { id: 'expenses', label: 'Expenses Tracking', icon: Receipt },
          { id: 'inventory', label: 'Inventory & Silos', icon: Warehouse }
        ]
      },
      {
        title: 'Administration',
        items: [
          { id: 'employees', label: 'Employees & Staff', icon: UserCog },
          { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || undefined },
          { id: 'roles', label: 'User & Role Access', icon: ShieldAlert },
          { id: 'settings', label: 'Dairy Settings', icon: Settings }
        ]
      }
    ];
  };

  const navSections = getNavSections();

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobile} />
      )}

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon-box">
              <img src="/dairy-logo.jpg" alt="AmritDhara Logo" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg leading-tight text-emerald-900 font-extrabold">{t('appName', 'AmritDhara')}</span>
                <span className="text-[11px] text-slate-400 font-semibold tracking-wider">
                  SMART DAIRY ERP
                </span>
              </div>
            )}
          </div>

          <button 
            className="btn-icon d-none d-lg-flex w-7 h-7" 
            onClick={toggleCollapse} 
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                {t('ActiveMode', 'Active Mode')}
              </span>
              <span className="badge-dairy success text-[11px]">
                {currentUser?.badge}
              </span>
            </div>
          </div>
        )}

        <div className="sidebar-menu">
          {navSections.map((sec, idx) => (
            <div key={idx} className="mb-2">
              <div className="menu-category-title">{t(sec.title.replace(/[&\s-]+/g, ''), sec.title)}</div>
              {sec.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const navKey = `Nav_${item.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^[a-z]/, c => c.toUpperCase())}`;
                const labelText = t(navKey, t(item.label, item.label));
                return (
                  <button
                    key={item.id}
                    className={`nav-link-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (mobileOpen) closeMobile();
                    }}
                    title={isCollapsed ? labelText : undefined}
                  >
                    <Icon size={19} className={isActive ? 'text-primary' : 'text-secondary'} />
                    <span className="nav-text">{labelText}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          <div className="mt-auto pt-4">
            <button
              className="nav-link-btn text-red-600 hover:text-red-700"
              onClick={logoutUser}
            >
              <LogOut size={19} />
              <span className="nav-text">{t('Logout', 'Sign Out')}</span>
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-mini-card">
            <div className="user-avatar">
              {currentUser?.avatar || 'AD'}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-bold whitespace-nowrap text-ellipsis overflow-hidden text-slate-800">
                  {currentUser?.fullName}
                </div>
                <div className="text-[11px] text-slate-400 whitespace-nowrap text-ellipsis overflow-hidden">
                  {currentUser?.roleTitle}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
