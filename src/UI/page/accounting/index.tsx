import React , { useState }from "react";
import {Card} from "antd";
import {AdvancedSearchForm} from "./advancedSearchForm";
import {AdvancedTable} from "./advancedTable";
import { Params_Transaction } from "src/global";
import './index.css'

function Accounting(): JSX.Element {
    const [transactions, setTransactions] = useState([]);
    const getTransactions = (params: Params_Transaction) => {

        window.mercury.api.getTransactions(params).then((res) => {
            console.log('res', res);
            
        })
    }
    return (
        <div className='p-accounting'>
            <Card className='plr8' >
               <AdvancedSearchForm getTransactions={getTransactions}/>
            </Card>
            <Card className='mt8 plr8'>
                <AdvancedTable />
            </Card>
        </div>
    );
}
export default Accounting;