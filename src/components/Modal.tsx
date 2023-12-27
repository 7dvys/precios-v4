import { ModalStyles } from "@/styles/ModalStyles"

export const Modal = ({children}:{children:React.ReactNode})=>{
    return <div style={ModalStyles}>{children}</div>
}