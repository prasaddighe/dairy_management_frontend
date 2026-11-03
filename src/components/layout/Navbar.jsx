import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Clock,
  X
} from 'lucide-react';
import { useDairy } from '../../context/DairyContext';

export const Navbar = ({ toggleSidebar }) => {
  const {
    currentShift,
    setCurrentShift,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    farmers,
    customers,
    products,
    setActiveTab
  } = useDairy();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString());

  const notifDropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read);

  const filteredFarmers = searchQuery.trim().length > 1
    ? farmers.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const filteredCustomers = searchQuery.trim().length > 1
    ? customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const filteredProducts = searchQuery.trim().length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const hasSearchResults = searchQuery.trim().length > 1 && (filteredFarmers.length > 0 || filteredCustomers.length > 0 || filteredProducts.length > 0);

  const toggleShift = () => {
    setCurrentShift(prev => prev === 'Morning' ? 'Evening' : 'Morning');
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="btn-icon" onClick={toggleSidebar} title="Toggle Sidebar">
          <Menu size={20} />
        </button>

        <div className="search-bar-wrapper" ref={searchRef}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search farmer, customer, product..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
          />

          {showSearchResults && searchQuery.trim().length > 1 && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-[1100] max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Search Results
                </span>
                <button 
                  onClick={() => setShowSearchResults(false)} 
                  className="border-0 bg-transparent text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                >
                  <X size={14} />
                </button>
              </div>

              {filteredFarmers.length > 0 && (
                <div className="mb-2">
                  <div className="text-[11px] font-bold text-emerald-700 mb-1">
                    Farmers
                  </div>
                  {filteredFarmers.map(f => (
                    <div
                      key={f.id}
                      onClick={() => {
                        setActiveTab('farmers');
                        setShowSearchResults(false);
                      }}
                      className="px-2 py-1.5 rounded-md cursor-pointer text-xs flex justify-between items-center hover:bg-slate-100 transition"
                    >
                      <span className="font-semibold text-slate-800">{f.name} ({f.village})</span>
                      <span className="text-slate-400 font-mono text-[11px]">{f.id}</span>
                    </div>
                  ))}
                </div>
              )}

              {filteredCustomers.length > 0 && (
                <div className="mb-2">
                  <div className="text-[11px] font-bold text-sky-600 mb-1">
                    Customers
                  </div>
                  {filteredCustomers.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveTab('customers');
                        setShowSearchResults(false);
                      }}
                      className="px-2 py-1.5 rounded-md cursor-pointer text-xs flex justify-between items-center hover:bg-slate-100 transition"
                    >
                      <span className="font-semibold text-slate-800">{c.name}</span>
                      <span className="text-slate-400 text-[11px]">{c.subscriptionType}</span>
                    </div>
                  ))}
                </div>
              )}

              {filteredProducts.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-amber-600 mb-1">
                    Products
                  </div>
                  {filteredProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveTab('products');
                        setShowSearchResults(false);
                      }}
                      className="px-2 py-1.5 rounded-md cursor-pointer text-xs flex justify-between items-center hover:bg-slate-100 transition"
                    >
                      <span className="font-semibold text-slate-800">{p.name}</span>
                      <span className="font-bold text-emerald-600">₹{p.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {!hasSearchResults && (
                <div className="p-3 text-center text-slate-400 text-xs">
                  No matching records found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <button
          onClick={toggleShift}
          className={`btn-dairy ${currentShift === 'Morning' ? 'badge-dairy morning' : 'badge-dairy evening'} py-1.5 px-3 cursor-pointer text-xs`}
          title="Click to toggle Shift"
        >
          {currentShift === 'Morning' ? <Sun size={15} /> : <Moon size={15} />}
          <span>{currentShift} Shift</span>
        </button>

        <div className="hidden md:flex items-center gap-1.5 text-slate-600 text-xs font-semibold px-2">
          <Clock size={15} className="text-slate-400" />
          <span className="mono-font">{currentTime}</span>
        </div>

        <div className="relative" ref={notifDropdownRef}>
          <button
            className="btn-icon notification-bell-btn cursor-pointer"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotifs.length > 0 && (
              <span className="notification-count">{unreadNotifs.length}</span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="notification-dropdown">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800">Notifications ({notifications.length})</span>
                {unreadNotifs.length > 0 && (
                  <button 
                    onClick={clearAllNotifications}
                    className="text-xs text-emerald-700 hover:text-emerald-800 border-0 bg-transparent cursor-pointer font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2.5 rounded-lg cursor-pointer transition border-l-4 ${
                      n.type === 'warning'
                        ? 'border-l-amber-500'
                        : n.type === 'success'
                        ? 'border-l-emerald-600'
                        : 'border-l-sky-500'
                    } ${n.read ? 'bg-white hover:bg-slate-50' : 'bg-slate-100/70 hover:bg-slate-100'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
