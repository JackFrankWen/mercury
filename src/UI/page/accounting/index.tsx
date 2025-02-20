import React , { useEffect, useState }from "react";
import {Card} from "antd";
import {AdvancedSearchForm} from "./advancedSearchForm";
import {AdvancedTable} from "./advancedTable";
import { Params_Transaction } from "src/global";
import './index.css'

export interface I_FormValue extends Params_Transaction {
    chose_unclassified: string
}
function Accounting(): JSX.Element {
    const [transactions, setTransactions] = useState([]);
    const [formValue, setFormValue] = useState<I_FormValue>({
        chose_unclassified: 'unclassified',
    })
    useEffect(() => {
        getTransactions(formValue)
    }, [])
    const getTransactions = (params: Params_Transaction) => {

        window.mercury.api.getTransactions(params).then((res) => {
            console.log('res', res);
            
            if(res) {
                setTransactions(res)
            }
        })
    }
    return (
        <div className='p-accounting' style={{height: '100vh'}}>
            <Card className='plr8' >
                <AdvancedSearchForm getTransactions={getTransactions}
                    setFormValue={setFormValue}
                 formValue={formValue}/>
            </Card>
            <Card className='mt8 plr8'>
                <AdvancedTable data ={transactions}
                fresh={
                    () => {
                        getTransactions(formValue)
                    }
                }
                />
            </Card>
        </div>
    );
}
export default Accounting;