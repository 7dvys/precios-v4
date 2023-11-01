'use client'
import { useSearchParams,useRouter,usePathname,  } from "next/navigation"
import { useEffect, useState } from "react";
import popupStyles from '@/styles/popup.module.css';
import { notificationMessages } from "@/constants/opciones/notifications";

export const Notification:React.FC<{message:string,onClose:(id:number)=>void, id:number}> = ({ id,message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
        onClose(id);
        }, 5000); // Cierra la notificación después de 5 segundos
        return () => {clearTimeout(timer)}
    }, []);

    return (
        <div className={popupStyles.notification}>
            <p>{message}</p>
            <button onClick={()=>onClose(id)}>Cerrar</button>
        </div>
    );
};

export const NotificationStack = () => {
    const [notifications, setNotifications] = useState<{id:number,code:string,message:string}[]>([]);
    const router = useRouter()
    const pathname = usePathname()

    const cleanQueryParams = ()=>{
        router.replace(pathname)
    }

    const addNotification = ({code,message}:{code:string,message: string}) => {
        setNotifications((prevNotifications) => {
          // Verifica si ya existe una notificación con el mismo mensaje
          if (!prevNotifications.some((notification) => notification.code === code)) {
            return [...prevNotifications, { id: Date.now(), message,code }];
          } else {
            return prevNotifications; // Devuelve el estado anterior sin cambios
          }
        });
      };
      
    const removeNotification = (id:number) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    };

    const searchParams = useSearchParams();

    useEffect(()=>{
        if(searchParams.has('notification')){
            const code= searchParams.get('notification') as keyof typeof notificationMessages;
            const message= notificationMessages[code];

            if(message)
            addNotification({code,message});

            cleanQueryParams()
        }
    },[searchParams])

    return (
        <div className={popupStyles.notificationStack}>
            {notifications.map((notification) => (
                <Notification
                key={notification.id}
                id={notification.id}
                message={notification.message}
                onClose={removeNotification}
                />
            ))}
        </div>
    );
};


