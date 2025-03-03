import React , { useEffect, useState }from "react";
import {Card} from "antd";
import {AdvancedSearchForm} from "./advancedSearchForm";
import {AdvancedTable} from "./advancedTable";
import { Params_Transaction } from "src/global";
import './index.css'
import dayjs from "dayjs";

export interface I_FormValue extends Params_Transaction {
    chose_unclassified: string
    trans_time: [string, string]
}
function Accounting(): JSX.Element {
    const [transactions, setTransactions] = useState([]);
    const [formValue, setFormValue] = useState<I_FormValue>({
        chose_unclassified: 'unclassified',
        // 默认查询当年
        trans_time: [dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss')]
    })
    useEffect(() => {
        getTransactions({
            ...formValue,
            is_unclassified: formValue.chose_unclassified === 'unclassified'
        })
    }, [])
    const getTransactions = (params: Params_Transaction) => {
        

        window.mercury.api.getTransactions(params).then((res) => {
            
            if(res) {
                setTransactions(res)
            }
        })
    }
    return (
        <div className='p-accounting'>
            <Card className='plr8'
               
             >
                <AdvancedSearchForm getTransactions={getTransactions}
                    setFormValue={setFormValue}
                 formValue={formValue}/>
            </Card>
            <Card
            
             className='mt8 plr8'>
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