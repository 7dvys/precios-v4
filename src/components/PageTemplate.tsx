import pageTemplateStyles from '@/styles/pageTemplate.module.css';

interface PageTemplateProps{
    AsideFC:React.FC,
    MainFC:React.FC
}

export const PageTemplate:React.FC<PageTemplateProps> = ({MainFC,AsideFC})=>{
    return (
        <div className={pageTemplateStyles.container}>
            <aside className={`${pageTemplateStyles.aside} ${pageTemplateStyles['--flex-column']}`}>
                <AsideFC/>
            </aside>
            <main className={`${pageTemplateStyles.main} ${pageTemplateStyles['--flex-column']}`}>
                <MainFC/>
            </main>
        </div>
    )
}