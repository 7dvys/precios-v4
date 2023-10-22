'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import popupStyles from '@/styles/popup.module.css';
import { accountTypeSuccess, cbLoginSuccess, duplicatedCbCredentials, loginTokenError, missingCbCredentials, setCredentialsError } from "@/constants/opciones/notifications";


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

const setNotificationMessage = (code:string)=>{
    const notificationMessages = {
        [missingCbCredentials.both]: 'Ingresa sesion en ambas cuentas.',
        [missingCbCredentials.main]: 'Ingresa sesion en la cuenta principal.',
        [missingCbCredentials.secondary]: 'Ingresa sesion en la cuenta secundaria.',
        [setCredentialsError]: 'Error al guardar las credenciales.',
        [cbLoginSuccess.main]: 'Cuenta principal logueada con exito.',
        [cbLoginSuccess.secondary]: 'Cuenta secundaria logueada con exito.',
        [accountTypeSuccess]: 'Tipo de cuenta cambiada con exito.',
        [loginTokenError.main]: 'Error al iniciar sesion principal, intentelo denuevo.',
        [loginTokenError.secondary]: 'Error al iniciar sesion secundaria, intentelo denuevo.',
        [duplicatedCbCredentials]: 'La cuenta ya existe.',
        // ...otros mensajes
      };
      
    return notificationMessages[code] || '';
}


export const NotificationStack = () => {
    const [notifications, setNotifications] = useState<{id:number,code:string,message:string}[]>([]);

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
            const code = searchParams.get('notification')??'';
            let message= setNotificationMessage(code);

            if(message)
            addNotification({code,message});
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


