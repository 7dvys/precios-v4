import { updateAccountProducts } from "@/services/contabilium/accountProducts";
import { Products } from "@/types/Products";
import { Tokens } from "@/types/Contabilium";
import { AccountType } from "@/types/Config";
import { UpdatedProductStatus } from "@/components/ItemsListaEditor/UpdateProductsModal";

export const updateProducts = async (tokens:Tokens,{main,secondary}:Products,listaType:AccountType|'both')=>{
    const updateProductsStatus:UpdatedProductStatus = {main:{},secondary:{}};
        
    if(listaType==='main'){
        const mainStatus = await updateAccountProducts({accountProducts:main,token:tokens.main});
        updateProductsStatus.main = mainStatus;
        return updateProductsStatus
    }

    if(listaType==='secondary'){
        const secondaryStatus = await updateAccountProducts({accountProducts:secondary,token:tokens.secondary});

        updateProductsStatus.secondary = secondaryStatus;
        return updateProductsStatus
    }

    const [mainStatus,secondaryStatus] = await Promise.all([updateAccountProducts({accountProducts:main,token:tokens.main}),updateAccountProducts({accountProducts:secondary,token:tokens.secondary})]) ;
    return {main:mainStatus,secondary:secondaryStatus}
}
