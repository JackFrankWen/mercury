import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { AdvancedSearchForm } from './advancedSearchForm';
import { AdvancedTable } from './advancedTable';
import { Params_Transaction } from 'src/preload/index';
import './index.css';
import dayjs from 'dayjs';
import emitter from 'src/renderer/events';
export interface I_FormValue extends Params_Transaction {
  chose_unclassified: string;
  trans_time: [string, string];
}
function Accounting(): JSX.Element {
  const [transactions, setTransactions] = useState([]);
  const [formValue, setFormValue] = useState<I_FormValue>({
    chose_unclassified: 'unclassified',
    // 默认查询当年
    trans_time: [
      dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });
  useEffect(() => {
    getTransactions({
      ...formValue,
      is_unclassified: formValue.chose_unclassified === 'unclassified',
    });
  }, []);
  const getTransactions = (params: Params_Transaction) => {
    // 如果 trans_time [object, object] 则转换为 [string, string]

    const params_new = {
      ...params,
      is_unclassified: params.chose_unclassified === 'unclassified',
    };
    window.mercury.api.getTransactions(params_new).then((res) => {
      console.log(res,'res=ooooooo===');
      
      if (res) {
        setTransactions(res);
      }
    });
  };
  return (
    <div className="p-accounting">
      <Card className="plr8">
        <AdvancedSearchForm
          getTransactions={getTransactions}
          setFormValue={setFormValue}
          formValue={formValue}
        />
      </Card>
      <Card className="mt8 mb20">
        <AdvancedTable
          data={transactions}
          fresh={() => {
            getTransactions({
              ...formValue,
              is_unclassified: formValue.chose_unclassified === 'unclassified',
            });
            emitter.emit('refresh', 'transaction');
          }}
        />
      </Card>
    </div>
  );
}
export default Accounting;
