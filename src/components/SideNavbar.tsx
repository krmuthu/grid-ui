import React, { useState } from 'react';

// SVGs for chevrons
const ChevronLeftIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16l-4-4 4-4" /></svg>
);
const ChevronRightIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4l4 4-4 4" /></svg>
);

interface NavItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

interface CollapsibleSection {
  label: string;
  icon?: React.ReactNode;
  items: NavItem[];
  defaultOpen?: boolean;
}

interface SideNavbarProps {
  brand?: React.ReactNode;
  items: NavItem[];
  secondaryItems?: NavItem[];
  collapsibleSections?: CollapsibleSection[];
  footer?: React.ReactNode;
  className?: string;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({
  brand,
  items,
  secondaryItems,
  collapsibleSections,
  footer,
  className = '',
  minimized = false,
  onToggleMinimize,
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const sidebarBg = 'bg-white border-gray-200 text-gray-900';
  const sidebarBorder = 'border-gray-200';
  const navItemActive = 'bg-blue-100 text-blue-700 font-semibold';
  const navItem = 'text-gray-700 hover:bg-gray-100 hover:text-blue-700';
  const badgeBg = 'bg-blue-100 text-blue-700';

  return (
    <aside
      className={`flex flex-col h-full border-r shadow-sm transition-all duration-300 ${minimized ? 'w-16' : 'w-64'} ${sidebarBg} ${className}`}
      style={{ minWidth: minimized ? '4rem' : '16rem' }}
    >
      {/* Brand/Logo */}
      <div className={`flex items-center gap-2 h-16 px-4 border-b ${sidebarBorder} ${minimized ? 'justify-center' : ''}`}>
        {brand ? brand : <span className="font-bold text-xl text-blue-600">Brand</span>}
      </div>
      {/* Minimize/Expand Button */}
      <div className="flex items-center justify-end p-2">
        <button
          onClick={onToggleMinimize}
          className="p-1 rounded hover:bg-gray-200 focus:outline-none"
          aria-label={minimized ? 'Expand sidebar' : 'Minimize sidebar'}
        >
          {minimized ? ChevronRightIcon : ChevronLeftIcon}
        </button>
      </div>
      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-2 mt-2">
          {items.map((item, idx) => (
            <li key={item.label + idx}>
              <button
                onClick={item.onClick}
                className={`group flex items-center w-full px-3 py-2 rounded-md transition-colors duration-150 text-left
                  ${item.active ? navItemActive : navItem}
                  ${minimized ? 'px-2' : ''}`}
              >
                {item.icon ? (
                  <span className={minimized ? '' : 'mr-3'}>{item.icon}</span>
                ) : (
                  <span className="font-bold text-lg mr-3">{item.label.charAt(0)}</span>
                )}
                {!minimized && <span className="truncate flex-1">{item.label}</span>}
                {!minimized && item.badge && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeBg}`}>{item.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        {/* Secondary Navigation */}
        {secondaryItems && secondaryItems.length > 0 && (
          <div className={`border-t pt-2 mt-2 ${sidebarBorder}`}>
            <ul className="flex flex-col gap-1">
              {secondaryItems.map((item, idx) => (
                <li key={item.label + idx}>
                  <button
                    onClick={item.onClick}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-left ${navItem} ${minimized ? 'px-2' : ''}`}
                  >
                    {item.icon && <span className={minimized ? '' : 'mr-3'}>{item.icon}</span>}
                    {!minimized && <span className="flex-1">{item.label}</span>}
                    {!minimized && item.badge && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeBg}`}>{item.badge}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Collapsible Sections */}
        {collapsibleSections && collapsibleSections.length > 0 && (
          <div className={`border-t pt-2 mt-2 ${sidebarBorder}`}>
            {collapsibleSections.map((section, idx) => {
              const isOpen = openSections[section.label] ?? section.defaultOpen ?? false;
              return (
                <div key={section.label + idx}>
                  <button
                    className={`flex items-center w-full px-3 py-2 rounded-md font-semibold text-left ${navItem} ${minimized ? 'px-2' : ''}`}
                    onClick={() => toggleSection(section.label)}
                  >
                    {section.icon && <span className={minimized ? '' : 'mr-3'}>{section.icon}</span>}
                    {!minimized && <span className="flex-1">{section.label}</span>}
                    <span className={`material-icons ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`}>{ChevronLeftIcon}</span>
                  </button>
                  {isOpen && (
                    <ul className="flex flex-col gap-1 ml-4 mt-1">
                      {section.items.map((item, i) => (
                        <li key={item.label + i}>
                          <button
                            onClick={item.onClick}
                            className={`flex items-center w-full px-3 py-2 rounded-md text-left ${navItem} ${minimized ? 'px-2' : ''}`}
                          >
                            {item.icon && <span className={minimized ? '' : 'mr-3'}>{item.icon}</span>}
                            {!minimized && <span className="flex-1">{item.label}</span>}
                            {!minimized && item.badge && (
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeBg}`}>{item.badge}</span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>
      {/* Footer/Profile Section */}
      {footer && (
        <div className={`flex items-center gap-2 p-4 border-t ${sidebarBorder}`}>
          {footer}
        </div>
      )}
    </aside>
  );
};

export default SideNavbar; 