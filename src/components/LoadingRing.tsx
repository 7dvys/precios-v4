import loadingRingStyles from '@/styles/loadingStyles.module.css'

export const LoadingRing:React.FC = ()=>{
    return (<div className={loadingRingStyles["lds-ellipsis"]}><div></div><div></div><div></div><div></div></div>)
}