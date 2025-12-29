import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import './css/NavPopup.css';
import './css/NavPopupButton.css';

interface NavLink {
  icon: string;
  label: string;
  path?: string;
  action?: () => void;
  isActive?: boolean;
  isDanger?: boolean;
}

const NavPopup = ({ currentPath = '/login' }: { currentPath?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, handleLogout } = useAuth();

  const handleLogoutAndNavigate = () => {
    handleLogout();
    closePopup();
    navigate('/login');
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  // Build nav links based on authentication status
  const getNavLinks = (): NavLink[] => {
    const links: NavLink[] = [
      { icon: 'fa-receipt', label: 'Orders', path: '/order', isActive: false },
      { icon: 'fa-calendar-alt', label: 'Reservations', path: '/reservation', isActive: false },
    ];

    // Add logout button if authenticated
    if (isAuthenticated) {
      links.push({
        icon: 'fa-sign-out-alt',
        label: 'Logout',
        action: handleLogoutAndNavigate,
        isActive: false,
        isDanger: true,
      });
    }

    return links;
  };

  // Close popup when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Hide nav popup on login page - AFTER all hooks
  if (currentPath === '/login' || currentPath === '/register') {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className='nav-popup-overlay active' onClick={closePopup} aria-hidden='true' />}

      {/* Popup Panel */}
      <div className={clsx('nav-popup', { active: isOpen })}>
        <button className='nav-popup-close' onClick={closePopup} aria-label='Close navigation' type='button'>
          <i className='fas fa-times'></i>
        </button>

        <h3>Navigation</h3>

        <nav className='nav-popup-list'>
          {getNavLinks().map((link) => (
            <div key={link.path || link.label}>
              {link.action ? (
                // Action button (e.g., Logout)
                <button
                  className={clsx('nav-popup-link', 'nav-popup-button', { danger: link.isDanger })}
                  onClick={link.action}
                  type='button'
                >
                  <i className={`fas ${link.icon}`}></i>
                  <span>{link.label}</span>
                </button>
              ) : (
                // Navigation link
                <a
                  href={link.path}
                  className={clsx('nav-popup-link', {
                    active: currentPath === link.path,
                  })}
                  onClick={() => {
                    closePopup();
                  }}
                >
                  <i className={`fas ${link.icon}`}></i>
                  <span>{link.label}</span>
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Toggle Button */}
      <button
        className='nav-popup-btn'
        onClick={togglePopup}
        aria-label='Toggle navigation menu'
        aria-expanded={isOpen}
        type='button'
      >
        <i className='fas fa-bars'></i>
      </button>
    </>
  );
};

export default NavPopup;
