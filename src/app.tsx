import React from 'react';
import { Divider } from 'antd';
import { Upload } from './component/upload';
import { $problems, resetList } from './state';
import { useStore } from '@nanostores/react';
import { Problem } from './component/problem';
import * as styles from './style.module.less';
import { Download } from './component/download';

export function App() {
  const list = useStore($problems);
  return (
    <div className={styles.comp}>
      <div className={styles.content}>
        <div className={styles.upload}>
          <Upload handleProblemList={resetList} />
        </div>
        <div className={styles.download}>
          <Download />
        </div>
        <div className={styles.list}>
          {list.map((data, index) => (
            <>
              <Divider className={styles.divider} />
              <Problem key={index + data.title} data={data} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
