import React, { Fragment } from 'react';
import { Divider } from 'antd';
import { Upload } from './component/upload';
import { $problems, resetList } from './state';
import { useStore } from '@nanostores/react';
import { Problem } from './component/problem';
import { Download } from './component/download';
import * as styles from './style.module.less';

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
            <Fragment key={index + '-' + data.title}>
              <Divider key={index + '-divider'} className={styles.divider} />
              <Problem key={index + '-data'} data={data} />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
