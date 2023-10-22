import pageTemplateStyles from '@/styles/pageTemplate.module.css';

interface PageTemplateProps{
    AsideContent:React.FC,
    MainContent:React.FC
}

export const PageTemplate:React.FC<PageTemplateProps> = ({MainContent,AsideContent})=>{
    return (
        <>
            <aside className={`${pageTemplateStyles.aside} ${pageTemplateStyles['--flex-column']}`}>
                <AsideContent/>
            </aside>
            <main className={`${pageTemplateStyles.main} ${pageTemplateStyles['--flex-column']}`}>
                <MainContent/>
            </main>
        </>
    )
}