import React from "react";
import {Card} from "antd";
import {AdvancedSearchForm} from "./advancedSearchForm";
import {AdvancedTable} from "./advancedTable";
import './index.css'

function Accounting(): JSX.Element {
    return (
        <div className='p-accounting'>
           <h1>记账</h1>
            <Card className='plr8' >
               <AdvancedSearchForm />
            </Card>
            <Card className='mt16 plr8'>
                <AdvancedTable />
            </Card>
        </div>
    );
}
export default Accounting;