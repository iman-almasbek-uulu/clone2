'use client'
import { FC, ReactNode } from 'react';
import LayoutProfile from '@/appPages/profile/components/layout/LayoutProfile';
interface LayoutType {
	children: ReactNode;
}
const Layout: FC<LayoutType> = ({ children }) => {
	return <LayoutProfile>{children}</LayoutProfile>;
};
export default Layout;
