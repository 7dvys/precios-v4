export const getAccountTypeFromSkus = (cbItemSkus: {
    main: string[];
    secondary: string[];
})=>{
    const mainItems = (cbItemSkus.main.length > 0 && 1) || 0;
    const secondaryItems = (cbItemSkus.secondary.length > 0 && 2) || 0;
    const result = mainItems+secondaryItems;
    return result===0?'sin items':result === 1?'primaria':result=== 2?'secundaria':'ambas';
}
