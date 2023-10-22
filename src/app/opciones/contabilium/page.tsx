import containerStyles from '@/styles/containers.module.css'
import { AccountType, AccountTypeKey } from '@/types/Config';
import { CbPassKey, CbUserKey } from '@/types/Contabilium'
import { cookies } from 'next/headers';


const ContabiliumOpciones:React.FC = ({})=>{

    const userMain:CbUserKey = 'userMain';
    const passMain:CbPassKey = 'passMain'      
    const userSecondary:CbUserKey = 'userSecondary';
    const passSecondary:CbPassKey = 'passSecondary';

    const accountTypeKey:AccountTypeKey = 'accountType';
    const mainAccountType:AccountType = 'main' 
    const secondaryAccountType:AccountType = 'secondary' 

    const cookiesStore = cookies();
    // console.log(cookiesStore)
    const defaultAccountType = cookiesStore.has(accountTypeKey)?cookiesStore.get(accountTypeKey)?.value as (string|undefined):mainAccountType;

    return (
        <div className='flex-row flex-gap'>
            <form id={mainAccountType} method='POST' action='/api/contabilium/login' className={`${containerStyles.container} ${containerStyles['container--form']}`}>
                <h4>Cuenta principal</h4>
                <label htmlFor={userMain}>usuario</label>
                <input required type="text" id={userMain} name={userMain} />
                <label htmlFor={passMain}>contraseña</label>
                <input required type="password" name={passMain} id={passMain} />
                <div><button>aceptar</button></div>
            </form>

            <form id={secondaryAccountType} method='POST' action='/api/contabilium/login' className={`${containerStyles.container} ${containerStyles['container--form']}`}>
                <h4>Cuenta secundaria</h4>
                <label htmlFor={userSecondary}>usuario</label>
                <input required type="text" id={userSecondary} name={userSecondary} />
                <label htmlFor={passSecondary}>contraseña</label>
                <input required type="password" name={passSecondary} id={passSecondary} />
                <div><button>aceptar</button></div>
            </form>

            <form method='POST' action='/api/opciones/accountType' className={`${containerStyles.container} ${containerStyles['container--form']}`}>
                <h4>Tipo de cuenta</h4>
                <select name={accountTypeKey} id={accountTypeKey} defaultValue={defaultAccountType}>
                    <option value={mainAccountType}>primaria</option>
                    <option value={secondaryAccountType}>secundaria</option>
                </select>
                <div><button>aceptar</button></div>
            </form>
        </div>
    )
}
export default ContabiliumOpciones