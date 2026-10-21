import React, { createContext, useCallback, useContext, useState } from 'react';
import { menuData, MenuItem } from '../data/menuData';

type NewMenuItem = Omit<MenuItem, 'id' | 'tersedia' | 'gambar'>;
type MenuUpdates = Partial<Pick<MenuItem, 'nama' | 'harga' | 'deskripsi' | 'kategori' | 'tersedia'>>;

interface MenuContextValue {
  menu: MenuItem[];
  addMenu: (item: NewMenuItem) => void;
  updateMenu: (id: string, updates: MenuUpdates) => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<MenuItem[]>(menuData);

  const addMenu = useCallback((item: NewMenuItem) => {
    setMenu((current) => [
      ...current,
      {
        ...item,
        id: String(Date.now()),
        tersedia: true,
        gambar:
          item.kategori === 'Minuman'
            ? 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'
            : 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
      },
    ]);
  }, []);

  const updateMenu = useCallback((id: string, updates: MenuUpdates) => {
    setMenu((current) => current.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  return <MenuContext.Provider value={{ menu, addMenu, updateMenu }}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
