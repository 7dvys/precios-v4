import { ACTIONS_KEYS } from '@/constants/opciones/actions';
import containerStyles from '@/styles/containers.module.css'
import { AccountType, AccountTypeKey } from '@/types/Config';
import { CbPassKey, CbUserKey } from '@/types/Contabilium'
import { cookies } from 'next/headers';


const ContabiliumOpciones:React.FC = ()=>{
    const userMainKey:CbUserKey = 'userMain';
    const passMainKey:CbPassKey = 'passMain'      
    const userSecondaryKey:CbUserKey = 'userSecondary';
    const passSecondaryKey:CbPassKey = 'passSecondary';

    const accountTypeKey:AccountTypeKey = 'accountType';
    const mainAccountType:AccountType = 'main' 
    const secondaryAccountType:AccountType = 'secondary' 

    const cookiesStore = cookies();
    // const defaultAccountType = cookiesStore.has(accountTypeKey)?cookiesStore.get(accountTypeKey)?.value as (string|undefined):mainAccountType;
    const defaultMainUser = cookiesStore.has(userMainKey)?cookiesStore.get(userMainKey)?.value as (string|undefined):'';
    const defaultSecondaryUser = cookiesStore.has(userSecondaryKey)?cookiesStore.get(userSecondaryKey)?.value as (string|undefined):'';

    return (
        <div className='flex-row flex-gap'>
            <form id={mainAccountType} method='POST' action='/api/opciones/contabilium' className={`${containerStyles.container} ${containerStyles['container--form']}`}>
                <h4>Cuenta principal</h4>
                <label htmlFor={userMainKey}>usuario</label>
                <input required type="text" id={userMainKey} name={userMainKey} defaultValue={defaultMainUser}/>
                <label htmlFor={passMainKey}>contraseña</label>
                <input required type="password" name={passMainKey} id={passMainKey} />
                <div>
                    <button>aceptar</button>
                    {defaultMainUser&&<a href={`/api/opciones/contabilium/?${accountTypeKey}=${mainAccountType}&action=${ACTIONS_KEYS.logout}`}>logout</a>}
                </div>
            </form>

            <form autoComplete='off' id={secondaryAccountType} method='POST' action='/api/opciones/contabilium' className={`${containerStyles.container} ${containerStyles['container--form']}`}>
                <h4>Cuenta secundaria</h4>
                <label htmlFor={userSecondaryKey}>usuario</label>
                <input required type="text" id={userSecondaryKey} name={userSecondaryKey} defaultValue={defaultSecondaryUser}/>
                <label htmlFor={passSecondaryKey}>contraseña</label>
                <input required type="password" name={passSecondaryKey} id={passSecondaryKey} />
                <div>
                    <button>aceptar</button>
                    {defaultSecondaryUser&&<a href={`/api/opciones/contabilium/?${accountTypeKey}=${secondaryAccountType}&action=${ACTIONS_KEYS.logout}`}>logout</a>}
                </div>
            </form>

            {/* <form autoComplete='off' method='POST' action='/api/opciones/accountType' className={`${containerStyles.container} ${containerStyles['container--form']}`}>
                <h4>Tipo de cuenta</h4>
                <select name={accountTypeKey} id={accountTypeKey} defaultValue={defaultAccountType}>
                    <option value={mainAccountType}>primaria</option>
                    <option value={secondaryAccountType}>secundaria</option>
                </select>
                <div><button>aceptar</button></div>
            </form> */}
        </div>
    )
}
export default ContabiliumOpciones
