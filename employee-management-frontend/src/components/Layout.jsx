import { useState } from "react";
import Sidebar from "./Sidebar";
import NotificationPanel from "./NotificationPanel";

function Layout({ children }) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar onNotificationClick={() => setIsNotificationOpen(true)} />
            <div style={{ marginLeft: "var(--sidebar-width)", flexGrow: 1, padding: "24px" }}>
                {children}
            </div>
            <NotificationPanel 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)} 
            />
        </div>
    );
}

export default Layout;
