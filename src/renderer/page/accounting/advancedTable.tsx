import React, { useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { I_Transaction } from 'src/main/sqlite3/transactions';
import { SelectionFooter } from '../../components/SelectionFooter';
import AddTransactionDrawer from './AddTransactionDrawer';
import BatchStepReplace from './batchStepRepace';
import { columns } from './config/tableColumns';
import { TableHeader } from './components/TableHeader';
import { useTableSelection } from './hooks/useTableSelection';
import { useTransactionOperations } from './hooks/useTransactionOperations';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface AdvancedTableProps {
  data: I_Transaction[];
  fresh: () => void;
  loading?: boolean;
}

export function AdvancedTable({ data, fresh, loading = false }: AdvancedTableProps): JSX.Element {
  const [addDrawerVisible, setAddDrawerVisible] = useState(false);
  const [batchReplaceVisible, setBatchReplaceVisible] = useState(false);

  const {
    selectedRowKeys,
    selectedAmount,
    onSelectChange,
    handleRowClick,
    clearSelection,
  } = useTableSelection(data);

  const { handleDelete, handleUpdate } = useTransactionOperations(
    selectedRowKeys,
    fresh,
    clearSelection
  );

  const rowSelection: TableRowSelection<I_Transaction> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="p-accounting-table" style={{ height: '100%' }}>
      <TableHeader
        onAddClick={() => setAddDrawerVisible(true)}
        onBatchReplaceClick={() => setBatchReplaceVisible(true)}
      />

      <Table
        size="small"
        className={'mt8'}
        rowKey={'id'}
        columns={columns}
        loading={loading}
        rowSelection={rowSelection}
        scroll={{ x: 1500, y: 'calc(100vh - 400px)' }}
        onRow={record => ({
          onClick: () => handleRowClick(record.id),
        })}
        dataSource={data}
        pagination={{
          defaultPageSize: 100,
          pageSizeOptions: [100, 200, 300],
          showSizeChanger: true,
          showTotal: (total) => `共${total}条`,
        }}
      />

      <AddTransactionDrawer
        visible={addDrawerVisible}
        onClose={() => setAddDrawerVisible(false)}
        onSuccess={fresh}
      />

      {selectedRowKeys.length > 0 && (
        <SelectionFooter
          className="full-width-bottom-footer"
          selectedAmount={selectedAmount}
          selectedCount={selectedRowKeys.length}
          onCancel={clearSelection}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}

      {batchReplaceVisible && (
        <BatchStepReplace
          data={data}
          visible={batchReplaceVisible}
          onClose={() => setBatchReplaceVisible(false)}
          onSuccess={() => {
            setBatchReplaceVisible(false);
            fresh();
          }}
        />
      )}
    </div>
  );
}
