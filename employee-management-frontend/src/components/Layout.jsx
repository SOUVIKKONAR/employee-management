import { useState } from "react";
import Sidebar from "./Sidebar";
import NotificationPanel from "./NotificationPanel";

function Layout({ children }) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    return (
        <div style={{ minHeight: "100vh" }}>
            <Sidebar onNotificationClick={() => setIsNotificationOpen(true)} />
            <main
                style={{
                    marginLeft: "var(--sidebar-width)",
                    width: "calc(100% - var(--sidebar-width))",
                    minWidth: 0,
                    padding: "24px"
                }}
            >
                {children}
            </main>
            <NotificationPanel 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)} 
            />
        </div>
    );
}

export default Layout;
