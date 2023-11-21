import containerStyles from '@/styles/containers.module.css';
import styles from './listElement.module.css';

type ListElementProps = {
    liList:React.ReactNode[];
    customStyle?:string;
}

export const ListElement:React.FC<ListElementProps> = ({liList,customStyle})=>{
    return (
        <div className={`${containerStyles.container}`}>
            <ul className={`${styles.ul} flex-row ${customStyle}`}>
                {liList.map((liValue,index)=>(
                    <li key={index}>{liValue}</li>
                ))}
            </ul>
        </div>
    )
}