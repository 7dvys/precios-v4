import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import buttonsStyles from '@/styles/buttons.module.css';

type ActiveLinkProps = {
    href:string;
    children:React.ReactNode;
    pathname:string;
}

export const ActiveLink:React.FC<ActiveLinkProps> = ({href,children,pathname})=>{
    const selectedLayout = useSelectedLayoutSegment()
    const mainPathName = href.split('/')[1];
    const isActive = (selectedLayout == mainPathName) || pathname==href;
    return (
        <Link 
        className={`${buttonsStyles.link} ${isActive?buttonsStyles['link--active']:''}`} 
        href={href}>
            {children}
        </Link>
    )
} 
