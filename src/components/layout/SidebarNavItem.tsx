import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { NavItem } from '../../types';

interface SidebarNavItemProps {
  item: NavItem;
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, onClick }) => {
  return (
    <NavLink
      to={item.path}
      end={item.exact}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-colors group relative select-none',
          isActive
            ? 'bg-primary-container text-on-primary font-bold shadow-sm'
            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(
              'material-symbols-outlined text-[20px] transition-colors',
              isActive
                ? 'text-on-primary'
                : 'text-outline group-hover:text-on-surface'
            )}
          >
            {item.icon}
          </span>
          <span className="font-body-md text-body-md tracking-normal flex-1 truncate">
            {item.name}
          </span>
          {item.badge && (
            <span
              className={clsx(
                'px-1.5 py-0.5 rounded text-[10px] font-mono-code font-medium',
                isActive
                  ? 'bg-on-primary/20 text-on-primary'
                  : 'bg-surface-container text-secondary'
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};
