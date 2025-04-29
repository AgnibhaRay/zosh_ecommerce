import * as React from "react";
import DrawerList from "../../admin seller/components/drawerList/DrawerList";
import PeopleIcon from '@mui/icons-material/People';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useAppDispatch } from "../../Redux Toolkit/Store";
import { performLogout } from "../../Redux Toolkit/Customer/AuthSlice";

const menu = [
    {
        name: "Sellers",
        path: "/admin",
        icon: <PeopleIcon className="text-primary-color" />,
        activeIcon: <PeopleIcon className="text-white" />,
    },
    {
        name: "Products",
        path: "/admin/products",
        icon: <LocalMallIcon className="text-primary-color" />,
        activeIcon: <LocalMallIcon className="text-white" />,
    }
];

const menu2 = [
    {
        name: "Account",
        path: "/admin/account",
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
    toggleDrawer?: (open: boolean) => () => void;
}

const AdminDrawerList = ({ toggleDrawer }: DrawerListProps) => {
    const dispatch = useAppDispatch();

    const handleClick = (item: any) => {
        if (item.name === "Logout") {
            dispatch(performLogout());
        }
        if (toggleDrawer) toggleDrawer(false)();
    };

    return (
        <>
            <DrawerList toggleDrawer={toggleDrawer} menu={menu} menu2={menu2} onItemClick={handleClick}/>
        </>
    );
}; 

export default AdminDrawerList;
