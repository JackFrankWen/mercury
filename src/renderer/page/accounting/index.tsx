import React from 'react';
import { Card } from 'antd';
import { AdvancedSearchForm } from './advancedSearchForm';
import { AdvancedTable } from './advancedTable';
import { Params_Transaction } from 'src/preload/type';
import { useTransactions } from './useTransactions';
import './index.css';
import dayjs from 'dayjs';

export interface I_FormValue extends Params_Transaction {
  chose_unclassified: string;
  trans_time?: [string, string]
}

function Accounting(): JSX.Element {
  const now = dayjs();
  const lastYear = now.month() === 0 ? now.subtract(1, 'year') : now;
  const {
    transactions,
    loading,
    formValue,
    setFormValue,
    refreshTransactions,
    getTransactions,
  } = useTransactions({
    chose_unclassified: 'unclassified',
    flow_type: '1',
    trans_time: [
      lastYear.startOf('year').format('YYYY-MM-DD HH:mm:ss'),
      lastYear.endOf('year').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });

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
          loading={loading}
          fresh={refreshTransactions}
        />
      </Card>
    </div>
  );
}

export default Accounting;
