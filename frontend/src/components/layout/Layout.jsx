import { useStore } from '../../context/StoreContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  const { isAuthenticated } = useStore();
  
  if (isAuthenticated) {
    return (
      <div className="flex w-screen min-h-screen bg-[var(--color-dark-bg)] text-white font-sans antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-[var(--color-dark-bg)] text-white font-sans antialiased relative overflow-x-hidden scroll-smooth">
      <Navbar />
      {children}
    </div>
  );
}
