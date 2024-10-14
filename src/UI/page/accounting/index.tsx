import React from "react";

import {Card, Table} from "antd";
import {AdvancedSearchForm} from "./advancedSearchForm";
function AdvancedTable(props: any): JSX.Element {
   return (
       <Table
           columns={[
               {
                   title: '姓名',
                   dataIndex: 'name',
                   key: 'name',
               },
               {
                   title: '年龄',
                   dataIndex: 'age',
                   key: 'age',
               },
           ]}
           dataSource={[
               {
                   name: '张三',
                   age: 18,
               },
               {
                   name: '李四',
                   age: 19,
               },
           ]}
       />
   )
}

function Accounting(): JSX.Element {
    return (
        <div>
            <h1>记账</h1>
            <Card>
               <AdvancedSearchForm />
            </Card>
            <Card>
                <AdvancedTable />
            </Card>
        </div>
    );
}
export default Accounting;