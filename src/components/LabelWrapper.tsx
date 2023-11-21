import { CSSProperties } from "react";

type LabelWrapperProps = {
    children:React.ReactNode;
    labelText:string;
}

const styles:CSSProperties = {
    marginLeft:4,
    marginBottom:2,
    fontSize:"1rem",
    color:'var(--grey-1)',
}

export const LabelWrapper:React.FC<LabelWrapperProps> = ({children,labelText})=>(
    <div className='flex-column'>
        <label style={styles}>{labelText}</label>
        {children}
    </div>
)