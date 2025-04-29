import * as React from "react";
import DrawerList from "../../admin seller/components/drawerList/DrawerList";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { Category } from "@mui/icons-material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';

const menu = [
    {
        name: "Sellers",
        path: "/admin/sellers",
        icon: <StorefrontIcon className="text-primary-color" />,
        activeIcon: <StorefrontIcon className="text-white" />,
    },
    {
        name: "Add Seller",
        path: "/admin/add-seller",
        icon: <AddIcon className="text-primary-color" />,
        activeIcon: <AddIcon className="text-white" />,
    },
    {
        name: "Customers",
        path: "/admin/customers",
        icon: <PeopleIcon className="text-primary-color" />,
        activeIcon: <PeopleIcon className="text-white" />,
    },
    {
        name: "Add Customer",
        path: "/admin/add-customer",
        icon: <AddIcon className="text-primary-color" />,
        activeIcon: <AddIcon className="text-white" />,
    },
    {
        name: "Products",
        path: "/admin/products",
        icon: <LocalMallIcon className="text-primary-color" />,
        activeIcon: <LocalMallIcon className="text-white" />,
    },
    {
        name: "Add Product",
        path: "/admin/add-product",
        icon: <AddIcon className="text-primary-color" />,
        activeIcon: <AddIcon className="text-white" />,
    },
    {
        name: "Coupons",
        path: "/admin/coupon",
        icon: <IntegrationInstructionsIcon className="text-primary-color" />,
        activeIcon: <IntegrationInstructionsIcon className="text-white" />,
    },
    {
        name: "Add New Coupon",
        path: "/admin/add-coupon",
        icon: <AddIcon className="text-primary-color" />,
        activeIcon: <AddIcon className="text-white" />,
    },
    {
        name: "Home Page",
        path: "/admin/home-grid",
        icon: <HomeIcon className="text-primary-color" />,
        activeIcon: <HomeIcon className="text-white" />,
    },
    {
        name: "Electronics Category",
        path: "/admin/electronics-category",
        icon: <ElectricBoltIcon className="text-primary-color" />,
        activeIcon: <ElectricBoltIcon className="text-white" />,
    },
    {
        name: "Shop By Category",
        path: "/admin/shop-by-category",
        icon: <Category className="text-primary-color" />,
        activeIcon: <Category className="text-white" />,
    },
    {
        name: "Deals",
        path: "/admin/deals",
        icon: <LocalOfferIcon className="text-primary-color" />,
        activeIcon: <LocalOfferIcon className="text-white" />,
    },
];

const menu2 = [
    {
        name: "Account",
        path: "/seller/account",
        icon: <AccountBoxIcon className="text-primary-color" />,
        activeIcon: <AccountBoxIcon className="text-white" />,
    },
    {
        name: "Logout",
        path: "/",
        icon: <LogoutIcon className="text-primary-color" />,
        activeIcon: <LogoutIcon className="text-white" />,
    },
];

interface DrawerListProps {
    toggleDrawer?: any;
}

const AdminDrawerList = ({ toggleDrawer }: DrawerListProps) => {
    return (
        <>
            <DrawerList toggleDrawer={toggleDrawer} menu={menu} menu2={menu2} />
        </>
    );
};

export default AdminDrawerList;
