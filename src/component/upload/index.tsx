import React from 'react';
import { parse } from '../../codec/browser';
import * as styles from './style.module.less';
import { Problem } from 'src/codec/type';

async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject('Error reading the file. Please try again.');
    };
    reader.readAsText(file);
  });
}

async function handleFile(file: File) {
  const content = await readFile(file);

  return parse(content);
}

interface Props {
  handleProblemList: (list: Problem[]) => void;
}

export function Upload(props: Props) {
  return (
    <label
      className={styles.comp}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
          handleFile(e.dataTransfer.files[0]).then(props.handleProblemList);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <input
        onChange={(e) => {
          if (e.target.files && e.target.files.length) {
            handleFile(e.target.files[0]).then(props.handleProblemList);
          }
        }}
        type="file"
        className={styles.input}
      ></input>
      <div className={styles.content}>
        <div>将 xml 文件拖放到这里</div>
        <div>或点击上传文件</div>
      </div>
    </label>
  );
}
