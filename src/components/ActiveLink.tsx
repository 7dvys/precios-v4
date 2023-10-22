import Link from "next/link";
import buttonsStyles from '@/styles/buttons.module.css';

type ActiveLinkProps = {
    href:string;
    children:React.ReactNode;
    pathname:string;
    mainPathname?:string;
}

export const ActiveLink:React.FC<ActiveLinkProps> = ({href,children,pathname,mainPathname})=>{
    const isActive = (mainPathname && mainPathname == href) || pathname==href;
    return (
        <Link 
        className={`${buttonsStyles.link} ${isActive?buttonsStyles['link--active']:''}`} 
        href={href}>
            {children}
        </Link>
    )
} 
